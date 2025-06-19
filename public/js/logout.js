document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("/auth/logout", {
        method: "POST",
        credentials: "include", // necesario para eliminar la cookie de sesión
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error al cerrar sesión");
          }
          // Redirigir al login tras logout exitoso
          window.location.href = "login.html";
        })
        .catch((err) => {
          alert("No se pudo cerrar sesión. Intenta de nuevo.");
          console.error(err);
        });
    });
  }
});
