const express = require('express');
const fetch = require('node-fetch'); 
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');

// GET /github/repos
router.get('/', isAuthenticated, async (req, res) => {
  const username = req.session.username || 'Amahoncortes';

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      return res.status(500).json({ error: 'No se pudieron obtener los repos' });
    }

    const repos = data.map(repo => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description
    }));

    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: 'Error al conectar con GitHub', details: err.message });
  }
});

module.exports = router;
