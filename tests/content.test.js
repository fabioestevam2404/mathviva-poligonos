const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { topics, topicGuides } = require('../content.js');

const questions = topics.flatMap(t => t.questions);
const byId = new Map(questions.map(q => [q.id, q]));
const correctText = id => byId.get(id).opts[byId.get(id).a];

// IDs da primeira versão: o progresso já salvo depende deles. Nunca podem sumir.
const LEGACY_IDS = ['fundamentos', 'convexos', 'regulares', 'angulos', 'diagonais_areas', 'aplicacoes']
  .flatMap(t => [1, 2, 3, 4, 5].map(n => `${t}-0${n}`));

// Retrato completo da ordem das trilhas e das questões. Mudou de propósito? Atualize aqui também.
const EXPECTED = {
  'm20-poligonos': ['fundamentos-01', 'fundamentos-02', 'fundamentos-03', 'fundamentos-04', 'fundamentos-05', 'm20-poligonos-01'],
  'm20-classificacao': ['convexos-01', 'convexos-02', 'convexos-03', 'm20-classificacao-01', 'regulares-01', 'regulares-02', 'regulares-03'],
  'm20-diagonais': ['diagonais_areas-01', 'diagonais_areas-02', 'm20-diagonais-01', 'm20-diagonais-02', 'm20-diagonais-03', 'm20-diagonais-04'],
  'm20-angulos': ['convexos-04', 'convexos-05', 'diagonais_areas-03', 'angulos-01', 'm20-angulos-01', 'm20-angulos-02'],
  'm21-angulos-regulares': ['regulares-04', 'angulos-02', 'angulos-03', 'angulos-04', 'angulos-05', 'm21-angulos-regulares-01', 'regulares-05'],
  'm21-construcao': ['m21-construcao-01', 'm21-construcao-02', 'm21-construcao-03', 'm21-construcao-04'],
  'm21-inscricao': ['m21-inscricao-01', 'm21-inscricao-02', 'm21-inscricao-03', 'm21-inscricao-04'],
  'm21-notaveis': ['m21-notaveis-01', 'm21-notaveis-02', 'm21-notaveis-03', 'm21-notaveis-04', 'm21-notaveis-05'],
  'm21-area': ['diagonais_areas-04', 'diagonais_areas-05', 'aplicacoes-01', 'aplicacoes-02', 'aplicacoes-03', 'aplicacoes-04', 'aplicacoes-05']
};

test('[CONT-01] as trilhas seguem a ordem da apostila', () => {
  assert.deepEqual(topics.map(t => t.code), ['20.1', '20.2', '20.3', '20.4', '21.1', '21.2', '21.3', '21.4', '21.5']);
  assert.deepEqual(topics.map(t => t.id), Object.keys(EXPECTED));
  for (const t of topics) assert.equal(String(t.module), t.code.split('.')[0], t.id);
});

test('[CONT-02] IDs das questões são explícitos, únicos e estáveis', () => {
  for (const t of topics) assert.deepEqual(t.questions.map(q => q.id), EXPECTED[t.id], t.id);
  const ids = questions.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length, 'sem IDs repetidos');
  for (const id of ids) assert.match(id, /^[a-z0-9_-]{1,64}$/, id);
});

// Gabarito das 30 questões originais: [posição da alternativa correta, texto da alternativa correta].
// O progresso salvo guarda a POSIÇÃO escolhida; mudar a posição corromperia o histórico.
const LEGACY_KEY = {
  'fundamentos-01': [0, 'Figura fechada formada por segmentos de reta'], 'fundamentos-02': [2, 'Octógono'],
  'fundamentos-03': [2, 'Círculo'], 'fundamentos-04': [1, 'Hexágono'], 'fundamentos-05': [2, 'Linha poligonal que não é polígono'],
  'convexos-01': [1, 'Todo segmento entre pontos internos fica dentro dele'], 'convexos-02': [0, 'Menor que 180°'],
  'convexos-03': [0, 'Sim'], 'convexos-04': [2, '540°'], 'convexos-05': [1, '70°'],
  'regulares-01': [2, 'Lados e ângulos internos iguais'], 'regulares-02': [2, 'Todo triângulo equilátero'],
  'regulares-03': [1, 'Não, pois seus ângulos podem ser diferentes'], 'regulares-04': [2, '60°'], 'regulares-05': [2, '5'],
  'angulos-01': [2, '1440°'], 'angulos-02': [1, '135°'], 'angulos-03': [2, '45°'], 'angulos-04': [1, '12'], 'angulos-05': [1, '12'],
  'diagonais_areas-01': [2, '9'], 'diagonais_areas-02': [1, '5'], 'diagonais_areas-03': [1, '8'],
  'diagonais_areas-04': [2, '35 cm'], 'diagonais_areas-05': [0, '90 cm²'],
  'aplicacoes-01': [0, 'Triângulo equilátero, quadrado e hexágono regular'], 'aplicacoes-02': [2, 'Octógono regular'],
  'aplicacoes-03': [1, 'Porque oferecem rigidez estrutural'], 'aplicacoes-04': [1, 'Preenchem o plano e compartilham lados'],
  'aplicacoes-05': [2, '80 m']
};

test('[CONT-03] nenhuma questão da primeira versão foi removida nem teve o gabarito alterado', () => {
  assert.deepEqual(Object.keys(LEGACY_KEY).sort(), [...LEGACY_IDS].sort());
  for (const id of LEGACY_IDS) {
    assert.ok(byId.has(id), `faltando ${id}`);
    const [pos, text] = LEGACY_KEY[id];
    assert.equal(byId.get(id).a, pos, `${id}: posição da resposta correta mudou`);
    assert.equal(correctText(id), text, `${id}: texto da resposta correta mudou`);
  }
});

test('[CONT-04] cada questão tem enunciado, 4 alternativas distintas, gabarito, dica e explicação', () => {
  for (const q of questions) {
    assert.ok(q.q.trim().length > 10, q.id);
    assert.equal(q.opts.length, 4, q.id);
    assert.equal(new Set(q.opts).size, 4, `${q.id}: alternativas repetidas`);
    assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < 4, q.id);
    assert.ok(q.hint.trim().length > 10, `${q.id}: dica`);
    assert.ok(q.why.trim().length > 10, `${q.id}: explicação`);
  }
});

test('[CONT-05] cada trilha tem explicação, exemplo, passos, referência à apostila e resumo', () => {
  for (const t of topics) {
    for (const k of ['name', 'desc', 'icon', 'color', 'tag', 'lesson', 'example']) assert.ok(String(t[k]).trim(), `${t.id}.${k}`);
    assert.match(t.ref, /^Módulo 2[01] · p\. \d/, `${t.id}: referência`);
    assert.equal(t.steps.length, 4, `${t.id}: passos`);
    assert.ok(t.questions.length >= 4, `${t.id}: questões`);
    const g = topicGuides[t.id];
    assert.ok(g, `${t.id}: resumo`);
    assert.ok(g.title && g.analogy && g.check, `${t.id}: resumo incompleto`);
    assert.ok(g.sections.length >= 4 && g.sections.every(s => s.length === 2 && s[0] && s[1]), `${t.id}: seções`);
    assert.ok(g.formulas.length >= 3, `${t.id}: fórmulas`);
  }
  assert.deepEqual(Object.keys(topicGuides).sort(), topics.map(t => t.id).sort(), 'sem resumos órfãos');
});

// Gabaritos recalculados pelas fórmulas, para não depender só da revisão manual.
const d = n => n * (n - 3) / 2;
const Si = n => 180 * (n - 2);
const ai = n => Si(n) / n;
const ae = n => 360 / n;
const radical = s => { // "4√3 cm" → 4·√3; "9 cm" → 9
  const m = s.replace(',', '.').match(/^(\d+(?:\.\d+)?)?(?:√(\d+))?/);
  return (m[1] ? Number(m[1]) : 1) * (m[2] ? Math.sqrt(Number(m[2])) : 1);
};

test('[CONT-06] gabaritos numéricos conferem com as fórmulas', () => {
  const expected = {
    'fundamentos-02': 'Octógono',
    'diagonais_areas-01': `${d(6)}`,
    'diagonais_areas-02': `${8 - 3}`,
    'm20-diagonais-01': `${[...Array(30).keys()].find(n => n > 3 && d(n) === 20)}`,
    'm20-diagonais-02': `${6 / 2}`,
    'm20-diagonais-03': '0',
    'm20-diagonais-04': `${12 * 2}`,
    'convexos-04': `${Si(5)}°`,
    'convexos-05': `${360 - (80 + 100 + 110)}°`,
    'diagonais_areas-03': `${10 - 2}`,
    'angulos-01': `${Si(10)}°`,
    'm20-angulos-01': '360°',
    'm20-angulos-02': `${1800 / 180 + 2}`,
    'regulares-04': `${ae(6)}°`,
    'angulos-02': `${ai(8)}°`,
    'angulos-03': `${ae(8)}°`,
    'angulos-04': `${360 / 30}`,
    'angulos-05': `${360 / (180 - 150)}`,
    'm21-angulos-regulares-01': `${ai(24)}°`,
    'm21-construcao-01': `${ai(8)}°`,
    'm21-construcao-03': `5 partes de ${ae(5)}°`,
    'diagonais_areas-04': `${5 * 7} cm`,
    'diagonais_areas-05': `${(36 / 2) * 5} cm²`,
    'aplicacoes-05': `${4 * 20} m`
  };
  for (const [id, text] of Object.entries(expected)) assert.equal(correctText(id), text, id);

  // Polígonos notáveis (valores com radicais comparados numericamente).
  const close = (id, value) => assert.ok(Math.abs(radical(correctText(id)) - value) < 1e-9, `${id}: ${correctText(id)} ≠ ${value}`);
  close('m21-notaveis-01', 9);                           // hexágono: ℓ = R
  close('m21-notaveis-02', 2 * 7);                       // quadrado: ℓ = 2r
  close('m21-notaveis-03', 5 * Math.sqrt(3) * Math.sqrt(3)); // triângulo: ℓ = R√3
  close('m21-notaveis-04', 8 * Math.sqrt(3) / 2);        // hexágono: aₚ = ℓ√3/2
});

test('[CONT-07] a marcação "Estamos aqui na escola" aponta para uma trilha existente', () => {
  const { school } = require('../content.js');
  assert.ok(school && 'currentTopic' in school, 'configuração school.currentTopic presente');
  if (school.currentTopic !== null) assert.ok(topics.some(t => t.id === school.currentTopic), `trilha inexistente: ${school.currentTopic}`);
});

test('[CONT-08] o index.html carrega o conteúdo de content.js, sem cópia embutida', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.ok(!html.includes('const topics = ['), 'conteúdo não deve ficar duplicado no index.html');
  const iContent = html.indexOf('<script src="content.js"></script>');
  const iProgress = html.indexOf('<script src="progress.js"></script>');
  const iApp = html.indexOf('window.MathVivaContent');
  assert.ok(iContent > 0 && iContent < iProgress && iProgress < iApp, 'ordem dos scripts: content.js, progress.js, aplicativo');
});
