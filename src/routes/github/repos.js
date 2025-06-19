const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/auth");
const db = require("../../db/database");

// GET /github/repos
router.get("/", isAuthenticated, (req, res) => {
  const userId = req.session.userId;

  db.get(
    "SELECT github_username FROM users WHERE id = ?",
    [userId],
    async (err, row) => {
      if (err || !row || !row.github_username) {
        return res
          .status(400)
          .json({ error: "No GitHub username configured." });
      }

      try {
        const response = await fetch(
          `https://api.github.com/users/${row.github_username}/repos`
        );

        const text = await response.text();
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
          return res
            .status(500)
            .json({ error: "La API de GitHub no devolvió un array.", raw: data });
        }

        const repos = data.map((repo) => ({
          name: repo.name,
          html_url: repo.html_url,
          description: repo.description,
        }));

        res.json(repos);
      } catch (error) {
        console.error("Error recuperando datos de GitHub:", error.message);
        res
          .status(500)
          .json({ error: "Error al recuperar repositorios", details: error.message });
      }
    }
  );
});

module.exports = router;
