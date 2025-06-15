const projectId = new URLSearchParams(window.location.search).get("projectId");

function loadTasks() {
  fetch(`/tasks/${projectId}`)
    .then((res) => res.json())
    .then((tasks) => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
          <div>
            <strong>${task.title}</strong><br />
            <small>${task.description || "Sin descripción"}</small><br />
            <span class="badge bg-secondary">${task.status}</span>
          </div>
          <div>
            <button onclick="deleteTask(${
              task.id
            })" class="btn btn-sm btn-danger">Eliminar</button>
          </div>`;
        list.appendChild(li);
      });
    });
}

function deleteTask(id) {
  if (!confirm("¿Eliminar esta tarea?")) return;
  fetch(`/tasks/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then(() => loadTasks());
}

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  fetch(`/tasks/${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  })
    .then((res) => res.json())
    .then(() => {
      this.reset();
      loadTasks();
    });
});

loadTasks();
