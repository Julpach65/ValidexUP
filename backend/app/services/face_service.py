import numpy as np
import cv2
import base64
from deepface import DeepFace
import os

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