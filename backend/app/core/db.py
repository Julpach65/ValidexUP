from sqlmodel import create_engine, Session
from app.core.config import settings

# Creación del engine SQLAlchemy/SQLModel para la DB MySQL
engine = create_engine(
    settings.DATABASE_URL, 
    pool_pre_ping=True, # Verifica que la conexión actúe antes de usarla
    echo=False # Cambiar a True para debuguear queries en consola
)

def get_session():
    """Dependencia inyectable de FastAPI proveyendo una sesión SQLModel"""
    with Session(engine) as session:
        yield session
