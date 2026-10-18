// Modo "Revisar erros" (specs/review.spec.md).
process.env.TZ = 'America/Sao_Paulo';

const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../progress.js');
const { topics } = require('../content.js');
const { validate } = require('../scripts/validate-schema.js');
const progressSchema = require('../schemas/progress-v2.schema.json');

const ids = topics.flatMap(t => t.questions.map(q => q.id)); // ordem das trilhas na apostila
const now = new Date(2026, 9, 18, 15, 0);
const reply = (s, id, correct, hintUsed = false) => P.recordAnswer(s, { questionId: id, option: correct ? 0 : 1, correct, hintUsed, now });
const queueIds = (s, limit) => P.reviewQueue(s, ids, limit).items.map(i => i.id);

test('[REV-01] entram as questões tentadas e ainda não vencidas', () => {
  const s = P.createEmpty();
  reply(s, ids[0], false);             // errou
  reply(s, ids[1], true, true);        // acertou com dica
  reply(s, ids[2], true);              // venceu
  reply(s, ids[3], false); reply(s, ids[3], true); // errou e depois venceu
  const q = P.reviewQueue(s, ids);
  assert.deepEqual(q.items.map(i => i.id), [ids[0], ids[1]]);
  assert.equal(q.total, 2);
  assert.ok(!queueIds(s).includes(ids[4]), 'questão nunca respondida não entra');
  assert.deepEqual(P.reviewQueue(P.createEmpty(), ids), { items: [], total: 0 }, 'sem respostas, nada para revisar');
});

test('[REV-02] primeiro as nunca acertadas, depois as acertadas com dica, na ordem da apostila', () => {
  const s = P.createEmpty();
  // Respondidas fora de ordem, de propósito.
  reply(s, ids[40], true, true);
  reply(s, ids[30], false);
  reply(s, ids[5], true, true);
  reply(s, ids[20], false); reply(s, ids[20], false);
  reply(s, ids[10], false); reply(s, ids[10], true, true); // já acertou com dica: grupo "hint"
  const q = P.reviewQueue(s, ids);
  assert.deepEqual(q.items, [
    { id: ids[20], reason: 'never' }, { id: ids[30], reason: 'never' },
    { id: ids[5], reason: 'hint' }, { id: ids[10], reason: 'hint' }, { id: ids[40], reason: 'hint' }
  ]);
});

test('[REV-03] a sessão tem no máximo 10 questões e informa o total', () => {
  const s = P.createEmpty();
  for (const id of ids.slice(0, 15)) reply(s, id, false);
  const q = P.reviewQueue(s, ids);
  assert.equal(P.REVIEW_LIMIT, 10);
  assert.equal(q.items.length, 10);
  assert.equal(q.total, 15);
  assert.deepEqual(q.items.map(i => i.id), ids.slice(0, 10), 'as 10 primeiras da prioridade');
  assert.equal(P.reviewQueue(s, ids, 3).items.length, 3, 'limite configurável');
});

test('[REV-04] respostas na revisão seguem as regras de sempre', () => {
  const s = P.createEmpty();
  reply(s, ids[0], false);
  reply(s, ids[1], false);
  const before = { xp: s.xp, answered: P.dailyStats(s, now).answered };

  reply(s, ids[0], true, true); // acerto com dica na revisão
  assert.equal(s.xp, before.xp + 10, 'acerto rende XP');
  assert.equal(P.dailyStats(s, now).answered, before.answered + 1, 'conta na meta do dia');
  assert.deepEqual(P.reviewQueue(s, ids).items.find(i => i.id === ids[0]), { id: ids[0], reason: 'hint' }, 'continua, agora como acertada com dica');

  const r = reply(s, ids[1], true); // acerto sem dica na revisão
  assert.equal(r.newlyMastered, true);
  assert.ok(!queueIds(s).includes(ids[1]), 'vencida sem dica sai da próxima sessão');
});

test('[REV-05] calcular a revisão não altera o progresso nem o formato salvo', () => {
  const s = P.createEmpty();
  reply(s, ids[0], false);
  reply(s, ids[1], true, true);
  const snapshot = JSON.stringify(s);
  P.reviewQueue(s, ids);
  P.reviewQueue(s, ids, 1);
  assert.equal(JSON.stringify(s), snapshot);
  assert.equal(s.schemaVersion, 2);
  assert.deepEqual(validate(progressSchema, s), []);
});

test('[REV-06] questões que não existem mais no conteúdo são ignoradas', () => {
  const s = P.createEmpty();
  reply(s, 'questao-removida-01', false);
  reply(s, ids[0], false);
  const q = P.reviewQueue(s, ids);
  assert.deepEqual(q.items.map(i => i.id), [ids[0]]);
  assert.equal(q.total, 1);
});
