// Mostrar el nombre del usuario
fetch('/auth/status', { credentials: 'include' })
  .then(res => res.json())
  .then(data => {
    document.getElementById('welcomeMessage').textContent = `Hola, ${data.username}! 👋`;
  });

// Botón de logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  fetch('/auth/logout', { method: 'GET', credentials: 'include' })
    .then(() => window.location.href = 'login.html');
});

// Crear proyecto
const form = document.getElementById('projectForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('projectName').value.trim();
  const description = document.getElementById('projectDescription').value.trim();

  const res = await fetch('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, description })
  });

  const alert = document.getElementById('projectAlert');
  if (res.ok) {
    alert.innerHTML = '<div class="alert alert-success">Proyecto creado</div>';
    form.reset();
    loadProjects();
  } else {
    const err = await res.json();
    alert.innerHTML = `<div class="alert alert-danger">${err.error}</div>`;
  }
});

// Cargar proyectos
function loadProjects() {
  fetch('/projects', { credentials: 'include' })
    .then(res => res.json())
    .then(projects => {
      const list = document.getElementById('projectList');
      list.innerHTML = '';
      if (projects.length === 0) {
        list.innerHTML = '<li class="list-group-item">No hay proyectos aún.</li>';
      } else {
        projects.forEach(p => {
          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.innerHTML = `<strong>${p.name}</strong><br><small>${p.description || ''}</small><br><em>${new Date(p.created_at).toLocaleString()}</em>`;
          list.appendChild(li);
        });
      }
    });
}

// Cargar automáticamente al iniciar
loadProjects();
