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
