# ==============================================================================
# Módulo de Modelos - Auditoría Logs
# Descripción: Tabla inmutable que alimenta la pantalla "Accesos y Descargas".
#              No se debe proveer Endpoints de DELETE o UPDATE para esta tabla.
# ==============================================================================

from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class AuditoriaLog(SQLModel, table=True):
    __tablename__ = "auditoria_logs" # Tabla en memoria inmutable
    
    # Identificador secuencial (Folio)
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relación lógica con el usuario que detonó la acción (Foreign Key)
    usuario_id: Optional[int] = Field(default=None, foreign_key="usuarios.id")
    
    # Etiqueta de la acción (Ej: "Inicio de Sesión", "Autorización de Descarga")
    accion: str
    
    # Bandera semáforo de seguridad (EXITO, DENEGADO)
    estado: str
    
    # Información extendida textual si se necesita
    detalles: Optional[str] = None
    
    # Marca de tiempo exacta del movimiento (Frontend usa solo `Hora`)
    fecha_hora: Optional[datetime] = Field(default_factory=datetime.utcnow)
