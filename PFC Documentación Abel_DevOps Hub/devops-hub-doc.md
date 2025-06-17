# DevOps Hub

DevOps Hub es una aplicación web ligera y funcional que permite a pequeños equipos o desarrolladores individuales gestionar el ciclo de vida de sus proyectos de software.

## Características implementadas hasta ahora

- Registro de usuarios con roles (`user` o `admin`)
- Asignación automática del rol `admin` al primer usuario
- Inicio y cierre de sesión con sesiones persistentes
- Gestión de proyectos (crear, listar, ver, editar, eliminar)
- Gestión de tareas asociadas a proyectos
- Carga de repositorios públicos de GitHub por nombre de usuario
- Precarga del nombre de usuario de GitHub al volver a iniciar sesión
- Rutas protegidas según rol de usuario
- Eliminación del sistema de live reload
- Validaciones básicas de longitud en frontend
- Interfaz moderna con Bootstrap 5

## Estructura del proyecto

```
devops-hub/
├── public/                  # Archivos estáticos (HTML, CSS, JS)
│   ├── css/
│   ├── js/
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
├── src/
│   ├── db/
│   │   ├── database.js
│   │   └── init.js
│   ├── routes/
│   │   ├── auth/
│   │   │   └── login.js
│   │   ├── github/
│   │   │   └── repos.js
│   │   ├── project.js
│   │   ├── tasks.js
│   │   └── users.js
│   └── middleware/
│       ├── auth.js
│       └── users.js
├── app.js
└── package.json
```

## Instalación y ejecución

```bash
npm install
npm run dev
```

## Scripts

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

## Endpoints principales

### Usuarios
- `POST /users` – Crear usuario
- `GET /users` – Listar usuarios (admin)
- `DELETE /users/:id` – Eliminar usuario (admin o self)
- `PATCH /users/:id/role` – Cambiar rol (admin)
- `PUT /users/github` – Guardar nombre de usuario de GitHub

### Autenticación
- `POST /auth/login` – Iniciar sesión
- `GET /auth/logout` – Cerrar sesión
- `GET /auth/status` – Obtener estado de sesión

### Proyectos
- `GET /projects` – Listar proyectos del usuario
- `POST /projects` – Crear nuevo proyecto
- `GET /projects/:id` – Ver detalles
- `PUT /projects/:id` – Editar
- `DELETE /projects/:id` – Eliminar

### Repositorios GitHub
- `GET /github/repos` – Obtener repos públicos según nombre almacenado

### Tareas
- `GET /tasks/:projectId` – Ver tareas del proyecto
- `POST /tasks/:projectId` – Crear tarea
- `DELETE /tasks/:id` – Eliminar tarea

## Notas adicionales

- El primer usuario creado tras vaciar la base de datos recibe rol de `admin`.
- El campo de nombre GitHub se mantiene en base de datos y se precarga al iniciar sesión.
- Se eliminó el sistema de live reload porque causaba problemas con instancias múltiples.

---

Proyecto en desarrollo por Abel Mahón como parte del Proyecto Fin de Ciclo.
