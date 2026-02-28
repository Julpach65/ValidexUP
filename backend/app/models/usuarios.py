# ==============================================================================
# Módulo de Modelos - Usuarios
# Descripción: Define la entidad Usuario (Gerentes y Patrones) usando SQLModel.
#              Esta clase se mapeará directamente a la tabla 'usuarios' en MySQL.
# ==============================================================================

from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios" # Nombre exacto de la tabla en MySQL
    
    # Identificador único autoincremental
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Correo corporativo (Ej: nombre@empresa.com)
    email: str = Field(unique=True, index=True)
    
    # Contraseña cifrada (Bcrypt)
    password_hash: str
    
    # Número de teléfono para OTP (MFA)
    telefono: Optional[str] = None
    
    # Nivel de acceso según el análisis de diseño (ADMIN, GERENTE, PATRON)
    rol: str = Field(default="GERENTE")
    
    # Banderas de estado del onboarding (Validex UP)
    sms_verificado: bool = Field(default=False)
    rostro_registrado: bool = Field(default=False)
    
    # Marca de tiempo de registro histórico
    fecha_creacion: Optional[datetime] = Field(default_factory=datetime.utcnow)
