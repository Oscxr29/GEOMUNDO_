// Envía múltiples peticiones de prueba a POST /api/sesiones/calificacion.
// Uso:
//   node scripts/send_test_sessions.mjs
//   API_BASE_URL=http://localhost:3000/api node scripts/send_test_sessions.mjs

const apiBase = process.env.API_BASE_URL || 'http://localhost:3000/api';
const url = `${apiBase}/sesiones/calificacion`;

const tests = [
  { estudiante: 'test1', tema: 'Figuras', actividad: 'act-1', puntaje: 8, totalPreguntas: 10 },
  { estudiante: 'test2', tema: 'Figuras', actividad: 'act-1', puntaje: 10, totalPreguntas: 10 },
  { estudiante: 'test3', tema: 'Ángulos', actividad: 'act-2', puntaje: 6, totalPreguntas: 8 },
  { estudiante: 'test4', tema: 'Ángulos', actividad: 'act-2', puntaje: 0, totalPreguntas: 5 },
  { estudiante: 'test5', tema: 'Figuras', actividad: 'act-3', puntaje: 5, totalPreguntas: 5 },
];

async function sendTest(payload) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
  } catch (err) {
    return { status: 0, ok: false, error: String(err) };
  }
}

async function runAll() {
  console.log('Enviando', tests.length, 'peticiones de prueba a', url);
  let success = 0;

  for (const test of tests) {
    process.stdout.write('-> ' + JSON.stringify(test) + ' ... ');
    const result = await sendTest(test);
    if (result.ok) success++;
    console.log(result.status, result.data ? JSON.stringify(result.data) : result.error || '');
  }

  console.log(`\nResultados: ${success}/${tests.length} exitosas`);

  if (success !== tests.length) {
    process.exitCode = 1;
  }
}

runAll();
