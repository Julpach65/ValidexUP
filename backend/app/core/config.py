from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Validex UP"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Configuración de Seguridad
    SECRET_KEY: str = "validex-super-secret-key-for-development-only-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 
    
    # Configuración de Base de Datos (MySQL)
    # Ajustado a tu puerto 3306 y nombre de DB 'ValidexDB'
    DATABASE_URL: str = "mysql+pymysql://root:123456@localhost:3306/ValidexDB"
    
    # Configuración de Twilio
    # Quitamos el Optional para que Pydantic valide que los datos existen en el .env
    TWILIO_ACCOUNT_SID: str 
    TWILIO_AUTH_TOKEN: str 
    TWILIO_VERIFY_SERVICE_SID: str 
    
    # Número de pruebas verificado en tu cuenta
    MY_VERIFIED_NUMBER: str = "+526692686003"
    
    MOCK_SMS: bool = True
    DEBUG_MODE: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()