from pydantic import BaseModel, EmailStr
from typing import Optional

# Propiedades compartidas
class UsuarioBase(BaseModel):
    email: EmailStr
    rol: str = "GERENTE"

# Propiedades para crear (recibidas en el Request Body)
class UsuarioCreate(UsuarioBase):
    password: str

# Propiedades para retornar por API (sin mostrar contraseñas)
class UsuarioOut(UsuarioBase):
    id: int
    telefono: Optional[str] = None
    sms_verificado: bool
    rostro_registrado: bool

    class Config:
        from_attributes = True
