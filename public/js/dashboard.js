document.addEventListener("DOMContentLoaded", () => {
  // Mostrar el nombre del usuario
  fetch("/auth/status", { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(
        "welcomeMessage"
      ).textContent = `Hola, ${data.username}! 👋`;
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
          `;
            list.appendChild(li);
          });
        }
      });
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

  // Cargar automáticamente al iniciar
  loadProjects();
});
