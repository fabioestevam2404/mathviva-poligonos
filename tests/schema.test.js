// Contratos formais (schemas/): conteúdo (CONT-10) e dados salvos (STOR-14).
process.env.TZ = 'America/Sao_Paulo';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validate } = require('../scripts/validate-schema.js');
const content = require('../content.js');
const P = require('../progress.js');
const contentSchema = require('../schemas/content.schema.json');
const progressSchema = require('../schemas/progress-v2.schema.json');

const clone = v => JSON.parse(JSON.stringify(v));
class MemoryStorage {
  constructor(initial = {}) { this.data = new Map(Object.entries(initial)); }
  getItem(k) { return this.data.has(k) ? this.data.get(k) : null; }
  setItem(k, v) { this.data.set(k, String(v)); }
}

test('[CONT-10] o content.js segue o contrato', () => {
  assert.deepEqual(validate(contentSchema, clone(content)), []);
});

test('[CONT-10] o contrato recusa conteúdo malformado', () => {
  const cases = {
    'questão sem dica': c => { delete c.topics[0].questions[0].hint; },
    'gabarito como texto': c => { c.topics[0].questions[0].a = '0'; },
    'gabarito fora das alternativas': c => { c.topics[0].questions[0].a = 4; },
    'quinta alternativa': c => { c.topics[0].questions[0].opts.push('Outra'); },
    'alternativas repetidas': c => { const o = c.topics[0].questions[0].opts; o[1] = o[0]; },
    'ID fora do padrão': c => { c.topics[0].questions[0].id = 'Questão 1'; },
    'campo desconhecido': c => { c.topics[0].questions[0].resposta = 'x'; },
    'referência sem página': c => { c.topics[0].ref = 'Apostila'; },
    'cor inválida': c => { c.topics[0].color = 'azul'; },
    'resumo sem fórmulas': c => { c.topicGuides[c.topics[0].id].formulas = []; },
    'marcação com número': c => { c.school.currentTopic = 3; }
  };
  for (const [name, mutate] of Object.entries(cases)) {
    const c = clone(content);
    mutate(c);
    assert.ok(validate(contentSchema, c).length > 0, `deveria recusar: ${name}`);
  }
});

const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
function stringLeaves(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (v && typeof v === 'object') Object.values(v).forEach(x => stringLeaves(x, out));
  return out;
}

test('[STOR-14] estados carregados de qualquer conteúdo seguem o contrato da versão 2', () => {
  const evil = '<img src=x onerror=alert(1)>';
  const okAnswer = { option: 1, correct: true, hintUsed: false, at: '2026-10-14T18:02:11.000Z' };
  const payloads = {
    vazio: null,
    válido: JSON.stringify({ schemaVersion: 2, xp: 10, questions: { 'angulos-01': { attempts: 1, correctCount: 1, hintCount: 0, first: okAnswer, last: okAnswer, masteredAt: okAnswer.at } }, activity: { '2026-10-14': { answered: 1, correct: 1 } }, legacy: null }),
    'HTML nas datas': JSON.stringify({ schemaVersion: 2, xp: 0, questions: { 'angulos-02': { attempts: 1, correctCount: 0, hintCount: 0, first: { ...okAnswer, at: evil }, last: okAnswer, masteredAt: evil } }, activity: {}, legacy: null }),
    'campos extras': JSON.stringify({ schemaVersion: 2, xp: 5, extra: evil, questions: { 'angulos-03': { attempts: 1, correctCount: 1, hintCount: 0, first: { ...okAnswer, nota: evil }, last: okAnswer, masteredAt: null, comentario: evil } }, activity: { '2026-10-14': { answered: 1, correct: 0, obs: evil } }, legacy: null }),
    'tipos trocados': JSON.stringify({ schemaVersion: 2, xp: '10', questions: [], activity: 'hoje', legacy: 'nada' }),
    'legado malicioso': JSON.stringify({ schemaVersion: 2, xp: 1, questions: {}, activity: {}, legacy: { answered: 3, correct: evil, xp: 1, topics: { [evil]: 2, angulos: 1 }, lastStudy: evil, migratedAt: evil, extra: evil } }),
    'JSON quebrado': '{"schemaVersion":2,'
  };
  for (const [name, raw] of Object.entries(payloads)) {
    const storage = new MemoryStorage(raw === null ? {} : { [P.STORAGE_KEY]: raw });
    const { state } = P.loadProgress(storage);
    P.recordAnswer(state, { questionId: 'convexos-01', option: 1, correct: true, hintUsed: false });
    assert.deepEqual(validate(progressSchema, state), [], name);
    for (const s of stringLeaves(state)) assert.ok(DATE_TIME.test(s) || DATE.test(s), `${name}: texto livre mantido: ${s}`);
  }
});

test('[STOR-14] dados da primeira versão com HTML são limpos na migração', () => {
  const evil = '<script>alert(1)</script>';
  const storage = new MemoryStorage({ [P.LEGACY_KEY]: JSON.stringify({ answered: 2, correct: 1, xp: 10, topics: { fundamentos: 1, [evil]: 1 }, lastStudy: evil }) });
  const { state, status } = P.loadProgress(storage);
  assert.equal(status, 'migrated');
  assert.deepEqual(validate(progressSchema, state), []);
  assert.deepEqual(state.legacy.topics, { fundamentos: 1 });
  assert.equal(state.legacy.lastStudy, null);
});

test('[STOR-14] o contrato recusa estados fora do formato', () => {
  const base = P.createEmpty();
  P.recordAnswer(base, { questionId: 'angulos-01', option: 0, correct: true, hintUsed: false });
  assert.deepEqual(validate(progressSchema, base), []);
  const cases = {
    'versão errada': s => { s.schemaVersion = 3; },
    'campo extra na raiz': s => { s.extra = 1; },
    'data livre': s => { s.questions['angulos-01'].first.at = 'ontem'; },
    'tentativas zero': s => { s.questions['angulos-01'].attempts = 0; },
    'dia fora do formato': s => { s.activity['14/10/2026'] = { answered: 1, correct: 0 }; }
  };
  for (const [name, mutate] of Object.entries(cases)) {
    const s = clone(base);
    mutate(s);
    assert.ok(validate(progressSchema, s).length > 0, `deveria recusar: ${name}`);
  }
});
