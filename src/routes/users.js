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
  let role = "user";

  // Verificar si es el primer usuario registrado
  db.get("SELECT COUNT(*) as count FROM users", [], async (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error checking user count", details: err.message });
    }

    console.log(
      "👉 Número de usuarios actuales en la base de datos:",
      row.count
    );

    if (row.count === 0) {
      role = "admin";
      console.log("🟢 Primer usuario, rol asignado:", role);
    } else {
      console.log("🔵 No es el primero, rol asignado:", role);
    }

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query =
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
      db.run(query, [normalizedUsername, hashedPassword, role], function (err) {
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
          role,
        });
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error hashing the password", details: error.message });
    }
  });
});

//Endpoint para listar usuarios
router.get("/", isAuthenticated, (req, res) => {
  //Verificar que el usuario es admin
  const query = "SELECT id, username, role FROM users";
  db.all(query, [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al buscar usuarios", details: err.message });
    }
    res.status(200).json(rows);
  });
});

//Endpoint para eliminar un usuario
router.delete("/:id", isAuthenticated, canDeleteUser, (req, res) => {
  const userId = parseInt(req.params.id);
  const currentUserId = req.session.userId;

  // Validar que el ID es válido
  if (isNaN(userId)) {
    return res.status(400).json({ error: "ID de usuario inválido." });
  }

  // Impedir eliminarse a uno mismo
  if (userId === currentUserId) {
    return res
      .status(403)
      .json({ error: "No puedes eliminar tu propio usuario." });
  }

  // Buscar usuario
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al buscar usuario", details: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Eliminar usuario
    db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error eliminando usuario", details: err.message });
      }

      res.status(200).json({ message: "Usuario eliminado con éxito", userId });
    });
  });
});

// PATCH /users/:id/role - Cambiar el rol de un usuario
router.patch("/:id/role", isAuthenticated, isAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "El rol es inválido." });
  }

  const query = "UPDATE users SET role = ? WHERE id = ?";
  db.run(query, [role, userId], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error actualizando el rol", details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Rol actualizado con éxito" });
  });
});

// PUT /users/github - Update GitHub username for current user
router.put("/github", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const { githubUsername } = req.body;

  if (!githubUsername || typeof githubUsername !== "string") {
    return res
      .status(400)
      .json({ error: "Se requiere el nombre de usuario de GitHub." });
  }

  db.run(
    "UPDATE users SET github_username = ? WHERE id = ?",
    [githubUsername.trim(), userId],
    function (err) {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({
          error: "Error actualizando el nombre de usuario de GitHub.",
        });
      }

      res.json({
        message: "Nombre de usuario de GitHub actualizado con éxito.",
      });
    }
  );
});

module.exports = router;
