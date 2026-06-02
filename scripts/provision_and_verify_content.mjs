import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

const apiBase = process.env.API_BASE_URL || 'http://localhost:3000/api';
const envPath = path.resolve('backend', '.env');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf8');
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();
        return [key, value];
      })
  );
}

const envFromFile = loadEnvFile(envPath);
const dbConfig = {
  host: process.env.DB_HOST || envFromFile.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || envFromFile.DB_PORT || 3306),
  user: process.env.DB_USER || envFromFile.DB_USER || 'root',
  password: process.env.DB_PASS || envFromFile.DB_PASS || '',
  database: process.env.DB_NAME || envFromFile.DB_NAME || 'geomundo',
};

const seedThemes = [
  {
    nombre: 'Figuras geométricas',
    descripcion: 'Contenido de prueba para figuras, perímetro y clasificación visual.',
    orden: 1,
    actividades: [
      { nombre: 'Reconoce figuras', descripcion: 'Identifica polígonos y cuerpos básicos.', nivel: 1, orden: 1 },
      { nombre: 'Clasifica por lados', descripcion: 'Agrupa figuras según cantidad de lados.', nivel: 1, orden: 2 },
    ],
  },
  {
    nombre: 'Medidas y perímetro',
    descripcion: 'Contenido de prueba para medición simple y cálculo de perímetro.',
    orden: 2,
    actividades: [
      { nombre: 'Calcula perímetro', descripcion: 'Suma lados para obtener el perímetro.', nivel: 2, orden: 1 },
      { nombre: 'Reto final', descripcion: 'Actividad de cierre con puntaje acumulado.', nivel: 2, orden: 2 },
    ],
  },
];

const sessionSeeds = [
  { estudiante: 'live-001', tema: 'Figuras geométricas', actividad: 'Reconoce figuras', puntaje: 8, totalPreguntas: 10 },
  { estudiante: 'live-002', tema: 'Figuras geométricas', actividad: 'Clasifica por lados', puntaje: 9, totalPreguntas: 10 },
  { estudiante: 'live-003', tema: 'Medidas y perímetro', actividad: 'Calcula perímetro', puntaje: 7, totalPreguntas: 10 },
  { estudiante: 'live-004', tema: 'Medidas y perímetro', actividad: 'Reto final', puntaje: 10, totalPreguntas: 10 },
  { estudiante: 'live-005', tema: 'Figuras geométricas', actividad: 'Reconoce figuras', puntaje: 6, totalPreguntas: 8 },
  { estudiante: 'live-006', tema: 'Medidas y perímetro', actividad: 'Calcula perímetro', puntaje: 5, totalPreguntas: 8 },
];

async function requestJson(method, endpoint, body) {
  const response = await fetch(`${apiBase}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`${method} ${endpoint} failed (${response.status}): ${JSON.stringify(data)}`);
  }

  return data;
}

async function ensureTheme(theme) {
  const list = await requestJson('GET', '/temas');
  const existing = Array.isArray(list?.data) ? list.data.find((item) => item.nombre === theme.nombre) : null;
  if (existing) {
    return existing;
  }

  const created = await requestJson('POST', '/temas', theme);
  return created.data;
}

async function ensureActivity(themeId, activity) {
  const list = await requestJson('GET', `/actividades/${themeId}`);
  const existing = Array.isArray(list?.data) ? list.data.find((item) => item.nombre === activity.nombre) : null;
  if (existing) {
    return existing;
  }

  const created = await requestJson('POST', '/actividades', {
    ...activity,
    temaId: themeId,
  });
  return created.data;
}

async function createSession(payload) {
  const created = await requestJson('POST', '/sesiones/calificacion', payload);
  return created.data;
}

async function run() {
  console.log(`Preparando contenido desde ${apiBase}`);

  const themes = [];
  for (const themeSeed of seedThemes) {
    const theme = await ensureTheme({
      nombre: themeSeed.nombre,
      descripcion: themeSeed.descripcion,
      orden: themeSeed.orden,
    });

    const activities = [];
    for (const activitySeed of themeSeed.actividades) {
      const activity = await ensureActivity(theme.id, activitySeed);
      activities.push(activity);
    }

    themes.push({ ...theme, activities });
  }

  console.log(`Temas verificados: ${themes.length}`);
  console.log(`Actividades verificados: ${themes.reduce((acc, theme) => acc + theme.activities.length, 0)}`);

  const createdSessions = [];
  for (const sessionSeed of sessionSeeds) {
    const session = await createSession(sessionSeed);
    createdSessions.push(session);
  }

  console.log(`Sesiones creadas: ${createdSessions.length}`);

  const connection = await mysql.createConnection(dbConfig);
  try {
    const [themeRows] = await connection.execute(
      'SELECT COUNT(*) AS count FROM tema WHERE nombre IN (?, ?)',
      seedThemes.map((theme) => theme.nombre)
    );
    const [activityRows] = await connection.execute(
      'SELECT COUNT(*) AS count FROM actividad WHERE nombre IN (?, ?, ?, ?)',
      seedThemes.flatMap((theme) => theme.actividades.map((activity) => activity.nombre))
    );
    const [sessionRows] = await connection.execute(
      'SELECT COUNT(*) AS count FROM sesion_calificacion WHERE estudiante LIKE ?',
      ['live-%']
    );
    const [recentRows] = await connection.execute(
      'SELECT estudiante, tema, actividad, puntaje, totalPreguntas, createdAt FROM sesion_calificacion WHERE estudiante LIKE ? ORDER BY createdAt DESC LIMIT 6',
      ['live-%']
    );

    console.log(`\nVerificación BD:`);
    console.log(`- Temas esperados: ${seedThemes.length} | encontrados: ${themeRows[0]?.count ?? 0}`);
    console.log(`- Actividades esperadas: 4 | encontradas: ${activityRows[0]?.count ?? 0}`);
    console.log(`- Sesiones esperadas: ${sessionSeeds.length} | encontradas: ${sessionRows[0]?.count ?? 0}`);
    console.log('\nÚltimos registros live:');
    for (const row of recentRows) {
      console.log(`- ${row.estudiante} | ${row.tema} | ${row.actividad} | ${row.puntaje}/${row.totalPreguntas} | ${row.createdAt}`);
    }
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
