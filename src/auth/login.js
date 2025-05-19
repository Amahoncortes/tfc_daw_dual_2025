const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");

// POST /auth/login - Autenticar usuario
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Se requieren usuario y contraseña" });
  }

  //Buscar el usuario en la base de datos
  const query = "SELECT * FROM users WHERE username = ?";
  db.get(query, [username], async (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al buscar el usuario", details: err.message });
    }

    //Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ error: "El usuario no existe" });
    }

    //Verificar la contraseña
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        //Guardar los datos de usuario en la sesión
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.isLoggedIn = true;
        res.json({
          message: "Login exitoso",
          userId: user.id,
          username: user.username,
        });
      } else {
        return res.status(401).json({ error: "Contraseña inválida" });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Error al verificar la contraseña",
        details: error.message,
      });
    }
  });
});

// POST /auth/logout - Cerrar sesión
router.post("/logout", (req, res) => {
  //Eliminar los datos de usuario de la sesión
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al cerrar sesión", details: err.message });
    }
    res.json({ message: "Sesión cerrada con éxito" });
  });
});

module.exports = router;
