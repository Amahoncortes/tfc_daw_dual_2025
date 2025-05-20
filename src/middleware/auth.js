//Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  } else {
    return res.status(401).json({ error: "Acceso denegado. Iniciar sesión primero." });
  }
}

// Middleware para verificar si el usuario no está autenticado
function preventLoginifAuthenticated(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return res.status(401).json({ error: "Ya estás autenticado." });
  } else {
    return next();
  }
}

module.exports = {
  isAuthenticated,
  preventLoginifAuthenticated
};
