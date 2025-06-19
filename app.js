const express = require("express");
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const usersRoute = require('./src/routes/users');
const loginRoute = require('./src/routes/auth/login');
const projectsRoute = require('./src/routes/project');
const githubReposRoute = require('./src/routes/github/repos');
const taskRoutes = require("./src/routes/tasks");

const app = express();
const port = 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de parseo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de sesión
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.sqlite',
    dir: path.join(__dirname, 'src', 'db'),
  }),
  secret: 'devops_hub_secret_key',
  resave: false,
  saveUninitialized: false, 
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600000 // 1 hora
  }
}));

// Rutas del backend
app.use('/users', usersRoute);
app.use('/auth', loginRoute);
app.use('/projects', projectsRoute);
app.use('/github/repos', githubReposRoute);
app.use('/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
