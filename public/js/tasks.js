const projectId = new URLSearchParams(window.location.search).get("projectId");

function loadTasks() {
  const list = document.getElementById("taskList");

  // Mostrar texto de carga
  list.innerHTML = `
    <li class="list-group-item text-center text-muted">
     Loading tasks...
    </li>`;

  fetch(`/tasks/${projectId}`)
    .then((res) => res.json())
    .then((tasks) => {
      list.innerHTML = ""; // Limpiar la lista tras cargar
      if (tasks.length === 0) {
        list.innerHTML = `
          <li class="list-group-item text-center text-muted">
            No tasks yet.
          </li>`;
        return;
      }

      // Ordenar tareas: pendientes primero, luego completadas
      tasks.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === "pending" ? -1 : 1;
      });

      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
          <div>
            <strong ${
              task.status === "completada"
                ? 'style="text-decoration: line-through;"'
                : ""
            }>
              ${task.title}
            </strong><br />
            <small>${task.description || "No description"}</small><br />
            <span class="badge ${
              task.status === "completed" ? "bg-success" : "bg-secondary"
            }">${task.status}</span>
          </div>
          <div class="btn-group">
            <button onclick="toggleStatus(${task.id}, '${
          task.status
        }')" class="btn btn-sm btn-warning">
              ${task.status === "completed" ? "↩️" : "✅"}
            </button>
            <button onclick="deleteTask(${
              task.id
            })" class="btn btn-sm btn-danger">🗑️</button>
          </div>`;

        list.appendChild(li);
      });
    })
    .catch((err) => {
      list.innerHTML = `
        <li class="list-group-item text-center text-danger">
          Error loading tasks
        </li>`;
      console.error(err);
    });
}

function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === "completed" ? "pending" : "completed";

  fetch(`/tasks/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error updating task status.");
      return res.json();
    })
    .then(() => {
      showMessage(`Task marked as ${newStatus}`);
      loadTasks();
    })
    .catch((err) => {
      showMessage("Error updating task", true);
      console.error(err);
    });
}

function deleteTask(id) {
  if (!confirm("¿Remove this task?")) return;

  fetch(`/tasks/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error eliminating task.");
      return res.json();
    })
    .then(() => {
      showMessage("Task eliminated successfully");
      loadTasks(); // recargar lista
    })
    .catch((err) => {
      showMessage("Error eliminating task.", true);
      console.error(err);
    });
}

function showMessage(msg, isError = false) {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = msg;
  msgDiv.className = `alert ${isError ? "alert-danger" : "alert-success"}`;
  msgDiv.style.position = "fixed";
  msgDiv.style.top = "20px";
  msgDiv.style.right = "20px";
  msgDiv.style.zIndex = "9999";
  msgDiv.style.minWidth = "200px";
  msgDiv.style.textAlign = "center";
  document.body.appendChild(msgDiv);

  setTimeout(() => {
    msgDiv.remove();
  }, 3000);
}

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  // Validación
  if (title === "") {
    showMessage("Title cannot be empty", true);
    return;
  }

  if (title.length > 100) {
    showMessage("Title is too long (max 100 characters).", true);
    return;
  }

  const task = {
    title,
    description,
  };

  fetch(`/tasks/${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
    .then((res) => res.json())
    .then(() => {
      showMessage("Task created successfully");
      this.reset();
      loadTasks();
    })
    .catch((err) => {
      showMessage("Error creating task", true);
      console.error(err);
    });
});

loadTasks();
