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

def get_face_embedding(base64_image):
    """
    Extrae el vector numérico (embedding) del rostro.
    """
    try:
        img = base64_to_image(base64_image)
        if img is None:
            return None

        # Usamos DeepFace para obtener los números (embeddings)
        # model_name="VGG-Face" es el estándar, balanceado entre velocidad y precisión.
        results = DeepFace.represent(
            img_path=img, 
            model_name="VGG-Face", 
            enforce_detection=True, 
            detector_backend='opencv'
        )
        
        # Retornamos solo la lista de números del primer rostro detectado
        return results[0]["embedding"]
    except Exception as e:
        print(f"Error en el reconocimiento facial: {e}")
        return None

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