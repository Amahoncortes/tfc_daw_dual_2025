// checkSession.js — Redirige a dashboard si ya hay sesión activa
fetch('/auth/status', {
  credentials: 'include'
})
.then(res => {
  if (res.ok) {
    return res.json();
  }
  throw new Error('No active session');
})
.then(data => {
  if (data.isLoggedIn) {
    window.location.href = 'dashboard.html';
  }
})
.catch(err => {
  // No hay sesión activa, continuar normalmente
});
