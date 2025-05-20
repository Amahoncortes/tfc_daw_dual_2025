# DevOps Hub: Documentación del Proyecto

Este documento registra el desarrollo completo del proyecto DevOps Hub, incluyendo todas las fases, decisiones, implementaciones y aprendizajes a lo largo del proceso.

## Índice

1. [Fase de Inicio](#fase-de-inicio)

   - [Definición del Producto Mínimo Viable](#definición-del-producto-mínimo-viable)
   - [Análisis de Requisitos](#análisis-de-requisitos)
   - [Identificación de Riesgos](#identificación-de-riesgos)

2. [Fase de Elaboración](#fase-de-elaboración)

   - [Estructura de Carpetas del Proyecto](#estructura-de-carpetas-del-proyecto)
   - [Configuración de Express y Dependencias](#configuración-de-express-y-dependencias)
   - [Configuración Inicial de SQLite](#configuración-inicial-de-sqlite)
   - [Gestión de Usuarios](#gestión-de-usuarios)
   - [Mejora de Seguridad en la Autenticación](#mejora-de-seguridad-en-la-autenticación)
   - [Implementación de Sesiones](#implementación-de-sesiones)
   - [Validación de Datos](#validación-de-datos)

3. [Fase de Construcción](#fase-de-construcción)

   - [Implementación de Proyectos](#implementación-de-proyectos)
   - [Integración con GitHub](#integración-con-github)
   - [Desarrollo del Frontend Básico](#desarrollo-del-frontend-básico)
   - [Dashboard de Usuario](#dashboard-de-usuario)

4. [Fase de Transición](#fase-de-transición)
   - [Pendiente de implementar]

---

## Fase de Inicio

### Definición del Producto Mínimo Viable

**DevOps Hub** será una plataforma web que centralizará las herramientas necesarias para el ciclo de vida de desarrollo de software, con el siguiente alcance para el MVP:

**Funcionalidades incluidas en el MVP:**

- Sistema de autenticación básico (registro/login)
- Dashboard para visualizar proyectos
- Creación de proyectos nuevos
- Integración básica con GitHub (visualización de repositorios)
- Medidas de seguridad básicas (validación de formularios y consultas parametrizadas)

**Funcionalidades excluidas del MVP:**

- Implementación completa de CI/CD
- Orquestación de contenedores
- Gestión avanzada de repositorios
- Funcionalidades colaborativas entre usuarios
- Integración con otras plataformas aparte de GitHub

### Análisis de Requisitos

**HU1: Autenticación**

- Criterios de aceptación:
  - El usuario puede registrarse proporcionando email y contraseña
  - El usuario puede iniciar sesión con sus credenciales
  - Se validan los datos de entrada (email válido, contraseña segura)
  - Se muestran mensajes de error apropiados si hay problemas
- Implementación técnica: Autenticación básica con sesiones en el backend; formulario de login en el frontend

**HU2: Crear proyectos**

- Criterios de aceptación:
  - El usuario puede crear un nuevo proyecto desde el dashboard
  - Se solicitan datos básicos: nombre, descripción
  - El proyecto se guarda en la base de datos y aparece en el listado
- Implementación técnica: Modelo de datos para proyectos y API REST para altas

**HU3: Visualizar proyectos**

- Criterios de aceptación:
  - El dashboard muestra todos los proyectos del usuario
  - Se muestra información básica: nombre, descripción, fecha de creación
  - El listado está ordenado de forma lógica (por fecha o nombre)
- Implementación técnica: Consulta de la base de datos y renderizado en el frontend

**HU4: Conectar con GitHub**

- Criterios de aceptación:
  - El usuario puede vincular su cuenta de GitHub
  - Se muestran los repositorios disponibles para el usuario
  - Solo funcionalidad de lectura (no modificación de repos)
- Implementación técnica: Uso de la API de GitHub para autenticación básica y listado de repos (solo lectura)

**HU5: Seguridad**

- Criterios de aceptación:
  - Se validan todos los formularios en frontend y backend
  - Se usan consultas parametrizadas para prevenir SQL injection
  - Las contraseñas se almacenan cifradas
  - Se verifica que cada usuario solo acceda a sus propios proyectos
- Implementación técnica: Validación en frontend y backend, consultas SQL parametrizadas

### Identificación de Riesgos

**Matriz de Riesgos:**

| Riesgo                                          | Impacto | Probabilidad | Estrategia de Mitigación                                                                                       |
| ----------------------------------------------- | ------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| Dificultad con las nuevas tecnologías           | Alto    | Alta         | Comenzar con tutoriales básicos, mantener la solución simple, y buscar ejemplos prácticos para cada componente |
| Problemas de integración con GitHub API         | Medio   | Media        | Comenzar con integración básica, usar bibliotecas probadas para la autenticación OAuth                         |
| Problemas de seguridad en la aplicación         | Alto    | Media        | Seguir prácticas estándar de seguridad, emplear validaciones robustas                                          |
| Atrasos en el cronograma                        | Alto    | Alta         | Priorizar funcionalidades core, simplificar donde sea posible, y mantener un MVP mínimo pero completo          |
| Problemas con la estructura de la base de datos | Medio   | Media        | Diseñar un esquema simple y flexible, haciendo un prototipo temprano                                           |

---

## Fase de Elaboración

### Estructura de Carpetas del Proyecto

La estructura del proyecto se generó utilizando un script de PowerShell:

```powershell
# Crear carpeta raíz
New-Item -ItemType Directory -Path "devops-hub" | Out-Null

# Cambiar al directorio raíz del proyecto
Set-Location "devops-hub"

# Crear subcarpetas
$folders = @(
    "node_modules",
    "public/css",
    "public/js",
    "public/img",
    "src/config",
    "src/controllers",
    "src/models",
    "src/routes",
    "src/middleware",
    "src/utils",
    "src/db",
    "views"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

# Crear archivos vacíos
$files = @(
    ".env",
    ".gitignore",
    "app.js",
    "package.json",
    "README.md"
)

foreach ($file in $files) {
    New-Item -ItemType File -Path $file -Force | Out-Null
}

# Mensaje final
Write-Host "✔ Proyecto devops-hub creado correctamente en $(Get-Location)" -ForegroundColor Green
```

Estructura final:

```
devops-hub/
├── node_modules/
├── public/
│   ├── css/
│   ├── js/
│   └── img/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── db/
│       ├── database.js
│       └── init.js
├── views/
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

### Configuración de Express y Dependencias

1. Inicialización del proyecto:

   ```bash
   npm init -y
   ```

   Para ejecutar el proyecto

   ```bash
   npm run dev
   ```

2. Instalación de dependencias:

   ```bash
   npm install express
   npm install --save-dev nodemon
   ```

3. Configuración del script de desarrollo en `package.json`:

   ```json
   "scripts": {
     "dev": "nodemon src/app.js"
   }
   ```

4. Servidor básico Express en `app.js`:

   ```js
   const express = require("express");
   const app = express();
   const port = 3000;

   app.use(express.json());

   app.get("/", (req, res) => {
     res.send("GET recibido");
   });

   app.post("/", (req, res) => {
     res.send("POST recibido");
   });

   app.listen(port, () => {
     console.log(`Servidor escuchando en http://localhost:${port}`);
   });
   ```

### Configuración Inicial de SQLite

1. Instalación de SQLite:

   ```bash
   npm install sqlite3
   ```

2. Archivo de conexión a base de datos (`src/db/database.js`):

   ```js
   const sqlite3 = require("sqlite3").verbose();
   const path = require("path");

   const dbPath = path.resolve(__dirname, "database.sqlite");
   const db = new sqlite3.Database(dbPath, (err) => {
     if (err) {
       console.error("Error al conectar con la base de datos:", err);
     } else {
       console.log("Conectado a la base de datos SQLite");
     }
   });

   module.exports = db;
   ```

3. Script de inicialización con creación de tabla (`src/db/init.js`):

   ```js
   const db = require("./database");

   db.serialize(() => {
     db.run(`
       CREATE TABLE IF NOT EXISTS users (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         username TEXT NOT NULL UNIQUE,
         password TEXT NOT NULL
       )
     `);
   });
   ```

4. Importación del script de inicialización en `app.js`:
   ```js
   require("./db/init");
   ```

### Gestión de Usuarios

1. Endpoints REST para usuarios (`src/routes/users.js`):

   ```js
   const express = require("express");
   const router = express.Router();
   const db = require("../db/database");

   // POST /users - Crear nuevo usuario
   router.post("/", (req, res) => {
     const { username, password } = req.body;

     if (!username || !password) {
       return res.status(400).json({ error: "Faltan username o password" });
     }

     const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
     db.run(query, [username, password], function (err) {
       if (err) {
         return res
           .status(500)
           .json({ error: "Error al insertar usuario", details: err.message });
       }
       res.status(201).json({ message: "Usuario creado", userId: this.lastID });
     });
   });

   // GET /users - Obtener lista de usuarios
   router.get("/", (req, res) => {
     const query = `SELECT id, username FROM users`;
     db.all(query, [], (err, rows) => {
       if (err) {
         return res
           .status(500)
           .json({ error: "Error al obtener usuarios", details: err.message });
       }
       res.json(rows);
     });
   });

   module.exports = router;
   ```

2. Configuración de rutas en `app.js`:

   ```js
   const express = require("express");
   const app = express();
   const usersRoute = require("./routes/users");

   // Middleware para procesar datos JSON
   app.use(express.json());

   // Middleware para procesar datos de formularios
   app.use(express.urlencoded({ extended: true }));

   // Middleware para las rutas de usuarios
   app.use("/users", usersRoute);
   ```

3. Endpoints probados en Postman:
   - POST /users - Crear nuevo usuario
   - GET /users - Obtener lista de usuarios

### Mejora de Seguridad en la Autenticación

1. Instalación de bcrypt para el cifrado de contraseñas:

   ```bash
   npm install bcrypt
   ```

2. Actualización del endpoint de registro para cifrar contraseñas (`src/routes/users.js`):

   ```js
   const express = require("express");
   const router = express.Router();
   const bcrypt = require("bcrypt");
   const db = require("../db/database");

   // POST /users - Crear nuevo usuario con contraseña cifrada
   router.post("/", async (req, res) => {
     const { username, password } = req.body;

     if (!username || !password) {
       return res.status(400).json({ error: "Faltan username o password" });
     }

     try {
       // Generar salt y hash de la contraseña
       const saltRounds = 10;
       const hashedPassword = await bcrypt.hash(password, saltRounds);

       const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
       db.run(query, [username, hashedPassword], function (err) {
         if (err) {
           return res.status(500).json({
             error: "Error al insertar usuario",
             details: err.message,
           });
         }
         res
           .status(201)
           .json({ message: "Usuario creado", userId: this.lastID });
       });
     } catch (error) {
       console.error("Error al cifrar contraseña:", error);
       res.status(500).json({ error: "Error interno del servidor" });
     }
   });

   // GET /users - Obtener lista de usuarios
   router.get("/", (req, res) => {
     const query = `SELECT id, username FROM users`;
     db.all(query, [], (err, rows) => {
       if (err) {
         return res
           .status(500)
           .json({ error: "Error al obtener usuarios", details: err.message });
       }
       res.json(rows);
     });
   });

   module.exports = router;
   ```

3. Implementación del endpoint de login (`src/routes/auth.js`):

   ```js
   const express = require("express");
   const router = express.Router();
   const bcrypt = require("bcrypt");
   const db = require("../db/database");

   // POST /auth/login - Iniciar sesión
   router.post("/login", (req, res) => {
     const { username, password } = req.body;

     if (!username || !password) {
       return res.status(400).json({ error: "Faltan username o password" });
     }

     // Buscar usuario en la base de datos
     const query = `SELECT id, username, password FROM users WHERE username = ?`;
     db.get(query, [username], async (err, user) => {
       if (err) {
         return res
           .status(500)
           .json({ error: "Error al buscar usuario", details: err.message });
       }

       if (!user) {
         return res.status(401).json({ error: "Credenciales incorrectas" });
       }

       // Verificar contraseña
       try {
         const match = await bcrypt.compare(password, user.password);
         if (match) {
           // Credenciales correctas - aquí posteriormente implementaremos sesiones
           res.json({
             message: "Login exitoso",
             userId: user.id,
             username: user.username,
           });
         } else {
           res.status(401).json({ error: "Credenciales incorrectas" });
         }
       } catch (error) {
         console.error("Error al verificar contraseña:", error);
         res.status(500).json({ error: "Error interno del servidor" });
       }
     });
   });

   module.exports = router;
   ```

4. Agregar ruta de autenticación en `app.js`:
   ```js
   const authRoute = require("./routes/auth");
   // ...
   app.use("/auth", authRoute);
   ```

### Implementación de Sesiones

1. Instalación de express-session y connect-sqlite3:

   ```bash
   npm install express-session connect-sqlite3
   ```

2. Configuración de sesiones en `app.js`:

   ```js
   const session = require("express-session");
   const SQLiteStore = require("connect-sqlite3")(session);
   const path = require("path");

   // Configuración de sesiones
   app.use(
     session({
       store: new SQLiteStore({
         db: "sessions.sqlite",
         dir: path.join(__dirname, "db"),
       }),
       secret: "devops_hub_secret_key", // En producción, usar variables de entorno
       resave: false,
       saveUninitialized: false,
       cookie: {
         secure: false, // Cambiar a true si se usa HTTPS
         maxAge: 24 * 60 * 60 * 1000, // 24 horas
       },
     })
   );
   ```

3. Actualización del endpoint de login para utilizar sesiones (`src/routes/auth.js`):

   ```js
   // POST /auth/login - Iniciar sesión
   router.post("/login", (req, res) => {
     const { username, password } = req.body;

     if (!username || !password) {
       return res.status(400).json({ error: "Faltan username o password" });
     }

     // Buscar usuario en la base de datos
     const query = `SELECT id, username, password FROM users WHERE username = ?`;
     db.get(query, [username], async (err, user) => {
       if (err) {
         return res
           .status(500)
           .json({ error: "Error al buscar usuario", details: err.message });
       }

       if (!user) {
         return res.status(401).json({ error: "Credenciales incorrectas" });
       }

       // Verificar contraseña
       try {
         const match = await bcrypt.compare(password, user.password);
         if (match) {
           // Guardar información de usuario en la sesión
           req.session.userId = user.id;
           req.session.username = user.username;
           req.session.isAuthenticated = true;

           res.json({
             message: "Login exitoso",
             userId: user.id,
             username: user.username,
           });
         } else {
           res.status(401).json({ error: "Credenciales incorrectas" });
         }
       } catch (error) {
         console.error("Error al verificar contraseña:", error);
         res.status(500).json({ error: "Error interno del servidor" });
       }
     });
   });

   // GET /auth/logout - Cerrar sesión
   router.get("/logout", (req, res) => {
     req.session.destroy((err) => {
       if (err) {
         return res.status(500).json({ error: "Error al cerrar sesión" });
       }
       res.json({ message: "Sesión cerrada correctamente" });
     });
   });

   // GET /auth/status - Verificar estado de autenticación
   router.get("/status", (req, res) => {
     if (req.session.isAuthenticated) {
       res.json({
         isAuthenticated: true,
         userId: req.session.userId,
         username: req.session.username,
       });
     } else {
       res.json({ isAuthenticated: false });
     }
   });
   ```

4. Creación de middleware de autenticación (`src/middleware/auth.js`):

   ```js
   function isAuthenticated(req, res, next) {
     if (req.session.isAuthenticated) {
       next();
     } else {
       res.status(401).json({ error: "No autorizado" });
     }
   }

   module.exports = { isAuthenticated };
   ```

### Validación de Datos

1. Instalación de express-validator:

   ```bash
   npm install express-validator
   ```

2. Implementación de validaciones para registro de usuarios (`src/routes/users.js`):

   ```js
   const { body, validationResult } = require("express-validator");

   // Validaciones para el registro de usuarios
   const registerValidations = [
     body("username")
       .notEmpty()
       .withMessage("El username es obligatorio")
       .isLength({ min: 4 })
       .withMessage("El username debe tener al menos 4 caracteres")
       .matches(/^[a-zA-Z0-9_]+$/)
       .withMessage(
         "El username solo puede contener letras, números y guiones bajos"
       ),

     body("password")
       .notEmpty()
       .withMessage("La contraseña es obligatoria")
       .isLength({ min: 6 })
       .withMessage("La contraseña debe tener al menos 6 caracteres")
       .matches(/\d/)
       .withMessage("La contraseña debe contener al menos un número")
       .matches(/[A-Z]/)
       .withMessage("La contraseña debe contener al menos una letra mayúscula"),
   ];

   // POST /users - Crear nuevo usuario con validaciones
   router.post("/", registerValidations, async (req, res) => {
     // Verificar si hay errores de validación
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const { username, password } = req.body;

     try {
       // Generar salt y hash de la contraseña
       const saltRounds = 10;
       const hashedPassword = await bcrypt.hash(password, saltRounds);

       const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
       db.run(query, [username, hashedPassword], function (err) {
         if (err) {
           // Verificar si es un error de duplicado
           if (err.message.includes("UNIQUE constraint failed")) {
             return res
               .status(400)
               .json({ error: "El username ya está en uso" });
           }
           return res.status(500).json({
             error: "Error al insertar usuario",
             details: err.message,
           });
         }
         res
           .status(201)
           .json({ message: "Usuario creado", userId: this.lastID });
       });
     } catch (error) {
       console.error("Error al cifrar contraseña:", error);
       res.status(500).json({ error: "Error interno del servidor" });
     }
   });
   ```

3. Implementación de validaciones para login (`src/routes/auth.js`):

   ```js
   const { body, validationResult } = require("express-validator");

   // Validaciones para el login
   const loginValidations = [
     body("username").notEmpty().withMessage("El username es obligatorio"),

     body("password").notEmpty().withMessage("La contraseña es obligatoria"),
   ];

   // POST /auth/login - Iniciar sesión con validaciones
   router.post("/login", loginValidations, (req, res) => {
     // Verificar si hay errores de validación
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     // Resto del código de login...
   });
   ```

---

## Fase de Construcción

### Implementación de Proyectos

1. Actualización del script de inicialización para crear la tabla de proyectos (`src/db/init.js`):

   ```js
   const db = require("./database");

   db.serialize(() => {
     // Tabla de usuarios
     db.run(`
       CREATE TABLE IF NOT EXISTS users (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         username TEXT NOT NULL UNIQUE,
         password TEXT NOT NULL
       )
     `);

     // Tabla de proyectos
     db.run(`
       CREATE TABLE IF NOT EXISTS projects (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         description TEXT,
         user_id INTEGER NOT NULL,
         created_at TEXT DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY (user_id) REFERENCES users (id)
       )
     `);
   });
   ```

2. Creación de rutas para proyectos (`src/routes/projects.js`):

   ```js
   const express = require("express");
   const router = express.Router();
   const { body, validationResult } = require("express-validator");
   const db = require("../db/database");
   const { isAuthenticated } = require("../middleware/auth");

   // Validaciones para la creación de proyectos
   const projectValidations = [
     body("name")
       .notEmpty()
       .withMessage("El nombre del proyecto es obligatorio")
       .isLength({ min: 3, max: 100 })
       .withMessage("El nombre debe tener entre 3 y 100 caracteres"),

     body("description")
       .optional()
       .isLength({ max: 500 })
       .withMessage("La descripción no debe exceder los 500 caracteres"),
   ];

   // POST /projects - Crear nuevo proyecto
   router.post("/", isAuthenticated, projectValidations, (req, res) => {
     // Verificar si hay errores de validación
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const { name, description = "" } = req.body;
     const userId = req.session.userId;

     const query = `INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)`;
     db.run(query, [name, description, userId], function (err) {
       if (err) {
         return res
           .status(500)
           .json({ error: "Error al crear proyecto", details: err.message });
       }
       res.status(201).json({
         message: "Proyecto creado",
         projectId: this.lastID,
         name,
         description,
       });
     });
   });

   // GET /projects - Obtener proyectos del usuario actual
   router.get("/", isAuthenticated, (req, res) => {
     const userId = req.session.userId;

     const query = `
       SELECT id, name, description, created_at 
       FROM projects 
       WHERE user_id = ?
       ORDER BY created_at DESC
     `;

     db.all(query, [userId], (err, projects) => {
       if (err) {
         return res
           .status(500)
           .json({ error: "Error al obtener proyectos", details: err.message });
       }
       res.json(projects);
     });
   });

   // GET /projects/:id - Obtener un proyecto específico
   router.get("/:id", isAuthenticated, (req, res) => {
     const projectId = req.params.id;
     const userId = req.session.userId;

     const query = `
       SELECT id, name, description, created_at 
       FROM projects 
       WHERE id = ? AND user_id = ?
     `;

     db.get(query, [projectId, userId], (err, project) => {
       if (err) {
         return res
           .status(500)
           .json({ error: "Error al obtener proyecto", details: err.message });
       }

       if (!project) {
         return res.status(404).json({ error: "Proyecto no encontrado" });
       }

       res.json(project);
     });
   });

   // PUT /projects/:id - Actualizar un proyecto
   router.put("/:id", isAuthenticated, projectValidations, (req, res) => {
     // Verificar si hay errores de validación
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const projectId = req.params.id;
     const userId = req.session.userId;
     const { name, description = "" } = req.body;

     // Primero verificamos que el proyecto exista y pertenezca al usuario
     const checkQuery = `SELECT id FROM projects WHERE id = ? AND user_id = ?`;
     db.get(checkQuery, [projectId, userId], (err, project) => {
       if (err) {
         return res.status(500).json({
           error: "Error al verificar proyecto",
           details: err.message,
         });
       }

       if (!project) {
         return res.status(404).json({ error: "Proyecto no encontrado" });
       }

       // Actualizar el proyecto
       const updateQuery = `UPDATE projects SET name = ?, description = ? WHERE id = ?`;
       db.run(updateQuery, [name, description, projectId], function (err) {
         if (err) {
           return res.status(500).json({
             error: "Error al actualizar proyecto",
             details: err.message,
           });
         }

         res.json({
           message: "Proyecto actualizado",
           projectId,
           name,
           description,
         });
       });
     });
   });

   // DELETE /projects/:id - Eliminar un proyecto
   router.delete("/:id", isAuthenticated, (req, res) => {
     const projectId = req.params.id;
     const userId = req.session.userId;

     // Primero verificamos que el proyecto exista y pertenezca al usuario
     const checkQuery = `SELECT id FROM projects WHERE id = ? AND user_id = ?`;
     db.get(checkQuery, [projectId, userId], (err, project) => {
       if (err) {
         return res.status(500).json({
           error: "Error al verificar proyecto",
           details: err.message,
         });
       }

       if (!project) {
         return res.status(404).json({ error: "Proyecto no encontrado" });
       }

       // Eliminar el proyecto
       const deleteQuery = `DELETE FROM projects WHERE id = ?`;
       db.run(deleteQuery, [projectId], function (err) {
         if (err) {
           return res.status(500).json({
             error: "Error al eliminar proyecto",
             details: err.message,
           });
         }

         res.json({ message: "Proyecto eliminado" });
       });
     });
   });

   module.exports = router;
   ```

3. Agregar rutas de proyectos en `app.js`:
   ```js
   const projectsRoute = require("./routes/projects");
   // ...
   app.use("/projects", projectsRoute);
   ```

### Integración con GitHub

1. Instalación de axios para hacer peticiones a la API de GitHub:

   ```bash
   npm install axios
   ```

2. Creación de rutas para la integración con GitHub (`src/routes/github.js`):

   ```js
   const express = require("express");
   const router = express.Router();
   const axios = require("axios");
   const { isAuthenticated } = require("../middleware/auth");

   // GET /github/repos - Obtener repositorios del usuario
   router.get("/repos", isAuthenticated, async (req, res) => {
     const { token } = req.query;

     if (!token) {
       return res.status(400).json({ error: "Token de GitHub requerido" });
     }

     try {
       const response = await axios.get("https://api.github.com/user/repos", {
         headers: {
           Authorization: `token ${token}`,
           Accept: "application/vnd.github.v3+json",
         },
       });

       // Transformar los datos para incluir solo la información necesaria
       const repos = response.data.map((repo) => ({
         id: repo.id,
         name: repo.name,
         full_name: repo.full_name,
         description: repo.description,
         html_url: repo.html_url,
         created_at: repo.created_at,
         updated_at: repo.updated_at,
         language: repo.language,
         default_branch: repo.default_branch,
       }));

       res.json(repos);
     } catch (error) {
       console.error(
         "Error al consultar la API de GitHub:",
         error.response?.data || error.message
       );

       if (error.response?.status === 401) {
         return res
           .status(401)
           .json({ error: "Token de GitHub inválido o expirado" });
       }

       res
         .status(500)
         .json({ error: "Error al consultar repositorios de GitHub" });
     }
   });

   // GET /github/repo/:owner/:repo - Obtener información de un repositorio específico
   router.get("/repo/:owner/:repo", isAuthenticated, async (req, res) => {
     const { token } = req.query;
     const { owner, repo } = req.params;

     if (!token) {
       return res.status(400).json({ error: "Token de GitHub requerido" });
     }

     try {
       const response = await axios.get(
         `https://api.github.com/repos/${owner}/${repo}`,
         {
           headers: {
             Authorization: `token ${token}`,
             Accept: "application/vnd.github.v3+json",
           },
         }
       );

       res.json(response.data);
     } catch (error) {
       console.error(
         "Error al consultar repositorio en GitHub:",
         error.response?.data || error.message
       );

       if (error.response?.status === 401) {
         return res
           .status(401)
           .json({ error: "Token de GitHub inválido o expirado" });
       }

       if (error.response?.status === 404) {
         return res.status(404).json({ error: "Repositorio no encontrado" });
       }

       res
         .status(500)
         .json({ error: "Error al consultar repositorio en GitHub" });
     }
   });

   module.exports = router;
   ```

3. Agregar rutas de GitHub en `app.js`:
   ```js
   const githubRoute = require("./routes/github");
   // ...
   app.use("/github", githubRoute);
   ```

### Desarrollo del Frontend Básico

1. Configuración de EJS como motor de plantillas:

   ```bash
   npm install ejs
   ```

2. Configuración de EJS en `app.js`:

   ```js
   // Configuración del motor de plantillas EJS
   app.set("view engine", "ejs");
   app.set("views", path.join(__dirname, "../views"));

   // Servir archivos estáticos
   app.use(express.static(path.join(__dirname, "../public")));
   ```

3. Creación de la estructura básica de las vistas:

   - Vista principal (`views/index.ejs`):

   ```html
   <!DOCTYPE html>
   <html lang="es">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>DevOps Hub</title>
       <link rel="stylesheet" href="/css/styles.css" />
     </head>
     <body>
       <header>
         <div class="logo">
           <h1>DevOps Hub</h1>
         </div>
         <nav>
           <ul>
             <% if (isAuthenticated) { %>
             <li><a href="/dashboard">Dashboard</a></li>
             <li><a href="#" id="logout-btn">Cerrar sesión</a></li>
             <% } else { %>
             <li><a href="/login">Iniciar sesión</a></li>
             <li><a href="/register">Registrarse</a></li>
             <% } %>
           </ul>
         </nav>
       </header>

       <main>
         <section class="hero">
           <h2>Centraliza tus herramientas DevOps</h2>
           <p>
             Una plataforma simple para gestionar tus proyectos de desarrollo
           </p>
           <% if (!isAuthenticated) { %>
           <div class="cta-buttons">
             <a href="/register" class="btn primary">Comenzar ahora</a>
             <a href="/login" class="btn secondary">Iniciar sesión</a>
           </div>
           <% } else { %>
           <div class="cta-buttons">
             <a href="/dashboard" class="btn primary">Ir al Dashboard</a>
           </div>
           <% } %>
         </section>
       </main>

       <footer>
         <p>&copy; 2025 DevOps Hub - Todos los derechos reservados</p>
       </footer>

       <script src="/js/main.js"></script>
     </body>
   </html>
   ```

   - Vista de login (`views/login.ejs`):

   ```html
   <!DOCTYPE html>
   <html lang="es">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Login | DevOps Hub</title>
       <link rel="stylesheet" href="/css/styles.css" />
     </head>
     <body>
       <header>
         <div class="logo">
           <h1><a href="/">DevOps Hub</a></h1>
         </div>
       </header>

       <main>
         <section class="auth-container">
           <h2>Iniciar sesión</h2>

           <div id="error-message" class="error-message hidden"></div>

           <form id="login-form">
             <div class="form-group">
               <label for="username">Usuario</label>
               <input type="text" id="username" name="username" required />
             </div>

             <div class="form-group">
               <label for="password">Contraseña</label>
               <input type="password" id="password" name="password" required />
             </div>

             <button type="submit" class="btn primary">Iniciar sesión</button>
           </form>

           <p class="auth-link">
             ¿No tienes cuenta? <a href="/register">Regístrate</a>
           </p>
         </section>
       </main>

       <footer>
         <p>&copy; 2025 DevOps Hub - Todos los derechos reservados</p>
       </footer>

       <script src="/js/login.js"></script>
     </body>
   </html>
   ```

   - Vista de registro (`views/register.ejs`):

   ```html
   <!DOCTYPE html>
   <html lang="es">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Registro | DevOps Hub</title>
       <link rel="stylesheet" href="/css/styles.css" />
     </head>
     <body>
       <header>
         <div class="logo">
           <h1><a href="/">DevOps Hub</a></h1>
         </div>
       </header>

       <main>
         <section class="auth-container">
           <h2>Crear cuenta</h2>

           <div id="error-message" class="error-message hidden"></div>

           <form id="register-form">
             <div class="form-group">
               <label for="username">Usuario</label>
               <input type="text" id="username" name="username" required />
               <small
                 >Mínimo 4 caracteres, solo letras, números y guiones
                 bajos</small
               >
             </div>

             <div class="form-group">
               <label for="password">Contraseña</label>
               <input type="password" id="password" name="password" required />
               <small
                 >Mínimo 6 caracteres, debe incluir una mayúscula y un
                 número</small
               >
             </div>

             <div class="form-group">
               <label for="confirm-password">Confirmar contraseña</label>
               <input
                 type="password"
                 id="confirm-password"
                 name="confirm-password"
                 required
               />
             </div>

             <button type="submit" class="btn primary">Registrarse</button>
           </form>

           <p class="auth-link">
             ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
           </p>
         </section>
       </main>

       <footer>
         <p>&copy; 2025 DevOps Hub - Todos los derechos reservados</p>
       </footer>

       <script src="/js/register.js"></script>
     </body>
   </html>
   ```

4. Creación de estilos básicos (`public/css/styles.css`):

   ```css
   /* Reset básico */
   * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
   }

   body {
     font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
     line-height: 1.6;
     color: #333;
     background-color: #f5f7fa;
   }

   a {
     text-decoration: none;
     color: #2563eb;
   }

   ul {
     list-style: none;
   }

   /* Header */
   header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     padding: 1rem 2rem;
     background-color: #fff;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }

   header .logo h1 {
     font-size: 1.5rem;
     color: #1e40af;
   }

   header .logo h1 a {
     color: #1e40af;
   }

   header nav ul {
     display: flex;
     gap: 1.5rem;
   }

   header nav ul li a {
     color: #4b5563;
     font-weight: 500;
     transition: color 0.2s ease;
   }

   header nav ul li a:hover {
     color: #1e40af;
   }

   /* Main */
   main {
     min-height: calc(100vh - 140px);
     padding: 2rem;
   }

   /* Sección Hero */
   .hero {
     text-align: center;
     padding: 4rem 1rem;
     max-width: 800px;
     margin: 0 auto;
   }

   .hero h2 {
     font-size: 2.5rem;
     color: #1e3a8a;
     margin-bottom: 1rem;
   }

   .hero p {
     font-size: 1.2rem;
     color: #6b7280;
     margin-bottom: 2rem;
   }

   /* Botones CTA */
   .cta-buttons {
     display: flex;
     justify-content: center;
     gap: 1rem;
     margin-top: 2rem;
   }

   .btn {
     display: inline-block;
     padding: 0.75rem 1.5rem;
     border-radius: 0.375rem;
     font-weight: 500;
     text-align: center;
     cursor: pointer;
     transition: all 0.2s ease;
   }

   .btn.primary {
     background-color: #2563eb;
     color: white;
   }

   .btn.primary:hover {
     background-color: #1d4ed8;
   }

   .btn.secondary {
     background-color: #e5e7eb;
     color: #4b5563;
   }

   .btn.secondary:hover {
     background-color: #d1d5db;
   }

   /* Formularios de autenticación */
   .auth-container {
     max-width: 400px;
     margin: 2rem auto;
     padding: 2rem;
     background-color: white;
     border-radius: 0.5rem;
     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   }

   .auth-container h2 {
     text-align: center;
     margin-bottom: 1.5rem;
     color: #1e40af;
   }

   .form-group {
     margin-bottom: 1.25rem;
   }

   .form-group label {
     display: block;
     margin-bottom: 0.5rem;
     font-weight: 500;
   }

   .form-group input {
     width: 100%;
     padding: 0.75rem;
     border: 1px solid #d1d5db;
     border-radius: 0.375rem;
     font-size: 1rem;
   }

   .form-group small {
     display: block;
     margin-top: 0.25rem;
     color: #6b7280;
     font-size: 0.875rem;
   }

   .auth-container button {
     width: 100%;
     margin-top: 0.5rem;
   }

   .auth-link {
     text-align: center;
     margin-top: 1.5rem;
     font-size: 0.875rem;
   }

   .error-message {
     background-color: #fee2e2;
     color: #b91c1c;
     padding: 0.75rem;
     border-radius: 0.375rem;
     margin-bottom: 1rem;
   }

   .hidden {
     display: none;
   }

   /* Footer */
   footer {
     text-align: center;
     padding: 1.5rem;
     background-color: #f9fafb;
     border-top: 1px solid #e5e7eb;
     color: #6b7280;
   }
   ```

5. Scripts para el frontend:

   - Script principal (`public/js/main.js`):

   ```js
   document.addEventListener("DOMContentLoaded", function () {
     // Manejo del botón de logout
     const logoutBtn = document.getElementById("logout-btn");

     if (logoutBtn) {
       logoutBtn.addEventListener("click", async function (e) {
         e.preventDefault();

         try {
           const response = await fetch("/auth/logout");
           const data = await response.json();

           if (response.ok) {
             window.location.href = "/";
           } else {
             console.error("Error al cerrar sesión:", data.error);
           }
         } catch (error) {
           console.error("Error al procesar la solicitud:", error);
         }
       });
     }
   });
   ```

   - Script para login (`public/js/login.js`):

   ```js
   document.addEventListener("DOMContentLoaded", function () {
     const loginForm = document.getElementById("login-form");
     const errorMessage = document.getElementById("error-message");

     loginForm.addEventListener("submit", async function (e) {
       e.preventDefault();

       const username = document.getElementById("username").value;
       const password = document.getElementById("password").value;

       try {
         const response = await fetch("/auth/login", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify({ username, password }),
         });

         const data = await response.json();

         if (response.ok) {
           // Redireccionar al dashboard en caso de éxito
           window.location.href = "/dashboard";
         } else {
           // Mostrar mensaje de error
           errorMessage.textContent = data.error || "Error al iniciar sesión";
           errorMessage.classList.remove("hidden");
         }
       } catch (error) {
         console.error("Error al procesar la solicitud:", error);
         errorMessage.textContent = "Error al conectar con el servidor";
         errorMessage.classList.remove("hidden");
       }
     });
   });
   ```

   - Script para registro (`public/js/register.js`):

   ```js
   document.addEventListener("DOMContentLoaded", function () {
     const registerForm = document.getElementById("register-form");
     const errorMessage = document.getElementById("error-message");

     registerForm.addEventListener("submit", async function (e) {
       e.preventDefault();

       const username = document.getElementById("username").value;
       const password = document.getElementById("password").value;
       const confirmPassword =
         document.getElementById("confirm-password").value;

       // Validación básica del lado del cliente
       if (password !== confirmPassword) {
         errorMessage.textContent = "Las contraseñas no coinciden";
         errorMessage.classList.remove("hidden");
         return;
       }

       try {
         const response = await fetch("/users", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify({ username, password }),
         });

         const data = await response.json();

         if (response.ok) {
           // Redireccionar a la página de login en caso de éxito
           window.location.href = "/login?registered=true";
         } else {
           // Mostrar mensaje de error
           if (data.errors && data.errors.length > 0) {
             errorMessage.textContent = data.errors[0].msg;
           } else {
             errorMessage.textContent =
               data.error || "Error al registrar usuario";
           }
           errorMessage.classList.remove("hidden");
         }
       } catch (error) {
         console.error("Error al procesar la solicitud:", error);
         errorMessage.textContent = "Error al conectar con el servidor";
         errorMessage.classList.remove("hidden");
       }
     });
   });
   ```

6. Creación de controladores y rutas para las vistas (`src/controllers/viewController.js`):

   ```js
   // Renderizar la página principal
   function renderHome(req, res) {
     res.render("index", {
       isAuthenticated: req.session.isAuthenticated || false,
     });
   }

   // Renderizar la página de login
   function renderLogin(req, res) {
     // Si el usuario ya está autenticado, redirigir al dashboard
     if (req.session.isAuthenticated) {
       return res.redirect("/dashboard");
     }

     res.render("login");
   }

   // Renderizar la página de registro
   function renderRegister(req, res) {
     // Si el usuario ya está autenticado, redirigir al dashboard
     if (req.session.isAuthenticated) {
       return res.redirect("/dashboard");
     }

     res.render("register");
   }

   // Exportar funciones
   module.exports = {
     renderHome,
     renderLogin,
     renderRegister,
   };
   ```

7. Configuración de las rutas para las vistas en `app.js`:

   ```js
   const viewController = require("./controllers/viewController");

   // Rutas para las vistas
   app.get("/", viewController.renderHome);
   app.get("/login", viewController.renderLogin);
   app.get("/register", viewController.renderRegister);
   ```

### Dashboard de Usuario

1. Creación de la vista del dashboard (`views/dashboard.ejs`):

   ```html
   <!DOCTYPE html>
   <html lang="es">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Dashboard | DevOps Hub</title>
       <link rel="stylesheet" href="/css/styles.css" />
       <link rel="stylesheet" href="/css/dashboard.css" />
     </head>
     <body>
       <header>
         <div class="logo">
           <h1><a href="/">DevOps Hub</a></h1>
         </div>
         <nav>
           <ul>
             <li><a href="/dashboard" class="active">Dashboard</a></li>
             <li><a href="/github-connect">GitHub</a></li>
             <li><a href="#" id="logout-btn">Cerrar sesión</a></li>
           </ul>
         </nav>
       </header>

       <main class="dashboard">
         <div class="dashboard-header">
           <h2>Mis Proyectos</h2>
           <button id="new-project-btn" class="btn primary">
             Nuevo Proyecto
           </button>
         </div>

         <div class="projects-container" id="projects-list">
           <!-- Aquí se cargarán los proyectos dinámicamente -->
           <p class="loading-message">Cargando proyectos...</p>
         </div>

         <!-- Modal para crear/editar proyecto -->
         <div id="project-modal" class="modal hidden">
           <div class="modal-content">
             <div class="modal-header">
               <h3 id="modal-title">Nuevo Proyecto</h3>
               <span class="close-modal">&times;</span>
             </div>
             <div class="modal-body">
               <form id="project-form">
                 <input type="hidden" id="project-id" />
                 <div class="form-group">
                   <label for="project-name">Nombre del proyecto</label>
                   <input type="text" id="project-name" name="name" required />
                 </div>
                 <div class="form-group">
                   <label for="project-description">Descripción</label>
                   <textarea
                     id="project-description"
                     name="description"
                     rows="4"
                   ></textarea>
                 </div>
                 <div class="modal-footer">
                   <button type="button" class="btn secondary close-modal">
                     Cancelar
                   </button>
                   <button type="submit" class="btn primary">Guardar</button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       </main>

       <footer>
         <p>&copy; 2025 DevOps Hub - Todos los derechos reservados</p>
       </footer>

       <script src="/js/main.js"></script>
       <script src="/js/dashboard.js"></script>
     </body>
   </html>
   ```

2. Estilos específicos para el dashboard (`public/css/dashboard.css`):

   ```css
   /* Estilos para el dashboard */
   .dashboard {
     max-width: 1200px;
     margin: 0 auto;
     padding: 2rem;
   }

   .dashboard-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 2rem;
   }

   .dashboard-header h2 {
     color: #1e40af;
   }

   /* Estilos para la lista de proyectos */
   .projects-container {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
     gap: 1.5rem;
   }

   .project-card {
     background-color: white;
     border-radius: 0.5rem;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
     padding: 1.5rem;
     transition: transform 0.2s ease, box-shadow 0.2s ease;
   }

   .project-card:hover {
     transform: translateY(-5px);
     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   }

   .project-card h3 {
     color: #1e40af;
     margin-bottom: 0.5rem;
     font-size: 1.25rem;
   }

   .project-card .description {
     color: #6b7280;
     margin-bottom: 1rem;
     font-size: 0.95rem;
   }

   .project-card .meta {
     color: #9ca3af;
     font-size: 0.85rem;
     margin-bottom: 1.25rem;
   }

   .project-actions {
     display: flex;
     justify-content: flex-end;
     gap: 0.5rem;
   }

   .project-actions button {
     padding: 0.4rem 0.75rem;
     font-size: 0.85rem;
     border-radius: 0.25rem;
     cursor: pointer;
     transition: all 0.2s ease;
   }

   .project-actions .edit-btn {
     background-color: #f3f4f6;
     color: #4b5563;
     border: 1px solid #e5e7eb;
   }

   .project-actions .edit-btn:hover {
     background-color: #e5e7eb;
   }

   .project-actions .delete-btn {
     background-color: #fee2e2;
     color: #b91c1c;
     border: 1px solid #fecaca;
   }

   .project-actions .delete-btn:hover {
     background-color: #fecaca;
   }

   .loading-message,
   .empty-message {
     grid-column: 1 / -1;
     text-align: center;
     color: #6b7280;
     padding: 2rem;
   }

   /* Estilos para el modal */
   .modal {
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background-color: rgba(0, 0, 0, 0.5);
     display: flex;
     align-items: center;
     justify-content: center;
     z-index: 1000;
   }

   .modal.hidden {
     display: none;
   }

   .modal-content {
     background-color: white;
     width: 100%;
     max-width: 500px;
     border-radius: 0.5rem;
     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   }

   .modal-header {
     padding: 1.25rem;
     border-bottom: 1px solid #e5e7eb;
     display: flex;
     justify-content: space-between;
     align-items: center;
   }

   .modal-header h3 {
     color: #1e40af;
     margin: 0;
   }

   .close-modal {
     font-size: 1.5rem;
     color: #9ca3af;
     cursor: pointer;
     transition: color 0.2s ease;
   }

   .close-modal:hover {
     color: #6b7280;
   }

   .modal-body {
     padding: 1.5rem;
   }

   .modal-footer {
     display: flex;
     justify-content: flex-end;
     gap: 0.75rem;
     margin-top: 1.5rem;
   }

   #project-description {
     width: 100%;
     padding: 0.75rem;
     border: 1px solid #d1d5db;
     border-radius: 0.375rem;
     font-family: inherit;
     font-size: 1rem;
     resize: vertical;
   }
   ```

3. Script para el funcionamiento del dashboard (`public/js/dashboard.js`):

   ```js
   document.addEventListener("DOMContentLoaded", function () {
     // Elementos del DOM
     const projectsList = document.getElementById("projects-list");
     const newProjectBtn = document.getElementById("new-project-btn");
     const projectModal = document.getElementById("project-modal");
     const modalTitle = document.getElementById("modal-title");
     const projectForm = document.getElementById("project-form");
     const projectIdInput = document.getElementById("project-id");
     const projectNameInput = document.getElementById("project-name");
     const projectDescriptionInput = document.getElementById(
       "project-description"
     );
     const closeModalBtns = document.querySelectorAll(".close-modal");

     // Cargar proyectos al iniciar
     loadProjects();

     // Event listeners
     newProjectBtn.addEventListener("click", openNewProjectModal);
     projectForm.addEventListener("submit", handleProjectSubmit);
     closeModalBtns.forEach((btn) => {
       btn.addEventListener("click", closeModal);
     });

     // Función para cargar los proyectos
     async function loadProjects() {
       try {
         const response = await fetch("/projects");
         const projects = await response.json();

         if (response.ok) {
           renderProjects(projects);
         } else {
           showError("Error al cargar proyectos");
         }
       } catch (error) {
         console.error("Error al cargar proyectos:", error);
         showError("Error al conectar con el servidor");
       }
     }

     // Función para renderizar los proyectos
     function renderProjects(projects) {
       // Limpiar el contenedor
       projectsList.innerHTML = "";

       if (projects.length === 0) {
         projectsList.innerHTML = `
           <p class="empty-message">
             No tienes proyectos todavía. ¡Crea uno nuevo para comenzar!
           </p>
         `;
         return;
       }

       // Renderizar cada proyecto
       projects.forEach((project) => {
         const projectCard = document.createElement("div");
         projectCard.className = "project-card";
         projectCard.innerHTML = `
           <h3>${escapeHtml(project.name)}</h3>
           <p class="description">${escapeHtml(
             project.description || "Sin descripción"
           )}</p>
           <p class="meta">Creado: ${formatDate(project.created_at)}</p>
           <div class="project-actions">
             <button class="edit-btn" data-id="${project.id}">Editar</button>
             <button class="delete-btn" data-id="${
               project.id
             }">Eliminar</button>
           </div>
         `;

         projectsList.appendChild(projectCard);

         // Agregar event listeners a los botones
         const editBtn = projectCard.querySelector(".edit-btn");
         const deleteBtn = projectCard.querySelector(".delete-btn");

         editBtn.addEventListener("click", () => openEditProjectModal(project));
         deleteBtn.addEventListener("click", () => deleteProject(project.id));
       });
     }

     // Función para abrir el modal para un nuevo proyecto
     function openNewProjectModal() {
       modalTitle.textContent = "Nuevo Proyecto";
       projectIdInput.value = "";
       projectNameInput.value = "";
       projectDescriptionInput.value = "";
       projectModal.classList.remove("hidden");
     }
   });
   // Función para abrir el modal para editar un proyecto
   function openEditProjectModal(project) {
     modalTitle.textContent = "Editar Proyecto";
     projectIdInput.value = project.id;
     projectNameInput.value = project.name;
     projectDescInput.value = project.description;
     projectModal.style.display = "block";
   }

   projectForm.addEventListener("submit", async (e) => {
     e.preventDefault();
   });
   ```

const id = projectIdInput.value;
const name = projectNameInput.value;
const description = projectDescInput.value;

const payload = { name, description };

try {
const response = await fetch(id ? `/projects/${id}` : '/projects', {
method: id ? 'PUT' : 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});

    if (!response.ok) throw new Error('Error al guardar el proyecto');
    projectModal.style.display = 'none';
    loadProjects();

} catch (error) {
console.error(error);
alert(error.message);
}

async function loadProjects() {
const res = await fetch('/projects');
const projects = await res.json();

const list = document.getElementById('projectList');
list.innerHTML = '';

projects.forEach(project => {
const item = document.createElement('div');
item.innerHTML = `     <strong>${project.name}</strong><br>
      ${project.description}<br>
      <button onclick='openEditProjectModal(${JSON.stringify(project)})'>Editar</button>
  `;
list.appendChild(item);
});
}

window.onload = loadProjects;

```

```
