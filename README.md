# Validex UP

**Sistema Web de Validacion Biometrica Zero-Trust**

Validex UP (Unified Protection) es una solucion para mitigar el fraude y errores humanos en los procesos de la industria pesada y logistica. Nuestro sistema garantiza que ninguna accion critica sea ejecutada sin pasar por un estricto modelo de autenticacion de 3 factores.

## Arquitectura Zero-Trust del MVP
El MVP se basa en un flujo estricto secuencial:
1. **Credenciales (Paso 1):** Acceso Base (Usuario y Password).
2. **MFA Temporal (Paso 2):** Envio y validacion de SMS OTP a traves de Twilio Verify.
3. **Validacion Biometrica (Paso 3):** Inteligencia Artificial mediante DeepFace para comparacion facial contra la base de datos de operadores autorizados a traves de captura Webcam.
4. **Autorizacion (Paso 4):** Acceso al Dashboard de operaciones y despachos.

## Tech Stack Elegido
*   **Frontend:** Next.js 14, React (react-webcam), Tailwind CSS, shadcn/ui.
*   **Backend:** Python 3.11+, FastAPI.
*   **Biometria e IA:** DeepFace, OpenCV Headless.
*   **Base de Datos:** MySQL (SQLModel para el ORM).
*   **Integraciones:** Twilio Verify API.

## Estrategia de Ramas (Branching)
Seguimos un flujo de trabajo profesional para proteger la rama principal de produccion:
*   `main`: Produccion estable.
*   `develop`: Entorno de Pruebas Unificadas e Integracion Continua (QA).
*   `feature/frontend`: Tareas exclusivas de la Interfaz de usuario.
*   `feature/backend`: Tareas de construccion de Endpoints y API REST.
*   `feature/ai-biometrics`: Entrenamiento e implementacion de logica DeepFace.
*   `feature/database`: Migraciones, Modelos SQLModel y arquitectura BD.

## Inicializacion Local
Este repositorio alojara todos los submodulos o carpetas de cada capa arquitectonica para asegurar el flujo agil en solo 4 semanas de desarrollo.

