from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Validex UP API",
    description="Backend de seguridad Zero-Trust para autorizacion de descarga de combustible",
    version="1.0.0"
)

# Configuración de CORS para Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción limitar a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.api import api_router
from app.core.config import settings

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
