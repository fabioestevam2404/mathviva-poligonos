// Fuso fixo para que os testes de data local não dependam da máquina (UTC−3, sem horário de verão).
process.env.TZ = 'America/Sao_Paulo';

const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../progress.js');
const { topics } = require('../content.js');
const allIds = topics.flatMap(t => t.questions.map(q => q.id));

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

const at = (y, m, d, h = 12, min = 0) => new Date(y, m - 1, d, h, min);
const answer = (state, questionId, correct, extra = {}) =>
  P.recordAnswer(state, { questionId, option: correct ? 0 : 1, correct, hintUsed: false, now: at(2026, 10, 12), ...extra });

test('[PROG-01][PROG-02][PROG-06] repetir uma questão conta tentativas, mas o progresso só uma vez', () => {
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

test('[PROG-02] guarda a primeira resposta e atualiza o último resultado', () => {
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

test('[PROG-01][PROG-06] errar não conta como desafio vencido', () => {
  const s = P.createEmpty();
  answer(s, 'regulares-02', false);
  assert.equal(P.countMastered(s, ['regulares-02']), 0);
  assert.equal(s.xp, 0);
});

test('[PROG-03][PROG-05] acerto com dica não conta no progresso, mas registra o uso da dica e soma XP', () => {
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

test('[PROG-07] meta diária considera apenas a data local do dispositivo', () => {
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

test('[PROG-08] data local difere da data UTC perto da meia-noite', () => {
  // 22h30 de 12/10 em São Paulo já é 13/10 em UTC.
  const evening = new Date('2026-10-13T01:30:00Z');
  assert.equal(P.localDateKey(evening), '2026-10-12');
  const s = P.createEmpty();
  answer(s, 'angulos-02', true, { now: evening });
  assert.deepEqual(Object.keys(s.activity), ['2026-10-12']);
});

test('[PROG-07] meta diária fica limitada a 100%', () => {
  const s = P.createEmpty();
  for (let i = 0; i < 8; i++) answer(s, 'angulos-03', i % 2 === 0);
  const d = P.dailyStats(s, at(2026, 10, 12));
  assert.equal(d.answered, 8);
  assert.equal(d.percent, 100);
});

test('[STOR-01] salvar e carregar preserva o estado e o schemaVersion', () => {
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

test('[STOR-02] sem dados salvos começa vazio', () => {
  const r = P.loadProgress(new MemoryStorage());
  assert.equal(r.status, 'empty');
  assert.deepEqual(r.state, P.createEmpty());
});

test('[STOR-06] JSON inválido: não lança erro, guarda cópia e recomeça', () => {
  const storage = new MemoryStorage({ [P.STORAGE_KEY]: '{"schemaVersion":2,"xp":' });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'corrupt');
  assert.deepEqual(r.state, P.createEmpty());
  assert.equal(storage.getItem(P.BACKUP_KEY), '{"schemaVersion":2,"xp":');
});

test('[STOR-06] estruturas com formato errado são tratadas como corrompidas', () => {
  for (const raw of ['null', '[]', '42', '"texto"', '{}', '{"schemaVersion":3,"xp":5}', '{"schemaVersion":"2"}']) {
    const r = P.loadProgress(new MemoryStorage({ [P.STORAGE_KEY]: raw }));
    assert.equal(r.status, 'corrupt', raw);
    assert.deepEqual(r.state, P.createEmpty(), raw);
  }
});

test('[STOR-07] campos inválidos são descartados individualmente, preservando o restante', () => {
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

test('[STOR-03] localStorage inacessível: carregar e salvar não lançam erro', () => {
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

test('[STOR-04] cota excedida na gravação é informada sem perder o estado em memória', () => {
  const storage = new FullStorage();
  const s = P.createEmpty();
  answer(s, 'aplicacoes-05', true);
  const saved = P.saveProgress(storage, s);
  assert.equal(saved.ok, false);
  assert.equal(saved.error.name, 'QuotaExceededError');
  assert.equal(s.xp, 10);
});

test('[STOR-09][STOR-10] migração do formato antigo preserva o histórico sem inventar acertos por questão', () => {
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

test('[STOR-09] migração descarta valores antigos inválidos', () => {
  const storage = new MemoryStorage({ [P.LEGACY_KEY]: JSON.stringify({ answered: -1, correct: '3', xp: 2.5, topics: { angulos: 'x', convexos: 2 } }) });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'migrated');
  assert.deepEqual(r.state.legacy.topics, { convexos: 2 });
  assert.equal(r.state.legacy.answered, 0);
  assert.equal(r.state.xp, 0);
});

test('[STOR-11] formato antigo ilegível é sinalizado e não é apagado', () => {
  const storage = new MemoryStorage({ [P.LEGACY_KEY]: 'não é json' });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'corrupt');
  assert.equal(storage.getItem(P.LEGACY_KEY), 'não é json');
});

test('[STOR-12] dados atuais corrompidos recorrem ao histórico antigo quando ele existe', () => {
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

test('[STOR-08] dados corrompidos sem cópia possível: funciona em memória e bloqueia a gravação', () => {
  const storage = new NoBackupStorage({ [P.STORAGE_KEY]: '{quebrado' });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'corrupt');
  assert.equal(r.writable, false);
  assert.equal(storage.getItem(P.BACKUP_KEY), null);
  answer(r.state, 'angulos-04', true);
  assert.equal(P.countMastered(r.state, ['angulos-04']), 1, 'o estado em memória continua utilizável');
  assert.equal(storage.getItem(P.STORAGE_KEY), '{quebrado', 'o original não foi tocado');
});

test('[STOR-08] dados reparáveis sem cópia possível também bloqueiam a gravação', () => {
  const raw = JSON.stringify({ ...P.createEmpty(), xp: 'muito' });
  const r = P.loadProgress(new NoBackupStorage({ [P.STORAGE_KEY]: raw }));
  assert.equal(r.status, 'repaired');
  assert.equal(r.writable, false);
});

test('[STOR-08] com cópia feita, a gravação continua liberada', () => {
  assert.equal(P.loadProgress(new MemoryStorage({ [P.STORAGE_KEY]: '{quebrado' })).writable, true);
  assert.equal(P.loadProgress(new MemoryStorage()).writable, true);
  assert.equal(P.loadProgress(new MemoryStorage({ [P.LEGACY_KEY]: 'x' })).writable, true, 'a chave antiga nunca é sobrescrita');
  assert.equal(P.loadProgress(null).writable, false);
});

test('[STOR-08][STOR-12] corrompido + histórico antigo + falha na cópia: migra em memória sem gravar', () => {
  const storage = new NoBackupStorage({ [P.STORAGE_KEY]: '###', [P.LEGACY_KEY]: JSON.stringify({ answered: 3, correct: 2, xp: 20 }) });
  const r = P.loadProgress(storage);
  assert.equal(r.status, 'corrupt');
  assert.equal(r.writable, false);
  assert.equal(r.state.legacy.answered, 3);
});

test('[PROG-10] estrelas das conquistas: uma a cada terço do total vencido sem dica', () => {
  const by30 = m => P.journeyStars(m, 30);
  assert.deepEqual([0, 9, 10, 19, 20, 29, 30, 99].map(by30), [0, 0, 1, 1, 2, 2, 3, 3], 'com 30 desafios mantém a regra anterior');
  const total = allIds.length;
  assert.equal(P.journeyStars(Math.ceil(total / 3) - 1, total), 0);
  assert.equal(P.journeyStars(Math.ceil(total / 3), total), 1);
  assert.equal(P.journeyStars(total - 1, total), 2);
  assert.equal(P.journeyStars(total, total), 3);
  assert.equal(P.journeyStars(5, 0), 0, 'sem desafios não há estrela');
  // A legenda da página anuncia a k-ésima estrela em ceil(k·total/3) desafios: a regra precisa bater.
  for (const k of [1, 2, 3]) {
    const mark = Math.ceil(k * total / 3);
    assert.equal(P.journeyStars(mark, total), k, `marco ${mark}`);
    assert.equal(P.journeyStars(mark - 1, total), k - 1, `antes do marco ${mark}`);
  }

  const s = P.createEmpty();
  for (let i = 1; i <= 5; i++) answer(s, `fundamentos-0${i}`, true);
  for (let i = 1; i <= 5; i++) answer(s, `convexos-0${i}`, true, { hintUsed: i > 4 });
  for (let i = 1; i <= 5; i++) answer(s, 'fundamentos-01', true);
  assert.equal(P.countMastered(s, allIds), 9, 'repetição e acerto com dica não contam');
  assert.equal(P.journeyStars(P.countMastered(s, allIds), total), 0);
});

test('[PROG-11] estrelas da trilha acompanham o tamanho da trilha', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(d => P.topicStars(d, 5)), [0, 1, 1, 2, 2, 3], 'com 5 questões mantém a regra anterior');
  assert.deepEqual([0, 1, 3, 4, 6, 7].map(d => P.topicStars(d, 7)), [0, 1, 1, 2, 2, 3]);
  assert.deepEqual([0, 1, 2, 3, 4].map(d => P.topicStars(d, 4)), [0, 1, 2, 2, 3]);
  assert.equal(P.topicStars(3, 0), 0);
});

test('[STOR-13] o histórico diário guarda só os 120 dias mais recentes com atividade', () => {
  const s = P.createEmpty();
  const days = [];
  for (let i = 0; i < 125; i++) days.push(P.localDateKey(at(2026, 1, 1 + i)));
  for (const d of days) s.activity[d] = { answered: 1, correct: 0 };
  answer(s, 'angulos-01', true, { now: at(2026, 10, 12) });
  const kept = Object.keys(s.activity).sort();
  assert.equal(kept.length, 120);
  assert.equal(kept[kept.length - 1], '2026-10-12', 'o dia da nova resposta é mantido');
  assert.ok(!kept.includes(days[0]), 'os dias mais antigos saem primeiro');
  assert.deepEqual(kept.slice(0, -1), days.slice(-119), 'mantém os 119 dias anteriores mais recentes');
});

test('[PROG-12] IDs de questão inválidos são recusados', () => {
  for (const questionId of [undefined, null, 7, '', 'com espaço']) {
    assert.throws(() => P.recordAnswer(P.createEmpty(), { questionId, option: 0, correct: true, hintUsed: false }), String(questionId));
  }
});
