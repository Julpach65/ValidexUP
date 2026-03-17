from typing import Any, List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func

from app.core.db import get_session
from app.models.pipas import Pipa
from app.models.cargas_combustible import CargaCombustible
from app.models.usuarios import Usuario
from app.schemas.pipas import PipaOut
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[PipaOut])
def read_pipas(
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(deps.get_current_active_user)
) -> Any:
    """
    Obtener todas las pipas con sus litros descargados reales
    calculados desde CargasCombustible. Incluye pipas en descarga activa.
    """
    # Obtener todas las pipas
    pipas = session.exec(select(Pipa)).all()

    # Obtener litros totales agrupados por pipa para evitar N+1 consultas
    litros_dict = {
        row[0]: row[1] 
        for row in session.exec(
            select(CargaCombustible.id_pipa, func.sum(CargaCombustible.litros_descargados))
            .group_by(CargaCombustible.id_pipa)
        ).all()
    }

    result = []
    for pipa in pipas:
        litros_total = litros_dict.get(pipa.id_pipa, 0.0)

        result.append(PipaOut(
            id_pipa=pipa.id_pipa,
            placa=pipa.placa,
            capacidad_litros=pipa.capacidad_litros,
            proveedor=pipa.proveedor,
            estado=pipa.estado,
            litros_descargados=litros_total,
        ))

    return result
