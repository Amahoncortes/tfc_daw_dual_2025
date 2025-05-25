const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");
const {isAuthenticated } = require("../middleware/auth");

// POST /auth/login - Iniciar sesión
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username & password required." });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  db.get(query, [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user", details: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.isLoggedIn = true;
        return res.status(200).json({ message: "Login successful" });
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      return res.status(500).json({ error: "Server internal error", details: error.message });
    }
  });
});

// GET /auth/logout - Cerrar sesión
router.get("/logout", isAuthenticated, (req, res) => {
  if (req.session && req.session.username) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Error logging out", details: err.message });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  } else {
    return res.status(401).json({ error: "No user session found" });
  }
});

// GET /auth/status - Verifica si hay sesión activa
router.get("/status", isAuthenticated, (req, res) => {
  res.json({
    isLoggedIn: true,
    userId: req.session.userId,
    username: req.session.username,
    message: `Usuario ${req.session.username} autenticado`
  });
});

module.exports = router;
