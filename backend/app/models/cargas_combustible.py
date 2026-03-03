from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime
from decimal import Decimal

class CargaCombustible(SQLModel, table=True):
    __tablename__ = "CargasCombustible"
    
    id_carga: Optional[int] = Field(default=None, primary_key=True)
    id_pipa: Optional[int] = Field(default=None, foreign_key="Pipas.id_pipa")
    litros_descargados: Decimal
    tipo_combustible: str # MAGNA, PREMIUM, DIESEL
    autorizado_por: Optional[int] = Field(default=None, foreign_key="Usuario.id_usuario")
    fecha_carga: Optional[datetime] = Field(default_factory=datetime.utcnow)
