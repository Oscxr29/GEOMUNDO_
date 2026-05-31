# GeoMundo local setup

Use these local-only credentials for the app:

- User: `geomundo_app`
- Password: `GeoMundo@2026!`
- Database: `geomundo`
- Host: `localhost`
- Port: `3306`

## SQL setup

Run [sql/setup-local-mysql.sql](sql/setup-local-mysql.sql) from MySQL Workbench or from the MySQL CLI using an administrator account.

## Backend env

Copy [.env.example](.env.example) to [.env](.env) and keep the same values.

## Notes

- Use `root` only for administration, not inside the application.
- Keep `.env` out of version control.
- If another machine joins the project, recreate the same user locally with the same database name.