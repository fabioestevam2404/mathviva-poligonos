/*
 * Regras de progresso e persistência do MathViva 9.
 * Script clássico (funciona em file://) que também pode ser carregado pelo Node nos testes.
 * No navegador fica disponível como window.MathVivaProgress.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MathVivaProgress = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SCHEMA_VERSION = 2;
  const STORAGE_KEY = 'mathviva-poligonos-progress';
  // Chave usada pela versão anterior. Ela é apenas lida, nunca alterada ou apagada.
  const LEGACY_KEY = 'mathviva-poligonos-v1-progress';
  // Cópia do conteúdo bruto quando os dados salvos estão danificados ou precisaram de reparo.
  const BACKUP_KEY = 'mathviva-poligonos-progress-backup';
  const DAILY_GOAL = 5;
  const XP_PER_CORRECT = 10;
  const MAX_ACTIVITY_DAYS = 120;

  const isObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const isCount = v => Number.isInteger(v) && v >= 0;
  const isText = v => typeof v === 'string' && v.length > 0 && v.length <= 64;
  const QUESTION_ID = /^[a-z0-9_-]{1,64}$/i;
  const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

  /** Data no fuso horário do dispositivo, no formato AAAA-MM-DD. */
  function localDateKey(date) {
    const d = date instanceof Date ? date : new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function createEmpty() {
    return { schemaVersion: SCHEMA_VERSION, xp: 0, questions: {}, activity: {}, legacy: null };
  }

  function sanitizeAnswer(raw) {
    if (!isObject(raw)) return null;
    if (!isCount(raw.option) || typeof raw.correct !== 'boolean' || typeof raw.hintUsed !== 'boolean' || !isText(raw.at)) return null;
    return { option: raw.option, correct: raw.correct, hintUsed: raw.hintUsed, at: raw.at };
  }

  function sanitizeQuestion(raw) {
    if (!isObject(raw)) return null;
    const { attempts, correctCount, hintCount } = raw;
    if (!isCount(attempts) || attempts < 1) return null;
    if (!isCount(correctCount) || correctCount > attempts) return null;
    if (!isCount(hintCount) || hintCount > attempts) return null;
    const first = sanitizeAnswer(raw.first), last = sanitizeAnswer(raw.last);
    if (!first || !last) return null;
    if (raw.masteredAt !== null && !isText(raw.masteredAt)) return null;
    return { attempts, correctCount, hintCount, first, last, masteredAt: raw.masteredAt };
  }

  function sanitizeLegacy(raw) {
    if (!isObject(raw)) return null;
    const out = { answered: 0, correct: 0, xp: 0, topics: {}, lastStudy: null };
    for (const k of ['answered', 'correct', 'xp']) if (isCount(raw[k])) out[k] = raw[k];
    if (isObject(raw.topics)) for (const [k, v] of Object.entries(raw.topics)) if (isCount(v)) out.topics[k] = v;
    if (isText(raw.lastStudy)) out.lastStudy = raw.lastStudy;
    if (isText(raw.migratedAt)) out.migratedAt = raw.migratedAt;
    return out;
  }

  /**
   * Valida um objeto no formato atual. Campos inválidos são descartados individualmente.
   * Retorna null se a estrutura principal não for reconhecida.
   */
  function sanitize(raw) {
    if (!isObject(raw) || raw.schemaVersion !== SCHEMA_VERSION) return null;
    const state = createEmpty();
    let repaired = false;

    if (isCount(raw.xp)) state.xp = raw.xp; else repaired = true;

    if (isObject(raw.questions)) {
      for (const [id, entry] of Object.entries(raw.questions)) {
        const clean = QUESTION_ID.test(id) ? sanitizeQuestion(entry) : null;
        if (clean) state.questions[id] = clean; else repaired = true;
      }
    } else repaired = true;

    if (isObject(raw.activity)) {
      for (const [day, a] of Object.entries(raw.activity)) {
        if (DATE_KEY.test(day) && isObject(a) && isCount(a.answered) && isCount(a.correct) && a.correct <= a.answered) {
          state.activity[day] = { answered: a.answered, correct: a.correct };
        } else repaired = true;
      }
    } else repaired = true;

    if (raw.legacy !== null && raw.legacy !== undefined) {
      state.legacy = sanitizeLegacy(raw.legacy);
      if (!state.legacy) repaired = true;
    }
    return { state, repaired };
  }

  /**
   * Converte o formato antigo (sem schemaVersion). Só existiam totais gerais e por tema,
   * então nenhuma questão é marcada como acertada: o histórico fica guardado em `legacy`.
   */
  function migrateLegacy(raw, now) {
    const legacy = sanitizeLegacy(raw);
    if (!legacy) return null;
    legacy.migratedAt = (now || new Date()).toISOString();
    const state = createEmpty();
    state.xp = legacy.xp;
    state.legacy = legacy;
    return state;
  }

  function parseJson(text) {
    try { return { ok: true, value: JSON.parse(text) }; } catch (e) { return { ok: false }; }
  }

  function readKey(storage, key) {
    try { return { ok: true, value: storage.getItem(key) }; } catch (e) { return { ok: false, error: e }; }
  }

  function backup(storage, text) {
    try { storage.setItem(BACKUP_KEY, text); return true; } catch (e) { return false; }
  }

  /**
   * Lê o progresso sem nunca lançar exceção.
   * status: 'ok' | 'empty' | 'migrated' | 'repaired' | 'corrupt' | 'unavailable'
   * writable: false quando o conteúdo original danificado não pôde ser copiado para BACKUP_KEY.
   *   Nesse caso o aplicativo deve trabalhar só em memória para não apagar o original.
   */
  function loadProgress(storage, now) {
    if (!storage) return { state: createEmpty(), status: 'unavailable', writable: false };

    const current = readKey(storage, STORAGE_KEY);
    if (!current.ok) return { state: createEmpty(), status: 'unavailable', writable: false, error: current.error };

    let corrupt = false, writable = true;
    if (current.value !== null) {
      const parsed = parseJson(current.value);
      const result = parsed.ok ? sanitize(parsed.value) : null;
      if (result) {
        if (result.repaired) writable = backup(storage, current.value);
        return { state: result.state, status: result.repaired ? 'repaired' : 'ok', writable };
      }
      writable = backup(storage, current.value);
      corrupt = true;
    }

    const old = readKey(storage, LEGACY_KEY);
    if (old.ok && old.value !== null) {
      const parsed = parseJson(old.value);
      const state = parsed.ok ? migrateLegacy(parsed.value, now) : null;
      if (state) return { state, status: corrupt ? 'corrupt' : 'migrated', writable };
      // A chave antiga nunca é gravada, então ilegível nela não impede salvar na chave nova.
      corrupt = true;
    }
    return { state: createEmpty(), status: corrupt ? 'corrupt' : 'empty', writable };
  }

  /** Grava o progresso sem nunca lançar exceção. */
  function saveProgress(storage, state) {
    if (!storage) return { ok: false, error: new Error('Armazenamento local indisponível') };
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  function isMastered(entry) {
    return !!(entry && entry.masteredAt);
  }

  function pruneActivity(activity) {
    const days = Object.keys(activity).sort();
    for (const day of days.slice(0, Math.max(0, days.length - MAX_ACTIVITY_DAYS))) delete activity[day];
  }

  /**
   * Registra uma resposta. Altera `state` e informa se a questão acabou de ser vencida
   * (primeiro acerto sem dica).
   */
  function recordAnswer(state, { questionId, option, correct, hintUsed, now }) {
    if (typeof questionId !== 'string' || !QUESTION_ID.test(questionId)) throw new Error('ID de questão inválido: ' + questionId);
    const when = now || new Date();
    const answer = { option, correct: !!correct, hintUsed: !!hintUsed, at: when.toISOString() };
    const prev = state.questions[questionId];
    const entry = prev || { attempts: 0, correctCount: 0, hintCount: 0, first: answer, last: answer, masteredAt: null };
    entry.attempts += 1;
    if (answer.correct) entry.correctCount += 1;
    if (answer.hintUsed) entry.hintCount += 1;
    entry.last = answer;
    const newlyMastered = answer.correct && !answer.hintUsed && !entry.masteredAt;
    if (newlyMastered) entry.masteredAt = answer.at;
    state.questions[questionId] = entry;

    if (answer.correct) state.xp += XP_PER_CORRECT;

    const day = localDateKey(when);
    const today = state.activity[day] || { answered: 0, correct: 0 };
    today.answered += 1;
    if (answer.correct) today.correct += 1;
    state.activity[day] = today;
    pruneActivity(state.activity);

    return { newlyMastered, firstAttempt: !prev };
  }

  /** Quantidade de questões distintas (dentre as informadas) acertadas sem dica. */
  function countMastered(state, questionIds) {
    return questionIds.filter(id => isMastered(state.questions[id])).length;
  }

  /** Estrelas das "Conquistas da jornada": uma a cada terço do total de desafios vencidos sem dica (máximo 3). */
  function journeyStars(mastered, total) {
    if (!total) return 0;
    return Math.min(Math.floor(mastered * 3 / total), 3);
  }

  /**
   * Estrelas de uma trilha: 1 ao começar, 2 com metade ou mais vencida, 3 com tudo vencido.
   * Com 5 questões equivale à regra anterior (1–2 → 1, 3–4 → 2, 5 → 3).
   */
  function topicStars(done, total) {
    if (!done || !total) return 0;
    if (done >= total) return 3;
    return done * 2 >= total ? 2 : 1;
  }

  function dailyStats(state, now) {
    const a = state.activity[localDateKey(now)] || { answered: 0, correct: 0 };
    return { answered: a.answered, correct: a.correct, goal: DAILY_GOAL, percent: Math.min(a.answered / DAILY_GOAL * 100, 100) };
  }

  /** Participação total (tentativas e acertos), incluindo o histórico antigo. */
  function totals(state) {
    let answered = 0, correct = 0;
    for (const entry of Object.values(state.questions)) { answered += entry.attempts; correct += entry.correctCount; }
    const legacy = state.legacy || { answered: 0, correct: 0 };
    return { answered: answered + legacy.answered, correct: correct + legacy.correct, xp: state.xp };
  }

  return {
    SCHEMA_VERSION, STORAGE_KEY, LEGACY_KEY, BACKUP_KEY, DAILY_GOAL, XP_PER_CORRECT,
    localDateKey, createEmpty, sanitize, migrateLegacy, loadProgress, saveProgress,
    recordAnswer, isMastered, countMastered, journeyStars, topicStars, dailyStats, totals
  };
});
