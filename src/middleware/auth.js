//Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  } else {
    return res.status(401).json({ error: "Acceso denegado. Iniciar sesión primero." });
  }
}

module.exports = {
  isAuthenticated
};
