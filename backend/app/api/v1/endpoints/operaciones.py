from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlmodel import Session, select
from decimal import Decimal
from datetime import datetime
import asyncio
import json

from app.core.db import get_session
from app.models.pipas import Pipa
from app.models.cargas_combustible import CargaCombustible
from app.models.operaciones_pipas import OperacionDescarga
from app.models.auditoria import Bitacora
from app.models.usuarios import Usuario

from app.schemas.operaciones import OperacionIniciarRequest, OperacionOut, BitacoraOut
from app.api import deps
from app.services import discharge_engine
from app.services.face_service import get_face_embedding, verify_face_match
from app.core.config import settings

router = APIRouter()


@router.post("/admin/reset-pipas", response_model=dict, status_code=200)
def reset_pipas_bloqueadas(
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(deps.get_gerente_user),
) -> Any:
    """
    ADMIN: Libera pipas atascadas en estado EN_DESCARGA y cierra
    operaciones colgadas que no tienen un worker activo.
    Útil tras reinicios del servidor o fallos inesperados.
    """
    pipas_liberadas = []
    ops_cerradas = []

    # Cerrar operaciones colgadas que no tienen worker activo
    ops_colgadas = session.exec(
        select(OperacionDescarga).where(
            OperacionDescarga.estado.in_(["INICIADA", "EN_PROGRESO"])
        )
    ).all()

    for op in ops_colgadas:
        if not discharge_engine.is_active(op.id_operacion):
            op.estado = "INTERRUMPIDA"
            op.fecha_fin = datetime.utcnow()
            session.add(op)
            ops_cerradas.append(op.id_operacion)

    # Liberar pipas EN_DESCARGA que no tienen operación activa
    pipas_bloqueadas = session.exec(
        select(Pipa).where(Pipa.estado == "EN_DESCARGA")
    ).all()

    for pipa in pipas_bloqueadas:
        # Verificar si tiene operación activa real
        op_activa = session.exec(
            select(OperacionDescarga)
            .where(OperacionDescarga.id_pipa == pipa.id_pipa)
            .where(OperacionDescarga.estado.in_(["INICIADA", "EN_PROGRESO"]))
        ).first()

        if not op_activa or not discharge_engine.is_active(op_activa.id_operacion):
            pipa.estado = "ACTIVA"
            session.add(pipa)
            pipas_liberadas.append(pipa.placa)

    session.commit()

    return {
        "status": "ok",
        "pipas_liberadas": pipas_liberadas,
        "operaciones_cerradas": ops_cerradas,
        "message": f"Reset completado: {len(pipas_liberadas)} pipas liberadas, {len(ops_cerradas)} operaciones cerradas."
    }



@router.post("/cargar", response_model=dict, status_code=201)
async def iniciar_descarga_combustible(
    *,
    session: Session = Depends(get_session),
    carga_in: OperacionIniciarRequest,
    current_user: Usuario = Depends(deps.get_gerente_user)
) -> Any:
    """
    FASE 1 - Inicia una operación de descarga de combustible.
    Valida la pipa, crea la OperacionDescarga en estado INICIADA,
    bloquea la pipa y lanza el motor asíncrono en segundo plano.
    """
    pipa = session.get(Pipa, carga_in.id_pipa)
    if not pipa:
        raise HTTPException(status_code=404, detail="La Pipa especificada no existe.")

    # 1. VERIFICACIÓN BIOMÉTRICA ATÓMICA
    if not current_user.face:
        raise HTTPException(status_code=400, detail="El Gerente no tiene biometría registrada.")
    
    try:
        current_embedding = get_face_embedding(carga_in.image_data)
    except ValueError as e:
        error_str = str(e)
        if "MULTIPLE_FACES_DETECTED" in error_str:
            msg = "Seguridad: Se han detectado varias personas en camara. Por tu seguridad, debes estar solo."
        elif "FACE_TOO_SMALL_OR_PARTIAL" in error_str:
            msg = "Calidad: Estas muy lejos o tu rostro esta incompleto. Acercate mas a la camara."
        else: # Cubre NO_FACE_DETECTED, etc.
            msg = "No se detecto ningun rostro. Por favor, asegurate de estar frente a la camara y con buena iluminacion."
        raise HTTPException(status_code=400, detail=msg)

    if not verify_face_match(current_user.face, current_embedding, threshold=0.55):
        # Log del intento fallido
        log_fallido = Bitacora(
            id_usuario=current_user.id_usuario,
            accion="Intento de Descarga Rechazado",
            detalles=f"Suplantacion detectada: Biometria no coincidio al intentar descargar pipa {pipa.placa}.",
        )
        session.add(log_fallido)
        session.commit()
        raise HTTPException(status_code=400, detail="Validacion biometrica fallida. Orden de descarga rechazada.")

    if pipa.estado != "ACTIVA":
        raise HTTPException(
            status_code=400,
            detail=f"Esta pipa no está disponible (Estado: {pipa.estado})."
        )

    # Validar volumen objetivo
    # Calcular litros descargados acumulados para esta pipa
    cargas_existentes = session.exec(
        select(CargaCombustible).where(CargaCombustible.id_pipa == pipa.id_pipa)
    ).all()
    litros_ya_descargados = sum(float(c.litros_descargados) for c in cargas_existentes)
    disponible = float(pipa.capacidad_litros) - litros_ya_descargados

    if float(carga_in.volumen_objetivo) > disponible:
        raise HTTPException(
            status_code=400,
            detail=f"Volumen solicitado ({carga_in.volumen_objetivo} L) supera la capacidad disponible ({disponible:.2f} L)."
        )

    # Crear la operación en estado INICIADA
    operacion = OperacionDescarga(
        id_pipa=pipa.id_pipa,
        id_usuario=current_user.id_usuario,
        volumen_objetivo=carga_in.volumen_objetivo,
        volumen_actual=Decimal("0.00"),
        estado="INICIADA",
    )
    session.add(operacion)

    # Bloquear la pipa
    pipa.estado = "EN_DESCARGA"
    session.add(pipa)

    # Log de auditoría (Inicio)
    log = Bitacora(
        id_usuario=current_user.id_usuario,
        accion="Descarga Iniciada",
        detalles=f"Pipa {pipa.placa}: descarga de {carga_in.volumen_objetivo} L ({carga_in.tipo_combustible}) autorizada por {current_user.nombre_completo}",
    )
    session.add(log)
    
    # Commit final de base de datos antes de disparar el motor
    # Esto asegura que la pipa esté bloqueada y la operación creada en DB
    session.commit()
    session.refresh(operacion)

    # Lanzar el motor asíncrono en segundo plano (BackgroundTask no intrusiva)
    try:
        discharge_engine.start_discharge(
            id_operacion=operacion.id_operacion,
            volumen_objetivo=float(carga_in.volumen_objetivo),
            db_url=settings.DATABASE_URL
        )
    except Exception as e:
        print(f"[ERROR] No se pudo iniciar el motor de descarga: {e}")
        # Recuperación de seguridad: si el motor falla, liberamos la pipa
        try:
            pipa.estado = "ACTIVA"
            session.add(pipa)
            session.commit()
        except:
            pass
        raise HTTPException(status_code=500, detail=f"Fallo al arrancar el motor de descarga: {str(e)}")

    return {
        "status": "success",
        "id_operacion": operacion.id_operacion,
        "message": f"Operación #{operacion.id_operacion} iniciada satisfactoriamente.",
    }


@router.get("/{id_operacion}/estado", response_model=OperacionOut)
def consultar_estado_operacion(
    id_operacion: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retorna el estado actual de la operación de descarga.
    Usado como fallback si el WebSocket no está disponible.
    """
    op = session.get(OperacionDescarga, id_operacion)
    if not op:
        raise HTTPException(status_code=404, detail="Operación no encontrada.")
    return op


@router.post("/{id_operacion}/interrumpir", response_model=dict)
async def interrumpir_descarga(
    id_operacion: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(deps.get_mfa_verified_user),
) -> Any:
    """
    PARO DE EMERGENCIA: Cancela la tarea asíncrona de descarga.
    Persiste el volumen parcial descargado y libera la pipa.
    """
    op = session.get(OperacionDescarga, id_operacion)
    if not op:
        raise HTTPException(status_code=404, detail="Operación no encontrada.")

    if op.estado not in ("INICIADA", "EN_PROGRESO"):
        raise HTTPException(
            status_code=400,
            detail=f"La operación ya está en estado '{op.estado}' y no puede interrumpirse."
        )

    # Detener el worker asíncrono de inmediato
    discharge_engine.stop_discharge(id_operacion)

    # El motor ya se encarga de cambiar el estado a INTERRUMPIDA y liberar la pipa.
    # Aquí solo nos aseguramos de registrar la carga parcial y la bitácora.
    # Refrescamos op para tener el volumen más reciente tras detener el motor
    session.refresh(op)

    # Si hubo volumen parcial, crear el registro de CargaCombustible parcial
    if float(op.volumen_actual) > 0:
        carga_parcial = CargaCombustible(
            id_operacion=op.id_operacion,
            id_pipa=op.id_pipa,
            litros_descargados=op.volumen_actual,
            tipo_combustible="MAGNA", # Se asume Magna o se podría obtener de la pipa
            autorizado_por=op.id_usuario,
        )
        session.add(carga_parcial)

    # Log de auditoría (Interrupción de Emergencia)
    log = Bitacora(
        id_usuario=current_user.id_usuario,
        accion="PARO DE EMERGENCIA",
        detalles=f"Operación #{id_operacion} interrumpida. Descargados: {op.volumen_actual} L.",
    )
    session.add(log)
    
    try:
        session.commit()
    except Exception:
        session.rollback()
        # Si falla el commit aquí (por colisión con el worker), ignoramos 
        # porque el motor ya salvó el estado principal.
        pass

    return {
        "status": "interrupted",
        "volumen_parcial": float(op.volumen_actual),
        "message": f"Operación #{id_operacion} detenida. {op.volumen_actual} L registrados como carga parcial.",
    }


@router.post("/{id_operacion}/finalizar", response_model=dict)
async def finalizar_descarga_manual(
    id_operacion: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(deps.get_mfa_verified_user),
) -> Any:
    """
    Cierra formalmente la operación y crea el registro final en CargasCombustible.
    Solo aplica si el estado es FINALIZADA (el motor ya terminó).
    """
    op = session.get(OperacionDescarga, id_operacion)
    if not op:
        raise HTTPException(status_code=404, detail="Operación no encontrada.")

    if op.estado != "FINALIZADA":
        raise HTTPException(
            status_code=400,
            detail=f"La operación aún no finalizó (Estado: {op.estado}). Espere a que el motor complete la descarga."
        )

    # Crear el registro histórico final
    carga = CargaCombustible(
        id_operacion=op.id_operacion,
        id_pipa=op.id_pipa,
        litros_descargados=op.volumen_actual,
        tipo_combustible="MAGNA",
        autorizado_por=op.id_usuario,
    )
    session.add(carga)

    # Liberar la pipa
    pipa = session.get(Pipa, op.id_pipa)
    if pipa:
        pipa.estado = "ACTIVA"
        session.add(pipa)

    # Log de auditoría (Finalización exitosa)
    duracion = ""
    if op.fecha_fin and op.fecha_inicio:
        delta = op.fecha_fin - op.fecha_inicio
        mins = int(delta.total_seconds() // 60)
        secs = int(delta.total_seconds() % 60)
        duracion = f" Duración: {mins}m {secs}s."
    
    log = Bitacora(
        id_usuario=current_user.id_usuario,
        accion="Descarga Completada",
        detalles=f"Operación #{id_operacion}: {op.volumen_actual} L descargados de pipa {pipa.placa if pipa else op.id_pipa}.{duracion}",
    )
    session.add(log)
    session.commit()

    return {
        "status": "completed",
        "volumen_final": float(op.volumen_actual),
        "id_pipa": op.id_pipa,
        "duracion": duracion.strip(),
        "message": f"Descarga completada exitosamente: {op.volumen_actual} L.",
    }


@router.websocket("/ws/descarga/{id_operacion}")
async def websocket_descarga(
    websocket: WebSocket,
    id_operacion: int,
    session: Session = Depends(get_session),
):
    """
    WebSocket de streaming en tiempo real para una operación de descarga.
    Envía actualizaciones cada segundo hasta que la operación termine.
    """
    await websocket.accept()

    try:
        while True:
            await asyncio.sleep(1)

            # Leer el estado actual desde la BD
            op = session.get(OperacionDescarga, id_operacion)
            if not op:
                await websocket.send_text(json.dumps({"error": "Operación no encontrada."}))
                break

            payload = {
                "id_operacion": op.id_operacion,
                "volumen_actual": float(op.volumen_actual),
                "volumen_objetivo": float(op.volumen_objetivo),
                "caudal_lpm": float(op.caudal_lpm),
                "estado": op.estado,
                "progreso_pct": round(
                    (float(op.volumen_actual) / float(op.volumen_objetivo)) * 100, 1
                ) if float(op.volumen_objetivo) > 0 else 0,
            }
            await websocket.send_text(json.dumps(payload))

            # Terminar el stream si la operación concluyó
            if op.estado in ("FINALIZADA", "INTERRUMPIDA"):
                break

    except WebSocketDisconnect:
        pass  # Cliente desconectado — el motor sigue corriendo en background


@router.get("/bitacora", response_model=List[BitacoraOut])
def read_bitacora(
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(deps.get_mfa_verified_user),
) -> Any:
    """Lista todos los eventos de seguridad y operaciones (últimos 100)."""
    query = (
        select(Bitacora, Usuario.nombre_completo, Usuario.rol)
        .join(Usuario, isouter=True)
        .order_by(Bitacora.id_log.desc())
        .limit(100)
    )

    results = session.exec(query).all()

    historial = []
    for log, nombre, rol in results:
        historial.append(BitacoraOut(
            id_log=log.id_log,
            id_usuario=log.id_usuario or 0,
            nombre_responsable=nombre or "Sistema",
            rol_responsable=rol or "N/A",
            accion=log.accion,
            detalles=log.detalles or "",
            fecha_hora=log.fecha_hora,
        ))

    return historial
