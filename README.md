# GeoMundo

GeoMundo es un monorepo que agrupa el backend y el frontend del proyecto. Este README resume la estructura, cómo ejecutar el proyecto, los cambios recientes y cómo verificar que las calificaciones se guardan correctamente en la base de datos.

## Estructura

- `backend/`: API en Node.js + TypeScript, Express y TypeORM.
- `frontend/`: aplicación en Vue 3 + Vite + Pinia.
- `package.json`: scripts raíz del monorepo.
- `.gitignore`: reglas globales para archivos temporales y locales.

## Tecnologías principales

- Backend: Node.js, TypeScript, Express, MySQL, TypeORM.
- Frontend: Vue 3, Vite, TypeScript, Pinia, Vue Router, Tailwind CSS, DaisyUI.

## Cambios recientes importantes

Estos cambios fueron implementados durante la integración frontend ↔ backend para que las actividades carguen preguntas reales y las calificaciones se registren en la base de datos:

- Frontend ahora consume los endpoints reales del backend: temas, actividades y preguntas.
- Se añadió `PreguntaView` (`frontend/src/views/PreguntaView.vue`) y servicios API (`frontend/src/services/preguntas.ts`, `frontend/src/services/temas.ts`, `frontend/src/services/session.ts`).
- El flujo de selección migró desde el catálogo estático a las APIs del backend (se eliminó `frontend/src/data/catalog.ts` y la vista legacy `ActividadView.vue`).
- Al guardar una sesión se envía `estudiante`, `tema`, `actividad`, `actividadId`, `puntaje`, `totalPreguntas` y `respuestas` desde el frontend. Nota: el backend persiste actualmente `estudiante`, `tema`, `actividad`, `puntaje`, `totalPreguntas` y `createdAt`.
- Se agregó en el store `progreso` el campo `estudiante` y en la UI (en `SeleccionTemaView.vue`) un input y un prompt para pedir el nombre antes de iniciar una actividad.
- Se corrigieron advertencias de Tailwind (uso de variables CSS en clases) en vistas principales.

## Endpoints principales (expuestos por el backend)

- `GET /api/tema` — lista de temas.
- `GET /api/tema/:id` — detalle de un tema.
- `GET /api/actividades/:temaId` — actividades por tema.
- `GET /api/preguntas/:actividadId` — preguntas y opciones para una actividad.
- `POST /api/sesiones/calificacion` — guarda una sesión/calificación (payload: estudiante?, tema?, actividad?, actividadId, puntaje, totalPreguntas). Actualmente el backend no persiste el campo `respuestas`.

Ruta del código clave

- Frontend:
	- `frontend/src/views/PreguntaView.vue` — flujo de preguntas, evaluación local y guardado.
	- `frontend/src/views/SeleccionTemaView.vue` — selección de tema/actividad y captura de nombre de estudiante.
	- `frontend/src/views/CalificacionView.vue` — vista final para guardar resultados.
	- `frontend/src/stores/progreso.ts` — store con `estudiante`, `temaId`, `actividadId`, `puntaje`, `totalPreguntas`, `respuestas`.
	- `frontend/src/services/*` — servicios axios para consumir la API.

- Backend:
	- `backend/src/entities/sesion-calificacion.entity.ts` — entidad persistida (columnas: `id`, `estudiante`, `tema`, `actividad`, `puntaje`, `totalPreguntas`, `createdAt`).
	- `backend/src/controllers/sesion-calificacion.controller.ts` y `backend/src/services/sesion-calificacion.service.ts` — lógica de creación de sesiones.

## Verificación en la base de datos (MySQL)

Para comprobar que las calificaciones se guardaron correctamente ejecuta estas consultas (reemplaza valores según necesites):

```sql
USE geomundo_db;

-- Últimas sesiones guardadas
SELECT id, estudiante, tema, actividad, puntaje, totalPreguntas, createdAt
FROM sesion_calificacion
ORDER BY createdAt DESC
LIMIT 20;

-- Filtrar por actividad (reemplaza ACTIVIDAD_UUID)
SELECT id, estudiante, tema, actividad, puntaje, totalPreguntas, createdAt
FROM sesion_calificacion
WHERE actividad = 'ACTIVIDAD_UUID'
ORDER BY createdAt DESC;
```

Si ves `NULL` en la columna `estudiante`, asegúrate de que ingresaste un nombre en la UI (en la selección de tema) o que la UI envió `estudiante` en el payload. Puedes inspeccionar el POST en DevTools → Network para confirmar el cuerpo del request.

Nota sobre `respuestas`:
- El frontend envía `respuestas` en el payload pero la columna no existe actualmente en la entidad. Si quieres persistir `respuestas` completas, puedes hacer una de las dos cosas:
	1) Añadir la columna JSON en la base de datos y actualizar la entidad/service del backend (recomendado):

```sql
ALTER TABLE sesion_calificacion
ADD COLUMN respuestas JSON NULL;
```

Luego, en `backend/src/entities/sesion-calificacion.entity.ts` añadir:

```ts
@Column({ type: 'json', nullable: true })
respuestas?: any[] | null;
```

y actualizar `SesionCalificacionService.createSesionCalificacion` para asignar `respuestas: sesion.respuestas ?? null` antes de guardar.

	2) Si prefieres, te puedo preparar el parche (entidad + servicio) y la migración/ALTER para aplicarlo.

## Cómo ejecutar el proyecto

Instalación (una sola vez):

```powershell
git clone <repo>
cd GEOMUNDO_
npm install
```

Configura variables de entorno:

```text
# Copia y edita las variables
cp backend/.env.example backend/.env
```

Arrancar en desarrollo (desde la raíz):

```powershell
npm run dev:backend   # inicia API
npm run dev:frontend  # inicia frontend
```

Compilar para producción:

```powershell
npm run build
```

## Pruebas

- `npm run test:backend` — pruebas unitarias del backend.
- `npm run test:integration` — script de integración que envía sesiones de prueba al backend.
- `npm run test:content` — procedimiento que crea contenido de ejemplo y envía sesiones para validar el flujo completo.

## Problemas conocidos y decisiones

- La columna `respuestas` no se persiste por defecto; se envía desde el frontend pero el backend no la guarda hasta que se implemente la columna/entidad correspondiente.
- Se eliminó el catálogo estático y se migró la navegación para usar UUIDs reales de `actividad` obtenidos desde la API.
- Se corrigieron advertencias de Tailwind relacionadas con variables CSS para evitar falsos positivos en Intellisense.

## Próximos pasos recomendados

1. Persistir `respuestas` (añadir columna JSON + ajustar entidad/service).
2. Añadir historial por estudiante y endpoints para consultar sesiones por nombre/ID.
3. Mejorar la UX para solicitar nombre (reemplazar `prompt()` por modal o formulario obligatorio).
4. Añadir más contenido real (preguntas, explicaciones) para evaluar la experiencia.

---

Si quieres, puedo preparar y aplicar el parche para persistir `respuestas` en el backend y añadir la migración SQL. ¿Lo preparo ahora?


