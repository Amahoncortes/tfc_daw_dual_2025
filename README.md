# 🚀 DevOps Hub

**DevOps Hub** es una plataforma web gratuita y ligera diseñada para pequeños equipos de desarrollo, estudiantes y desarrolladores freelance que necesitan gestionar el ciclo de vida de sus proyectos sin recurrir a herramientas pesadas como Jira o Azure DevOps.

---

## 💡 Motivación

En el contexto actual del desarrollo de software, muchas herramientas profesionales resultan excesivas o inaccesibles para proyectos individuales. **DevOps Hub** nace como una solución enfocada en la simplicidad, funcionalidad esencial y facilidad de uso.

---

## 🎯 Objetivos y funcionalidades previstas

Este proyecto se ha desarrollado siguiendo los objetivos definidos en el anteproyecto:

- [x] **HU1**: Registro e inicio de sesión de usuarios.
Se pretende demostrar que: un usuario puede registrar su cuenta y hacer login con la misma

## 📺 Demostracion en vídeo
- [HU1 - Registro e inicio de sesión](https://github.com/Amahoncortes/tfc_daw_dual_2025/releases/tag/v1.0-hu1)

- [x] **HU2**: Creación de nuevos proyectos desde la plataforma.
Se pretende demostrar que: 
- Un usuario autenticado puede acceder al formulario de creación de proyecto.
- El formulario permite introducir nombre y descripción del proyecto.
- Que al enviarlo, el nuevo proyecto queda registrado correctamente en la base de datos.
- Que se ve reflejado inmediatamente en el dashboard.
- [HU2 - Crear nuevos proyectos](https://github.com/Amahoncortes/tfc_daw_dual_2025/releases/tag/v1.1-hu2)
 
- [x] **HU3**: Visualización de los proyectos personales en el dashboard.
Se pretende demostrar que:
- Al iniciar sesión, el usuario accede a un dashboard o pantalla principal.
- En dicho dashboard se muestra una lista de proyectos creados por ese usuario.
- La visualización es clara y muestra nombre, descripción y cualquier otro dato relevante.
- El nuevo proyecto creado en la HU2 también se muestra en esta vista.
- [HU3 - Visualización de proyectos en el dashboard](https://github.com/Amahoncortes/tfc_daw_dual_2025/releases/tag/v1.2-hu3)

- [x] **HU4**: Conexión con GitHub para mostrar repositorios públicos.
Se pretende demostrar que:
- El usuario puede introducir su nombre de usuario de GitHub en algún formulario, campo o input.
- Al hacerlo, la app consulta la API pública de GitHub y muestra una lista de repositorios públicos.
- Los repositorios mostrados corresponden al usuario introducido.
- [HU4 - Visualización de repositorios de GitHub](https://github.com/Amahoncortes/tfc_daw_dual_2025/releases/tag/v1.3-hu4)

- [x] **HU5**: Validación de datos y protección contra accesos no autorizados.
Se pretende demostrar que:
- El usuario intenta registrarse o loguearse con campos vacíos y no se le permite.
- El usuario introduce datos inválidos (por ejemplo, muy cortos) y recibe mensaje de error
- Se han usado consultas parametrizadas para prevenir inyecciones SQL (mostrar en el código, por ejemplo en auth.js para el autenticado de usuario.)
- El usuario no puede acceder al dashboard sin estar logueado (devops-hub/public/js/protectDashboard.js)
- Si accede manualmente por URL sin sesión, es redirigido o bloqueado
- El backend verifica que haya sesión activa antes de responder a rutas sensibles
- [HU5 - Seguridad y validaciones](https://github.com/Amahoncortes/tfc_daw_dual_2025/releases/tag/v1.4-hu5)

---

## 🧠 Decisiones de diseño

- **Node.js + Express**: Ligero y eficiente para construir APIs REST.
- **SQLite**: Permite desarrollo local sin necesidad de configurar un servidor.
- **Bootstrap**: Acelera la maquetación con diseño responsive.
- **API GitHub**: Permite integración externa sin necesidad de OAuth.

---

## 🧩 Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Creación y visualización de proyectos personales
- Conexión con GitHub para listar repositorios públicos
- Almacenamiento de datos en base de datos local (SQLite)
- Validación de formularios y consultas parametrizadas para seguridad

---

## 🛠 Tecnologías utilizadas

| Capa                 | Tecnología                                              |
| -------------------- | ------------------------------------------------------- |
| Presentación         | HTML, CSS, JavaScript, Bootstrap                        |
| Lógica de negocio    | Node.js, Express.js                                     |
| Persistencia         | SQLite (en local) / PostgreSQL (producción recomendado) |
| Control de versiones | Git, GitHub                                             |
| API externa          | GitHub REST API v3                                      |

---

## 🔌 API REST (ejemplo de endpoint)

### `POST /login`

Autenticar a un usuario con credenciales.

**Parámetros (body JSON):**

```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Respuesta exitosa:**

```json
{
  "message": "Login successful",
  "userId": 1
}
```

**Errores comunes:**

- 400: Campos vacíos
- 401: Credenciales incorrectas

---

## 🧪 Instrucciones para levantar el proyecto en local

1. Clonar el repositorio:

```bash
git clone https://github.com/Amahoncortes/tfc_daw_dual_2025/
cd devops-hub
```

2. Instalar las dependencias:

```bash
npm install
```

3. Arrancar el servidor backend:

```bash
npm run dev
```

4. Abrir el archivo `public/index.html` en el navegador (utilicé Live Server para refresco de pantalla automático).

---

## ☁️ Despliegue en producción (Render)

1. Subir el proyecto a GitHub.
2. Crear cuenta en [Render](https://render.com/).
3. Crear un nuevo servicio de tipo Web Service con Node.js.
4. Configurar:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - Variables de entorno si fueran necesarias
5. Obtengo un dominio: https://devops-hub.onrender.com

---

## 🧭 Arquitectura del sistema

El sistema sigue una arquitectura en tres capas (presentación, lógica de negocio y acceso a datos).

![Diagrama de arquitectura](docs/Anteproyecto/arquitectura.png)

---

## 🧱 Estructura del proyecto

```
├── app.js
├── package.json
├── package-lock.json
├── .env                # (no incluido en el repo)
├── README.md
├── public/
│   ├── index.html
│   ├── dashboard.html
│   ├── login.html
│   ├── register.html
│   ├── tasks.html
│   ├── handleUsers.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── checkSession.js
│       ├── dashboard.js
│       ├── handleUsers.js
│       ├── protectDashboard.js
│       ├── register.js
│       └── tasks.js
├── src/
│   ├── db/
│   │   ├── database.js
│   │   ├── database.sqlite
│   │   ├── sessions.sqlite
│   │   └── init.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── users.js
│   └── routes/
│       ├── auth/
│       │   └── login.js
│       ├── github/
│       │   └── repos.js
│       ├── project.js
│       ├── tasks.js
│       └── users.js
├── docs/
│   └── Anteproyecto/
│       ├── arquitectura.png
│       └── Versión_definitiva_anteproyecto.pdf
│
├── .env (no incluido en el repo)
└── README.md
```

---

## 🔐 Seguridad aplicada

- Validación de formularios en cliente y servidor
- Consultas SQL parametrizadas para evitar inyecciones
- Control de sesión básica con cookies

---

## 🔄 Mejoras respecto al anteproyecto

Aunque este proyecto se ha basado en una planificación previa recogida en el anteproyecto definitivo, durante el desarrollo real surgieron nuevas ideas y necesidades que me llevaron a implementar algunas funcionalidades extra no contempladas inicialmente. Estas mejoras reflejan un proceso iterativo auténtico, donde fui adaptando y ampliando el alcance según la evolución del trabajo.

### ✅ Funcionalidades añadidas durante el desarrollo:

- **Gestión de sesiones:** añadí un control de sesión para que los usuarios no tuvieran que iniciar sesión constantemente. También protegí el acceso al dashboard con scripts como `checkSession.js` y `protectDashboard.js`.

- **Página de gestión de usuarios:** implementé una vista específica (`handleUsers.html`) con su lógica para listar y gestionar usuarios. No estaba prevista en el anteproyecto pero resultó útil durante las pruebas.

- **CRUD de tareas:** desarrollé una funcionalidad completa para crear, listar y eliminar tareas. Incluye su propia ruta en el backend y página HTML dedicada. No estaba planteada originalmente pero fue una buena forma de ampliar el sistema y probar nuevas rutas.

- **Modularización del backend:** organicé mejor el backend separando rutas por módulos (`auth`, `github`, `users`, `tasks`) y utilizando middleware personalizado para validar accesos. Esto mejoró mucho la claridad del código.

- **Base de datos de sesiones independiente:** además de la base de datos principal, añadí un fichero `sessions.sqlite` para gestionar las sesiones de forma más limpia y separada.

- **Documentación de la API:** incluí un ejemplo de documentación de endpoints en el README y tengo la intención de extenderlo más adelante si amplío el sistema.

- **Imagen de arquitectura técnica:** elaboré un diagrama visual de las tres capas (frontend, lógica, datos) para acompañar la defensa y explicar mejor cómo está estructurado todo.

---

## ✅ Justificación de objetivos alcanzados

Las cinco historias de usuario comprometidas en el anteproyecto han sido desarrolladas e implementadas correctamente. Todas ellas están demostradas en los vídeos enlazados en este README. Además, el proyecto ha evolucionado con mejoras adicionales que no estaban previstas inicialmente pero que enriquecen su funcionalidad.

No queda ningún objetivo sin cumplir.

## 📎 Documentación adicional

- [Anteproyecto completo (PDF)](docs/Anteproyecto/Versión_definitiva_anteproyecto.pdf)

- ### 📦 Diagrama de componentes
[Diagrama de componentes](docs/Anteproyecto/Diagramas/diagrama_componentes.png)

---

---

## 🔄 Metodología de desarrollo y flujo de trabajo en GitHub (sin invents)

Durante el desarrollo de este proyecto no seguí ninguna metodología formal, dado que no conozco prácticamente ninguna lo suficiente todavía. Además, trabajé de forma completamente individual. Sin embargo, sí que traté de organizarme siguiendo un enfoque iterativo e incremental, tal como proponía el ejemplo de anteproyecto enviado por nuestro tutor, por el cual me guié a la hora de hacer este desarrollo.

Mi flujo de trabajo en GitHub fue el siguiente:

- Creé una rama `main` que sirvió como rama principal para almacenar el código que iba funcionando de forma estable.
- A medida que iba creando funcionalidades para el proyecto, las he subido cada una en una rama feature/ específica para cada característica en un intento de organizarme. También he tenido que arreglar algunos errores en ramas bugfix/ , como cuando por equivocación hice que la aplicación me obligase a tener la sesión
iniciada para poder acceder a la página de inicio de sesión.
- Dichas ramas, incluida, como es lógico, main, contienen numerosso commits con mensajes descriptivos que reflejan bien cada cambio (por ejemplo: `feat: integración con GitHub`, `fix: validación de formulario de login`, `docs: actualizar README con mejoras`). como punto a mejorar, a veces he hecho commits con tantos cambios sin darme cuenta que era imposible hacer un commit lo suficientemente específico y he recurrido a generalizaciones, lo cual no está del todo bien.
- Fui subiendo cambios conforme terminaba cada historia de usuario.
- Usé los *GitHub Releases* para organizar y adjuntar las demostraciones en vídeo, uno por cada historia de usuario completada.

En resumen, aunque el desarrollo fue individual, traté de mantener un control de versiones limpio, documentado y relacionado directamente con las funcionalidades implementadas.

## 🔄 Diagramas de Gantt inicial (estimación de tiempos) y final (tiempos reales basados en commits del repositorio de GitHub)
[Diagrama de Gantt_inicial](docs/Anteproyecto/Diagramas/Diagrama_Gantt_inicial.jpg)
[Diagrama de Gantt_final](docs/Anteproyecto/Diagramas/Diagrama%20de%20Gantt_final.png)

## 📊 Justificación de las diferencias en las estimaciones

Al comparar el cronograma planificado con los tiempos reales extraídos del historial de commits, hay diferencias bastante evidentes en algunas
fases del proyecto respecto a la previsión original.
A continuación, hago una explicación de las diferencias por fases y tareas:

### ✅ Coincidencias destacables

- La **fase de inicio** la cumplí ajustada al plan: entre el 18 y 19 de mayo definí el MVP, analicé los requisitos necesarios para el proyecto, y organicé la estructura inicial del proyecto en Express con SQLite.
- La **fase de transición**, centrada en las pruebas y documentación final, también la hice según lo previsto: los vídeos y el README final se prepararon del 15 al 18 de junio.

### ⚠️ Desviaciones y causas detalladas

#### 🟧 Fase de construcción – Iteración 2 (Gestión de proyectos) 

**Planificada para una semana, me llevó casi tres.** Las razones son las siguientes:

- **Problemas de sesiones:** Al principio del desarrollo, las rutas protegidas como el dashboard redirigían incluso a usuarios ya logueados, permitiendo cosas
como que un usuario pudiera hacer doble login (es decir, al darle al iniciar sesión, el usuario se autenticaba y registraba el inicio de sesión, pero luego me permitía volver a intentarlo en lugar de redirigirme al dashboard). Esto ocurría porque no me estaba guardando bien las sesiones de usuario en sqlite. Tuve que modificar `isAuthenticated` en `src/middleware/auth.js` y crear middlewares específicos para proteger y evitar dobles login o logouts. Esto implicó rediseñar parte del control de sesión, e introducir `express-session` junto con `connect-sqlite3` para que empezasen a persistirse las sesiones. (commits 19-20 de mayo).

- **Estado inconsistente entre frontend y backend:** al modificar datos del proyecto, en algunas ocasiones se reflejaban incorrectamente en la vista. Descubrí que estaba accediendo al DOM antes de que el `fetch` devolviera la respuesta, lo que me obligó a introducir `async/await` y redibujar dinámicamente las listas con `innerHTML` una vez obtenidos los datos.


- **Estructura duplicada de rutas:** Al principio, la lógica de creación, listado y eliminación de proyectos se me quedó desperdigada por diferentes archivos
y mezclada con la gestión de usuarios, lo que me dificultó el desarrollo de partes posteriores de la aplicación. Por ejemplo, algunas funciones del CRUD de projects
las tenía directamente en app.js, o en users.js. Lo que hice para resolver esto fue hacer un archivo en la carpeta de rutas , y empezar a separarlas por 
dominios funcionales. Con dominio funcional me refiero a clasificarlas en una estructura modular de acuerdo a las tareas que realiza cada una: routes/ para los endpoints, middleware/ para las validaciones de acceso, y db/ para la conexión y creación de base de datos (init.js, database.js). Esto me permitió mejorar mi propio entendimiento de lo que estaba desarrollando al tener que estructurarlo mejor, con coherencia y un sentido, y fue útil para prevenir repeticiones de código.

- **Errores al guardar datos:** Hubo un punto en el que SQLite me estaba permitiendo insertar algunos proyectos sin título, o sin ID de usuarios. Esto lo solucioné añadiendo validaciones al front, como el tag required a la hora de introducir el nombre del proyecto. En el lado del servidor, en el endpoint de creación del proyecto, validé que los campos username e id existiesen y tuviesen contenido.

- **Problemas visuales en el dashboard:**: Al crear un nuevo proyecto desde el formulario, se añadía correctamente a la base de datos, pero no se me actualizaba la lista en pantalla. Al principio, la lógica del código de cargar los proyectos estaba dentro del DOMContentLoaded del dashboard.js sin encapsular. Así que la moví 
a una función loadProjects con la idea de reutilizarla cuando fuese necesario, como al crear un proyecto, o después de editarlo o borrarlo.

- **TLDR: Esta fase se alargó porque tuve que corregir múltiples errores debido a mi inexperiencia a la hora de programar la lógica de la aplicación**, y cada error me forzaba a rehacer parte del código para mantenerlo estable.

---

🟩 Fase de elaboración – Iteración 2 (Prueba de concepto)
- **Persistencia de sesión:** Aunque al principio parecía que las sesiones funcionaban, noté que podía loguearme varias veces seguidas sin perder la sesión anterior, o incluso acceder al dashboard sin estar autenticado en ciertas condiciones. Esto se debía a que no estaba guardando las sesiones correctamente en disco, y se perdían tras reiniciar el servidor. Para solucionarlo, implementé express-session con connect-sqlite3 como store persistente, y modifiqué los middlewares isAuthenticated, preventLoginifAuthenticated y isAdmin para gestionar bien los accesos.

-**Redirección automática y bloqueo de rutas:** Tuve que reestructurar el sistema para que, al iniciar sesión, se redirigiera automáticamente al dashboard si el login era correcto, y que este no fuese accesible directamente desde la URL si no había sesión activa. Esto implicó revisar la lógica de frontend y backend para unificar el comportamiento de acceso.

-**Feedback visual tras login:** Al principio, si el login fallaba o se hacía correctamente, no se mostraban mensajes claros al usuario. Añadí mensajes dinámicos tanto en éxito como en error (por ejemplo: “Login successful” o “Wrong credentials”), con estilos de alerta de Bootstrap, para que el usuario supiera qué estaba ocurriendo.

-**Visualización de usuario conectado:** Implementé la funcionalidad para que, una vez logueado, se mostrara el nombre del usuario en el frontend (con welcomeMessage) y también su rol (admin o user). Esto me obligó a crear un endpoint /auth/status que devolviese esta información y adaptarlo para que incluyera también el username de GitHub si estaba almacenado.

TLDR: Esta iteración se alargó más de lo previsto porque tuve que rehacer casi todo el sistema de control de sesión desde cero para evitar accesos indebidos y mostrar bien la información tras login.
---

🟦 Fase de construcción – Iteración 3 (Integración con GitHub)
- **Problemas con CORS:**
Al principio, intenté hacer directamente desde el frontend un fetch() a la URL pública de GitHub (https://api.github.com/users/{username}/repos). Esto funcionaba en local, pero al desplegar o probar en navegadores con políticas más estrictas, el navegador bloqueaba la solicitud por política de Cross-Origin Resource Sharing (CORS).
Para solucionarlo, creé una ruta en el backend GET /github/repos, que recibe la petición desde el cliente, obtiene el username del usuario logueado (desde req.session) y luego hace la petición HTTP a GitHub desde el propio servidor utilizando node-fetch. Esto evitó completamente el problema de CORS, ya que la comunicación era backend-backend.

-**Errores no tratados (usuario inválido o username no registrado):**
En una primera versión, si el usuario no había introducido aún su GitHub username, el sistema seguía intentando hacer fetch a una URL inválida, lo que resultaba en errores silenciosos o en un listado vacío que confundía.
Añadí una validación en la ruta /github/repos para verificar que req.session.githubUsername existiera antes de hacer la petición. En caso contrario, devolvía un 400 con { error: "GitHub username not set" }.
También añadí manejo de errores en caso de que GitHub devolviese un error (por ejemplo, 404 si el usuario no existía). En el frontend, capturo ese error y muestro un mensaje en pantalla (list.innerHTML = 'No repositories found' o un mensaje de error si ocurre otra cosa).

-**Precarga del GitHub username en el formulario del dashboard:**
Modifiqué el endpoint /auth/status para que, además de devolver username y role, devolviese también githubUsername. Esto me permitió, en dashboard.js, detectar si el usuario ya tenía ese dato guardado en sesión y, en caso afirmativo, precargarlo directamente en el campo del formulario HTML (input#githubUsername).
Además, creé el endpoint PUT /users/github que actualiza el campo githubUsername en la base de datos. Este endpoint verifica que:
-El usuario esté autenticado (req.session.userId).
-El campo githubUsername exista y no esté vacío.
-No se intente sobrescribir el username con valores null o undefined.

-**Cambios en la base de datos y modelo de usuario:**
Para almacenar este dato, modifiqué la base de datos añadiendo una nueva columna github_username a la tabla users. Para mantener la compatibilidad, usé un ALTER TABLE si ya había datos cargados en desarrollo. Esta columna se usa para:
Precargar el valor en el frontend tras el login.
Guardar el valor enviado desde el formulario al actualizarlo.

-**Cambios en el frontend (dashboard.js)**:
Añadí la lógica para precargar el campo si data.githubUsername existe en la respuesta del endpoint /auth/status.
Añadí un PUT que se activa al pulsar el botón "Actualizar GitHub username", con validación previa de que el campo no esté vacío.
Añadí feedback dinámico: mensajes de éxito o error justo debajo del formulario, con estilos Bootstrap (alert-success o alert-danger), usando el elemento #githubStatus.

-**Clockify**
- [Clockify](docs/Anteproyecto/Diagramas/Clockify.png)

⏱️ **Análisis y justificación del tiempo invertido**
A lo largo del desarrollo del proyecto DevOps Hub, invertí aproximadamente 39 horas y 30 minutos, distribuidas en tareas registradas mediante Clockify. Aunque algunas fases se ajustaron bastante bien a lo estimado en el Gantt inicial, otras se extendieron más de lo previsto debido a la complejidad técnica o a mi proceso de aprendizaje. A continuación, detallo los principales bloques de trabajo:

🔹 MVP y definición (1h)
Esta fase fue breve porque ya tenía una idea clara desde el anteproyecto. Me centré en dejar clara la propuesta, definir las funcionalidades base y pensar en una arquitectura sencilla.

🔹 Requisitos y diseño técnico (1h 30m)
Analicé qué endpoints necesitaría, cómo dividir el backend, y qué partes del frontend harían falta. Esta tarea fue clave para organizarme aunque no dejara código escrito todavía.

🔹 Arquitectura base (3h)
Aquí dediqué tiempo a estructurar carpetas, configurar Express, SQLite y sessions. Lo que más me costó fue entender cómo persistir correctamente las sesiones en disco y proteger las rutas.

🔹 Autenticación (4h)
Aunque el login/logout básico fue rápido, se me complicó la gestión de sesiones y el control de acceso. Implementé varios middlewares para roles y protección de rutas, y eso me llevó más tiempo del esperado.

🔹 CRUD de proyectos (18h)
Este fue el bloque más largo. Al principio tenía el código duplicado o mal estructurado, lo que me obligó a reorganizar las rutas (project.js), modularizar el código y encapsular funciones como loadProjects() en el frontend. También invertí bastante tiempo en los botones de edición y borrado, en el formateo de fechas y en el diseño visual del dashboard.

🔹 Integración con GitHub (1h)
Parecía algo pequeño, pero tuve que añadir un endpoint intermediario en el backend por problemas de CORS, manejar errores como usuarios inexistentes, y añadir la precarga del GitHub username desde sesión. En total, fue más costoso de lo previsto.

🔹 Documentación y vídeos (2h)
Redactar el README y grabar los vídeos me llevó menos tiempo porque ya tenía el guión claro, y fui escribiendo documentación durante el desarrollo. Aun así, revisé todo varias veces para que el resultado final quedara claro, profesional y útil para la defensa.

🔹 Pruebas finales (2h)
Incluyen validaciones del flujo completo, repaso del login, redirecciones, errores de formulario y prueba de funcionalidades clave como roles o tareas. Aproveché para limpiar console.logs y mensajes irrelevantes.


## Presupuesto estimado para comprador

## 💰 Presupuesto estimado para comprador: Costes por fase del ciclo de vida

| Recurso / Fase                    | Inicio | Elaboración | Construcción | Transición | Total (€) | Detalles                                                                  |
|-----------------------------------|--------|-------------|--------------|------------|-----------|--------------------------------------------------------------------------|
| 💻 Equipo informático             | 0 €    | 0 €         | 0 €          | 0 €        | 0 €       | Ordenador personal (amortizado previamente)                              |
| 🧠 Coste de trabajo (12 €/h)      | 36 €   | 96 €        | 240 €        | 36 €       | 408 €     | Basado en Clockify real: 3h/Inicio, 8h/Elaboración, 20h/Construcción...  |
| ⚡ Electricidad (0,30 €/h aprox.) | 1 €    | 3 €         | 6 €          | 1 €        | 11 €      | Estimación por consumo medio del equipo                                  |
| 🌐 Internet                       | 2 €    | 2 €         | 3 €          | 1 €        | 8 €       | Parte proporcional del mes (tarifa mensual dividida entre fases)         |
| 🧰 Software libre                 | 0 €    | 0 €         | 0 €          | 0 €        | 0 €       | VS Code, Node.js, SQLite, DB Browser, GitHub... (todos gratuitos)        |
| 📚 Herramientas de documentación | 0 €    | 0 €         | 0 €          | 0 €        | 0 €       | LibreOffice, draw.io (gratuitos)                                         |

---

### 📊 Total estimado: **427 €**

> **Amortización software**: No hay coste directo, ya que toda la pila de tecnologías empleada (Node.js, Express, SQLite, GitHub, Bootstrap, DB Browser, etc.) es de uso libre o gratuito, tanto en entorno de desarrollo como en despliegue (Render gratuito). Por tanto, su "amortización" se refleja en el valor del tiempo dedicado en cada fase.



## 🧠 Conclusiones

### a. Posibles mejoras

Aunque el proyecto cumple todos los objetivos definidos en el anteproyecto, hay margen para mejoras y nuevas funcionalidades. Algunas ideas que me planteo implementar en el futuro son:

- **Historial de cambios**: Añadir un log de actividad para cada proyecto, registrando acciones realizadas por los usuarios (ediciones, borrados, etc.).
- **Subida de archivos**: Permitir añadir documentos o imágenes a los proyectos, por ejemplo, documentación adicional o recursos del equipo.
- **Estadísticas**: Visualización de datos sobre proyectos creados, tareas completadas, tiempo invertido, etc.
- **Modo demo sin login**: Versión pública donde se pueda interactuar con la app sin necesidad de registrarse, útil para mostrar sin comprometer datos reales.
- **Tests automáticos**: Integrar pruebas unitarias y de integración para garantizar mayor estabilidad.
- **Mejoras visuales**: Uso de animaciones suaves, nuevos iconos y refuerzo de accesibilidad visual.
- **Roles avanzados**: Separación más granular de permisos (por ejemplo, editor, lector, administrador).

---

### b. Principales dificultades encontradas

Durante el desarrollo real del proyecto me enfrenté a varias dificultades técnicas y organizativas. Las más relevantes fueron:

- **Gestión de sesiones y autenticación**: Me costó entender bien cómo almacenar las sesiones de forma persistente con `express-session` y `connect-sqlite3`. Al principio permitía dobles login, redirecciones incorrectas y pérdidas de sesión al reiniciar el servidor.

- **Organización de rutas**: Al comienzo tenía código mezclado en `app.js` y otros módulos poco cohesionados. Reorganicé el backend en `routes/`, `middleware/` y `db/` para mantener una estructura limpia y modular, lo cual fue clave para no perderme a medida que crecía el código.

- **Validaciones de formularios**: SQLite permitía insertar registros vacíos. Tuve que añadir validaciones en frontend (`required`) y en backend (comprobación de que el `userId` proviene de una sesión activa y que el nombre no esté vacío).

- **Problemas visuales en el dashboard**: Al crear un proyecto, la lista no se actualizaba. Moví la lógica de carga a una función `loadProjects()` reutilizable, lo cual resolvió el problema.

- **Integración con GitHub**: El fetch desde frontend a la API de GitHub fallaba por CORS. Tuve que crear una ruta backend que actuara como proxy, y además gestionar errores como usuarios inexistentes o campos vacíos. También añadí precarga del username guardado desde backend al frontend.

- **Curva de aprendizaje**: Al desarrollar de forma completamente individual, hubo muchas veces en las que me encontraba bloqueado con errores pequeños que me costaban horas por falta de experiencia. Aun así, cada obstáculo fue una oportunidad de aprendizaje real.

---

En resumen, he ganado soltura en Node.js, comprensión del ciclo de vida de una aplicación y capacidad para organizar un desarrollo completo por fases, desde cero hasta el despliegue.


## 📚 Bibliografía / Recursos
- [MDN Web Docs](https://developer.mozilla.org/es/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [SQLite](https://www.sqlite.org/docs.html)
- [GitHub REST API](https://docs.github.com/es/rest)