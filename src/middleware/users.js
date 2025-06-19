function canDeleteUser(req, res, next) {
  // Verificar autenticación
  if (!req.session || !req.session.isLoggedIn) {
    return res.status(401).json({ error: 'Acceso denegado. Inicia sesión.' });
  }
  
  const requestedUserId = parseInt(req.params.id);
  const loggedInUserId = req.session.userId;
  
  // Solo permitir si el usuario intenta eliminar su propia cuenta
  if (requestedUserId === loggedInUserId) {
    return next();
  } else {
    // Aquí se puede implementar verificación de administrador en el futuro
    return res.status(403).json({ error: 'No tienes permiso para borrar este usuario.' });
  }
}

module.exports = {
  canDeleteUser
};