const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");

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
      if (err) {
        return res
          .status(500)
          .json({ error: "Error inserting the user", details: err.message });
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
router.get("/", (req, res) => {
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

module.exports = router;
