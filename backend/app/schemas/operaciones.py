from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime


class CargaCreate(BaseModel):
    id_pipa: int
    litros_descargados: Decimal
    tipo_combustible: str  # MAGNA, PREMIUM, DIESEL


class OperacionIniciarRequest(BaseModel):
    id_pipa: int
    volumen_objetivo: Decimal
    tipo_combustible: str
    image_data: str


class OperacionOut(BaseModel):
    id_operacion: int
    id_pipa: int
    volumen_objetivo: Decimal
    volumen_actual: Decimal
    caudal_lpm: Decimal
    estado: str
    fecha_inicio: datetime
    fecha_fin: Optional[datetime] = None

    class Config:
        from_attributes = True


class BitacoraOut(BaseModel):
    id_log: int
    id_usuario: int
    nombre_responsable: str
    rol_responsable: str
    accion: str
    detalles: str
    fecha_hora: datetime

    class Config:
        from_attributes = True
