# 🚀 Guía de Ejecución Local - VALIDEX UP

Esta guía te permitirá iniciar el sistema completo (Backend y Frontend) en tu computadora sin necesidad de pedir ayuda al asistente.

---

## 1. Requisitos Previos

Asegúrate de tener instalados:
- **Python 3.10+**
- **Node.js 18+**

---

## 2. Iniciar el Backend (API)

El backend maneja la lógica de negocio, base de datos y seguridad.

1. Abre una terminal (PowerShell o CMD).
2. Navega a la carpeta del backend:
   ```powershell
   cd c:\Users\julpa\OneDrive\Desktop\VALIDEX\backend
   ```
3. Activa el entorno virtual (opcional pero recomendado):
   ```powershell
   .\venv\Scripts\activate
   ```
4. Ejecuta el servidor:
   ```powershell
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   > **Nota:** Verás un mensaje que dice `INFO: Application startup complete.` El backend estará disponible en `http://localhost:8000`.

---

## 3. Iniciar el Frontend (Interfaz de Usuario)

La interfaz es donde verás las pantallas premium de Validex UP.

1. Abre **otra** terminal diferente.
2. Navega a la carpeta del frontend:
   ```powershell
   cd c:\Users\julpa\OneDrive\Desktop\VALIDEX\validex_ui
   ```
3. Inicia el modo de desarrollo:
   ```powershell
   npm run dev
   ```
   *O si prefieres usar npx:*
   ```powershell
   npx next dev
   ```
4. Abre tu navegador en: `http://localhost:3000`

---

## 🛠️ Solución de Problemas Comunes

- **Puerto 3000 o 8000 ocupado:** Asegúrate de cerrar cualquier otra aplicación que use esos puertos o cierra las terminales anteriores.
- **Error de "npm":** Si no reconoce el comando, verifica que instalaste Node.js correctamente.
- **Error de "python":** Si no reconoce python, intenta usar `python3` en el comando.

---

**¡Listo! Ya tienes el control total del entorno local.**
