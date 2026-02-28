# Rutas de Pruebas de Validex UP

A continuación se detallan todas las rutas disponibles en el servidor local para probar cada pantalla individualmente:

| Pantalla | URL Local | Descripción |
| :--- | :--- | :--- |
| **Login** | [http://localhost:3000/](http://localhost:3000/) | Acceso Táctico principal (Identidad). |
| **Crear Cuenta** | [http://localhost:3000/crear-cuenta](http://localhost:3000/crear-cuenta) | Enrolamiento inicial de nuevos usuarios. |
| **Registro SMS** | [http://localhost:3000/registro-sms](http://localhost:3000/registro-sms) | Proceso de vinculación de teléfono (OTP). |
| **Registro Cara** | [http://localhost:3000/registro-cara](http://localhost:3000/registro-cara) | Enrolamiento Biométrico Facial (Webcam). |
| **Dashboard** | [http://localhost:3000/dashboard](http://localhost:3000/dashboard) | Centro de Control Táctico (Navegación). |
| **Gestión Pipas** | [http://localhost:3000/pipas](http://localhost:3000/pipas) | Autorización de descargas y Gauge visual. |
| **Bitácora** | [http://localhost:3000/bitacora](http://localhost:3000/bitacora) | Registro inmutable de auditoría. |

> [!NOTE]
> Asegúrese de que el comando `npm run dev` esté ejecutándose en la carpeta `validex_ui`.
