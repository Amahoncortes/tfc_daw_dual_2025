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

3. [Fase de Construcción](#fase-de-construcción)
   - [Pendiente de implementar]

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

| Riesgo | Impacto | Probabilidad | Estrategia de Mitigación |
|--------|---------|--------------|--------------------------|
| Dificultad con las nuevas tecnologías | Alto | Alta | Comenzar con tutoriales básicos, mantener la solución simple, y buscar ejemplos prácticos para cada componente |
| Problemas de integración con GitHub API | Medio | Media | Comenzar con integración básica, usar bibliotecas probadas para la autenticación OAuth |
| Problemas de seguridad en la aplicación | Alto | Media | Seguir prácticas estándar de seguridad, emplear validaciones robustas |
| Atrasos en el cronograma | Alto | Alta | Priorizar funcionalidades core, simplificar donde sea posible, y mantener un MVP mínimo pero completo |
| Problemas con la estructura de la base de datos | Medio | Media | Diseñar un esquema simple y flexible, haciendo un prototipo temprano |

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
   const express = require('express');
   const app = express();
   const port = 3000;

   app.use(express.json());

   app.get('/', (req, res) => {
     res.send('GET recibido');
   });

   app.post('/', (req, res) => {
     res.send('POST recibido');
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
   const sqlite3 = require('sqlite3').verbose();
   const path = require('path');

   const dbPath = path.resolve(__dirname, 'database.sqlite');
   const db = new sqlite3.Database(dbPath, (err) => {
     if (err) {
       console.error('Error al conectar con la base de datos:', err);
     } else {
       console.log('Conectado a la base de datos SQLite');
     }
   });

   module.exports = db;
   ```

3. Script de inicialización con creación de tabla (`src/db/init.js`):
   ```js
   const db = require('./database');

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
   require('./db/init');
   ```

### Gestión de Usuarios

1. Endpoints REST para usuarios (`src/routes/users.js`):
   ```js
   const express = require('express');
   const router = express.Router();
   const db = require('../db/database');

   // POST /users - Crear nuevo usuario
   router.post('/', (req, res) => {
     const { username, password } = req.body;

     if (!username || !password) {
       return res.status(400).json({ error: 'Faltan username o password' });
     }

     const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
     db.run(query, [username, password], function(err) {
       if (err) {
         return res.status(500).json({ error: 'Error al insertar usuario', details: err.message });
       }
       res.status(201).json({ message: 'Usuario creado', userId: this.lastID });
     });
   });

   // GET /users - Obtener lista de usuarios
   router.get('/', (req, res) => {
     const query = `SELECT id, username FROM users`;
     db.all(query, [], (err, rows) => {
       if (err) {
         return res.status(500).json({ error: 'Error al obtener usuarios', details: err.message });
       }
       res.json(rows);
     });
   });

   module.exports = router;
   ```

2. Configuración de rutas en `app.js`:
   ```js
   const express = require('express');
   const app = express();
   const usersRoute = require('./routes/users');

   // Middleware para procesar datos JSON
   app.use(express.json());

   // Middleware para procesar datos de formularios
   app.use(express.urlencoded({ extended: true }));

   // Middleware para las rutas de usuarios
   app.use('/users', usersRoute);
   ```

3. Endpoints probados en Postman:
   - POST /users - Crear nuevo usuario
   - GET /users - Obtener lista de usuarios

---

## Fase de Construcción

*[Esta sección se actualizará cuando se implementen las funcionalidades correspondientes]*

---

## Fase de Transición

*[Esta sección se actualizará cuando se implementen las funcionalidades correspondientes]*

---

## Notas adicionales y aprendizajes

- Es importante utilizar `express.json()` como middleware para procesar datos JSON en las peticiones, ya que de lo contrario `req.body` será `undefined`.
- El uso de `nodemon` facilita el desarrollo al reiniciar automáticamente el servidor cuando se detectan cambios en los archivos.
- Las consultas parametrizadas en SQLite son cruciales para prevenir inyecciones SQL.