# VALIDEX UP - Sistema de Autenticacion Biometrica Zero-Trust

Validex UP es una plataforma avanzada diseñada para eliminar el fraude y los errores operativos en entornos de logistica e industria pesada. El sistema asegura que ninguna accion critica se realice sin una verificacion estricta de tres factores, garantizando la identidad del operador en todo momento.

## Arquitectura de Seguridad

El sistema implementa un modelo de confianza cero dividido en etapas secuenciales:

1. Credenciales de Acceso: Validacion base de usuario y contraseña.
2. Segundo Factor (MFA): Envio y verificacion de codigo SMS OTP.
3. Verificacion Biometrica: Analisis facial mediante inteligencia artificial para comparar al operador contra la base de datos autorizada.
4. Autorizacion: Acceso al panel de control y modulos operativos.

## Especificaciones Tecnicas

El proyecto utiliza una pila tecnologica moderna y robusta:

- Interfaz de Usuario: Next.js con Tailwind CSS y Framer Motion para animaciones de grado premium.
- Servidor de Aplicaciones: Python con FastAPI de alto rendimiento.
- Inteligencia Artificial: DeepFace y OpenCV para el reconocimiento facial.
- Base de Datos: MySQL con SQLModel para la gestion de datos.
- Seguridad: Implementacion de AuthGuard con validacion asincrona y ofuscacion de sesiones.

## Guia de Instalacion y Ejecucion Local

Para poner en marcha el sistema en un entorno de desarrollo, siga estos pasos:

### Requisitos

- Python 3.10 o superior.
- Node.js 18 o superior.
- MySQL corriendo localmente.

### Inicio del Backend

1. Entre a la carpeta del servidor:
   cd backend
2. Inicie el servidor de aplicaciones:
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
3. Verifique que el servidor indique que la aplicacion ha iniciado correctamente en el puerto 8000.

### Inicio del Frontend

1. Entre a la carpeta de la interfaz en una nueva terminal:
   cd validex_ui
2. Inicie el modo de desarrollo:
   npm run dev
3. Acceda desde su navegador a: http://localhost:3000

## Protocolo de Verificacion de Calidad

Para asegurar que el sistema funciona correctamente despues de una actualizacion, realice las siguientes pruebas manuales:

### Flujo de Registro y Autenticacion
- Realice un registro de cuenta nuevo para validar la persistencia en base de datos.
- Verifique la recepcion del SMS (en modo de desarrollo se utiliza el codigo 123456 por defecto).
- Realice la prueba de biometria facial asegurando que la iluminacion sea la correcta.
- Confirme que el sistema le permite ingresar al panel principal tras la validacion exitosa.

### Modulo de Operaciones
- Ingrese al modulo de pipas y verifique que los indicadores de descarga en curso muestren informacion en tiempo real.
- Confirme que al finalizar una operacion, el sistema muestre el resumen de validacion exitosa.

## Organizacion del Repositorio

- /backend: Logica de servidor, API y servicios de inteligencia artificial.
- /validex_ui: Codigo fuente de la interfaz de usuario en Next.js.
- /database: Scripts de migracion y esquemas SQL.
- /tools: Herramientas de diagnostico y mantenimiento.

Validex UP es propiedad intelectual protegida. Todos los derechos reservados 2026.
