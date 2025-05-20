const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");
const { preventLoginifAuthenticated } = require("../middleware/auth");
const { isAuthenticated } = require("../middleware/auth");

// POST /auth/login - Iniciar sesión
router.post("/login", preventLoginifAuthenticated, (req, res) => {
  const { username, password } = req.body;
  //Verificar que se envíen el nombre de usuario y la contraseña
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
        res.redirect('/views/welcome.html');
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      return res.status(500).json({
        error: "Server internal error",
        details: error.message,
      });
    }
  });
});

// GET /auth/logout - Cerrar sesión
router.get("/logout", isAuthenticated, (req, res) => {

  //Verificar si el usuario está autenticado
  if (req.session && req.session.username) {
    const username = req.session.username;
    //Si lo está, eliminar los datos de usuario de la sesión
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({
            error: "Error logging out for the user " + req.session.username,
            details: err.message,
          });
      }
      res.redirect("/");
    });
  } else {
    return res.status(401).json({ error: "No user session found" });
  }
});

// GET /auth/status - Verificar el estado de la sesión
router.get("/status", isAuthenticated, (req, res) => {
  if (req.session.isLoggedIn) {
    res.json({
      isLoggedIn: true,
      message: "User " + req.session.username + " authenticated",
      userId: req.session.userId,
      username: req.session.username,
    });
  } else {
    res.status(401).json({
      isLoggedIn: false,
      message:
        "User " + (req.session.username || "unknown") + " is not logged in",
    });
  }
});

module.exports = router;
