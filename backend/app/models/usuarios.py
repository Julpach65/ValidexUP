from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Text, String # Importamos Text y String de sqlalchemy
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
    # Corregido: String(255) en lugar de string(255)
    telefono: Optional[str] = Field(default=None, sa_column=Column(String(255))) 
    # CRÍTICO: Usamos sa_column con Text para que acepte el embedding largo
    face: Optional[str] = Field(default=None, sa_column=Column(Text))  
    rol: RolUsuario = Field(default=RolUsuario.GERENTE)
    fecha_registro: Optional[datetime] = Field(default_factory=datetime.utcnow)