const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { isAuthenticated } = require("../middleware/auth");

// Obtener todas las tareas de un proyecto
router.get("/:projectId", isAuthenticated, (req, res) => {
  const projectId = parseInt(req.params.projectId);
  db.all(
    "SELECT * FROM tasks WHERE project_id = ?",
    [projectId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Crear una nueva tarea
router.post("/:projectId", isAuthenticated, (req, res) => {
  const { title, description } = req.body;
  const projectId = parseInt(req.params.projectId);
  if (!title) return res.status(400).json({ error: "Title is required" });

  db.run(
    "INSERT INTO tasks (project_id, title, description) VALUES (?, ?, ?)",
    [projectId, title, description || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Actualizar una tarea (título, descripción, estado)
router.put("/:taskId", isAuthenticated, (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const { title, description, status } = req.body;
  db.run(
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
    [title, description, status, taskId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Task updated successfully" });
    }
  );
});

// Actualizar el estado de una tarea
router.put("/:taskId/status", isAuthenticated, (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  db.run(
    "UPDATE tasks SET status = ? WHERE id = ?",
    [status, taskId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Estado de tarea actualizado" });
    }
  );
});

// Borrar una tarea
router.delete("/:taskId", isAuthenticated, (req, res) => {
  const taskId = parseInt(req.params.taskId);
  db.run("DELETE FROM tasks WHERE id = ?", [taskId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tarea eliminada con éxito" });
  });
});

module.exports = router;
