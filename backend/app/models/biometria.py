# ==============================================================================
# Módulo de Modelos - Biometría
# Descripción: Almacena los vectores faciales y la imagen base64. 
#              Relación 1 a 1 (o 1 a N) con los usuarios B2B.
# ==============================================================================

from typing import Optional
from sqlmodel import SQLModel, Field

class Biometria(SQLModel, table=True):
    __tablename__ = "biometria"
    
    # Identificador del registro biométrico
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Foreign Key al dueño del rostro
    usuario_id: int = Field(foreign_key="usuarios.id", unique=True)
    
    # Cadena codificada en Base64 de la foto original (Puede ser larga)
    foto_referencia: Optional[str] = None
    
    # Vector matemático (embeddings) en formato JSON (String en SQLite/MySQL)
    vector_facial: Optional[str] = None
