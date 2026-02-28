from twilio.rest import Client
from app.core.config import settings

# Inicializamos el cliente de Twilio usando las llaves que configuramos en config.py
client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

def enviar_codigo_verificacion(telefono: str):
    """
    Esta función le dice a Twilio: 'Genera un código y mándalo por SMS'.
    """
    # Si estamos en modo MOCK, no gastamos créditos y solo simulamos el envío
    if settings.MOCK_SMS:
        print(f"--- MOCK SMS ---")
        print(f"Enviando código de prueba al número: {telefono}")
        print(f"-----------------")
        return "pending"

    # Usamos el Service SID (el que empieza con VA) para disparar el mensaje
    verification = client.verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID) \
        .verifications \
        .create(to=telefono, channel='sms')
    
    return verification.status

def validar_codigo_verificacion(telefono: str, codigo: str):
    """
    Esta función recibe el código que el usuario escribió en el frontend
    y le pregunta a Twilio si es correcto.
    """
    if settings.MOCK_SMS:
        # En modo prueba, aceptamos el código '123456' como válido
        return codigo == "123456"

    check = client.verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID) \
        .verification_checks \
        .create(to=telefono, code=codigo)
    
    return check.status == "approved"