const usersRoute = require('./src/routes/users');
const loginRoute = require('./src/auth/login');
const initDB = require('./src/db/init');
const express = require("express");
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const path = require('path');
const projectsRoute = require('./src/routes/project');

const app = express();
const port = 3000;

// Middleware para habilitar el live reload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// 2. Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 3. Middleware para parseo de datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Middleware de sesiones
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.sqlite',
    dir: path.join(__dirname, 'src', 'db'),
  }),
  secret: 'devops_hub_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  maxAge: 3600000
}));

// 5. Rutas del backend
app.use('/users', usersRoute);
app.use('/auth', loginRoute);

// Ruta de proyectos
app.use('/projects', projectsRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
