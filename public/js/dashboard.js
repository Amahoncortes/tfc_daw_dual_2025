document.addEventListener("DOMContentLoaded", () => {
  // Mostrar saludo y rol del usuario
  fetch("/auth/status", { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      const welcomeEl = document.getElementById("welcomeMessage");
      if (welcomeEl) {
        welcomeEl.textContent = `Hola, ${data.username}! 👋`;
      }

      const infoRol = document.getElementById("rolUsuario");
      if (infoRol && data.role) {
        infoRol.innerText = `Rol: ${data.role}`;
      }

      if (data.role === "admin") {
        showAdminButton();
      }
    })
    .catch((err) => {
      console.error("No se pudo cargar el estado de sesión:", err);
    });

  // Cerrar sesión
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("/auth/logout", { method: "GET", credentials: "include" }).then(() => {
        window.location.href = "login.html";
      });
    });
  }

  // Exponer función global solo si aplica
  window.showAdminButton = showAdminButton;
});

// Mostrar botón de administrar usuarios (si admin)
function showAdminButton() {
  const container = document.getElementById("adminActions");
  if (!container) return;

  const button = document.createElement("a");
  button.href = "handleUsers.html";
  button.className = "btn btn-outline-primary";
  button.textContent = "Administrar usuarios";

  container.appendChild(button);
}
