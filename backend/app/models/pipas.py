from typing import Optional
from sqlmodel import SQLModel, Field
from decimal import Decimal

class Pipa(SQLModel, table=True):
    __tablename__ = "Pipas"
    
    id_pipa: Optional[int] = Field(default=None, primary_key=True)
    placa: str = Field(unique=True, index=True)
    capacidad_litros: Decimal
    proveedor: Optional[str] = None
    estado: str = Field(default="ACTIVA")
