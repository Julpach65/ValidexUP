from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

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
    Registra a un nuevo usuario (Gerente o Patrón).
    """
    statement = select(Usuario).where(Usuario.username == user_in.username)
    user = session.exec(statement).first()
    
    if user:
        raise HTTPException(
            status_code=400,
            detail="El nombre de usuario ya se encuentra registrado.",
        )
        
    # Crear y hashear
    hashed_password = security.get_password_hash(user_in.password)
    db_user = Usuario(
        nombre_completo=user_in.nombre_completo,
        username=user_in.username,
        password_hash=hashed_password,
        rol=user_in.rol,
        telefono=user_in.telefono
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    return db_user
