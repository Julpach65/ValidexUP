from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Validex UP"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security Configuration
    SECRET_KEY: str = "validex-super-secret-key-for-development-only-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days for development
    
    # Database Configuration (MySQL)
    # Ejemplo local: mysql+pymysql://usuario:password@localhost:3306/validex_db
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/validex_db"
    
    # Twilio Configuration (Postergado para Fase 2)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_VERIFY_SERVICE_SID: Optional[str] = None
    MOCK_SMS: bool = True

    class Config:

        env_file = ".env"
        case_sensitive = True

settings = Settings()
