from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class Bitacora(SQLModel, table=True):
    __tablename__ = "Bitacora"
    
    id_log: Optional[int] = Field(default=None, primary_key=True)
    id_usuario: Optional[int] = Field(default=None, foreign_key="Usuario.id_usuario")
    accion: str
    detalles: Optional[str] = None
    ip_address: Optional[str] = None
    fecha_hora: Optional[datetime] = Field(default_factory=datetime.utcnow)
