# VALIDEX UP - Unified Protection System

SISTEMA DE AUTENTICACION BIOMETRICA Y CONTROL OPERATIVO INDUSTRIAL

Validex UP es una plataforma de alta seguridad diseñada para la mitigación de riesgos operativos y la prevención de fraude en sectores críticos como la logística y la industria pesada. El sistema implementa un modelo de autorización basado en una arquitectura Zero-Trust, asegurando la integridad de cada transacción mediante una validación secuencial de tres factores (3FA).

## Arquitectura de Distribucion (Docker)

El ecosistema se encuentra orquestado mediante Docker Compose, lo que garantiza la portabilidad y la paridad entre los entornos de desarrollo y producción. La arquitectura se divide en servicios independientes para optimizar la seguridad y el rendimiento:

### Gestion de Redes
- **Red Interna (validex_internal):** Aísla la comunicación entre el backend y la base de datos MySQL. Esta red no tiene exposición externa ni acceso a servicios públicos de internet.
- **Red de Aplicacion (validex_frontend):** Facilita el enlace seguro entre la interfaz de usuario y la API REST.

### Servicios Orquestados
1. **Motor de Base de Datos:** MySQL 8.0 con persistencia de datos mediante volúmenes Docker.
2. **Servidor de Aplicaciones (API):** Desarrollado en FastAPI, integrando librerías avanzadas de biometría (OpenCV y DeepFace).
3. **Interfaz de Usuario (Frontend):** Aplicación Next.js 15 optimizada mediante compilación standalone para reducir la huella de memoria en contenedores.

## Stack Tecnologico

### Frontend
- Framework: Next.js 15
- Libreria de Interfaz: React 19
- Estilos y Animaciones: Tailwind CSS y Framer Motion
- Gestion de Estado: Zustand

### Backend
- Framework: FastAPI (Python 3.11)
- ORM: SQLModel
- Procesamiento de Imagen: OpenCV (Headless)
- Inteligencia Artificial: DeepFace

### Seguridad
- Protocolos: JWT (JSON Web Tokens) con ofuscación de cliente.
- Segundo Factor: SMS OTP integrado via Twilio.
- Control de Acceso: Middleware AuthGuard con validación asíncrona de estado.

## Procedimiento de Despliegue

La implementación recomendada requiere Docker y Docker Compose instalados en el sistema anfitrión.

### Ejecucion del Sistema
Para construir e iniciar la arquitectura completa, ejecute el siguiente comando desde el directorio raíz:

```bash
docker-compose up --build
```

### Puertos de Servicio
Una vez completado el despliegue, la plataforma será accesible en las siguientes direcciones:
- Interfaz de Usuario: http://localhost:3000
- Documentacion de API (Swagger): http://localhost:8000/docs

## Estructura del Proyecto

- **/backend:** Logica de negocio, servicios de identidad y endpoints de IA.
- **/validex_ui:** Aplicacion cliente desarrollada en Next.js.
- **/database:** Esquemas SQL y scripts de inicializacion de datos.
- **/docker-compose.yml:** Definicion maestra de la infraestructura.

## Terminologia de Seguridad y Privacidad

El sistema incorpora tecnicas de blindaje contra errores de pre-renderizado (SSR) y gestiona el ciclo de vida de los procesos para evitar estados huerfanos. Todas las transacciones biometricas son comparadas contra una base de datos local pre-autorizada bajo rigurosos protocolos de cumplimiento.

PROPIEDAD INTELECTUAL PROTEGIDA. TODOS LOS DERECHOS RESERVADOS 2026.
