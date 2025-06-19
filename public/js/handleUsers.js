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
            ? `<span class="badge ${isCurrent ? "bg-warning text-dark" : "bg-danger"} ms-2"><i class="bi bi-shield-lock-fill"></i> ${user.role}${isCurrent ? " (tú)" : ""}</span>`
            : `<span class="badge ${isCurrent ? "bg-info text-dark" : "bg-secondary"} ms-2"><i class="bi bi-person-fill"></i> ${user.role}${isCurrent ? " (tú)" : ""}</span>`;

        const newRole = user.role === "admin" ? "user" : "admin";
        const icon =
          newRole === "admin"
            ? `<i class="bi bi-shield-lock-fill me-1"></i>`
            : `<i class="bi bi-person-fill me-1"></i>`;

        const changeRoleBtn = `
          <button class="btn btn-sm btn-outline-primary me-2" onclick="updateRole(${user.id}, '${newRole}')" ${isCurrent ? "disabled" : ""}>
            ${icon}Cambiar a ${newRole}
          </button>
        `;

        const deleteBtn = isCurrent
          ? `<span class="text-muted small">No se puede eliminar</span>`
          : `<button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id}, '${user.username}')">
              <i class="bi bi-trash"></i> Eliminar
            </button>`;

        li.innerHTML = `
          <div>
            <strong>${user.username}</strong> (ID ${user.id}) ${badge}
          </div>
          <div class="d-flex align-items-center">
            ${changeRoleBtn}
            ${deleteBtn}
          </div>
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

function deleteUser(id, username) {
  if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${username}"?`)) return;

  fetch(`/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al eliminar el usuario");
      return res.json();
    })
    .then(() => {
      alert(`Usuario "${username}" eliminado.`);
      loadUsers();
    })
    .catch((err) => alert(`No se pudo eliminar el usuario: ${err.message}`));
}

// Exponer funciones globalmente
window.updateRole = updateRole;
window.deleteUser = deleteUser;
