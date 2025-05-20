const usersRoute = require('./src/routes/users');
const loginRoute = require('./src/auth/auth');
const initDB = require('./src/db/init');
const express = require("express");
const session = require('express-session');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para habilitar el live reload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
app.use(connectLivereload());

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Recargar el navegador cuando cambien archivos
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Añadir para prevenir que la request venga nula
app.use(express.json());

// Middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: true }));

//Middleware para procesar el manejo de sesiones
app.use(session({
  secret: 'secreto-devops-hub', // Cambiar esto por una clave secreta más segura en producción
  resave: false, // No volver a guardar la sesión si no ha habido cambios
  saveUninitialized: true, // Guardar sesiones no inicializadas
  cookie: { secure: false }, // Cambiar a true al usar HTTPS
  maxAge: 1000 * 60 * 60 * 24 // 1 día de duración de la sesión
}));

// Middleware para procesar ruta de usuarios
app.use('/users', usersRoute);

//Middleware para procesar la ruta de autenticado
app.use('/auth', loginRoute);

app.get("/", (req, res) => {
  res.send(`<form method="POST" action="/">
      <label>Nombre: <input type="text" name="nombre" /></label><br>
      <button type="submit">Enviar</button>
    </form>`);
});

app.post("/", (req, res) => {
  const nombre = req.body.nombre;
  res.send(`Hola, ${nombre}! Gracias por enviar el formulario.`);
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
