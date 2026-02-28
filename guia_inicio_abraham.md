# Guia de Inicio Rápido - Validex UP (Rama: testAbraham)

Esta guía contiene los pasos exactos para configurar y ejecutar el proyecto desde cero en una nueva máquina.

---

## 🚀 1. Preparación del Entorno
Abraham, primero asegúrate de estar en la rama correcta:
```bash
git fetch origin
git checkout testAbraham
```

---

## 🗄️ 2. Base de Datos (MySQL)
El sistema ahora utiliza la base de datos `ValidexDB`.
1.  Abre **MySQL Workbench** o tu terminal de MySQL.
2.  Ejecuta el script de creación de tablas que se encuentra en:
    `[RAIZ]/database/schema.sql`
    *(Este script creará la base de datos `ValidexDB` y todas sus tablas con el nuevo diseño).*

---

## 🐍 3. Configuración del Backend (FastAPI)
Navega a la carpeta de backend:
```bash
cd backend
```

1.  **Crear Entorno Virtual**:
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```
2.  **Instalar Dependencias**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido:
    ```env
    PROJECT_NAME="Validex UP - Test Abraham"
    DATABASE_URL="mysql+pymysql://USUARIO:PASSWORD@localhost:3306/ValidexDB"
    SECRET_KEY="tu-llave-secreta-para-tests"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=1440
    MOCK_SMS=True
    ```
    *Nota: Cambia USUARIO y PASSWORD por tus credenciales de MySQL.*

4.  **Ejecutar Servidor**:
    ```bash
    python -m app.main
    ```
    *La API estará disponible en: http://localhost:8000/docs*

---

## ⚛️ 4. Configuración del Frontend (Next.js)
Navega a la carpeta del frontend profesional:
```bash
cd validex_ui
```

1.  **Instalar Node Modules**:
    ```bash
    npm install
    ```
2.  **Correr en Desarrollo**:
    ```bash
    npm run dev
    ```
    *La interfaz estará disponible en: http://localhost:3000*

---

## 🧪 5. Pruebas Rápidas con Swagger
Una vez que el backend esté corriendo, entra a [http://localhost:8000/docs](http://localhost:8000/docs):
1.  Prueba el endpoint `POST /api/v1/auth/register` con un JSON como este:
    ```json
    {
      "nombre_completo": "Abraham Orozco",
      "username": "abraham_test",
      "password": "mi_clave_secreta",
      "rol": "GERENTE"
    }
    ```
2.  Luego prueba el `POST /api/v1/auth/login` con el `username` y `password` para obtener tu token.

---

**Cualquier duda técnica con los modelos de SQLModel o Pydantic, favor de revisar la carpeta `backend/app/models/` donde ya están mapeadas las nuevas tablas de Abraham.**
