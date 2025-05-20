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
    return res.status(401).json({ error: "You are already logged in." });
  } else {
    return next();
  }
}

module.exports = {
  isAuthenticated,
  preventLoginifAuthenticated
};
