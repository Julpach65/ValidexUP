from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime
from enum import Enum

class RolUsuario(str, Enum):
    GERENTE = "GERENTE"
    ADMIN = "ADMIN"
    VISOR = "VISOR"

class Usuario(SQLModel, table=True):
    __tablename__ = "Usuario" 
    
    id_usuario: Optional[int] = Field(default=None, primary_key=True)
    nombre_completo: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    telefono: Optional[str] = None
    face: Optional[str] = None # Para el paso 3 (Cara)
    rol: RolUsuario = Field(default=RolUsuario.GERENTE)
    fecha_registro: Optional[datetime] = Field(default_factory=datetime.utcnow)