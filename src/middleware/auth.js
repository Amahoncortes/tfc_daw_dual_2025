//Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  } else {
    return res.status(401).json({ error: "Acceso denegado. Inicia sesión primero." });
  }
}

// Middleware para verificar si el usuario no está autenticado
function preventLoginifAuthenticated(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    // Responder con éxito silencioso para permitir redirección
    return res.status(200).json({ message: "Ya has iniciado sesión." });
  }
  next();
}

//Middleware para restringir ciertos accesos solo a usuario administrador
function isAdmin(req, res, next) {
  if (req.session && req.session.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ error: "Se requiere acceso de administrador." });
  }
}

module.exports = {
  isAuthenticated,
  preventLoginifAuthenticated,
  isAdmin,
};
