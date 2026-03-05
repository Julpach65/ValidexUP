from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class CodigoOTP(SQLModel, table=True):
    __tablename__ = "CodigosOTP" 
    
    id_otp: Optional[int] = Field(default=None, primary_key=True)
    id_usuario: int = Field(foreign_key="Usuario.id_usuario")
    codigo: str
    creado_at: datetime = Field(default_factory=datetime.utcnow)
    expira_at: datetime # Aquí validaremos los 5 minutos
    usado: bool = Field(default=False)