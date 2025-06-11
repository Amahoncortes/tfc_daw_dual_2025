const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { isAuthenticated } = require("../middleware/auth");

// POST /projects - Crear un nuevo proyecto
router.post("/", isAuthenticated, (req, res) => {
  const { name, description } = req.body;
  const userId = req.session.userId;

  if (!name) {
    return res
      .status(400)
      .json({ error: "El nombre del proyecto es obligatorio" });
  }

  const now = new Date()
    .toLocaleString("sv-SE", { timeZone: "Europe/Madrid" })
    .replace(" ", "T");
  const query = `INSERT INTO projects (user_id, name, description, created_at) VALUES (?, ?, ?, ?)`;
  db.run(query, [userId, name, description, now], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al crear proyecto", details: err.message });
    }
    res.status(201).json({
      message: "Proyecto creado exitosamente",
      projectId: this.lastID,
    });
  });
});

// GET /projects - Listar proyectos del usuario autenticado
router.get("/", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const query = `SELECT id, name, description, created_at FROM projects WHERE user_id = ? ORDER BY created_at DESC`;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener proyectos", details: err.message });
    }
    res.json(rows);
  });
});

// GET /projects/:id - Obtener detalles de un proyecto específico
router.get("/:id", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const projectId = req.params.id;
  const query = `SELECT id, name, description, created_at FROM projects WHERE user_id = ? AND id = ?`;

  db.get(query, [userId, projectId], (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener proyecto", details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.json(row);
  });
});

module.exports = router;
