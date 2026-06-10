# GeoMundo

GeoMundo es una aplicación educativa de geometría organizada como monorepo. El proyecto reúne una API en Node.js con TypeScript y un frontend en Vue 3 para que estudiantes puedan seleccionar temas, realizar actividades y guardar sus calificaciones en una base de datos MySQL.

## Estado actual

El proyecto ya cuenta con una base funcional para trabajar en equipo:

- Monorepo en la raíz del proyecto con `backend/`, `frontend/` y `scripts/`.
- Workspaces de npm para ejecutar comandos desde la raíz.
- Backend conectado a MySQL con TypeORM.
- Frontend en Vue 3 con rutas para bienvenida, selección de tema, actividad, retroalimentación y calificación.
- Endpoint de guardado de calificaciones: `POST /api/sesiones/calificacion`.
- Pruebas unitarias del backend con Vitest.
- Pruebas de integración para validar el guardado de sesiones.
- Prueba de contenido que crea temas, actividades, sesiones y verifica registros en MySQL.

## Estructura del proyecto

```text
GeoMundo/
├─ backend/                 API, entidades, controladores, servicios y SQL local
├─ frontend/                Aplicación Vue 3 + Vite
├─ scripts/                 Scripts de prueba e inicialización de contenido
├─ package.json             Scripts raíz y workspaces
├─ package-lock.json        Dependencias del monorepo
└─ README.md                Guía principal del proyecto
```

## Tecnologías

- Backend: Node.js, TypeScript, Express, TypeORM, MySQL, Vitest.
- Frontend: Vue 3, Vite, TypeScript, Pinia, Vue Router, Tailwind CSS, DaisyUI.
- Herramientas: npm workspaces, Git, scripts Node.js.

## Requisitos

Antes de instalar el proyecto, asegúrate de tener:

- Node.js compatible con Vite. El frontend indica `^20.19.0 || >=22.12.0`.
- npm.
- MySQL instalado y en ejecución.
- Git.

## Instalación

Desde la carpeta raíz del proyecto:

```powershell
npm install
```

Este comando instala las dependencias del monorepo y de los workspaces.

## Configuración de la base de datos

El backend usa las variables de `backend/.env`. Primero crea el archivo local:

```powershell
Copy-Item backend\.env.example backend\.env
```

El archivo debe quedar similar a esto:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=geomundo_app
DB_PASS=Geo2026@
DB_NAME=geomundo
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Luego crea la base de datos y el usuario local ejecutando el script:

```powershell
mysql -u root -p < backend\sql\setup-local-mysql.sql
```

También puedes ejecutar ese archivo desde MySQL Workbench. La guía detallada está en `backend/LOCAL-SETUP.md`.

Importante: `backend/.env` es privado y no debe subirse al repositorio.

## Ejecución local

Abre dos terminales desde la raíz del proyecto.

Terminal 1, backend:

```powershell
npm run dev:backend
```

Terminal 2, frontend:

```powershell
npm run dev:frontend
```

URLs esperadas:

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`

El frontend envía las llamadas a `/api` y Vite las redirige al backend mediante proxy.

## Endpoints principales

| Método | Ruta | Uso |
| --- | --- | --- |
| `GET` | `/api/temas` | Lista los temas disponibles |
| `GET` | `/api/temas/:id` | Consulta un tema por ID |
| `POST` | `/api/temas` | Crea un tema |
| `GET` | `/api/actividades/:temaId` | Lista actividades de un tema |
| `POST` | `/api/actividades` | Crea una actividad |
| `GET` | `/api/preguntas/:actividadId` | Lista preguntas de una actividad |
| `POST` | `/api/preguntas` | Crea una pregunta |
| `POST` | `/api/sesiones/calificacion` | Guarda una sesión de calificación |

Payload mínimo para guardar una calificación:

```json
{
  "estudiante": "Ana",
  "tema": "Figuras planas",
  "actividad": "Detecta la figura correcta",
  "puntaje": 8,
  "totalPreguntas": 10
}
```

`puntaje` y `totalPreguntas` son obligatorios. `estudiante`, `tema` y `actividad` son opcionales y se guardan como `null` si no se envían.

## Cómo probar con MySQL

### 1. Verificar que MySQL esté listo

Ejecuta:

```powershell
mysql -u geomundo_app -p -D geomundo -e "SHOW TABLES;"
```

Si todavía no aparecen tablas, inicia el backend. TypeORM las crea automáticamente en desarrollo porque `synchronize` está activo cuando `NODE_ENV` no es `production`.

### 2. Iniciar el backend

```powershell
npm run dev:backend
```

Espera un mensaje similar a:

```text
Base de datos conectada exitosamente
Servidor iniciado en el puerto 3000
```

### 3. Ejecutar la prueba rápida de integración

Con el backend encendido:

```powershell
npm run test:integration
```

Este script envía varias peticiones `POST /api/sesiones/calificacion` y muestra cuántas fueron exitosas.

Si usas otro puerto o URL:

```powershell
$env:API_BASE_URL="http://localhost:3000/api"
npm run test:integration
```

### 4. Ejecutar la prueba completa de contenido y base de datos

Con el backend encendido y `backend/.env` configurado:

```powershell
npm run test:content
```

Esta prueba:

- crea o reutiliza temas de ejemplo;
- crea o reutiliza actividades por tema;
- limpia sesiones anteriores con estudiantes `live-%`;
- envía sesiones nuevas al backend;
- consulta MySQL directamente;
- confirma la cantidad de temas, actividades y sesiones guardadas;
- imprime los últimos registros insertados.

### 5. Confirmar manualmente en MySQL

Puedes revisar los datos guardados con:

```powershell
mysql -u geomundo_app -p -D geomundo -e "SELECT estudiante, tema, actividad, puntaje, totalPreguntas, createdAt FROM sesion_calificacion ORDER BY createdAt DESC LIMIT 10;"
```

También puedes revisar temas y actividades:

```powershell
mysql -u geomundo_app -p -D geomundo -e "SELECT nombre, descripcion, orden FROM tema ORDER BY orden;"
mysql -u geomundo_app -p -D geomundo -e "SELECT nombre, descripcion, nivel, orden FROM actividad ORDER BY orden;"
```

## Pruebas disponibles

Pruebas unitarias del backend:

```powershell
npm run test:backend
```

Pruebas unitarias en modo observación:

```powershell
npm run test:backend:watch
```

Prueba rápida contra el endpoint de calificaciones:

```powershell
npm run test:integration
```

Prueba completa con contenido y verificación en MySQL:

```powershell
npm run test:content
```

Compilación completa:

```powershell
npm run build
```

## Scripts raíz

| Comando | Descripción |
| --- | --- |
| `npm run dev:backend` | Inicia la API en desarrollo |
| `npm run dev:frontend` | Inicia el frontend en desarrollo |
| `npm run build:backend` | Compila el backend |
| `npm run build:frontend` | Compila el frontend |
| `npm run build` | Compila backend y frontend |
| `npm run start:backend` | Ejecuta el backend compilado |
| `npm run preview:frontend` | Previsualiza la build del frontend |
| `npm run test:backend` | Ejecuta pruebas unitarias del backend |
| `npm run test:integration` | Envía sesiones de prueba al backend |
| `npm run test:content` | Crea contenido y valida MySQL |

## Flujo recomendado de trabajo

1. Actualizar `master` antes de iniciar:

```powershell
git checkout master
git pull
```

2. Crear una rama para cada cambio:

```powershell
git checkout -b feature/nombre-del-cambio
```

3. Probar antes de subir:

```powershell
npm run test:backend
npm run build
```

4. Subir la rama:

```powershell
git add .
git commit -m "Describe el cambio realizado"
git push -u origin feature/nombre-del-cambio
```

5. Abrir un pull request y pedir revisión.

## Trabajo realizado

### Monorepo

- Se detectó que backend y frontend estaban separados como repositorios independientes.
- Se creó un repositorio principal en la raíz de GeoMundo.
- Se configuró `package.json` con workspaces.
- Se añadió un `.gitignore` global.
- Se inicializó Git en la raíz y se publicó el proyecto en GitHub.
- La rama principal quedó publicada como `master`.

### Documentación

- Se creó y mejoró el README raíz.
- Se agregó estructura, tecnologías, instalación, configuración local, ejecución, scripts, flujo Git, pruebas y tareas pendientes.
- Se agregó una guía local específica para MySQL en `backend/LOCAL-SETUP.md`.

### Backend

- Se revisó el flujo de calificación.
- Se confirmó el endpoint `POST /api/sesiones/calificacion`.
- Se validó que el backend guarda sesiones de calificación en MySQL.
- Se verificó la entidad `SesionCalificacion` con estudiante, tema, actividad, puntaje, total de preguntas y fecha de creación.
- Se agregaron pruebas unitarias para controlador y servicio.

### Frontend

- Se reorganizó el flujo visual de bienvenida, selección de tema, actividad, retroalimentación y calificación.
- Se creó un catálogo central de contenido para temas y actividades.
- Se agregó el guardado de calificación desde la UI hacia el backend.
- Se mejoró el estilo global para una interfaz más moderna y consistente.

### Pruebas

- Pruebas unitarias con Vitest para el backend.
- Prueba de integración que envía sesiones de calificación.
- Prueba de contenido que crea temas, actividades y sesiones, y verifica los datos en MySQL.

### Pull request reciente

- Se revisó el merge aceptado de un pull request del equipo.
- Los cambios principales fueron actualización de Vitest y cambio del título de `index.html` a `GEOMUNDO`.
- No se detectó afectación en la lógica principal del flujo.

## Tareas pendientes

Prioridad recomendada:

1. Agregar preguntas y opciones reales por tema.
2. Conectar el frontend con el banco de preguntas del backend.
3. Calcular puntaje real según respuestas correctas e incorrectas.
4. Mejorar la retroalimentación por actividad.
5. Mostrar historial de resultados desde la base de datos.
6. Crear pruebas unitarias para tema, actividad y pregunta.
7. Crear una prueba de integración que simule el recorrido completo de un estudiante.
8. Pulir la experiencia visual en móvil.
9. Dejar una guía final de roles, ramas y pull requests para el equipo.

## Preguntas abiertas para el equipo

Estas respuestas ayudarán a cerrar la siguiente etapa del proyecto:

- ¿Los estudiantes tendrán usuario real o se seguirá guardando solo un nombre/código temporal?
- ¿Cada tema debe tener actividades fijas o el backend debe entregar preguntas aleatorias?
- ¿El puntaje será una suma simple de aciertos o tendrá ponderación por dificultad?
- ¿La retroalimentación debe mostrarse por pregunta, por actividad o por tema completo?
- ¿El historial debe filtrarse por estudiante, por tema, por fecha o por todos esos criterios?
- ¿El equipo quiere mantener MySQL local o preparar una base remota para demostración?
- ¿Quién será responsable de crear el contenido real de preguntas y opciones?

## Notas importantes

- No subas `backend/.env`.
- No subas `node_modules/`, `dist/` ni archivos temporales.
- En producción no se recomienda usar `synchronize: true` en TypeORM. Para producción se deben preparar migraciones.
- Antes de probar el frontend completo, asegúrate de que el backend esté encendido y conectado a MySQL.
