let currentUserId = null;

// Proteger acceso: solo admins
fetch("/auth/status")
  .then((res) => res.json())
  .then((data) => {
    if (!data.isLoggedIn || data.role !== "admin") {
      window.location.href = "login.html";
    } else {
      currentUserId = data.userId; // guardar ID actual
      loadUsers();
    }
  })
  .catch(() => {
    window.location.href = "login.html";
  });

function loadUsers() {
  fetch("/users")
    .then((res) => res.json())
    .then((users) => {
      const list = document.getElementById("userList");
      list.innerHTML = "";

      // Ordenar: usuario actual primero, luego por username
      users.sort((a, b) => {
        if (a.id === currentUserId) return -1;
        if (b.id === currentUserId) return 1;
        return a.username.localeCompare(b.username);
      });

      users.forEach((user) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";

        const isCurrent = user.id === currentUserId;

        const badge =
          user.role === "admin"
            ? `<span class="badge ${
                isCurrent ? "bg-warning text-dark" : "bg-danger"
              } ms-2"><i class="bi bi-shield-lock-fill"></i> ${user.role}${
                isCurrent ? " (tú)" : ""
              }</span>`
            : `<span class="badge ${
                isCurrent ? "bg-info text-dark" : "bg-secondary"
              } ms-2"><i class="bi bi-person-fill"></i> ${user.role}${
                isCurrent ? " (tú)" : ""
              }</span>`;

        const newRole = user.role === "admin" ? "user" : "admin";
        const icon =
          newRole === "admin"
            ? `<i class="bi bi-shield-lock-fill me-1"></i>`
            : `<i class="bi bi-person-fill me-1"></i>`;

        const btn = `
          <button class="btn btn-sm btn-outline-primary" onclick="updateRole(${
            user.id
          }, '${newRole}')" ${isCurrent ? "disabled" : ""}>
            ${icon}Cambiar a ${newRole}
          </button>
        `;

        li.innerHTML = `
          <div>
            <strong>${user.username}</strong> (ID ${user.id}) ${badge}
          </div>
          ${btn}
        `;

        list.appendChild(li);
      });
    })
    .catch(() => {
      alert("Error al cargar usuarios.");
    });
}

function updateRole(id, newRole) {
  fetch(`/users/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Rol actualizado");
      loadUsers(); // Reload list
    })
    .catch(() => {
      alert("Error al actualizar rol");
    });
}
// Expose the function so it can be called from HTML
window.updateRole = updateRole;
