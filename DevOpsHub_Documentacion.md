# DevOps Hub – Documentación Técnica

Este documento resume la estructura y funcionamiento técnico del proyecto DevOps Hub, una aplicación web ligera para la gestión del ciclo de vida de proyectos software por parte de pequeños equipos o desarrolladores individuales.

---

## 📦 Estructura General del Proyecto

```
devops-hub/
├── app.js                     # Servidor principal (Express)
├── src/
│   ├── routes/                # Rutas del backend (usuarios, login, proyectos, GitHub)
│   ├── db/                    # Inicialización y persistencia con SQLite
│   ├── middleware/            # Middlewares de autenticación y autorización
├── public/                   # Frontend HTML, CSS y JS
├── Utils/                    # Documentación y scripts de automatización
├── .env                      # Variables de entorno
├── package.json              # Dependencias y scripts
```

---

## 🌐 Frontend

- **Vistas**: `public/*.html` (login, registro, dashboard)
- **CSS**: `public/css/style.css`
- **JS**: Manejo de sesión, protección de rutas, interacción con API:
  - `auth.js`, `checkSession.js`, `register.js`, `dashboard.js`
- **Flujo**:
  1. Usuario accede a `login.html` o `register.html`.
  2. Si está autenticado, es redirigido automáticamente a `dashboard.html`.
  3. En el dashboard, se listan proyectos del usuario y repositorios GitHub.

---

## 🧠 Backend (Node.js + Express)

- **Archivo principal**: `app.js`
- **Puerto**: `3000`
- **Características**:
  - Servidor Express con rutas definidas modularmente.
  - Middleware de sesión con almacenamiento en SQLite.
  - LiveReload activo durante el desarrollo.
  - Rutas protegidas por autenticación.

---

## 🧩 Rutas y Controladores

### `/auth`
- `POST /auth/login`: Login de usuario con contraseña cifrada.
- `GET /auth/logout`: Cierre de sesión.
- `GET /auth/status`: Verifica si la sesión está activa.

### `/users`
- `POST /users`: Crear usuario (bcrypt).
- `GET /users`: Listar usuarios (requiere autenticación).
- `DELETE /users/:id`: Eliminar usuario propio (validado).

### `/projects`
- `POST /projects`: Crear proyecto.
- `GET /projects`: Listar proyectos del usuario autenticado.

### `/github/repos`
- `GET /github/repos`: Obtiene repos públicos del usuario GitHub actual.

---

## 🔒 Middlewares

- **`isAuthenticated`**: Verifica sesión activa.
- **`preventLoginifAuthenticated`**: Evita que usuarios logueados accedan al login.
- **`canDeleteUser`**: Solo permite que un usuario elimine su propia cuenta.

---

## 💾 Base de Datos

- **Sistema**: SQLite
- **Ubicación**: `src/db/database.sqlite`, `sessions.sqlite`
- **Inicialización**: `init.js`
- **Tablas**:
  - `users`: credenciales cifradas.
  - `projects`: proyectos por usuario.
  - `sessions`: manejadas automáticamente.

---

## ⚙️ Dependencias Clave

- `express`: servidor web
- `express-session`: gestión de sesiones
- `connect-sqlite3`: persistencia de sesiones
- `bcrypt`: hash de contraseñas
- `node-fetch`: integración con API GitHub

---

## 📌 Seguridad

- Control de acceso por sesión en el servidor.
- Cifrado de contraseñas con bcrypt.
- Redirección de vistas según estado de autenticación.

---

## 🚀 Despliegue

- **Modo desarrollo**:
  ```bash
  npm install
  node app.js
  ```
- **Requiere**: Node.js 18+, navegador moderno.

---

## 🧪 Estado Actual

- [x] CRUD básico de usuarios
- [x] Autenticación y sesiones
- [x] Gestión de proyectos
- [x] Consulta de repositorios GitHub
- [x] Middleware personalizado
- [x] Interfaz sencilla y funcional

---

## 📝 Autores y Contacto

Proyecto desarrollado por Abel Mahón para el módulo de Proyecto Integrado.

