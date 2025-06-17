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
        '<div class="alert alert-success">Project created</div>';
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
          list.innerHTML = '<li class="list-group-item">No projects yet.</li>';
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
            })">View</button>
            <button class="btn btn-sm btn-warning mt-1" onclick="editProjects(${
              p.id
            })">Edit</button>
            <button class="btn btn-sm btn-danger mt-1" onclick="deleteProjects(${
              p.id
            })">Delete</button>
            <button class="btn btn-sm btn-info mt-1" onclick="viewTasks(${
              p.id
            })">Tasks</button>
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
        console.error("Could not fetch user role:", err);
      });
  }

  // Función para ver detalles
  function seeProjects(id) {
    fetch(`/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        alert(`Project: ${data.name}\nDescription: ${data.description}`);
      })
      .catch((err) => alert("Error fetching project"));
  }

  // Función para editar
  function editProjects(id) {
    const newName = prompt("New name:");
    const newDescription = prompt("New description:");

    if (!newName && !newDescription) {
      return alert("You must introduce at least one change.");
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
        alert("Project updated successfully");
        loadProjects(); // Reload list
      })
      .catch((err) => alert("Error updating project"));
  }

  // Función para eliminar
  function deleteProjects(id) {
    if (!confirm("¿Are you sure you want to delete this project?")) return;

    fetch(`/projects/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Project deleted");
        loadProjects(); // Reload list
      })
      .catch((err) => alert("Error deleting project"));
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
    button.textContent = "Manage users";

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
            repos.error || "Unexpected response"
          }</li>`;
          return;
        }

        if (repos.length === 0) {
          list.innerHTML =
            '<li class="list-group-item">No repositories found.</li>';
        } else {
          repos.forEach((repo) => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `
              <a href="${repo.html_url}" target="_blank">
                <strong>${repo.name}</strong>
              </a><br>
              <small>${repo.description || "No description"}</small>`;
            list.appendChild(li);
          });
        }
      })
      .catch((err) => {
        const list = document.getElementById("repoList");
        list.innerHTML = `<li class="list-group-item text-danger">Fetch error: ${err.message}</li>`;
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
    alert("Please enter a valid GitHub username.");
    return;
  }

  fetch("/users/github", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ githubUsername: username }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error saving GitHub username.");
      return res.json();
    })
    .then(() => {
      status.textContent = "GitHub username updated successfully.";
      status.classList.remove("d-none", "text-danger");
      status.classList.add("text-success");
    })
    .catch((err) => {
      status.textContent = "Error updating GitHub username.";
      status.classList.remove("d-none", "text-success");
      status.classList.add("text-danger");
      console.error(err);
    });
}
