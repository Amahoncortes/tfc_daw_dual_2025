const express = require("express");
const router = express.Router();
const db = require("../../db/database");
const bcrypt = require("bcrypt");
const { isAuthenticated } = require("../../middleware/auth");

// POST /auth/login - Iniciar sesión
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Se requiere usuario y contraseña." });
  }
  // Verificar si el usuario existe (ignorando mayúsculas/minúsculas)
  const query = "SELECT * FROM users WHERE LOWER(username) = LOWER(?)";
  db.get(query, [username], async (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al buscar usuario", details: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.isLoggedIn = true;
        req.session.role = user.role || "user"; // Asignar rol por defecto si no existe
        return res.status(200).json({ message: "Login exitoso" });
      } else {
        return res.status(401).json({ error: "Contraseña inválida" });
      }
    } catch (error) {
      console.error("Error verificando contraseña:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor", details: error.message });
    }
  });
});

// GET /auth/logout - Cerrar sesión
router.get("/logout", isAuthenticated, (req, res) => {
  if (req.session && req.session.username) {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al cerrar sesión", details: err.message });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout exitoso" });
    });
  } else {
    return res.status(401).json({ error: "No se encontró sesión de usuario" });
  }
});

// GET /auth/status - Verifica si hay sesión activa
// GET /auth/status - Verifica si hay sesión activa y devuelve datos del usuario
router.get("/status", (req, res) => {
  if (!req.session || !req.session.isLoggedIn) {
    return res.json({
      isLoggedIn: false,
      message: "No hay sesión activa",
    });
  }

  const userId = req.session.userId;

  db.get(
    "SELECT github_username FROM users WHERE id = ?",
    [userId],
    (err, row) => {
      if (err) {
        console.error("Error recuperando nombre de usuario de GitHub:", err);
        return res
          .status(500)
          .json({ error: "Error recuperando nombre de usuario de GitHub" });
      }

      res.json({
        isLoggedIn: true,
        userId: req.session.userId,
        username: req.session.username,
        role: req.session.role,
        githubUsername: row?.github_username || "",
        message: `Usuario ${req.session.username} autenticado`,
      });
    }
  );
});

module.exports = router;
