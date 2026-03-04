from datetime import datetime, timedelta
import random
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

# Importamos solo lo que necesitamos de sms.py
from app.core.sms import enviar_codigo_custom

from app.core.config import settings
from app.core import security
from app.core.db import get_session

# Modelos corregidos (uno por archivo)
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
    """
    Paso 1: Login con contraseña. 
    Verifica credenciales y crea el registro inicial en la tabla Sesiones.
    """
    statement = select(Usuario).where(Usuario.username == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # --- MODIFICACIÓN: Registro de inicio de sesión en tabla Sesiones ---
    statement_sesion = select(Sesion).where(Sesion.id_usuario == user.id_usuario)
    sesion_activa = session.exec(statement_sesion).first()
    
    if not sesion_activa:
        sesion_activa = Sesion(id_usuario=user.id_usuario)
    
    sesion_activa.paso_1_login = True
    session.add(sesion_activa)
    session.commit()
    # ------------------------------------------------------------------

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
    Registra un nuevo usuario con rol (Gerente, Admin, Visor) y envía el primer OTP.
    """
    statement = select(Usuario).where(Usuario.username == user_in.username)
    user = session.exec(statement).first()
    
    if user:
        raise HTTPException(
            status_code=400,
            detail="El nombre de usuario ya se encuentra registrado.",
        )
        
    db_user = Usuario(
        nombre_completo=user_in.nombre_completo,
        username=user_in.username,
        password_hash=security.get_password_hash(user_in.password),
        rol=user_in.rol, # Usa el Enum de roles de la maestra
        telefono=user_in.telefono
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    # Generar código OTP inicial
    if db_user.telefono:
        code = f"{random.randint(100000, 999999)}"
        # MODIFICACIÓN: Se usa expira_at coherente con la tabla CodigosOTP
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
def verify_sms(
    body: VerifySMSRequest,
    session: Session = Depends(get_session)
) -> Any:
    """
    Paso 2: Verifica el SMS contra CodigosOTP y actualiza Sesiones.
    """
    # Buscar el código activo (no usado) en CodigosOTP
    statement = select(CodigoOTP).where(
        CodigoOTP.id_usuario == body.id_usuario,
        CodigoOTP.codigo == body.codigo,
        CodigoOTP.usado == False
    )
    otp_record = session.exec(statement).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Código incorrecto o ya utilizado.")

    # Validar expiración (Si el reloj llegó a 0:00)
    if datetime.utcnow() > otp_record.expira_at:
        raise HTTPException(
            status_code=400, 
            detail="El código expiró. Solicite uno nuevo."
        )

    # 1. Marcar código como usado
    otp_record.usado = True
    session.add(otp_record)

    # 2. Actualizar Sesiones (Paso 2 completado)
    statement_sesion = select(Sesion).where(Sesion.id_usuario == body.id_usuario)
    sesion_activa = session.exec(statement_sesion).first()

    if not sesion_activa:
        sesion_activa = Sesion(id_usuario=body.id_usuario, paso_1_login=True)
    
    sesion_activa.paso_2_sms = True
    session.add(sesion_activa)
    session.commit()
        
    return {"msg": "Código verificado correctamente", "status": "SMS_VERIFIED"}