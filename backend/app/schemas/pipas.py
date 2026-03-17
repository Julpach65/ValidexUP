from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class PipaOut(BaseModel):
    id_pipa: int
    placa: str
    capacidad_litros: Decimal
    proveedor: Optional[str]
    estado: str
    litros_descargados: Decimal = Decimal("0.00")
    
    class Config:
        from_attributes = True
