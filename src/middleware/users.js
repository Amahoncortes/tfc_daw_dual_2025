function canDeleteUser(req, res, next) {
  if (!req.session || !req.session.isLoggedIn) {
    return res.status(401).json({ error: "Acceso denegado. Inicia sesión." });
  }

  const requestedUserId = parseInt(req.params.id);
  const loggedInUserId = req.session.userId;
  const userRole = req.session.role;

  // No permitir que un usuario se borre a sí mismo
  if (requestedUserId === loggedInUserId) {
    return res
      .status(403)
      .json({ error: "No puedes eliminar tu propio usuario." });
  }

  // Permitir que un admin borre a otros usuarios
  if (userRole === "admin") {
    return next();
  }

  // Bloquear en todos los demás casos
  return res
    .status(403)
    .json({ error: "No tienes permiso para borrar este usuario." });
}

module.exports = {
  canDeleteUser,
};
