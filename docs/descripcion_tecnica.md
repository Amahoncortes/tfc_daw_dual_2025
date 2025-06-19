
# 🧰 Descripción técnica

## 🧭 Arquitectura de la aplicación

La aplicación sigue una arquitectura en tres capas:

1. **Capa de presentación (frontend)**  
   - Tecnologías: HTML5, CSS3, JavaScript, Bootstrap  
   - Archivos: `public/index.html`, `public/js/*.js`, `public/css/style.css`  
   - Función: mostrar la interfaz del usuario, formularios, interacción visual

2. **Capa de lógica de negocio (backend)**  
   - Tecnologías: Node.js + Express  
   - Archivos: `app.js`, rutas en `src/routes`, middleware en `src/middleware`  
   - Función: gestionar sesiones, autenticar usuarios, procesar lógica de proyectos, tareas, etc.

3. **Capa de acceso a datos (persistencia)**  
   - Tecnologías: SQLite (en local), PostgreSQL (previsto para producción)  
   - Archivos: `src/db/database.js`, `database.sqlite`, `sessions.sqlite`  
   - Función: almacenar y recuperar datos (usuarios, proyectos, sesiones...)

> 🔐 Además, se implementa control de sesión con cookies y protección de rutas, asegurando el acceso restringido a vistas y endpoints.

📌 Se puede ver el diagrama de esta arquitectura en el apartado "Arquitectura del sistema" del README, o directamente en [Anteproyecto/arquitectura.png](Anteproyecto/arquitectura.png).

---

## 🧪 Tecnologías utilizadas

| Componente         | Tecnología                            |
|--------------------|---------------------------------------|
| Lenguaje backend   | Node.js                               |
| Framework backend  | Express.js                            |
| Base de datos      | SQLite (desarrollo), PostgreSQL (producción) |
| Interfaz visual    | HTML, CSS, JavaScript, Bootstrap      |
| Control de versión | Git, GitHub                           |
| API externa        | GitHub REST API v3                    |
| Entorno local      | VS Code + Live Server                 |
| Despliegue online  | Render.com                            |
