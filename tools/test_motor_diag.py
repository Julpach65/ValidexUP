
import os
import sys

# Agregar el path del backend para poder importar los módulos
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from app.services import discharge_engine
    print("Importación exitosa.")
    
    # Simular guardado de estado
    id_test = 9999
    vol_test = 100.0
    print(f"Probando escritura en Shadow State: {discharge_engine.SHADOW_STATE_DIR}")
    discharge_engine._save_shadow_state(id_test, vol_test)
    print("Escritura exitosa.")
    
    path = os.path.join(discharge_engine.SHADOW_STATE_DIR, f"{id_test}.json")
    if os.path.exists(path):
        print(f"Archivo creado correctamente en: {path}")
        os.remove(path)
        print("Limpieza de prueba completada.")
    else:
        print("ERROR: El archivo no se encontró tras la escritura.")

except Exception as e:
    print(f"ERROR DETECTADO: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
