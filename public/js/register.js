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
      "El usuario y la contraseña deben tener como mínimo 3 y 4 caracteres respectivamente."
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
      throw new Error(result.error || "Error registering user.");
    }

    showSuccess("Usuario registrado con éxito. Redirigiendo a inicio de sesión...");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (err) {
    showError(err.message || "Error connecting to server.");
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
