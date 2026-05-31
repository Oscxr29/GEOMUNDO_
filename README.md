# GeoMundo

Monorepo del proyecto GeoMundo con backend y frontend en una sola raíz.

## Estructura

- `backend/`: API en Node.js + TypeScript
- `frontend/`: aplicación Vue + Vite
- `package.json`: scripts raíz del monorepo

## Qué se hizo

1. Se revisó la estructura original y se confirmó que `backend/` y `frontend/` tenían repos Git separados.
2. Se creó un repositorio Git en la raíz `GeoMundo/` para centralizar el trabajo.
3. Se agregó un `package.json` raíz con `workspaces` para administrar `backend` y `frontend` desde un solo punto.
4. Se agregó un `.gitignore` raíz para evitar subir archivos temporales, `node_modules`, compilados y archivos locales.
5. Se preservaron los repos anteriores de `backend` y `frontend` dentro de `.git-backups/` para no perder el historial local.
6. Se creó el commit inicial del monorepo con todo el estado actual del proyecto.
7. Se conectó el remoto de GitHub y se subió la rama `master`.

## Comandos útiles

Desde la raíz del proyecto:

```powershell
npm run dev:backend
npm run dev:frontend
npm run build
```

## Flujo de trabajo Git

Cada vez que hagas cambios:

```powershell
git add .
git commit -m "mensaje del cambio"
git push
```

## Notas

- El monorepo ya quedó publicado en la rama `master`.
- Si tus compañeros clonan el proyecto, deben trabajar desde la raíz `GeoMundo/`.
- Los repos anteriores quedaron respaldados en `.git-backups/` por seguridad local.