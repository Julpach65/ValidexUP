from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class Usuario(SQLModel, table=True):
    __tablename__ = "Usuario"
    
    id_usuario: Optional[int] = Field(default=None, primary_key=True)
    nombre_completo: str
    username: str = Field(unique=True, index=True)
    password_hash: str
    telefono: Optional[str] = None
    face: Optional[str] = None # Vector facial / Base64
    rol: str = Field(default="GERENTE")
    fecha_registro: Optional[datetime] = Field(default_factory=datetime.utcnow)
