from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def _reset_stuck_pipas():
    """
    Limpia automáticamente cualquier pipa o operación que haya quedado
    bloqueada tras un reinicio inesperado del servidor.
    Se ejecuta ANTES de que el servidor empiece a aceptar peticiones.
    """
    try:
        from app.core.db import engine
        from sqlmodel import Session, select
        from app.models.pipas import Pipa
        from app.models.operaciones_pipas import OperacionDescarga
        from app.services.discharge_engine import SHADOW_STATE_DIR
        from datetime import datetime
        import os

        with Session(engine) as session:
            # 1. Cerrar operaciones colgadas QUE NO tengan Shadow State
            ops = session.exec(
                select(OperacionDescarga).where(
                    OperacionDescarga.estado.in_(["INICIADA", "EN_PROGRESO"])
                )
            ).all()
            
            cleaned_count = 0
            for op in ops:
                shadow_path = os.path.join(SHADOW_STATE_DIR, f"{op.id_operacion}.json")
                if not os.path.exists(shadow_path):
                    op.estado = "INTERRUMPIDA"
                    op.fecha_fin = datetime.utcnow()
                    session.add(op)
                    cleaned_count += 1

            # 2. Liberar todas las pipas EN_DESCARGA (ninguna puede estar activa en startup)
            pipas = session.exec(
                select(Pipa).where(Pipa.estado == "EN_DESCARGA")
            ).all()
            for pipa in pipas:
                pipa.estado = "ACTIVA"
                session.add(pipa)

            session.commit()

            if cleaned_count > 0 or pipas:
                print(
                    f"[STARTUP] Limpieza automática: {cleaned_count} operaciones zombis cerradas, "
                    f"{len(pipas)} pipas liberadas."
                )
    except Exception as e:
        print(f"[STARTUP] Advertencia en limpieza de startup: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestiona el ciclo de vida: startup y shutdown del servidor."""
    # --- STARTUP ---
    from app.services.discharge_engine import reanimate_tasks
    _reset_stuck_pipas()
    reanimate_tasks()
    yield
    # --- SHUTDOWN ---
    # El discharge_engine cancela las tareas al terminar el proceso


app = FastAPI(
    title="Validex UP API",
    description="Backend de seguridad Zero-Trust para autorizacion de descarga de combustible",
    version="1.0.0",
    lifespan=lifespan,
)

# Configuración de CORS para Next.js (desarrollo y producción)
app.add_middleware(
    CORSMiddleware,
    # SOPORTE PARA IP DINÁMICA: Permitimos cualquier origen mediante regex para evitar bloqueos
    # tras un reinicio de IP en AWS (Recomendado: Usar Elastic IP en AWS para producción real)
    allow_origins=["*"],
    allow_origin_regex=None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

from app.api.v1.api import api_router
from app.core.config import settings
# Importar todos los modelos para que SQLModel los registre en metadata
from app.models import operaciones_pipas  # noqa: F401

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Bienvenido a la API de Validex UP - Unified Protection",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
