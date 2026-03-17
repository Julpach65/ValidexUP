from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime
from decimal import Decimal

class OperacionDescarga(SQLModel, table=True):
    """
    Rastrea el ciclo de vida de una descarga individual de combustible.
    Permite persistencia de estado si el cliente o servidor se desconectan.
    """
    __tablename__ = "OperacionesDescarga"
    
    id_operacion: Optional[int] = Field(default=None, primary_key=True)
    id_pipa: int = Field(foreign_key="Pipas.id_pipa")
    id_usuario: int = Field(foreign_key="Usuario.id_usuario") # Quién autorizó
    volumen_objetivo: Decimal
    volumen_actual: Decimal = Field(default=Decimal("0.00"))
    caudal_lpm: Decimal = Field(default=Decimal("0.00")) # Flujo actual observado
    estado: str = Field(default="INICIADA") # INICIADA, EN_PROGRESO, INTERRUMPIDA, FINALIZADA
    fecha_inicio: datetime = Field(default_factory=datetime.utcnow)
    fecha_fin: Optional[datetime] = Field(default=None)
    
