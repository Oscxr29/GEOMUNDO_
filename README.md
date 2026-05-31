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


