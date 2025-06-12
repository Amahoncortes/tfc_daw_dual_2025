//Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  } else {
    return res.status(401).json({ error: "Access denied. Log in first." });
  }
}

// Middleware para verificar si el usuario no está autenticado
function preventLoginifAuthenticated(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    // Responder con éxito silencioso para permitir redirección
    return res.status(200).json({ message: "Already logged in" });
  }
  next();
}

//Middleware para restringir ciertos accesos solo a usuario administrador
function isAdmin(req, res, next) {
  if (req.session && req.session.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ error: "Admin access required." });
  }
}

module.exports = {
  isAuthenticated,
  preventLoginifAuthenticated,
  isAdmin,
};
