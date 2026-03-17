from fastapi import APIRouter
from app.api.v1.endpoints import auth, pipas, operaciones

api_router = APIRouter()

# Incluir los distintos módulos de endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["Autenticación de Identidad"])
api_router.include_router(pipas.router, prefix="/pipas", tags=["Gestión de Pipas"])
api_router.include_router(operaciones.router, prefix="/operaciones", tags=["Transacciones y Auditoría"])
