from datetime import datetime, timedelta
import random
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select, SQLModel

# Importamos las funciones del archivo sms.py
from app.core.sms import enviar_codigo_verificacion, validar_codigo_verificacion, enviar_codigo_custom

from app.core.config import settings
from app.core import security
from app.core.db import get_session
from app.models.usuarios import Usuario
from app.models.verification import CodigoOTP
from app.models.sesiones import Sesion
from app.schemas.user import UsuarioCreate, UsuarioOut
from app.schemas.token import Token

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    session: Session = Depends(get_session), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, requiere username y password.
    """
    statement = select(Usuario).where(Usuario.username == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id_usuario, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UsuarioOut)
def register_user(
    *, session: Session = Depends(get_session), user_in: UsuarioCreate
) -> Any:
    """
    Registra a un nuevo usuario (Gerente).
    """
    statement = select(Usuario).where(Usuario.username == user_in.username)
    user = session.exec(statement).first()
    
    if user:
        raise HTTPException(
            status_code=400,
            detail="El nombre de usuario ya se encuentra registrado.",
        )
        
    hashed_password = security.get_password_hash(user_in.password)
    db_user = Usuario(
        nombre_completo=user_in.nombre_completo,
        username=user_in.username,
        password_hash=hashed_password,
        rol=user_in.rol,
        telefono=user_in.telefono
    )
    
    # 1. Guardamos en la base de datos MySQL
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    # 2. Disparamos el código de verificación (Real o Mock)
    # MODIFICADO: Ahora generamos el código localmente para guardarlo en DB
    if db_user.telefono:
        # Generar código de 6 dígitos
        code = f"{random.randint(100000, 999999)}"
        expires_at = datetime.utcnow() + timedelta(minutes=5)
        
        otp_entry = CodigoOTP(
            id_usuario=db_user.id_usuario,
            codigo=code,
            expira_at=expires_at,
            usado=False
        )
        session.add(otp_entry)
        session.commit()
        
        enviar_codigo_custom(db_user.telefono, code)
    
    return db_user

# --- ESTA ES LA RUTA QUE FALTABA PARA CERRAR EL CICLO ---
@router.post("/verify-otp")
def verify_otp(
    telefono: str, 
    codigo: str, 
    session: Session = Depends(get_session)
) -> Any:
    """
    Verifica el código enviado al celular para validar al usuario.
    """
    # 1. Validamos el código usando tu lógica de sms.py
    es_valido = validar_codigo_verificacion(telefono, codigo)
    
    if not es_valido:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Código de verificación incorrecto o expirado."
        )
    
    # 2. Si el código es correcto, buscamos al usuario por su teléfono
    statement = select(Usuario).where(Usuario.telefono == telefono)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    # 3. Registrar o actualizar la sesión activa
    statement = select(Sesion).where(Sesion.id_usuario == user.id_usuario)
    sesion_activa = session.exec(statement).first()
    
    if not sesion_activa:
        sesion_activa = Sesion(id_usuario=user.id_usuario, paso_1_login=True)
        session.add(sesion_activa)
        
    sesion_activa.paso_2_sms = True
    session.add(sesion_activa)
    session.commit()
    
    return {"msg": "Verificación exitosa", "status": "approved", "paso_2_sms": True}

class VerifySMSRequest(SQLModel):
    id_usuario: int
    codigo: str

@router.post("/verify-sms")
def verify_sms(
    body: VerifySMSRequest,
    session: Session = Depends(get_session)
) -> Any:
    """
    Verifica el código contra la base de datos local.
    Valida expiración (5 minutos) y actualiza la sesión.
    """
    # Buscar el código en la base de datos
    statement = select(CodigoOTP).where(
        CodigoOTP.id_usuario == body.id_usuario,
        CodigoOTP.codigo == body.codigo,
        CodigoOTP.usado == False
    )
    otp_record = session.exec(statement).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Código incorrecto o ya utilizado.")

    # Validar expiración
    if datetime.utcnow() > otp_record.expira_at:
        raise HTTPException(
            status_code=400, 
            detail="El código expiró y debe solicitar uno nuevo."
        )

    # Si es correcto:
    # 1. Marcar código como usado
    otp_record.usado = True
    session.add(otp_record)

    # 2. Actualizar la tabla Sesiones
    statement_sesion = select(Sesion).where(Sesion.id_usuario == body.id_usuario)
    sesion_activa = session.exec(statement_sesion).first()

    if not sesion_activa:
        # Si no existe sesión (ej. registro nuevo), creamos una
        sesion_activa = Sesion(id_usuario=body.id_usuario, paso_2_sms=True)
    else:
        sesion_activa.paso_2_sms = True
    
    session.add(sesion_activa)
    session.commit()
        
    return {"msg": "Código verificado correctamente", "status": "SMS_VERIFIED"}