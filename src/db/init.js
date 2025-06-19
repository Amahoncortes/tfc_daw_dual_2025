const db = require("./database");

//Tabla de usuarios
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `);

  //Tabla de proyectos
  db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

  //Tabla de tareas
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pendiente', -- estados: pendiente, en_progreso, completada
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )`);
});

// Reiniciar contador AUTOINCREMENT de la tabla users si está vacía
db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
  if (err) {
    console.error("Error comprobando usuarios:", err.message);
  } else if (row.count === 0) {
    db.run("DELETE FROM sqlite_sequence WHERE name = 'users'", (err2) => {
      if (err2) {
        console.error("Error reiniciando contador de users:", err2.message);
      } else {
        console.log("Contador de ID de users reiniciado (vacía)");
      }
    });
  }
});
