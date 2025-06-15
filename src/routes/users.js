const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");
const { isAuthenticated } = require("../middleware/auth");
const { canDeleteUser } = require("../middleware/users");
const { isAdmin } = require("../middleware/auth");

//Endpoint para crear un nuevo usuario con cifrado de contraseña
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const normalizedUsername = username.toLowerCase();
  const supremeRole =
    req.session && req.session.role === "admin" ? "admin" : "user";

  if (!username || !password) {
    return res.status(400).json({ error: "Username & password required." });
  }

  try {
    //Cifrar contraseña con bcrypt (10 rondas de encriptado)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query =
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    db.run(
      query,
      [normalizedUsername, hashedPassword, supremeRole],
      function (err) {
        if (err && err.message && err.message.includes("UNIQUE")) {
          return res
            .status(409)
            .json({ error: "El nombre de usuario ya está en uso." });
        }
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al crear usuario", details: err.message });
        }
        res.status(201).json({
          message: "Usuario creado exitosamente",
          userId: this.lastID,
        });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error hashing the password", details: error.message });
  }
});

//Endpoint para listar usuarios
router.get("/", isAuthenticated, (req, res) => {
  //Verificar que el usuario es admin
  const query = "SELECT id, username, role FROM users";
  db.all(query, [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching users", details: err.message });
    }
    res.status(200).json(rows);
  });
});

//Endpoint para eliminar un usuario
router.delete("/:id", isAuthenticated, canDeleteUser, (req, res) => {
  const userId = parseInt(req.params.id);

  //Verificar que el ID del usuario sea un número válido
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  //Verificar que el usuario existe ante de eliminarlo
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching user", details: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //Eliminar el usuario
    db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting user", details: err.message });
      }
      res
        .status(200)
        .json({ message: "User deleted successfully", userId: userId });
    });
  });
});

// PATCH /users/:id/role - Cambiar el rol de un usuario
router.patch("/:id/role", isAuthenticated, isAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Role is invalid." });
  }

  const query = "UPDATE users SET role = ? WHERE id = ?";
  db.run(query, [role, userId], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error updating role", details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Role updated successfully" });
  });
});

module.exports = router;
