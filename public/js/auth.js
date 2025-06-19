// auth.js — Manejo del login de DevOps Hub

// Referencias al formulario y al contenedor de errores
const form = document.getElementById('loginForm');
const alertContainer = document.getElementById('alertContainer');
const loginBtn = document.getElementById('loginBtn');
const spinner = document.getElementById('loginSpinner');

// Manejador del evento submit del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevenir el envío normal del formulario (recarga)

  // Limpiar errores anteriores
  alertContainer.innerHTML = '';

  // Obtener los valores del formulario
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // Mostrar el spinner y desactivar el botón mientras se procesa
  spinner.classList.remove('d-none');
  loginBtn.disabled = true;

  try {
    // Enviar la petición POST al backend
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Importante para sesiones con cookies
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
      // Redirigir al dashboard si login exitoso
      window.location.href = 'dashboard.html';
    } else {
      // Mostrar error si las credenciales son inválidas
      showError(result.error || 'Credenciales incorrectas.');
    }

  } catch (err) {
    // Error general de red o del servidor
    showError('No se pudo conectar al servidor.');
  }

  // Ocultar spinner y reactivar botón
  spinner.classList.add('d-none');
  loginBtn.disabled = false;
});

// Función auxiliar para mostrar errores
function showError(message) {
  alertContainer.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}
