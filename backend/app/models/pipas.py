# ==============================================================================
# Módulo de Modelos - Pipas
# Descripción: Define la entidad Pipa (Camión de combustible) usando SQLModel.
#              Mapeo de inventario estático para las autorizaciones.
# ==============================================================================

from typing import Optional
from sqlmodel import SQLModel, Field

class Pipa(SQLModel, table=True):
    __tablename__ = "pipas" # Nombre exacto de la tabla en MySQL
    
    # Identificador único de sistema
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Código o Placa de la Pipa (Ej: PIPA-001) usado en el frontend
    codigo_pipa: str = Field(unique=True, index=True)
    
    # Capacidad geométrica total de la pipa (Litros)
    capacidad_maxima: float
    
    # Volumen actual en el interior (Litros) - Actualizado por Stored Procedure
    volumen_actual: float = Field(default=0.0)
    
    # Estado operativo
    estatus: str = Field(default="ACTIVA")
