"""
Motor Industrial de Descarga de Combustible - Validex UP
Simula el proceso de descarga en el backend con asyncio para garantizar
integridad de datos, independientemente del estado del cliente.
"""

import asyncio
import json
import os
from decimal import Decimal
from datetime import datetime
from typing import Dict
import random

# Carpeta para persistencia de tareas activas (Shadow State)
SHADOW_STATE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".shadow_state")
os.makedirs(SHADOW_STATE_DIR, exist_ok=True)

# Almacena las tareas activas en memoria: {id_operacion: task}
_active_tasks: Dict[int, asyncio.Task] = {}

def _save_shadow_state(id_operacion: int, volumen_objetivo: float):
    path = os.path.join(SHADOW_STATE_DIR, f"{id_operacion}.json")
    with open(path, "w") as f:
        json.dump({"id_operacion": id_operacion, "volumen_objetivo": volumen_objetivo, "timestamp": datetime.utcnow().isoformat()}, f)

def _remove_shadow_state(id_operacion: int):
    path = os.path.join(SHADOW_STATE_DIR, f"{id_operacion}.json")
    if os.path.exists(path):
        os.remove(path)


async def run_discharge(
    id_operacion: int,
    volumen_objetivo: float,
    db_url: str,
):
    """
    Worker asíncrono que simula la descarga de combustible.
    Actualiza la BD cada segundo con el volumen actual.
    Se puede interrumpir limpiamente desde afuera al cancelar la Task.
    """
    from app.core.db import engine
    from sqlmodel import Session, select
    from app.models.pipas import Pipa
    from app.models.operaciones_pipas import OperacionDescarga

    # Caudal base en litros/minuto con variabilidad ±5%
    caudal_base_lpm = 450.0  # litros por minuto
    litros_por_tick = caudal_base_lpm / 60.0  # litros por segundo

    try:
        while True:
            await asyncio.sleep(1)

            # Variación aleatoria del caudal (±5%)
            variacion = 1.0 + (random.uniform(-0.05, 0.05))
            caudal_real = caudal_base_lpm * variacion
            transferido_tick = (caudal_real / 60.0)

            # Usamos una sesión para cada tick para asegurar que los datos estén frescos
            # y no dejar transacciones abiertas innecesariamente si el proceso es muy largo.
            with Session(engine) as session:
                op = session.get(OperacionDescarga, id_operacion)
                if op is None or op.estado not in ("INICIADA", "EN_PROGRESO"):
                    break  # Interrupción externa o ya finalizada

                nuevo_volumen = float(op.volumen_actual) + transferido_tick

                if nuevo_volumen >= volumen_objetivo:
                    # Finalizada: llenar exactamente el objetivo
                    op.volumen_actual = Decimal(str(round(volumen_objetivo, 2)))
                    op.caudal_lpm = Decimal(str(round(caudal_real, 2)))
                    op.estado = "FINALIZADA"
                    op.fecha_fin = datetime.utcnow()
                    session.add(op)
                    
                    # Liberar la pipa automáticamente
                    pipa = session.get(Pipa, op.id_pipa)
                    if pipa:
                        pipa.estado = "ACTIVA"
                        session.add(pipa)
                    
                    session.commit()
                    break
                else:
                    op.volumen_actual = Decimal(str(round(nuevo_volumen, 2)))
                    op.caudal_lpm = Decimal(str(round(caudal_real, 2)))
                    op.estado = "EN_PROGRESO"
                    session.add(op)
                    session.commit()

    except asyncio.CancelledError:
        # Paro de emergencia: actualizamos el estado a INTERRUMPIDA y lo que se bajó
        with Session(engine) as session:
            op = session.get(OperacionDescarga, id_operacion)
            if op:
                op.estado = "INTERRUMPIDA"
                op.fecha_fin = datetime.utcnow()
                session.add(op)
                
                # Liberar la pipa automáticamente
                pipa = session.get(Pipa, op.id_pipa)
                if pipa:
                    pipa.estado = "ACTIVA"
                    session.add(pipa)
                
                session.commit()
    finally:
        _active_tasks.pop(id_operacion, None)
        _remove_shadow_state(id_operacion)

def start_discharge(id_operacion: int, volumen_objetivo: float, db_url: str = ""):
    """Registra y lanza la tarea de descarga en el event loop de FastAPI."""
    _save_shadow_state(id_operacion, volumen_objetivo)
    task = asyncio.create_task(run_discharge(id_operacion, volumen_objetivo, db_url))
    _active_tasks[id_operacion] = task
    return task

def reanimate_tasks():
    """Busca descargas que quedaron a medias en el Shadow State y las reanima."""
    if not os.path.exists(SHADOW_STATE_DIR):
        return
    
    for filename in os.listdir(SHADOW_STATE_DIR):
        if filename.endswith(".json"):
            try:
                path = os.path.join(SHADOW_STATE_DIR, filename)
                with open(path, "r") as f:
                    data = json.load(f)
                    id_op = data["id_operacion"]
                    obj = data["volumen_objetivo"]
                    
                    if id_op not in _active_tasks:
                        print(f"[ENGINE] Reanimando descarga de operación {id_op}...")
                        start_discharge(id_op, obj)
            except Exception as e:
                print(f"[ENGINE] Error reanimando {filename}: {e}")


def stop_discharge(id_operacion: int) -> bool:
    """Cancela la tarea de descarga (dispara el paro de emergencia)."""
    task = _active_tasks.get(id_operacion)
    if task and not task.done():
        task.cancel()
        return True
    return False


def is_active(id_operacion: int) -> bool:
    """Retorna True si la operación tiene un worker activo."""
    task = _active_tasks.get(id_operacion)
    return task is not None and not task.done()
