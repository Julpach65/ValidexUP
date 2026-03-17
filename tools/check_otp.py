import sys
sys.path.insert(0, '.')
from app.core.db import engine
from sqlmodel import Session
from sqlalchemy import text

with Session(engine) as session:
    result = session.exec(text("SELECT id, email, nombre_completo FROM Usuarios WHERE email = 'melisa@gmail.com'")).all()
    print('=== USUARIO MELISA ===')
    for r in result:
        print(f'  id={r[0]}, email={r[1]}, nombre={r[2]}')
    
    if result:
        user_id = result[0][0]
        otps = session.exec(text(f"SELECT id_codigo, codigo, fecha_expiracion, usado FROM CodigosOTP WHERE id_usuario = {user_id} ORDER BY id_codigo DESC LIMIT 5")).all()
        print(f'\n=== ÚLTIMOS OTP (usuario {user_id}) ===')
        for otp in otps:
            print(f'  id={otp[0]}, codigo={otp[1]}, expira={otp[2]}, usado={otp[3]}')
    else:
        print('  Usuario no encontrado')
