# Configuración local de MySQL para GeoMundo

Esta guía prepara una base de datos local para ejecutar el backend y las pruebas de contenido.

## Datos locales recomendados

- Base de datos: `geomundo`
- Host: `localhost`
- Puerto: `3306`
- Usuario de aplicación: `geomundo_app`
- Contraseña local sugerida: `Geo2026@`

La contraseña puede cambiarse, pero debe coincidir entre MySQL y `backend/.env`.

## 1. Crear base de datos y usuario

Desde la raíz del monorepo, ejecuta:

```powershell
mysql -u root -p < backend\sql\setup-local-mysql.sql
```

También puedes abrir `backend/sql/setup-local-mysql.sql` en MySQL Workbench y ejecutarlo con un usuario administrador.

## 2. Crear archivo `.env`

Desde la raíz:

```powershell
Copy-Item backend\.env.example backend\.env
```

Edita `backend/.env`:

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

## 3. Probar conexión

Ejecuta:

```powershell
mysql -u geomundo_app -p -D geomundo -e "SELECT DATABASE();"
```

Si responde `geomundo`, la conexión local está lista.

## 4. Crear tablas

Inicia el backend:

```powershell
npm run dev:backend
```

En desarrollo, TypeORM crea o sincroniza las tablas automáticamente porque `synchronize` está activo cuando `NODE_ENV` no es `production`.

Para revisar las tablas:

```powershell
mysql -u geomundo_app -p -D geomundo -e "SHOW TABLES;"
```

## 5. Probar guardado de calificaciones

Con el backend encendido:

```powershell
npm run test:integration
```

Para confirmar los registros:

```powershell
mysql -u geomundo_app -p -D geomundo -e "SELECT estudiante, tema, actividad, puntaje, totalPreguntas, createdAt FROM sesion_calificacion ORDER BY createdAt DESC LIMIT 10;"
```

## 6. Probar contenido completo

Con el backend encendido:

```powershell
npm run test:content
```

Este script crea o reutiliza temas y actividades de ejemplo, guarda sesiones de prueba y verifica directamente los datos en MySQL.

## Recomendaciones

- Usa `root` solo para crear la base y el usuario.
- Usa `geomundo_app` para ejecutar la aplicación.
- Mantén `backend/.env` fuera de Git.
- No uses secretos reales en `.env.example`.
- Si otro integrante trabaja en otra computadora, debe ejecutar este mismo proceso localmente.
