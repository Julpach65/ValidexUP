# Validex UP 🛡️

**Sistema Web de Validación Biométrica "Zero-Trust"**

Validex UP (Unified Protection) es la solución definitiva para mitigar el fraude y errores humanos en los procesos de la industria pesada y logística. Nuestro sistema garantiza que ninguna acción crítica (como la liberación de pipas u órdenes de despacho) sea ejecutada sin pasar por un estricto modelo de autenticación de 3 factores.

## 🚀 Arquitectura "Zero-Trust" del MVP
El MVP se basa en un flujo estricto secuencial:
1. **Credenciales (Paso 1):** Acceso Base (Usuario y Password).
2. **MFA Temporal (Paso 2):** Envío y validación de SMS OTP a través de Twilio Verify (Expira en 5 minutos).
3. **Validación Biométrica (Paso 3):** Inteligencia Artificial mediante DeepFace para comparación facial contra la base de datos de operadores autorizados a través de captura Webcam.
4. **Autorización (Paso 4):** Acceso al Dashboard de operaciones y despachos.

## 💻 Tech Stack Elegido
*   **Frontend:** Next.js 14, React (react-webcam), Tailwind CSS, shadcn/ui.
*   **Backend:** Python 3.11+, FastAPI.
*   **Biometría & IA:** DeepFace, OpenCV Headless.
*   **Base de Datos:** MySQL (SQLModel para el ORM).
*   **Integraciones:** Twilio Verify API.

## 🌿 Estrategia de Ramas (Branching)
Seguimos un flujo de trabajo profesional para proteger la rama principal de producción:
*   `main`: Producción estable.
*   `develop`: Entorno de Pruebas Unificadas e Integración Continua (QA).
*   `feature/frontend`: Tareas exclusivas de la Interfaz de usuario.
*   `feature/backend`: Tareas de construcción de Endpoints y API REST.
*   `feature/ai-biometrics`: Entrenamiento e implementación de lógica DeepFace.
*   `feature/database`: Migraciones, Modelos SQLModel y arquitectura BD.

## 📦 Inicialización Local
Este repositorio alojará todos los submódulos o carpetas de cada capa arquitectónica para asegurar el flujo ágil en solo 4 semanas de desarrollo.

> Construido para estandarizar la seguridad industrial bajo un diseño de vanguardia.
