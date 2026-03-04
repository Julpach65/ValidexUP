from app.services.face_service import get_face_embedding
import json 
from datetime import datetime, timedelta
import random
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select, SQLModel

from app.core.sms import enviar_codigo_custom
from app.core.config import settings
from app.core import security
from app.core.db import get_session

from app.models.usuarios import Usuario
from app.models.codigos_otp import CodigoOTP
from app.models.sesiones import Sesion

from app.schemas.user import UsuarioCreate, UsuarioOut
from app.schemas.token import Token

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    session: Session = Depends(get_session), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    # AJUSTE: Buscamos por EMAIL porque eliminaste la columna username
    statement = select(Usuario).where(Usuario.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
        )
    
    statement_sesion = select(Sesion).where(Sesion.id_usuario == user.id_usuario)
    sesion_activa = session.exec(statement_sesion).first()
    
    if not sesion_activa:
        sesion_activa = Sesion(id_usuario=user.id_usuario)
    
    sesion_activa.paso_1_login = True
    session.add(sesion_activa)
    session.commit()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id_usuario, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UsuarioOut)
def register_user(
    *, session: Session = Depends(get_session), user_in: UsuarioCreate
) -> Any:
    statement = select(Usuario).where(Usuario.email == user_in.email)
    user = session.exec(statement).first()
    
    if user:
        raise HTTPException(status_code=400, detail="El email ya está registrado.")
        
    db_user = Usuario(
        nombre_completo=user_in.nombre_completo,
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        rol=user_in.rol,
        telefono=user_in.telefono
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    if db_user.telefono:
        code = f"{random.randint(100000, 999999)}"
        otp_entry = CodigoOTP(
            id_usuario=db_user.id_usuario,
            codigo=code,
            expira_at=datetime.utcnow() + timedelta(minutes=5),
            usado=False
        )
        session.add(otp_entry)
        session.commit()
        enviar_codigo_custom(db_user.telefono, code)
    
    return db_user

class VerifySMSRequest(SQLModel):
    id_usuario: int
    codigo: str

@router.post("/verify-sms")
def verify_sms(body: VerifySMSRequest, session: Session = Depends(get_session)) -> Any:
    statement = select(CodigoOTP).where(
        CodigoOTP.id_usuario == body.id_usuario,
        CodigoOTP.codigo == body.codigo,
        CodigoOTP.usado == False
    )
    otp_record = session.exec(statement).first()

    if not otp_record or datetime.utcnow() > otp_record.expira_at:
        raise HTTPException(status_code=400, detail="Código incorrecto o expirado.")

    otp_record.usado = True
    session.add(otp_record)

    statement_sesion = select(Sesion).where(Sesion.id_usuario == body.id_usuario)
    sesion_activa = session.exec(statement_sesion).first()

    if not sesion_activa:
        sesion_activa = Sesion(id_usuario=body.id_usuario, paso_1_login=True)
    
    sesion_activa.paso_2_sms = True
    session.add(sesion_activa)
    session.commit()
        
    return {"msg": "Paso 2 completado", "status": "SMS_VERIFIED"}

# --- PASO 3: REGISTRO DE CARA (AL FINAL) ---
@router.post("/register-face/{user_id}")
def register_face(
    user_id: int, 
    image_data: str, # Aquí recibiremos el Base64 de la cámara
    session: Session = Depends(get_session)
):
    """
    Toma la foto de referencia, la convierte en números y la guarda
    en la columna 'face' del usuario.
    """
    # 1. Usamos el servicio que creaste para obtener los números (embedding)
    embedding = get_face_embedding(image_data)
    
    if not embedding:
        raise HTTPException(
            status_code=400, 
            detail="No se pudo detectar un rostro. Intenta con mejor iluminación."
        )

    # 2. Buscamos al usuario en la base de datos (ej. Karol)
    user = session.get(Usuario, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 3. Guardamos los números. 
    # Como la columna 'face' es TEXT, convertimos la lista a un string JSON.
    user.face = json.dumps(embedding)
    
    session.add(user)
    session.commit()

    return {
        "status": "success",
        "message": f"Rostro de {user.nombre_completo} registrado correctamente."
    }