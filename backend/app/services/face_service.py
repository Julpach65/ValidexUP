import numpy as np
import cv2
import base64
from deepface import DeepFace
import os
import json

def base64_to_image(base64_string):
    """
    Convierte la cadena Base64 que viene de la cámara (frontend)
    en una imagen formato OpenCV.
    """
    try:
        # Quitamos el encabezado data:image/jpeg;base64, si existe
        if "," in base64_string:
            format, imgstr = base64_string.split(',')
        else:
            imgstr = base64_string
            
        nparr = np.frombuffer(base64.b64decode(imgstr), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Error al decodificar imagen: {e}")
        return None

# Cargamos el clasificador de OpenCV una sola vez para máxima eficiencia.
cascade_path = os.path.join(cv2.data.haarcascades, 'haarcascade_frontalface_default.xml')
face_cascade = cv2.CascadeClassifier(cascade_path)

def get_face_embedding(base64_image):
    """
    Extrae el vector numérico (embedding) del rostro con validaciones de seguridad previas.
    """
    img = base64_to_image(base64_image)
    if img is None:
        raise ValueError("INVALID_IMAGE_DATA")

    # 1. Convertir a escala de grises para la detección (más rápido)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 2. Detectar rostros con el clasificador de OpenCV
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5, # Un valor más alto para ser más estricto
        minSize=(100, 100) # Ignorar caras muy pequeñas que puedan ser falsos positivos
    )

    # 3. FILTRO DE SEGURIDAD 1: Múltiples rostros
    if len(faces) > 1:
        raise ValueError("MULTIPLE_FACES_DETECTED")
    
    # 4. FILTRO DE SEGURIDAD 2: Ningún rostro
    if len(faces) == 0:
        raise ValueError("NO_FACE_DETECTED")

    # 5. FILTRO DE SEGURIDAD 3: Calidad del rostro (tamaño)
    (x, y, w, h) = faces[0]
    face_area = w * h
    image_area = img.shape[0] * img.shape[1]
    
    # La cara debe ocupar al menos el 15% de la imagen para ser válida.
    if (face_area / image_area) < 0.15:
        raise ValueError("FACE_TOO_SMALL_OR_PARTIAL")

    # 6. Si todos los filtros pasan, generamos el embedding
    try:
        results = DeepFace.represent(
            img_path=img, 
            model_name="VGG-Face", 
            enforce_detection=True, 
            detector_backend='opencv' # Usamos el más rápido porque ya validamos la seguridad
        )
        if not results:
             raise ValueError("DEEPFACE_REPRESENT_FAILED")
        return results[0]["embedding"]
    except Exception as e:
        print(f"Error interno de DeepFace durante la representación: {e}")
        raise ValueError("NO_FACE_DETECTED") from e

def verify_face_match(stored_embedding_str: str, current_embedding: list, threshold: float = 0.40) -> bool:
    """
    Compara el embedding guardado en BD (TEXT/JSON) con el nuevo capturado (List).
    Usa Distancia Coseno.
    
    Args:
        stored_embedding_str: String JSON de la base de datos (ej. "[0.1, 0.2...]")
        current_embedding: Lista de floats generada por DeepFace en este momento.
        threshold: Límite de tolerancia (0.40 recomendado para VGG-Face/Cosine).
        
    Returns:
        True si la distancia es MENOR al umbral (Es la misma persona).
    """
    print(f"⚡ Iniciando cálculo matemático de similitud...", flush=True)
    try:
        if not stored_embedding_str:
            print("⚠️ Error: El embedding guardado en BD está vacío.", flush=True)
            return False
            
        # 1. Convertir el string de la BD a lista y luego ambos a NumPy Arrays
        known_embedding = np.array(json.loads(stored_embedding_str))
        candidate_embedding = np.array(current_embedding)
        
        # 2. Calcular Distancia Coseno
        # Fórmula: 1 - (Producto Punto / (Magnitud A * Magnitud B))
        dot_product = np.dot(known_embedding, candidate_embedding)
        norm_a = np.linalg.norm(known_embedding)
        norm_b = np.linalg.norm(candidate_embedding)
        
        cosine_distance = 1 - (dot_product / (norm_a * norm_b))
        
        print(f"🔍 Distancia Biométrica: {cosine_distance:.4f} (Umbral: {threshold})", flush=True)
        
        # 3. Si la distancia es menor al umbral, es un MATCH
        return cosine_distance < threshold
        
    except Exception as e:
        print(f"Error en comparación matemática: {e}", flush=True)
        return False