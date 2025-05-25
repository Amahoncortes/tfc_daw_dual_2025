// dashboard.js — Muestra info del usuario y permite cerrar sesión

// Mostrar el nombre del usuario
fetch('/auth/status', {
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => {
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = `Hola, ${data.username}! 👋`;
  });

// Botón de logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  fetch('/auth/logout', {
    method: 'GET',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(() => {
      window.location.href = 'login.html';
    });
});
