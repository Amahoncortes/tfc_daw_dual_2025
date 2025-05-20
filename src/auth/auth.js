const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");

// POST /auth/login - Autenticar usuario
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username & password required." });
  }

  //Buscar el usuario en la base de datos
  const query = "SELECT * FROM users WHERE username = ?";
  db.get(query, [username], async (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching user", details: err.message });
    }

    //Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ error: "User not found" });
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
          message: "Login successful",
          userId: user.id,
          username: user.username,
        });
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Error verifying password",
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
        .json({ error: "Error logging out", details: err.message });
    }
    res.json({ message: "Logout successful" });
  });
});

module.exports = router;
