from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session, select
from pydantic import ValidationError

from app.core.config import settings
from app.core.db import engine
from app.models.usuarios import Usuario
from app.schemas.token import TokenPayload

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_db() -> Generator:
    with Session(engine) as session:
        yield session

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> Usuario:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        if token_data.sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token incompleto",
            )
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Validación de credenciales fallida",
        )
    
    # El 'sub' es el id_usuario
    try:
        user_id = int(token_data.sub)
        user = db.exec(select(Usuario).where(Usuario.id_usuario == user_id)).first()
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Formato de token inválido",
        )
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    return user

def get_current_active_user(
    current_user: Usuario = Depends(get_current_user),
) -> Usuario:
    # Aca podriamos verificar si current_user.estado == 'ACTIVO'
    return current_user

def get_gerente_user(
    current_user: Usuario = Depends(get_current_user),
) -> Usuario:
    if current_user.rol not in ["GERENTE", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Operación restringida. Privilegios insuficientes."
        )
    return current_user
