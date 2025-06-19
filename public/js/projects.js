document.addEventListener("DOMContentLoaded", () => {
  loadProjects();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch("/auth/logout", { method: "GET", credentials: "include" }).then(() => {
      window.location.href = "login.html";
    });
  });

  const form = document.getElementById("projectForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("projectName").value.trim();
    const description = document.getElementById("projectDescription").value.trim();

    const res = await fetch("/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, description }),
    });

    const alert = document.getElementById("projectAlert");
    if (res.ok) {
      alert.innerHTML = '<div class="alert alert-success">Proyecto creado con éxito</div>';
      form.reset();
      loadProjects();
    } else {
      const err = await res.json();
      alert.innerHTML = `<div class="alert alert-danger">${err.error}</div>`;
    }
  });

  window.seeProjects = seeProjects;
  window.editProjects = editProjects;
  window.deleteProjects = deleteProjects;
  window.viewTasks = viewTasks;
});

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

          const date = new Date(p.created_at);
          const formattedDate = date.toLocaleString("es-ES");

          li.innerHTML = `
            <strong>${p.name}</strong><br>
            <small>${p.description || ""}</small><br>
            <em>${formattedDate}</em><br>
            <button class="btn btn-sm btn-primary mt-1" onclick="seeProjects(${p.id})">Ver</button>
            <button class="btn btn-sm btn-warning mt-1" onclick="editProjects(${p.id})">Editar</button>
            <button class="btn btn-sm btn-danger mt-1" onclick="deleteProjects(${p.id})">Eliminar</button>
            <button class="btn btn-sm btn-info mt-1" onclick="viewTasks(${p.id})">Tareas</button>
          `;
          list.appendChild(li);
        });
      }
    });
}

function seeProjects(id) {
  fetch(`/projects/${id}`)
    .then((res) => res.json())
    .then((data) => {
      alert(`Proyecto: ${data.name}\nDescripción: ${data.description}`);
    })
    .catch(() => alert("Error al obtener proyecto"));
}

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
    .then(() => {
      alert("Proyecto actualizado con éxito");
      loadProjects();
    })
    .catch(() => alert("Error al actualizar proyecto"));
}

function deleteProjects(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este proyecto?")) return;

  fetch(`/projects/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      alert("Proyecto eliminado con éxito");
      loadProjects();
    })
    .catch(() => alert("Error al eliminar proyecto"));
}

function viewTasks(projectId) {
  window.location.href = `tasks.html?projectId=${projectId}`;
}
