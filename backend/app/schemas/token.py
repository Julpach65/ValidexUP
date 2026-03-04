from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    id_usuario: int
    rol: str
    
class TokenPayload(BaseModel):
    sub: Optional[str] = None
