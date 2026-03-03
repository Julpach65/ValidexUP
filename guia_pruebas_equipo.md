# manual_validación_equipo.md - Guía de Pruebas Rápidas 

Esta guía es para que cualquier miembro del equipo pueda validar que el sistema funciona correctamente después de hacer `git pull origin develop`.

---

##  1. Preparación de la Máquina
Antes de nada, asegúrate de estar al día:
```bash
git checkout develop
git pull origin develop
```

### Backend:
1. Asegúrate de que tu `venv` esté activo.
2. Verifica tu `.env`. Debe tener `MOCK_SMS=True` para no gastar créditos.
3. Inicia el servidor: `python -m app.main`

### Frontend:
1. Entra a `validex_ui`.
2. Ejecuta: `npm run dev`

---

##  2. El "Test Dorado" (Flujo Completo)

Sigue estos pasos para comprobar que nada está roto:

### Paso A: Registro Base
1. Ve a `http://localhost:3000/crear-cuenta`.
2. Llena los datos y dale a "Completar Registro Base".
3. **Resultado esperado:** El sistema debe redirigirte automáticamente a `/registro-sms`.

### Paso B: Validación SMS (Modo Mock)
1. En la pantalla de SMS, verás que el sistema "envió" un código.
2. Ingresa el código: `123456`.
3. **Resultado esperado:**
   - Visualmente verás un check verde y serás enviado a `/registro-cara/validar`.
   - Técnicamente: Si revisas tu Base de Datos (`ValidexDB`), en la tabla `Sesiones`, el campo `paso_2_sms` ahora debe decir `1` (True).

### Paso C: Biometría y Navegación
1. En la pantalla de "Captura de Foto", dale a "Escanear y Autenticar".
2. Serás llevado a la pantalla de éxito (Fondo Negro/Obsidiana).
3. Dale a "Ingresar al Dashboard".
4. **Resultado esperado:** Acceso total al panel de control sin errores 404.

---

##  3. Módulo de Pipas (Nuevas Vistas)
Para probar las pantallas de operación:
- Ve directamente a `http://localhost:3000/pipas/descarga-en-curso` para ver el gauge de carga.
- Ve a `http://localhost:3000/pipas/descarga-finalizada` para ver el resumen de éxito.

---

**Nota Técnica:** El backend ya reconoce todos los campos de la base de datos de Abraham (`id_usuario`, `nombre_completo`, `username`). Si algo falla, revisa que tu MySQL tenga las tablas actualizadas con el `schema.sql`.
