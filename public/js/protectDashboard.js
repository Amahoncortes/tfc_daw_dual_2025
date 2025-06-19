// protectDashboard.js — Redirige al login si el usuario no está autenticado
fetch('/auth/status', {
  credentials: 'include'
})
  .then(res => {
    if (!res.ok) throw new Error('No hay sesión activa');
    return res.json();
  })
  .then(data => {
    if (!data.isLoggedIn) {
      window.location.href = 'login.html';
    }
  })
  .catch(() => {
    window.location.href = 'login.html';
  });
