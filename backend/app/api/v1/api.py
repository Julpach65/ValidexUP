from fastapi import APIRouter
from app.api.v1.endpoints import auth

api_router = APIRouter()

# Incluir los distintos módulos de endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["Autenticación de Identidad"])
