const usersRoute = require('./src/routes/users');
const loginRoute = require('./src/auth/login');
const initDB = require('./src/db/init');
const express = require("express");
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


// Middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: true }));

// Añadir para prevenir que la request venga nula
app.use(express.json());
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
