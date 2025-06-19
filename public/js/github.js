document.addEventListener("DOMContentLoaded", () => {
  // Precargar GitHub username si existe
  fetch("/auth/status", { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      const input = document.getElementById("githubUsername");
      if (input && data.githubUsername) {
        input.value = data.githubUsername;
      }
    });

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("/auth/logout", { method: "GET", credentials: "include" }).then(() => {
        window.location.href = "login.html";
      });
    });
  }

  // Cargar repos
  const loadReposBtn = document.getElementById("loadRepos");
  if (loadReposBtn) {
    loadReposBtn.addEventListener("click", () => {
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
            list.innerHTML = '<li class="list-group-item">No se encontraron repositorios.</li>';
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
  }

  // Exponer globalmente
  window.updateGithubUsername = updateGithubUsername;
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
