from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class Sesion(SQLModel, table=True):
    __tablename__ = "Sesiones"
    
    id_sesion: Optional[int] = Field(default=None, primary_key=True)
    id_usuario: Optional[int] = Field(default=None, foreign_key="Usuario.id_usuario")
    token_jwt: Optional[str] = Field(default=None, max_length=500)
    paso_1_login: bool = Field(default=False)
    paso_2_sms: bool = Field(default=False)
    paso_3_face: bool = Field(default=False)
    dispositivo: Optional[str] = None
    expira_at: Optional[datetime] = None
