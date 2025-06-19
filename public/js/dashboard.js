document.addEventListener("DOMContentLoaded", () => {
  // Cargar automáticamente al iniciar
  loadProjects();

  //Mostrado de roles
  verifyRole();

  // Mostrar el nombre del usuario
  fetch("/auth/status", { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(
        "welcomeMessage"
      ).textContent = `Hello, ${data.username}! 👋`;

      // Precargar GitHub username si existe
      const githubInput = document.getElementById("githubUsername");
      if (githubInput && data.githubUsername) {
        githubInput.value = data.githubUsername;
      }

      if (data.role === "admin") {
        showAdminButton();
      }
    });

  // Log out button
  document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch("/auth/logout", { method: "GET", credentials: "include" }).then(
      () => (window.location.href = "login.html")
    );
  });

  // Create project
  const form = document.getElementById("projectForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("projectName").value.trim();
    const description = document
      .getElementById("projectDescription")
      .value.trim();

    const res = await fetch("/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, description }),
    });

    const alert = document.getElementById("projectAlert");
    if (res.ok) {
      alert.innerHTML =
        '<div class="alert alert-success">Proyecto creado con éxito</div>';
      form.reset();
      loadProjects();
    } else {
      const err = await res.json();
      alert.innerHTML = `<div class="alert alert-danger">${err.error}</div>`;
    }
  });

  // Load projects
  function loadProjects() {
    fetch("/projects", { credentials: "include" })
      .then((res) => res.json())
      .then((projects) => {
        const list = document.getElementById("projectList");
        list.innerHTML = "";
        if (projects.length === 0) {
          list.innerHTML = '<li class="list-group-item">No hay proyectos aún.</li>';
        } else {
          projects.forEach((p) => {
            const li = document.createElement("li");
            li.className = "list-group-item";

            // Formatear fecha
            const date = new Date(p.created_at);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const hour = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const formattedDate = `${day}/${month}/${year} ${hour}:${minutes}`;

            //Hora formateada
            li.innerHTML = `
            <strong>${p.name}</strong><br>
            <small>${p.description || ""}</small><br>
            <em>${formattedDate}</em><br>
            <button class="btn btn-sm btn-primary mt-1" onclick="seeProjects(${
              p.id
            })">Ver</button>
            <button class="btn btn-sm btn-warning mt-1" onclick="editProjects(${
              p.id
            })">Editar</button>
            <button class="btn btn-sm btn-danger mt-1" onclick="deleteProjects(${
              p.id
            })">Eliminar</button>
            <button class="btn btn-sm btn-info mt-1" onclick="viewTasks(${
              p.id
            })">Tareas</button>
          `;
            list.appendChild(li);
          });
        }
      });
  }

  // Función para verificar el rol del usuario
  function verifyRole() {
    fetch("/auth/status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const infoRol = document.getElementById("rolUsuario");
        if (infoRol && data.role) {
          infoRol.innerText = `Rol: ${data.role}`;
        }
      })
      .catch((err) => {
        console.error("No se pudo obtener el rol del usuario:", err);
      });
  }

  // Función para ver detalles
  function seeProjects(id) {
    fetch(`/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        alert(`Proyecto: ${data.name}\nDescripción: ${data.description}`);
      })
      .catch((err) => alert("Error al obtener proyecto"));
  }

  // Función para editar
  function editProjects(id) {
    const newName = prompt("Nuevo nombre:");
    const newDescription = prompt("Nueva descripción:");

    if (!newName && !newDescription) {
      return alert("Debes introducir al menos un cambio.");
    }

    fetch(`/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName || undefined,
        description: newDescription || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Proyecto actualizado con éxito");
        loadProjects(); // Reload list
      })
      .catch((err) => alert("Error al actualizar proyecto"));
  }

  // Función para eliminar
  function deleteProjects(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este proyecto?")) return;

    fetch(`/projects/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Proyecto eliminado con éxito");
        loadProjects(); // Reload list
      })
      .catch((err) => alert("Error al eliminar proyecto"));
  }

  function viewTasks(projectId) {
    window.location.href = `tasks.html?projectId=${projectId}`;
  }

  // Show user management button if admin
  function showAdminButton() {
    const container = document.getElementById("adminActions");
    const button = document.createElement("a");

    button.href = "handleUsers.html";
    button.className = "btn btn-outline-primary";
    button.textContent = "Administrar usuarios";

    container.appendChild(button);
  }

  // GitHub Repositories
  document.getElementById("loadRepos").addEventListener("click", () => {
    fetch("/github/repos", { credentials: "include" })
      .then((res) => res.json())
      .then((repos) => {
        const list = document.getElementById("repoList");
        list.innerHTML = "";

        if (!Array.isArray(repos)) {
          list.innerHTML = `<li class="list-group-item text-danger">Error: ${
            repos.error || "Respuesta inesperada"
          }</li>`;
          return;
        }

        if (repos.length === 0) {
          list.innerHTML =
            '<li class="list-group-item">No se encontraron repositorios.</li>';
        } else {
          repos.forEach((repo) => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `
              <a href="${repo.html_url}" target="_blank">
                <strong>${repo.name}</strong>
              </a><br>
              <small>${repo.description || "Sin descripción"}</small>`;
            list.appendChild(li);
          });
        }
      })
      .catch((err) => {
        const list = document.getElementById("repoList");
        list.innerHTML = `<li class="list-group-item text-danger">Error de fetch: ${err.message}</li>`;
      });
  });

  // Cargar funciones en el DOM
  window.seeProjects = seeProjects;
  window.editProjects = editProjects;
  window.deleteProjects = deleteProjects;
  window.viewTasks = viewTasks;
  window.showAdminButton = showAdminButton;
});

function updateGithubUsername() {
  const username = document.getElementById("githubUsername").value.trim();
  const status = document.getElementById("githubStatus");

  if (!username) {
    alert("Por favor, introduce un nombre de usuario de GitHub válido.");
    return;
  }

  fetch("/users/github", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ githubUsername: username }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al guardar el nombre de usuario de GitHub.");
      return res.json();
    })
    .then(() => {
      status.textContent = "Nombre de usuario de GitHub actualizado con éxito.";
      status.classList.remove("d-none", "text-danger");
      status.classList.add("text-success");
    })
    .catch((err) => {
      status.textContent = "Error al actualizar el nombre de usuario de GitHub.";
      status.classList.remove("d-none", "text-success");
      status.classList.add("text-danger");
      console.error(err);
    });
}
