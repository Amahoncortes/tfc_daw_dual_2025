const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");

// POST /auth/login - Autenticar usuario
router.post("/login", async (req, res) => {
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
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos" });
    }

    //Verificar la contraseña
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        //Generar un token de sesión (aquí se puede usar un token JWT)
        // const token = generateToken(user.id);
        res.json({
          message: "Login exitoso",
          userId: user.id,
          username: user.username,
        });
      } else {
        return res
          .status(401)
          .json({ error: "Usuario o contraseña incorrectos" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({
          error: "Error al verificar la contraseña",
          details: error.message,
        });
    }
  });
});
module.exports = router;
