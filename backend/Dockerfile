# ===================================================================
# Dockerfile: Validex UP - Backend (FastAPI + IA)
# ===================================================================
# Imagen unica optimizada para el backend de IA.
# Usa python:3.11-slim-bullseye para compatibilidad con OpenCV/DeepFace.
FROM python:3.11-slim-bullseye

# Dependencias de sistema necesarias para OpenCV y DeepFace
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root para seguridad
RUN addgroup --gid 1001 validexgroup && \
    adduser --uid 1001 --gid 1001 --disabled-password --gecos "" validexuser

WORKDIR /app

# Copiar requirements primero para aprovechar cache de capas.
# Si el codigo cambia pero requirements no, esta capa no se reconstruye.
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar codigo fuente de la aplicacion
COPY --chown=validexuser:validexgroup ./app ./app

# Cambiar al usuario no-root
USER validexuser

EXPOSE 8000

# Healthcheck: verifica que la API responda correctamente
HEALTHCHECK --interval=30s --timeout=15s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Comando de inicio
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
