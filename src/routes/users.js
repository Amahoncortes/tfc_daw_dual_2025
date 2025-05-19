const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");

//Endpoint para crear un nuevo usuario con cifrado de contraseña
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Se requieren usuario y contraseña" });
  }

  try {
    //Cifrar contraseña con bcrypt (10 rondas de encriptado)
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.run(query, [username, hashedPassword], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al crear el usuario", details: err.message });
      }
      res
        .status(201)
        .json({ message: "Usuario creado con éxito", userId: this.lastID });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al cifrar la contraseña", details: error.message });
  }
});

//Endpoint para listar usuarios
router.get("/", (req, res) => {
  const query = "SELECT * FROM users";
  db.all(query, [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener los usuarios", details: err.message });
    }
    res.status(200).json(rows);
  });
});

module.exports = router;
