const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { isAuthenticated } = require("../middleware/auth");

// POST /projects - Crear un nuevo proyecto
router.post("/", isAuthenticated, (req, res) => {
  const { name, description } = req.body;
  const userId = req.session.userId;

  if (!name || !userId) {
    return res
      .status(400)
      .json({ error: "Name project and user ID are required" });
  }

  const now = new Date()
    .toLocaleString("sv-SE", { timeZone: "Europe/Madrid" })
    .replace(" ", "T");
  const query = `INSERT INTO projects (user_id, name, description, created_at) VALUES (?, ?, ?, ?)`;
  db.run(query, [userId, name, description, now], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error creating project", details: err.message });
    }
    res.status(201).json({
      message: "Project created successfully",
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
        .json({ error: "Error fetching projects", details: err.message });
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
        .json({ error: "Error fetching project", details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(row);
  });
});

// PUT /projects/:id - Actualizar un proyecto existente
router.put("/:id", isAuthenticated, (req, res) => {
  const projectId = parseInt(req.params.id);
  const userId = req.session.userId;
  const { name, description } = req.body;

  if (!name && !description) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided for update" });
  }

  const fields = [];
  const values = [];

  if (name) {
    fields.push("name = ?");
    values.push(name);
  }

  if (description) {
    fields.push("description = ?");
    values.push(description);
  }

  values.push(projectId, userId);

  const query = `UPDATE projects SET ${fields.join(
    ", "
  )} WHERE id = ? AND user_id = ?`;

  db.run(query, values, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error updating project", details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ message: "Project updated successfully" });
  });
});

// DELETE /projects/:id - Eliminar un proyecto
router.delete("/:id", isAuthenticated, (req, res) => {
  const projectId = parseInt(req.params.id);
  const userId = req.session.userId;
  const query = `DELETE FROM projects WHERE id = ? AND user_id = ?`;

  db.run(query, [projectId, userId], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error deleting project", details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  });
});

module.exports = router;
