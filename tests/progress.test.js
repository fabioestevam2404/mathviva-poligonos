// Fuso fixo para que os testes de data local não dependam da máquina (UTC−3, sem horário de verão).
process.env.TZ = 'America/Sao_Paulo';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const P = require('../progress.js');

/** Armazenamento em memória com a mesma interface usada do localStorage. */
class MemoryStorage {
  constructor(initial = {}) { this.data = new Map(Object.entries(initial)); }
  getItem(k) { return this.data.has(k) ? this.data.get(k) : null; }
  setItem(k, v) { this.data.set(k, String(v)); }
}
class ThrowingStorage {
  getItem() { throw new Error('SecurityError'); }
  setItem() { throw new Error('SecurityError'); }
}
class FullStorage extends MemoryStorage {
  setItem() { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; }
}

/** Extrai o array `topics` diretamente do index.html, sem duplicar o conteúdo didático. */
function loadTopics() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const start = html.indexOf('const topics = [');
  const end = html.indexOf('\n];', start);
  assert.ok(start > 0 && end > start, 'array topics encontrado no index.html');
  // JSON normaliza os objetos criados em outro contexto do vm (protótipos diferentes).
  return JSON.parse(JSON.stringify(vm.runInNewContext(html.slice(start + 'const topics = '.length, end + 3).replace(/;$/, ''))));
}

const at = (y, m, d, h = 12, min = 0) => new Date(y, m - 1, d, h, min);
const answer = (state, questionId, correct, extra = {}) =>
  P.recordAnswer(state, { questionId, option: correct ? 0 : 1, correct, hintUsed: false, now: at(2026, 10, 12), ...extra });

test('as 30 questões têm IDs explícitos, únicos e estáveis', () => {
  const topics = loadTopics();
  const ids = topics.flatMap(t => t.questions.map(q => q.id));
  assert.equal(ids.length, 30);
  assert.equal(new Set(ids).size, 30);
  const expected = topics.flatMap(t => [1, 2, 3, 4, 5].map(n => `${t.id}-0${n}`));
  assert.deepEqual(ids, expected);
  assert.deepEqual(topics.map(t => t.id), ['fundamentos', 'convexos', 'regulares', 'angulos', 'diagonais_areas', 'aplicacoes']);
});

test('repetir uma questão conta tentativas, mas o progresso só uma vez', () => {
  const s = P.createEmpty();
  const r1 = answer(s, 'angulos-01', true);
  const r2 = answer(s, 'angulos-01', true);
  assert.equal(r1.newlyMastered, true);
  assert.equal(r2.newlyMastered, false);
  const q = s.questions['angulos-01'];
  assert.equal(q.attempts, 2);
  assert.equal(q.correctCount, 2);
  assert.equal(P.countMastered(s, ['angulos-01', 'angulos-02']), 1);
  assert.equal(s.xp, 20, 'XP é participação e continua somando');
  assert.deepEqual(P.totals(s), { answered: 2, correct: 2, xp: 20 });
});

test('guarda a primeira resposta e atualiza o último resultado', () => {
  const s = P.createEmpty();
  answer(s, 'convexos-04', false, { option: 3, now: at(2026, 10, 10) });
  answer(s, 'convexos-04', true, { option: 2, now: at(2026, 10, 11) });
  const q = s.questions['convexos-04'];
  assert.deepEqual({ option: q.first.option, correct: q.first.correct }, { option: 3, correct: false });
  assert.deepEqual({ option: q.last.option, correct: q.last.correct }, { option: 2, correct: true });
  assert.equal(q.attempts, 2);
  assert.equal(q.correctCount, 1);
  assert.ok(P.isMastered(q));
});

test('errar não conta como desafio vencido', () => {
  const s = P.createEmpty();
  answer(s, 'regulares-02', false);
  assert.equal(P.countMastered(s, ['regulares-02']), 0);
  assert.equal(s.xp, 0);
});

test('acerto com dica não conta no progresso, mas registra o uso da dica e soma XP', () => {
  const s = P.createEmpty();
  const r = answer(s, 'fundamentos-02', true, { hintUsed: true });
  assert.equal(r.newlyMastered, false);
  assert.equal(P.countMastered(s, ['fundamentos-02']), 0);
  assert.equal(s.questions['fundamentos-02'].hintCount, 1);
  assert.equal(s.questions['fundamentos-02'].first.hintUsed, true);
  assert.equal(s.xp, 10);

  const r2 = answer(s, 'fundamentos-02', true, { hintUsed: false });
  assert.equal(r2.newlyMastered, true);
  assert.equal(P.countMastered(s, ['fundamentos-02']), 1);
  assert.equal(s.questions['fundamentos-02'].hintCount, 1);

  answer(s, 'fundamentos-02', true, { hintUsed: true });
  assert.equal(P.countMastered(s, ['fundamentos-02']), 1, 'usar dica depois não desfaz a conquista');
});

test('meta diária considera apenas a data local do dispositivo', () => {
  const s = P.createEmpty();
  for (let i = 0; i < 3; i++) answer(s, `aplicacoes-0${i + 1}`, true, { now: at(2026, 10, 12, 23, 50) });
  answer(s, 'aplicacoes-04', false, { now: at(2026, 10, 13, 0, 10) });

  assert.equal(P.dailyStats(s, at(2026, 10, 12, 23, 59)).answered, 3);
  const nextDay = P.dailyStats(s, at(2026, 10, 13, 8, 0));
  assert.equal(nextDay.answered, 1);
  assert.equal(nextDay.correct, 0);
  assert.equal(nextDay.percent, 20);
  assert.equal(P.dailyStats(s, at(2026, 10, 14)).answered, 0, 'dia novo começa zerado');
  assert.equal(P.totals(s).answered, 4, 'total acumulado não depende do dia');
});

test('data local difere da data UTC perto da meia-noite', () => {
  // 22h30 de 12/10 em São Paulo já é 13/10 em UTC.
  const evening = new Date('2026-10-13T01:30:00Z');
  assert.equal(P.localDateKey(evening), '2026-10-12');
  const s = P.createEmpty();
  answer(s, 'angulos-02', true, { now: evening });
  assert.deepEqual(Object.keys(s.activity), ['2026-10-12']);
});

test('meta diária fica limitada a 100%', () => {
  const s = P.createEmpty();
  for (let i = 0; i < 8; i++) answer(s, 'angulos-03', i % 2 === 0);
  const d = P.dailyStats(s, at(2026, 10, 12));
  assert.equal(d.answered, 8);
  assert.equal(d.percent, 100);
});

test('salvar e carregar preserva o estado e o schemaVersion', () => {
  const storage = new MemoryStorage();
  const s = P.createEmpty();
  answer(s, 'diagonais_areas-05', true, { hintUsed: true });
  assert.equal(P.saveProgress(storage, s).ok, true);
  const stored = JSON.parse(storage.getItem(P.STORAGE_KEY));
  assert.equal(stored.schemaVersion, 2);
  const loaded = P.loadProgress(storage);
  assert.equal(loaded.status, 'ok');
  assert.deepEqual(loaded.state, s);
});

test('sem dados salvos começa vazio', () => {
  const r = P.loadProgress(new MemoryStorage());
  assert.equal(r.status, 'empty');
  assert.deepEqual(r.state, P.createEmpty());
});

test('JSON inválido: não lança erro, guarda cópia e recomeça', () => {
  const storage = new MemoryStorage({ [P.STORAGE_KEY]: '{"schemaVersion":2,"xp":' });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'corrupt');
  assert.deepEqual(r.state, P.createEmpty());
  assert.equal(storage.getItem(P.BACKUP_KEY), '{"schemaVersion":2,"xp":');
});

test('estruturas com formato errado são tratadas como corrompidas', () => {
  for (const raw of ['null', '[]', '42', '"texto"', '{}', '{"schemaVersion":3,"xp":5}', '{"schemaVersion":"2"}']) {
    const r = P.loadProgress(new MemoryStorage({ [P.STORAGE_KEY]: raw }));
    assert.equal(r.status, 'corrupt', raw);
    assert.deepEqual(r.state, P.createEmpty(), raw);
  }
});

test('campos inválidos são descartados individualmente, preservando o restante', () => {
  const good = P.createEmpty();
  answer(good, 'convexos-01', true);
  const raw = JSON.parse(JSON.stringify(good));
  raw.xp = -5;
  raw.questions['convexos-02'] = { attempts: 'muitas' };
  raw.questions['convexos-03'] = { ...raw.questions['convexos-01'], correctCount: 9 };
  raw.questions['<script>'] = raw.questions['convexos-01'];
  raw.activity['ontem'] = { answered: 1, correct: 0 };
  raw.activity['2026-10-01'] = { answered: 1, correct: 2 };
  const storage = new MemoryStorage({ [P.STORAGE_KEY]: JSON.stringify(raw) });

  const r = P.loadProgress(storage);
  assert.equal(r.status, 'repaired');
  assert.deepEqual(Object.keys(r.state.questions), ['convexos-01']);
  assert.deepEqual(Object.keys(r.state.activity), ['2026-10-12']);
  assert.equal(r.state.xp, 0);
  assert.ok(storage.getItem(P.BACKUP_KEY), 'conteúdo original guardado antes de ser regravado');
});

test('localStorage inacessível: carregar e salvar não lançam erro', () => {
  for (const storage of [null, new ThrowingStorage()]) {
    const r = P.loadProgress(storage);
    assert.equal(r.status, 'unavailable');
    const s = r.state;
    answer(s, 'regulares-01', true);
    const saved = P.saveProgress(storage, s);
    assert.equal(saved.ok, false);
    assert.ok(saved.error instanceof Error);
    assert.equal(P.countMastered(s, ['regulares-01']), 1, 'o progresso continua na memória');
  }
});

test('cota excedida na gravação é informada sem perder o estado em memória', () => {
  const storage = new FullStorage();
  const s = P.createEmpty();
  answer(s, 'aplicacoes-05', true);
  const saved = P.saveProgress(storage, s);
  assert.equal(saved.ok, false);
  assert.equal(saved.error.name, 'QuotaExceededError');
  assert.equal(s.xp, 10);
});

test('migração do formato antigo preserva o histórico sem inventar acertos por questão', () => {
  const legacy = { answered: 12, correct: 8, xp: 80, topics: { fundamentos: 7, angulos: 1 }, lastStudy: '2026-10-01' };
  const legacyText = JSON.stringify(legacy);
  const storage = new MemoryStorage({ [P.LEGACY_KEY]: legacyText });
  const now = new Date('2026-10-12T15:00:00Z');

  const r = P.loadProgress(storage, now);
  assert.equal(r.status, 'migrated');
  assert.equal(r.state.schemaVersion, 2);
  assert.deepEqual(r.state.questions, {}, 'nenhuma questão é marcada como acertada');
  assert.deepEqual(r.state.activity, {}, 'nenhuma atividade diária é inventada');
  assert.equal(r.state.xp, 80);
  assert.deepEqual(r.state.legacy, { ...legacy, migratedAt: now.toISOString() });
  assert.deepEqual(P.totals(r.state), { answered: 12, correct: 8, xp: 80 });
  assert.equal(P.countMastered(r.state, ['fundamentos-01', 'fundamentos-02']), 0);

  assert.equal(P.saveProgress(storage, r.state).ok, true);
  assert.equal(storage.getItem(P.LEGACY_KEY), legacyText, 'chave antiga permanece intacta');

  answer(r.state, 'fundamentos-01', true);
  assert.deepEqual(P.totals(r.state), { answered: 13, correct: 9, xp: 90 });

  const reloaded = P.loadProgress(storage);
  assert.equal(reloaded.status, 'ok', 'depois de migrado, a chave nova tem prioridade');
  assert.equal(reloaded.state.legacy.answered, 12);
});

test('migração descarta valores antigos inválidos', () => {
  const storage = new MemoryStorage({ [P.LEGACY_KEY]: JSON.stringify({ answered: -1, correct: '3', xp: 2.5, topics: { angulos: 'x', convexos: 2 } }) });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'migrated');
  assert.deepEqual(r.state.legacy.topics, { convexos: 2 });
  assert.equal(r.state.legacy.answered, 0);
  assert.equal(r.state.xp, 0);
});

test('formato antigo ilegível é sinalizado e não é apagado', () => {
  const storage = new MemoryStorage({ [P.LEGACY_KEY]: 'não é json' });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'corrupt');
  assert.equal(storage.getItem(P.LEGACY_KEY), 'não é json');
});

test('dados atuais corrompidos recorrem ao histórico antigo quando ele existe', () => {
  const storage = new MemoryStorage({ [P.STORAGE_KEY]: '###', [P.LEGACY_KEY]: JSON.stringify({ answered: 3, correct: 2, xp: 20 }) });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'corrupt');
  assert.equal(r.state.legacy.answered, 3);
  assert.equal(storage.getItem(P.BACKUP_KEY), '###');
});

/** Lê normalmente, mas não consegue gravar a cópia de segurança. */
class NoBackupStorage extends MemoryStorage {
  setItem(k, v) { if (k === P.BACKUP_KEY) throw new Error('QuotaExceededError'); super.setItem(k, v); }
}

test('dados corrompidos sem cópia possível: funciona em memória e bloqueia a gravação', () => {
  const storage = new NoBackupStorage({ [P.STORAGE_KEY]: '{quebrado' });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'corrupt');
  assert.equal(r.writable, false);
  assert.equal(storage.getItem(P.BACKUP_KEY), null);
  answer(r.state, 'angulos-04', true);
  assert.equal(P.countMastered(r.state, ['angulos-04']), 1, 'o estado em memória continua utilizável');
  assert.equal(storage.getItem(P.STORAGE_KEY), '{quebrado', 'o original não foi tocado');
});

test('dados reparáveis sem cópia possível também bloqueiam a gravação', () => {
  const raw = JSON.stringify({ ...P.createEmpty(), xp: 'muito' });
  const r = P.loadProgress(new NoBackupStorage({ [P.STORAGE_KEY]: raw }));
  assert.equal(r.status, 'repaired');
  assert.equal(r.writable, false);
});

test('com cópia feita, a gravação continua liberada', () => {
  assert.equal(P.loadProgress(new MemoryStorage({ [P.STORAGE_KEY]: '{quebrado' })).writable, true);
  assert.equal(P.loadProgress(new MemoryStorage()).writable, true);
  assert.equal(P.loadProgress(new MemoryStorage({ [P.LEGACY_KEY]: 'x' })).writable, true, 'a chave antiga nunca é sobrescrita');
  assert.equal(P.loadProgress(null).writable, false);
});

test('corrompido + histórico antigo + falha na cópia: migra em memória sem gravar', () => {
  const storage = new NoBackupStorage({ [P.STORAGE_KEY]: '###', [P.LEGACY_KEY]: JSON.stringify({ answered: 3, correct: 2, xp: 20 }) });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'corrupt');
  assert.equal(r.writable, false);
  assert.equal(r.state.legacy.answered, 3);
});

test('estrelas das conquistas: uma a cada 10 desafios vencidos sem dica', () => {
  assert.deepEqual([0, 9, 10, 19, 20, 29, 30, 99].map(P.journeyStars), [0, 0, 1, 1, 2, 2, 3, 3]);
  const s = P.createEmpty();
  for (let i = 1; i <= 5; i++) answer(s, `fundamentos-0${i}`, true);
  for (let i = 1; i <= 5; i++) answer(s, `convexos-0${i}`, true, { hintUsed: i > 4 });
  for (let i = 1; i <= 5; i++) answer(s, 'fundamentos-01', true);
  const topics = loadTopics();
  const ids = topics.flatMap(t => t.questions.map(q => q.id));
  assert.equal(P.countMastered(s, ids), 9, 'repetição e acerto com dica não contam');
  assert.equal(P.journeyStars(P.countMastered(s, ids)), 0);
});

test('IDs de questão inválidos são recusados', () => {
  for (const questionId of [undefined, null, 7, '', 'com espaço']) {
    assert.throws(() => P.recordAnswer(P.createEmpty(), { questionId, option: 0, correct: true, hintUsed: false }), String(questionId));
  }
});
