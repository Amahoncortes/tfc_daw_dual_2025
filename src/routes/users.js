const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");
const { isAuthenticated } = require("../middleware/auth");
const { canDeleteUser } = require("../middleware/users");

//Endpoint para crear un nuevo usuario con cifrado de contraseña
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username & password required." });
  }

  try {
    //Cifrar contraseña con bcrypt (10 rondas de encriptado)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.run(query, [username, hashedPassword], function (err) {
      if (err.message.includes("UNIQUE")) {
        return res
          .status(409)
          .json({ error: "El nombre de usuario ya está en uso." });
      }
      res
        .status(201)
        .json({ message: "User created successfully", userId: this.lastID });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error hashing the password", details: error.message });
  }
});

//Endpoint para listar usuarios
router.get("/", isAuthenticated, (req, res) => {
  const query = "SELECT id, username FROM users";
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

module.exports = router;
