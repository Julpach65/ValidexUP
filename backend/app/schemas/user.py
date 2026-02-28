from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Propiedades compartidas
class UsuarioBase(BaseModel):
    username: str
    nombre_completo: str
    rol: str = "GERENTE"

# Propiedades para crear (recibidas en el Request Body)
class UsuarioCreate(UsuarioBase):
    password: str
    telefono: Optional[str] = None

# Propiedades para retornar por API (sin mostrar contraseñas)
class UsuarioOut(UsuarioBase):
    id_usuario: int
    telefono: Optional[str] = None
    face: Optional[str] = None
    fecha_registro: datetime

    class Config:
        from_attributes = True
