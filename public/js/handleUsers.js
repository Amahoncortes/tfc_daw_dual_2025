// Proteger acceso: solo admins
fetch("/auth/status")
  .then((res) => res.json())
  .then((data) => {
    if (!data.isLoggedIn || data.role !== "admin") {
      window.location.href = "login.html";
    } else {
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

      users.forEach((user) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        const badge =
          user.role === "admin"
            ? `<span class="badge bg-danger ms-2"><i class="bi bi-shield-lock-fill"></i> admin</span>`
            : `<span class="badge bg-secondary ms-2"><i class="bi bi-person-fill"></i> user</span>`;

        const newRole = user.role === "admin" ? "user" : "admin";
        const icon =
          newRole === "admin"
            ? `<i class="bi bi-shield-lock-fill me-1"></i>`
            : `<i class="bi bi-person-fill me-1"></i>`;

        const btn = `
          <button class="btn btn-sm btn-outline-primary" onclick="updateRole(${user.id}, '${newRole}')">
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
      alert("Error al cargar los usuarios.");
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
      loadUsers(); // recargar la lista
    })
    .catch(() => {
      alert("Error al actualizar el rol");
    });
}
