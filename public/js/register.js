// register.js — Registro de usuario para DevOps Hub

const form = document.getElementById("registerForm");
const alertContainer = document.getElementById("alertContainer");
const registerBtn = document.getElementById("registerBtn");
const spinner = document.getElementById("registerSpinner");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evitar recarga de página

  // Limpiar alertas previas
  alertContainer.innerHTML = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validaciones básicas (frontend)
  if (username.length < 3 || password.length < 4) {
    return showError(
      "El nombre de usuario o la contraseña son demasiado cortos."
    );
  }

  if (password !== confirmPassword) {
    showError("Las contraseñas no coinciden.");
    spinner.classList.add("d-none");
    registerBtn.disabled = false;
    return;
  }

  try {
    const response = await fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Error al registrar usuario.");
    }

    showSuccess("Usuario registrado correctamente. Redirigiendo a login...");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (err) {
    showError(err.message || "Error de conexión con el servidor.");
  }

  spinner.classList.add("d-none");
  registerBtn.disabled = false;
});

// Mostrar error en el contenedor
function showError(message) {
  alertContainer.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

// Mostrar éxito en el contenedor
function showSuccess(message) {
  alertContainer.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}
