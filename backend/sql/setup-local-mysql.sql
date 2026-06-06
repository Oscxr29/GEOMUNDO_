CREATE DATABASE IF NOT EXISTS geomundo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'geomundo_app'@'localhost'
  IDENTIFIED BY 'Geo2026@';

GRANT ALL PRIVILEGES ON geomundo.* TO 'geomundo_app'@'localhost';
FLUSH PRIVILEGES;
