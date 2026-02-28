from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

# Importamos las funciones del archivo sms.py
from app.core.sms import enviar_codigo_verificacion, validar_codigo_verificacion 

from app.core.config import settings
from app.core import security
from app.core.db import get_session
from app.models.usuarios import Usuario
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
    if db_user.telefono:
        enviar_codigo_verificacion(db_user.telefono)
    
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
    
    # Aquí puedes marcar al usuario como verificado en la DB si tienes el campo
    # user.esta_verificado = True
    # session.add(user)
    # session.commit()
    
    return {"msg": "Verificación exitosa", "status": "approved"}