from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.usuarios import RolUsuario

# 1. Propiedades compartidas (Lo que siempre lleva un usuario)
class UsuarioBase(BaseModel):
    email: EmailStr  # Usamos EmailStr para validar que tenga @ y .com
    nombre_completo: str
    rol: RolUsuario = RolUsuario.GERENTE

# 2. Propiedades para el Registro (Request)
class UsuarioCreate(UsuarioBase):
    password: str
    telefono: Optional[str] = None

# 3. Propiedades para la Respuesta de la API (Response)
class UsuarioOut(UsuarioBase):
    id_usuario: int
    telefono: Optional[str] = None
    face: Optional[str] = None
    fecha_registro: datetime

    class Config:
        from_attributes = True