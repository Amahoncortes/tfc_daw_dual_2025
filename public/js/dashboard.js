document.addEventListener("DOMContentLoaded", () => {
  // Cargar automáticamente al iniciar
  loadProjects();

  //Mostrado de roles
  verificarRol();

  // Mostrar el nombre del usuario
  fetch("/auth/status", { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(
        "welcomeMessage"
      ).textContent = `Hola, ${data.username}! 👋`;
      if (data.role === "admin") {
        showAdminButton();
      }
    });

  // Botón de logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch("/auth/logout", { method: "GET", credentials: "include" }).then(
      () => (window.location.href = "login.html")
    );
  });

  // Crear proyecto
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
        '<div class="alert alert-success">Proyecto creado</div>';
      form.reset();
      loadProjects();
    } else {
      const err = await res.json();
      alert.innerHTML = `<div class="alert alert-danger">${err.error}</div>`;
    }
  });

  // Cargar proyectos
  function loadProjects() {
    fetch("/projects", { credentials: "include" })
      .then((res) => res.json())
      .then((projects) => {
        const list = document.getElementById("projectList");
        list.innerHTML = "";
        if (projects.length === 0) {
          list.innerHTML =
            '<li class="list-group-item">No hay proyectos aún.</li>';
        } else {
          projects.forEach((p) => {
            const li = document.createElement("li");
            li.className = "list-group-item";

            // Formatear fecha
            const fecha = new Date(p.created_at);
            const dia = String(fecha.getDate()).padStart(2, "0");
            const mes = String(fecha.getMonth() + 1).padStart(2, "0");
            const anio = fecha.getFullYear();
            const hora = String(fecha.getHours()).padStart(2, "0");
            const minutos = String(fecha.getMinutes()).padStart(2, "0");
            const fechaFormateada = `${dia}/${mes}/${anio} ${hora}:${minutos}`;

            //Hora formateada
            li.innerHTML = `
            <strong>${p.name}</strong><br>
            <small>${p.description || ""}</small><br>
            <em>${fechaFormateada}</em><br>
            <button class="btn btn-sm btn-primary mt-1" onclick="seeProjects(${
              p.id
            })">Ver</button>
            <button class="btn btn-sm btn-warning mt-1" onclick="editProjects(${
              p.id
            })">Editar</button>
            <button class="btn btn-sm btn-danger mt-1" onclick="deleteProjects(${
              p.id
            })">Eliminar</button>
          `;
            list.appendChild(li);
          });
        }
      });
  }

  // Función para verificar el rol del usuario
  function verificarRol() {
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
    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevaDescripcion = prompt("Nueva descripción:");

    if (!nuevoNombre && !nuevaDescripcion) {
      return alert("Debes introducir al menos un cambio.");
    }

    fetch(`/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nuevoNombre || undefined,
        description: nuevaDescripcion || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Proyecto actualizado correctamente");
        loadProjects(); // Recargar lista
      })
      .catch((err) => alert("Error al actualizar proyecto"));
  }

  // Función para eliminar
  function deleteProjects(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?"))
      return;

    fetch(`/projects/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Proyecto eliminado");
        loadProjects(); // Recargar lista
      })
      .catch((err) => alert("Error al eliminar proyecto"));
  }

  // Mostrar botón de gestión de usuarios si es admin
  function showAdminButton() {
    const contenedor = document.getElementById("adminActions");
    const boton = document.createElement("a");

    boton.href = "handleUsers.html";
    boton.className = "btn btn-outline-primary";
    boton.textContent = "Gestionar usuarios";

    contenedor.appendChild(boton);
  }

  //Repositorio de GitHub
  document.getElementById("loadRepos").addEventListener("click", () => {
    fetch("/github/repos", { credentials: "include" })
      .then((res) => res.json())
      .then((repos) => {
        const list = document.getElementById("repoList");
        list.innerHTML = "";
        if (repos.length === 0) {
          list.innerHTML =
            '<li class="list-group-item">No se encontraron repositorios.</li>';
        } else {
          repos.forEach((repo) => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `
                    <a href="${repo.url}" target="_blank">
                      <strong>${repo.name}</strong>
                    </a><br>
                    <small>${repo.description || "Sin descripción"}</small>`;
            list.appendChild(li);
          });
        }
      });
  });

  const infoRol = document.getElementById("rolUsuario");
  infoRol.innerText = `Rol: ${data.role}`;

  // Cargar funciones en el DOM
  window.seeProjects = seeProjects;
  window.editProjects = editProjects;
  window.deleteProjects = deleteProjects;
  window.showAdminButton = showAdminButton;
});
