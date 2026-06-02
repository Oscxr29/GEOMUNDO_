# GeoMundo

GeoMundo es un monorepo que agrupa el backend y el frontend del proyecto en una sola raíz para facilitar el trabajo en equipo, el control de cambios y la colaboración.

## Estructura

- `backend/`: API en Node.js + TypeScript, Express y TypeORM.
- `frontend/`: aplicación en Vue 3 + Vite + Pinia.
- `package.json`: scripts raíz del monorepo.
- `.gitignore`: reglas globales para archivos temporales y locales.

## Tecnologías

- Backend: Node.js, TypeScript, Express, MySQL, TypeORM.
- Frontend: Vue 3, Vite, TypeScript, Pinia, Vue Router, Tailwind CSS, DaisyUI.

## Estado del proyecto

- El proyecto ya fue convertido a monorepo.
- La rama principal publicada es `master`.
- El repositorio remoto está conectado a GitHub.
- Ya existen pruebas unitarias del backend y scripts de integración/contenido.

## Tareas pendientes

Estas son las siguientes tareas recomendadas para continuar el proyecto en orden de prioridad:

1. Agregar más preguntas y opciones reales por tema para que las actividades ya no dependan solo del contenido de prueba.
2. Conectar el frontend con las preguntas del backend para que cada actividad cargue su propio banco de preguntas.
3. Calcular el puntaje real según respuestas correctas, incorrectas y número total de intentos.
4. Mejorar la retroalimentación para mostrar aciertos, errores y recomendaciones por actividad.
5. Mostrar resultados históricos guardados en la base de datos para cada estudiante o sesión.
6. Crear más pruebas unitarias para `tema`, `actividad` y `pregunta`.
7. Agregar una prueba de integración que recorra todo el flujo de una actividad completa hasta guardar la calificación.
8. Revisar la experiencia visual en móvil y ajustar espaciados, tamaños y navegación si hace falta.
9. Preparar una guía final para el equipo con ramas, pull requests y orden de trabajo.

## Requisitos

- Node.js compatible con los proyectos del repo.
- npm.
- MySQL local para el backend.

## Instalación

Clona el repositorio y entra a la carpeta raíz:

```powershell
git clone https://github.com/Oscxr29/GEOMUNDO_.git
cd GEOMUNDO_
```

Instala las dependencias desde la raíz:

```powershell
npm install
```

## Configuración local

1. Copia `backend/.env.example` a `backend/.env`.
2. Ajusta las variables de entorno según tu entorno local.
3. Revisa `backend/LOCAL-SETUP.md` para preparar la base de datos MySQL local.
4. Ejecuta el script SQL en `backend/sql/setup-local-mysql.sql` si necesitas crear la estructura inicial.

## Ejecución en desarrollo

Desde la raíz del proyecto:

```powershell
npm run dev:backend
npm run dev:frontend
```

## Compilación

Para compilar ambos proyectos:

```powershell
npm run build
```

También puedes compilar cada parte por separado:

```powershell
npm run build:backend
npm run build:frontend
```

## Scripts disponibles

- `npm run dev:backend`: inicia la API en modo desarrollo.
- `npm run build:backend`: compila el backend.
- `npm run start:backend`: ejecuta el backend compilado.
- `npm run dev:frontend`: inicia el frontend en modo desarrollo.
- `npm run build:frontend`: compila el frontend.
- `npm run preview:frontend`: previsualiza la build del frontend.
- `npm run build`: compila backend y frontend.

## Flujo de trabajo Git

Cuando hagas cambios, usa el flujo habitual desde la raíz:

```powershell
git add .
git commit -m "mensaje del cambio"
git push
```

## Notas para el equipo

- Todo el trabajo debe hacerse desde la raíz del monorepo.
- Evita subir archivos locales como `.env`, `node_modules` o `dist`.
- Si una persona nueva se integra al proyecto, debe clonar el repo raíz, instalar dependencias y configurar su entorno local antes de arrancar el backend.

## Paso a paso realizado

1. Se detectó que `backend/` y `frontend/` funcionaban como repositorios Git separados.
2. Se creó un repositorio Git en la raíz `GeoMundo/`.
3. Se configuró un `package.json` raíz con `workspaces`.
4. Se añadió un `.gitignore` global.
5. Se preservó el historial local anterior en `.git-backups/`.
6. Se creó el commit inicial del monorepo.
7. Se conectó el remoto de GitHub.
8. Se subieron los cambios a `master`.

## Ejecutar pruebas rápidas (integración)

Hay un script de integración sencillo que envía varias peticiones de prueba al endpoint del backend `POST /api/sesiones/calificacion`.

Desde la raíz del proyecto puedes ejecutar:

```bash
# Asegúrate de que el backend esté corriendo en http://localhost:3000
npm run test:integration
```

El script `scripts/send_test_sessions.mjs` enviará varios POSTs y mostrará el resultado en la terminal.

Notas:
- Estas pruebas son de integración (end-to-end) y verifican que el backend reciba y persista sesiones de calificación.
- Las pruebas unitarias del backend ya están agregadas con Vitest.

## Ejecutar pruebas unitarias del backend

Ya quedaron listas pruebas unitarias para el backend enfocadas en la sesión de calificación. Puedes ejecutarlas desde la raíz del proyecto con:

```bash
npm run test:backend
```

En modo observación, útil mientras desarrollas:

```bash
npm run test:backend:watch
```

Estas pruebas validan:
- que el servicio guarda correctamente la sesión de calificación sin tocar la base de datos real;
- que el controlador responde `400` si faltan datos obligatorios;
- que el controlador responde `201` cuando el payload es válido.

## Ejecutar prueba de contenido y base de datos

Si quieres probar un escenario más completo, con más contenido para estudiantes y verificación directa en MySQL, usa:

```bash
npm run test:content
```

Este comando hace lo siguiente:
- crea o reutiliza 2 temas de ejemplo;
- crea o reutiliza 4 actividades ligadas a esos temas;
- envía 6 sesiones de calificación de prueba;
- consulta la base de datos y confirma cuántos temas, actividades y sesiones quedaron guardados;
- imprime los últimos registros insertados para que puedas revisarlos rápido.

Es la mejor opción cuando quieres validar el flujo completo antes de añadir más contenido real para estudiantes.


