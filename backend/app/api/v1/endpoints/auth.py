from app.services.face_service import get_face_embedding
import json 
from datetime import datetime, timedelta
import random
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select, SQLModel

from app.core.sms import enviar_codigo_custom
from app.core.config import settings
from app.core import security
from app.core.db import get_session

from app.models.usuarios import Usuario
from app.models.codigos_otp import CodigoOTP
from app.models.sesiones import Sesion

from app.schemas.user import UsuarioCreate, UsuarioOut
from app.schemas.token import Token
from app.api import deps

router = APIRouter()

# --- MODELOS DE PETICIÓN (SCHEMAS) ---
class VerifySMSRequest(SQLModel):
    id_usuario: int
    codigo: str

class RequestOTP(SQLModel):
    id_usuario: int
    telefono: str

class FaceRegisterRequest(SQLModel):
    user_id: int
    image_data: str

class ResendOTPRequest(SQLModel):
    id_usuario: int


# --- ENDPOINTS ---

@router.post("/login", response_model=Token)
def login_access_token(
    session: Session = Depends(get_session), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    statement = select(Usuario).where(Usuario.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
        )
    
    statement_sesion = select(Sesion).where(Sesion.id_usuario == user.id_usuario)
    sesion_activa = session.exec(statement_sesion).first()
    
    if not sesion_activa:
        sesion_activa = Sesion(id_usuario=user.id_usuario)
    
    sesion_activa.paso_1_login = True
    session.add(sesion_activa)
    session.commit()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id_usuario, sid=sesion_activa.id_sesion, expires_delta=access_token_expires
    )
    
    # Auto-envío de OTP en modo Login (Anti-Takeover)
    has_phone = bool(user.telefono)
    if has_phone:
        code = f"{random.randint(100000, 999999)}"
        otp_entry = CodigoOTP(
            id_usuario=user.id_usuario,
            codigo=code,
            expira_at=datetime.utcnow() + timedelta(minutes=5),
            usado=False
        )
        session.add(otp_entry)
        session.commit()
        enviar_codigo_custom(user.telefono, code)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "id_usuario": user.id_usuario,
        "rol": user.rol,
        "has_phone": has_phone
    }

@router.post("/register", response_model=UsuarioOut)
def register_user(
    *, session: Session = Depends(get_session), user_in: UsuarioCreate
) -> Any:
    statement = select(Usuario).where(Usuario.email == user_in.email)
    user = session.exec(statement).first()
    
    if user:
        raise HTTPException(status_code=400, detail="El email ya está registrado.")
        
    # Se asume que el schema UsuarioCreate ya no incluye 'username'.
    # Se usará el email como username para consistencia con el login y simplificar el registro.
    db_user = Usuario(
        nombre_completo=user_in.nombre_completo,
        username=user_in.email,  # Usar el email como username.
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        rol=user_in.rol,
        telefono=user_in.telefono # Este campo es opcional en el registro inicial.
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    if db_user.telefono:
        code = f"{random.randint(100000, 999999)}"
        otp_entry = CodigoOTP(
            id_usuario=db_user.id_usuario,
            codigo=code,
            expira_at=datetime.utcnow() + timedelta(minutes=5),
            usado=False
        )
        session.add(otp_entry)
        session.commit()
        enviar_codigo_custom(db_user.telefono, code)
    
    return db_user

@router.post("/request-otp")
def request_new_otp(body: RequestOTP, session: Session = Depends(get_session)) -> Any:
    user = session.get(Usuario, body.id_usuario)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.telefono = body.telefono
    session.add(user)

    code = f"{random.randint(100000, 999999)}"
    otp_entry = CodigoOTP(
        id_usuario=user.id_usuario,
        codigo=code,
        expira_at=datetime.utcnow() + timedelta(minutes=5),
        usado=False
    )
    session.add(otp_entry)
    session.commit()
    enviar_codigo_custom(user.telefono, code)
    
    return {"msg": "Código enviado correctamente", "status": "OTP_SENT"}

@router.post("/resend-login-otp")
def resend_login_otp(body: ResendOTPRequest, session: Session = Depends(get_session)) -> Any:
    user = session.get(Usuario, body.id_usuario)
    if not user or not user.telefono:
        raise HTTPException(status_code=400, detail="Usuario sin teléfono registrado o no encontrado")

    code = f"{random.randint(100000, 999999)}"
    otp_entry = CodigoOTP(
        id_usuario=user.id_usuario,
        codigo=code,
        expira_at=datetime.utcnow() + timedelta(minutes=5),
        usado=False
    )
    session.add(otp_entry)
    session.commit()
    enviar_codigo_custom(user.telefono, code)
    
    return {"msg": "Código reenviado automáticamente al número seguro", "status": "OTP_RESENT"}

@router.post("/verify-otp")
def verify_sms(body: VerifySMSRequest, session: Session = Depends(get_session)) -> Any:
    statement = select(CodigoOTP).where(
        CodigoOTP.id_usuario == body.id_usuario,
        CodigoOTP.codigo == body.codigo,
        CodigoOTP.usado == False
    )
    otp_record = session.exec(statement).first()

    if not otp_record or datetime.utcnow() > otp_record.expira_at:
        raise HTTPException(status_code=400, detail="Código incorrecto o expirado.")

    otp_record.usado = True
    session.add(otp_record)

    statement_sesion = select(Sesion).where(Sesion.id_usuario == body.id_usuario)
    sesion_activa = session.exec(statement_sesion).first()

    if not sesion_activa:
        sesion_activa = Sesion(id_usuario=body.id_usuario, paso_1_login=True)
    
    sesion_activa.paso_2_sms = True
    session.add(sesion_activa)
    session.commit()

    # VERIFICACIÓN ROBUSTA: Consultamos si el usuario ya tiene biometría
    user = session.get(Usuario, body.id_usuario)
    has_face = False
    if user and user.face:
        has_face = True
        
    return {
        "msg": "Paso 2 completado", 
        "status": "SMS_VERIFIED",
        "has_face_registered": has_face # <--- Nueva bandera de verdad absoluta
    }

from sqlmodel import select # Asegúrate de tener esta importación arriba

@router.post("/register-face")
def register_face(data: FaceRegisterRequest, session: Session = Depends(get_session)):
    try:
        embedding = get_face_embedding(data.image_data)
    except ValueError as e:
        error_str = str(e)
        if "MULTIPLE_FACES_DETECTED" in error_str:
            raise HTTPException(
                status_code=400, 
                detail="Se han detectado varias personas en camara. Por tu seguridad, debes estar solo."
            )
        elif "FACE_TOO_SMALL_OR_PARTIAL" in error_str:
            raise HTTPException(
                status_code=400,
                detail="Estas muy lejos o tu rostro esta incompleto. Acercate mas a la camara."
            )
        else: # Cubre NO_FACE_DETECTED, etc.
            raise HTTPException(
                status_code=400, 
                detail="No se detecto ningun rostro. Por favor, asegurate de estar frente a la camara y con buena iluminacion."
            )
    
    user = session.get(Usuario, data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 1. Guardamos el rostro en el perfil del usuario
    user.face = json.dumps(embedding)
    session.add(user)

    # 2. ACTUALIZACIÓN DE LA TABLA SESIONES
    # Buscamos la última sesión de este usuario donde el paso 3 sea 0
    statement = select(Sesion).where(
        Sesion.id_usuario == data.user_id,
        Sesion.paso_3_face == 0
    ).order_by(Sesion.id_sesion.desc())
    
    db_session = session.exec(statement).first()

    if db_session:
        db_session.paso_3_face = 1 # Marcamos el paso biométrico como completado
        session.add(db_session)
    
    # Guardamos todos los cambios (Usuario y Sesión)
    session.commit()
    
    # 3. GENERACION DE TOKEN PARA LOGIN AUTOMATICO POST-REGISTRO
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id_usuario, 
        sid=db_session.id_sesion if db_session else 0,
        expires_delta=access_token_expires
    )
    
    return {
        "status": "success",
        "message": f"Rostro de {user.nombre_completo} registrado y seguridad completada.",
        "access_token": access_token,
        "token_type": "bearer",
        "id_usuario": user.id_usuario,
        "nombre_completo": user.nombre_completo,
        "rol": user.rol
    }

    # Seccion de verificar Rostro 
from app.services.face_service import get_face_embedding, verify_face_match
from fastapi import status

@router.post("/verify-face-login")
def verify_face_login(data: FaceRegisterRequest, session: Session = Depends(get_session)):
    # 1. Intentar extraer el rostro de la imagen enviada
    try:
        current_embedding = get_face_embedding(data.image_data)
    except ValueError as e:
        error_str = str(e)
        if "MULTIPLE_FACES_DETECTED" in error_str:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="SEGURIDAD: Se han detectado varias personas en camara. Por tu seguridad, debes estar solo."
            )
        elif "FACE_TOO_SMALL_OR_PARTIAL" in error_str:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="CALIDAD: Estas muy lejos o tu rostro esta incompleto. Acercate mas a la camara."
            )
        else: # Cubre NO_FACE_DETECTED y otros errores internos.
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="No se detecto ningun rostro. Por favor, asegurate de estar frente a la camara y con buena iluminacion."
            )

    # 2. Buscar al usuario y verificar si tiene biometría registrada
    user = session.get(Usuario, data.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Usuario no encontrado."
        )
    
    if not user.face:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El usuario no tiene un rostro registrado en el sistema."
        )

    # 3. VERIFICACION BIOMETRICA ESTRICTA
    if not verify_face_match(user.face, current_embedding, threshold=0.45):
        # Se asume que el intento fallido significa que la sesion no avanzo.
        # No registramos la sesion fallida aqui para no bloquear, o podriamos añadir un contador de intentos.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Biometria no coincide. Acceso denegado.",
        )

    # 4. ACTUALIZACIÓN DE SEGURIDAD (Paso 3 completado)
    statement = select(Sesion).where(
        Sesion.id_usuario == data.user_id
    ).order_by(Sesion.id_sesion.desc())
    
    db_session = session.exec(statement).first()

    if db_session:
        db_session.paso_3_face = 1  # Marcamos éxito en la base de datos
        session.add(db_session)
        session.commit()

    return {
        "status": "success", 
        "message": f"Identidad verificada correctamente. ¡Bienvenido, {user.nombre_completo}!",
        "user_name": user.nombre_completo
    }

@router.get("/me", response_model=UsuarioOut)
def read_users_me(
    current_user: Usuario = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener el usuario actual (Conectado via Token JWT).
    """
    return current_user

