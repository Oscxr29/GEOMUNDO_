// Envia múltiples peticiones de prueba a POST /api/sesiones/calificacion
// Uso: node scripts/send_test_sessions.mjs

const url = 'http://localhost:3000/api/sesiones/calificacion';

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
  for (const t of tests) {
    process.stdout.write('-> ' + JSON.stringify(t) + ' ... ');
    const r = await sendTest(t);
    if (r.ok) success++;
    console.log(r.status, r.data ? JSON.stringify(r.data) : r.error || '');
  }
  console.log(`\nResultados: ${success}/${tests.length} exitosas`);
}

runAll();
