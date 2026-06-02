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
    nombre: 'Figuras planas',
    descripcion: 'Reconoce, clasifica y compara formas básicas con ejemplos del entorno.',
    orden: 1,
    actividades: [
      { nombre: 'Detecta la figura correcta', descripcion: 'Mira varias imágenes y elige la figura que corresponde.', nivel: 1, orden: 1 },
      { nombre: 'Clasifica por características', descripcion: 'Agrupa figuras por lados, curvas y similitudes.', nivel: 1, orden: 2 },
    ],
  },
  {
    nombre: 'Perímetro',
    descripcion: 'Suma lados para descubrir cuánto mide alrededor.',
    orden: 2,
    actividades: [
      { nombre: 'Suma los lados', descripcion: 'Resuelve sumas cortas para obtener el perímetro.', nivel: 2, orden: 1 },
      { nombre: 'Perímetro en objetos reales', descripcion: 'Relaciona figuras con objetos cotidianos y estima su borde.', nivel: 2, orden: 2 },
    ],
  },
  {
    nombre: 'Área',
    descripcion: 'Explora el área con cuadriculas y figuras sencillas para entender su uso.',
    orden: 3,
    actividades: [
      { nombre: 'Cuenta cuadrados', descripcion: 'Observa figuras cuadriculadas y cuenta los cuadros internos.', nivel: 2, orden: 1 },
      { nombre: 'Compara superficies', descripcion: 'Decide cuál figura ocupa más espacio y explica por qué.', nivel: 3, orden: 2 },
    ],
  },
  {
    nombre: 'Ángulos',
    descripcion: 'Aprende a reconocer ángulos en el entorno y en figuras geométricas sencillas.',
    orden: 4,
    actividades: [
      { nombre: 'Identifica el ángulo', descripcion: 'Selecciona el tipo de ángulo que ves en cada imagen.', nivel: 2, orden: 1 },
      { nombre: 'Ángulos en la vida diaria', descripcion: 'Busca objetos del aula o casa que representen ángulos.', nivel: 3, orden: 2 },
    ],
  },
];

const sessionSeeds = [
  { estudiante: 'live-001', tema: 'Figuras planas', actividad: 'Detecta la figura correcta', puntaje: 8, totalPreguntas: 10 },
  { estudiante: 'live-002', tema: 'Figuras planas', actividad: 'Clasifica por características', puntaje: 9, totalPreguntas: 10 },
  { estudiante: 'live-003', tema: 'Perímetro', actividad: 'Suma los lados', puntaje: 7, totalPreguntas: 10 },
  { estudiante: 'live-004', tema: 'Perímetro', actividad: 'Perímetro en objetos reales', puntaje: 10, totalPreguntas: 10 },
  { estudiante: 'live-005', tema: 'Área', actividad: 'Cuenta cuadrados', puntaje: 6, totalPreguntas: 8 },
  { estudiante: 'live-006', tema: 'Ángulos', actividad: 'Identifica el ángulo', puntaje: 5, totalPreguntas: 8 },
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
  const expectedActivities = themes.reduce((acc, theme) => acc + theme.activities.length, 0);
  console.log(`Actividades verificadas: ${expectedActivities}`);

  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.execute('DELETE FROM sesion_calificacion WHERE estudiante LIKE ?', ['live-%']);
  } finally {
    await connection.end();
  }

  const createdSessions = [];
  for (const sessionSeed of sessionSeeds) {
    const session = await createSession(sessionSeed);
    createdSessions.push(session);
  }

  console.log(`Sesiones creadas: ${createdSessions.length}`);

  const connection2 = await mysql.createConnection(dbConfig);
  try {
      const [themeRows] = await connection2.execute(
      'SELECT COUNT(*) AS count FROM tema WHERE nombre IN (?, ?, ?, ?)',
      seedThemes.map((theme) => theme.nombre)
    );
      const [activityRows] = await connection2.execute(
      'SELECT COUNT(*) AS count FROM actividad WHERE nombre IN (?, ?, ?, ?, ?, ?, ?, ?)',
      seedThemes.flatMap((theme) => theme.actividades.map((activity) => activity.nombre))
    );
      const [sessionRows] = await connection2.execute(
      'SELECT COUNT(*) AS count FROM sesion_calificacion WHERE estudiante LIKE ?',
      ['live-%']
    );
      const [recentRows] = await connection2.execute(
      'SELECT estudiante, tema, actividad, puntaje, totalPreguntas, createdAt FROM sesion_calificacion WHERE estudiante LIKE ? ORDER BY createdAt DESC LIMIT 6',
      ['live-%']
    );

    console.log(`\nVerificación BD:`);
    console.log(`- Temas esperados: ${seedThemes.length} | encontrados: ${themeRows[0]?.count ?? 0}`);
      console.log(`- Actividades esperadas: ${expectedActivities} | encontradas: ${activityRows[0]?.count ?? 0}`);
    console.log(`- Sesiones esperadas: ${sessionSeeds.length} | encontradas: ${sessionRows[0]?.count ?? 0}`);
    console.log('\nÚltimos registros live:');
    for (const row of recentRows) {
      console.log(`- ${row.estudiante} | ${row.tema} | ${row.actividad} | ${row.puntaje}/${row.totalPreguntas} | ${row.createdAt}`);
    }
  } finally {
    await connection2.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
