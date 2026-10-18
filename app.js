/*
 * Interface do MathViva 9. Carregado por último, depois de content.js, progress.js e html.js (CONT-08).
 * Toda inserção de HTML usa o gerador seguro `html` (SEC-05): interpolações são escapadas por padrão.
 */
'use strict';

const { topics, topicGuides, school } = window.MathVivaContent;
const P = window.MathVivaProgress;
const { html } = window.MathVivaHtml;

const schoolTopic = topics.find(t => t.id === (school && school.currentTopic)) || null;
const storage = (() => { try { return window.localStorage; } catch (e) { return null; } })();
const loaded = P.loadProgress(storage);
let progress = loaded.state;
let selectedTopic = schoolTopic || topics[0], questionIndex = 0, answered = false, hintShown = false;
// Sessão de revisão em andamento (specs/review.spec.md): fila fixa até o fim (REV-07), ou null fora dela.
let review = null;

const $ = s => document.querySelector(s);
const allQuestionIds = topics.flatMap(t => t.questions.map(q => q.id));
const topicMastered = t => P.countMastered(progress, t.questions.map(q => q.id));
const isSchoolTopic = t => !!schoolTopic && schoolTopic.id === t.id;
const questionById = new Map(topics.flatMap(t => t.questions.map(q => [q.id, { topic: t, question: q }])));
const reviewQueue = () => P.reviewQueue(progress, allQuestionIds, P.REVIEW_LIMIT);
const currentQuestion = () => review ? review.items[review.index].question : selectedTopic.questions[questionIndex];
const REVIEW_REASONS = { never: 'ainda não acertada', hint: 'acertada só com dica' };

// ── Avisos de armazenamento (STOR-05) ──────────────────────────────────
const noticeTexts = {
  save: 'Não foi possível salvar seu progresso neste navegador. Você pode continuar estudando, mas as respostas desta visita podem se perder ao fechar a página. Verifique se o navegador permite que este site guarde dados e se há espaço disponível.',
  corrupt: 'Os dados de progresso guardados neste navegador estavam danificados e não puderam ser lidos. Uma cópia foi preservada e um novo registro foi iniciado.',
  locked: 'Os dados de progresso guardados neste navegador estão danificados e não foi possível fazer uma cópia de segurança deles. Para não apagar o original, as respostas desta visita não serão salvas. Você pode continuar estudando normalmente.'
};
let noticeKind = null;
function setNotice(kind) {
  noticeKind = kind;
  const box = $('#storageNotice');
  if (!kind) { box.hidden = true; return; }
  $('#storageNoticeText').textContent = noticeTexts[kind];
  box.hidden = false;
}

// Com dados danificados sem cópia de segurança, nada é gravado: o progresso fica só em memória (STOR-08).
const writeLocked = !!storage && loaded.writable === false;
function save() {
  if (writeLocked) { setNotice('locked'); renderStats(); return; }
  const r = P.saveProgress(storage, progress);
  if (!r.ok) setNotice('save');
  else if (noticeKind === 'save') setNotice(null);
  renderStats();
}

// ── Mapa de trilhas ────────────────────────────────────────────────────
function renderTopics() {
  const grid = $('#topicGrid');
  grid.innerHTML = html`${topics.map(t => {
    const done = topicMastered(t), total = t.questions.length, stars = P.topicStars(done, total);
    return html`<button class="topic-card ${selectedTopic.id === t.id ? 'active' : ''}" data-topic="${t.id}" data-level="${t.code}" style="--topic-color:${t.color}"><div class="topic-top"><div class="topic-icon" style="background:${t.color}">${t.icon}</div><span class="topic-tag">MÓDULO ${t.module} · ${t.tag}</span></div><h3>${t.code} ${t.name}${isSchoolTopic(t) && html` <span class="school-badge">📍 Estamos aqui na escola</span>`}</h3><p>${t.desc}</p><div class="topic-progress"><span style="width:${done / total * 100}%"></span><small class="level-label">${done ? `${done} de ${total} desafios vencidos` : 'Nova descoberta esperando por você'}</small><span class="topic-stars">${[0, 1, 2].map(n => html`<i class="${n < stars ? '' : 'off'}">★</i>`)}</span></div></button>`;
  })}`;
  grid.querySelectorAll('[data-topic]').forEach(btn => { btn.onclick = () => selectTopic(btn.dataset.topic); });
}

function selectTopic(id) {
  review = null;
  selectedTopic = topics.find(t => t.id === id);
  questionIndex = 0; answered = false; hintShown = false;
  document.querySelectorAll('.nav-btn').forEach(n => n.classList.toggle('active', n.dataset.view === 'estudar'));
  renderTopics();
  renderLesson();
  $('#lesson').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Resumo detalhado ───────────────────────────────────────────────────
function guideHtml(t) {
  const g = topicGuides[t.id];
  return html`<div class="guide"><div class="guide-hero"><div class="guide-icon">${t.icon}</div><div><h3>${g.title}</h3><p>Leia devagar. Você não precisa decorar tudo de uma vez: procure compreender a ideia e depois pratique.</p></div></div><div class="analogy-box"><b>🏡 Pense em uma situação do dia a dia</b><p>${g.analogy}</p></div><div class="guide-grid">${g.sections.map((s, i) => html`<section class="guide-section ${i === g.sections.length - 1 ? 'wide' : ''}"><h4>${i + 1}. ${s[0]}</h4><p>${s[1]}</p></section>`)}<section class="guide-section wide"><h4>🧠 Fórmulas e ideias para consultar</h4>${g.formulas.map(f => html`<span class="formula-chip">${f}</span>`)}</section></div><div class="final-check"><b>✅ Antes de dizer “terminei”, faça esta verificação:</b><p>${g.check}</p></div></div>`;
}

// ── Lição e questões ───────────────────────────────────────────────────
function renderLesson() {
  const t = selectedTopic;
  $('#lesson').classList.add('show');
  $('#emptyState').classList.add('hidden');
  const q = t.questions[questionIndex];
  const last = questionIndex === t.questions.length - 1;
  $('#lesson').innerHTML = html`<div class="lesson-head"><div><div class="lesson-kicker">${t.icon} ${t.code} · ${t.tag} · ${t.minutes} minutinhos</div><h2>${t.name}</h2><div class="lesson-ref">📖 Na apostila: ${t.ref}${isSchoolTopic(t) && ' · 📍 tema que está sendo visto em sala'}</div></div><div style="text-align:right"><div class="lesson-meta">Uma ideia + um exemplo + prática</div><button class="link-btn" id="closeLesson" style="margin-top:8px">Fechar ×</button></div></div><div class="lesson-layout"><article class="explain-box"><h3>💡 A ideia principal</h3><p>${t.lesson}</p></article><article class="example-box"><h3>🪄 Vamos ver um exemplo</h3><p><b>${t.example}</b></p><div class="steps">${t.steps.map((s, i) => html`<div class="step"><b>${i + 1}</b><span>${s}</span></div>`)}</div></article></div><details class="summary-preview"><summary>📚 Abrir o resumo detalhado da teoria</summary>${guideHtml(t)}</details><div class="practice"><div class="practice-head"><h3>Agora é sua vez! 🌟</h3><span class="question-count">QUESTÃO ${questionIndex + 1} DE ${t.questions.length}</span></div><div class="question">${q.q}</div><div class="answers">${q.opts.map((o, i) => html`<button class="answer" data-answer="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`)}</div><div class="feedback" id="feedback" aria-live="polite">Escolha uma resposta. Se bater dúvida, peça uma dica!</div><div class="quiz-controls"><button class="hint-btn" id="hintBtn">💭 Me dá uma dica</button><button class="primary next-btn" id="nextBtn">${last ? 'Concluir tema' : 'Próxima questão →'}</button></div></div>`;
  $('#closeLesson').onclick = () => { home('estudar'); $('#homeContent').scrollIntoView({ behavior: 'smooth' }); };
  wireQuestion(q);
}

/** Liga dica, alternativas e "próxima" da questão exibida (trilha ou revisão). */
function wireQuestion(q) {
  $('#hintBtn').onclick = () => {
    hintShown = true;
    const f = $('#feedback');
    f.textContent = 'Dica: ' + q.hint;
    f.className = 'feedback';
    $('#hintBtn').textContent = '💭 Dica recebida';
  };
  document.querySelectorAll('[data-answer]').forEach(b => { b.onclick = () => answer(Number(b.dataset.answer)); });
  $('#nextBtn').onclick = nextQuestion;
}

function celebrate(message) {
  const colors = ['#7257e8', '#f06cae', '#ffd45f', '#65d6b0', '#59b8ff'];
  for (let i = 0; i < 18; i++) {
    const bit = document.createElement('i');
    bit.className = 'confetti';
    bit.style.left = (45 + Math.random() * 10) + '%';
    bit.style.top = (38 + Math.random() * 8) + '%';
    bit.style.background = colors[i % colors.length];
    bit.style.setProperty('--drift', (Math.random() * 220 - 110) + 'px');
    bit.style.animationDelay = (Math.random() * .14) + 's';
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 1500);
  }
  const pop = document.createElement('div');
  pop.className = 'reward-pop';
  pop.textContent = message;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

function answer(index) {
  if (answered) return;
  answered = true;
  const q = currentQuestion(), correct = index === q.a;
  document.querySelectorAll('[data-answer]').forEach((b, i) => {
    b.disabled = true;
    if (i === q.a) b.classList.add('correct');
    else if (i === index) b.classList.add('wrong');
  });
  // Na revisão valem exatamente as mesmas regras (REV-04).
  const r = P.recordAnswer(progress, { questionId: q.id, option: index, correct, hintUsed: hintShown });
  if (review && r.newlyMastered) review.won++;
  const f = $('#feedback');
  const hintNote = correct && hintShown && !P.isMastered(progress.questions[q.id])
    ? ' Como você usou a dica, este desafio ainda não conta como vencido: tente de novo sem dica quando quiser.' : '';
  f.textContent = (correct ? '🎉 Muito bem! ' : '💜 Quase! Vamos entender: ') + q.why + hintNote;
  f.className = 'feedback ' + (correct ? 'good' : 'bad');
  $('#hintBtn').classList.add('hidden');
  $('#nextBtn').classList.add('show');
  if (correct) {
    celebrate(r.newlyMastered ? '+10 XP · desafio vencido! ⭐' : '+10 XP');
    $('#mascotNote').textContent = 'Aí sim! Seu raciocínio brilhou! ⭐';
  } else {
    $('#mascotNote').textContent = 'Errar também faz parte da aventura. Vamos juntas! 💜';
  }
  save();
  renderTopics();
}

function nextQuestion() {
  if (review) { nextReviewQuestion(); return; }
  if (questionIndex < selectedTopic.questions.length - 1) {
    questionIndex++; answered = false; hintShown = false;
    renderLesson();
    return;
  }
  const t = selectedTopic;
  $('#lesson').innerHTML = html`<div class="completion-head"><div class="big-emoji">🎊</div><div class="lesson-kicker">MISSÃO CONCLUÍDA · REVISÃO FINAL</div><h2>Agora vamos organizar tudo o que você aprendeu</h2><p style="color:var(--muted);font-size:13px">Este resumo foi feito para ser relido sem pressa. Use-o sempre que surgir uma dúvida.</p><div class="lesson-ref">📖 Para revisar na apostila: ${t.ref}</div></div>${guideHtml(t)}<div class="completion-actions"><button class="ghost" id="repeatTopic">Refazer os desafios</button><button class="primary" id="chooseAgain">Escolher outro tema</button></div>`;
  $('#repeatTopic').onclick = () => selectTopic(t.id);
  $('#chooseAgain').onclick = () => { home('estudar'); $('#homeContent').scrollIntoView({ behavior: 'smooth' }); };
  $('#lesson').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Revisar erros (specs/review.spec.md) ───────────────────────────────
const qtd = n => n === 1 ? '1 questão' : `${n} questões`;

function startReview() {
  const { items } = reviewQueue();
  if (!items.length) { home(); return; }
  review = { items: items.map(i => ({ ...i, ...questionById.get(i.id) })), index: 0, won: 0 };
  answered = false; hintShown = false;
  $('#homeContent').classList.add('hidden');
  $('#hero').classList.add('hidden');
  document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
  renderReviewQuestion();
}

function renderReviewQuestion() {
  const item = review.items[review.index], t = item.topic, q = item.question;
  const n = review.items.length, pos = review.index + 1, last = pos === n;
  const box = $('#lesson');
  box.classList.add('show');
  $('#emptyState').classList.add('hidden');
  box.innerHTML = html`<div class="lesson-head"><div><div class="lesson-kicker">🔁 REVISÃO · QUESTÃO ${pos} DE ${n}</div><h2 id="reviewHeading" tabindex="-1">${t.code} ${t.name}</h2><div class="lesson-ref">📖 Na apostila: ${t.ref}</div><span class="review-reason ${item.reason}">Motivo: ${REVIEW_REASONS[item.reason]}</span></div><button class="link-btn" id="closeReview">Sair da revisão ×</button></div><div class="practice"><div class="practice-head"><h3>Tente de novo, com calma 💪</h3><span class="question-count">QUESTÃO ${pos} DE ${n}</span></div><div class="question">${q.q}</div><div class="answers">${q.opts.map((o, i) => html`<button class="answer" data-answer="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`)}</div><div class="feedback" id="feedback" aria-live="polite">Escolha uma resposta. A dica continua disponível, mas o desafio só é vencido sem ela.</div><div class="quiz-controls"><button class="hint-btn" id="hintBtn">💭 Me dá uma dica</button><button class="primary next-btn" id="nextBtn">${last ? 'Ver resultado' : 'Próxima questão →'}</button></div></div>`;
  wireQuestion(q);
  $('#closeReview').onclick = () => home();
  // Leva o foco ao título para o leitor de tela anunciar a nova questão (REV-11).
  $('#reviewHeading').focus({ preventScroll: true });
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextReviewQuestion() {
  if (review.index < review.items.length - 1) {
    review.index++; answered = false; hintShown = false;
    renderReviewQuestion();
    return;
  }
  finishReview();
}

function finishReview() {
  const { won, items } = review, remaining = reviewQueue().total;
  review = null;
  const box = $('#lesson');
  box.innerHTML = html`<div class="completion-head"><div class="big-emoji">${won ? '🏆' : '🌱'}</div><div class="lesson-kicker">REVISÃO CONCLUÍDA</div><h2 id="reviewHeading" tabindex="-1">Você venceu ${won} de ${qtd(items.length)} nesta revisão</h2><p style="color:var(--muted);font-size:13px">${remaining ? `Ainda há ${qtd(remaining)} para revisar.` : 'Não há mais questões para revisar. Excelente trabalho!'}${won === 0 ? ' Cada tentativa conta: o que hoje ainda não saiu, amanhã sai.' : ''}</p></div><div class="completion-actions">${remaining > 0 && html`<button class="primary" id="reviewAgain">Revisar mais ${qtd(Math.min(remaining, P.REVIEW_LIMIT))} →</button>`}<button class="ghost" id="reviewHome">Voltar ao início</button></div>`;
  if (remaining > 0) $('#reviewAgain').onclick = startReview;
  $('#reviewHome').onclick = () => home();
  $('#reviewHeading').focus({ preventScroll: true });
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Painel lateral e estrelas (PROG-07, PROG-10) ───────────────────────
function renderStats() {
  const today = P.dailyStats(progress), done = today.answered, pct = today.percent, { correct } = P.totals(progress);
  $('#goalRing').style.setProperty('--progress', pct + '%');
  $('#goalPercent').textContent = Math.round(pct) + '%';
  $('#goalText').textContent = done ? (done === 1 ? '1 questão respondida hoje' : `${done} questões respondidas hoje`) : 'Vamos começar?';
  $('#streakText').textContent = done ? 'Missão do dia iniciada!' : 'Sua jornada começa hoje';
  $('#continueTitle').textContent = progress.xp ? `${progress.xp} XP conquistados!`
    : schoolTopic ? `Na escola: ${schoolTopic.code} ${schoolTopic.name}` : 'Sua primeira fase espera por você!';
  $('#continueDesc').textContent = progress.xp ? `${correct} acerto${correct === 1 ? '' : 's'} e novas habilidades desbloqueadas.`
    : schoolTopic ? 'Comece pela trilha que está sendo vista em sala.' : 'Escolha um portal e encare uma missão curtinha.';
  $('#continueBtn').textContent = !progress.xp && schoolTopic ? `Começar a trilha ${schoolTopic.code} →` : 'Escolher um tema →';
  const mastered = P.countMastered(progress, allQuestionIds), stars = P.journeyStars(mastered, allQuestionIds.length), starsEl = $('#journeyStars');
  starsEl.textContent = [0, 1, 2].map(i => i < stars ? '★' : '☆').join('  ');
  starsEl.setAttribute('aria-label', `${stars} de 3 estrelas · ${mastered} de ${allQuestionIds.length} desafios vencidos sem dica`);
  // Cartão "Para revisar": só aparece quando há o que revisar (REV-08).
  const pending = reviewQueue().total;
  $('#reviewCard').hidden = pending === 0;
  if (pending) {
    $('#reviewTitle').textContent = `${qtd(pending)} para revisar`;
    $('#reviewDesc').textContent = pending > P.REVIEW_LIMIT
      ? `Volte às questões que você errou ou acertou com dica, em sessões de até ${P.REVIEW_LIMIT}.`
      : 'Volte às questões que você errou ou acertou com dica.';
  }
}

// ── Telas: progresso, resumos e início ─────────────────────────────────
function showProgress() {
  review = null;
  const box = $('#lesson');
  $('#homeContent').classList.add('hidden');
  $('#hero').classList.add('hidden');
  box.classList.add('show');
  const { answered: tried, correct } = P.totals(progress), mastered = P.countMastered(progress, allQuestionIds), legacy = progress.legacy;
  const legacyNote = legacy && legacy.answered > 0 ? html`<p class="legacy-note">📜 Os números de tentativas, acertos e XP incluem ${legacy.answered} resposta${legacy.answered === 1 ? '' : 's'} e ${legacy.correct} acerto${legacy.correct === 1 ? '' : 's'} da versão anterior do aplicativo. Aquela versão não registrava cada questão, por isso esses acertos não aparecem como desafios vencidos.</p>` : '';
  const pending = reviewQueue().total;
  const reviewBlock = pending
    ? html`<div class="review-cta"><button class="primary" id="progressReview">🔁 Revisar ${qtd(pending)} →</button></div>`
    : html`<p class="review-empty">✅ Nenhuma questão para revisar agora. Quando você errar uma questão ou acertar usando a dica, ela aparece aqui para você tentar de novo.</p>`;
  box.innerHTML = html`<div class="lesson-head"><div><div class="lesson-kicker">🌱 SUA JORNADA</div><h2>Olha só o quanto você já avançou!</h2></div><button class="link-btn" id="closeProgress">Voltar ao início ×</button></div><div class="sidebar" style="margin-top:20px"><div class="side-card"><div class="side-title">🏅 Desafios vencidos</div><div class="side-caption">Questões diferentes acertadas sem usar dica.</div><b style="font-size:22px">${mastered} de ${allQuestionIds.length}</b><span style="font-size:12px;color:var(--muted)"> desafios</span></div><div class="side-card"><div class="side-title">⭐ ${progress.xp || 0} pontos de coragem</div><div class="side-caption">Cada questão respondida conta.</div><b style="font-size:22px">${tried}</b><span style="font-size:12px;color:var(--muted)"> questões tentadas</span></div><div class="side-card"><div class="side-title">🎯 ${correct} acertos</div><div class="side-caption">Aprender também é tentar de novo.</div><b style="font-size:22px">${tried ? Math.round(correct / tried * 100) : 0}%</b><span style="font-size:12px;color:var(--muted)"> de aproveitamento</span></div></div>${reviewBlock}${legacyNote}<h3 style="margin:22px 0 12px;font-size:15px">Temas que você está descobrindo</h3><div class="topic-grid">${topics.map(t => html`<div class="topic-card"><div class="topic-top"><div class="topic-icon" style="background:${t.color}">${t.icon}</div><span class="topic-tag">${topicMastered(t)} de ${t.questions.length} sem dica</span></div><h3>${t.name}</h3><p>${t.desc}</p></div>`)}</div>`;
  $('#closeProgress').onclick = () => home();
  if (pending) $('#progressReview').onclick = startReview;
}

function showSummaries() {
  review = null;
  const box = $('#lesson');
  $('#homeContent').classList.add('hidden');
  $('#hero').classList.add('hidden');
  box.classList.add('show');
  box.innerHTML = html`<div class="lesson-head"><div><div class="lesson-kicker">📚 CENTRAL DE RESUMOS</div><h2>Teoria explicada com calma e exemplos do cotidiano</h2><p class="lesson-meta">Escolha uma matéria para revisar. Os resumos podem ser consultados antes ou depois dos desafios.</p></div><button class="link-btn" id="closeSummaries">Voltar ao início ×</button></div><div class="summary-catalog">${topics.map(t => html`<button class="summary-catalog-card" data-summary="${t.id}"><span class="catalog-icon">${t.icon}</span><h3>${t.code} ${t.name}</h3><div class="lesson-ref">📖 ${t.ref}</div><p>${topicGuides[t.id].analogy.slice(0, 115)}…</p><span>LER RESUMO COMPLETO →</span></button>`)}</div>`;
  $('#closeSummaries').onclick = () => home();
  document.querySelectorAll('[data-summary]').forEach(btn => { btn.onclick = () => showTopicSummary(btn.dataset.summary); });
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showTopicSummary(id) {
  const t = topics.find(item => item.id === id), box = $('#lesson');
  box.innerHTML = html`<div class="lesson-head"><div><div class="lesson-kicker">${t.icon} ${t.code} · RESUMO COMPLETO</div><h2>${t.name}</h2><div class="lesson-ref">📖 Na apostila: ${t.ref}</div></div><button class="link-btn" id="backSummaries">← Todos os resumos</button></div>${guideHtml(t)}<div class="completion-actions"><button class="primary" id="studyFromSummary">Praticar esta matéria →</button></div>`;
  $('#backSummaries').onclick = showSummaries;
  $('#studyFromSummary').onclick = () => selectTopic(t.id);
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function home(view = 'inicio') {
  review = null;
  document.querySelectorAll('.nav-btn').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  $('#homeContent').classList.remove('hidden');
  $('#hero').classList.remove('hidden');
  $('#lesson').classList.remove('show');
  $('#emptyState').classList.add('hidden');
}

// ── Navegação e inicialização ──────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(n => n.classList.toggle('active', n === b));
    if (b.dataset.view === 'progresso') showProgress();
    else if (b.dataset.view === 'resumos') showSummaries();
    else if (b.dataset.view === 'estudar') { home('estudar'); $('#homeContent').scrollIntoView({ behavior: 'smooth' }); }
    else home();
  };
});
$('#continueBtn').onclick = () => selectTopic(selectedTopic.id);
$('#reviewBtn').onclick = startReview;
$('#allTopics').onclick = () => {
  const toast = $('#toast');
  toast.textContent = 'Escolha uma trilha, veja a explicação e vença os desafios sem dica para conquistar até 3 estrelas!';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
};
$('#backHome').onclick = () => home();

$('#pillTrails').textContent = `📐 ${topics.length} trilhas na ordem das aulas`;
$('#pillChallenges').textContent = `🌟 ${allQuestionIds.length} desafios`;
{
  const n = allQuestionIds.length, at = k => Math.ceil(k * n / 3);
  $('#journeyCaption').textContent = `Estrelas com ${at(1)}, ${at(2)} e ${n} desafios vencidos sem dica.`;
}

if (loaded.status === 'unavailable') setNotice('save');
else if (writeLocked) setNotice('locked');
else if (loaded.status === 'corrupt') setNotice('corrupt');

renderTopics();
if (loaded.status === 'migrated' || loaded.status === 'repaired') save(); else renderStats();

// A meta diária depende da data local: recalcula quando a página volta a ficar visível ou recebe foco (PROG-09).
const refreshDay = () => { if (!document.hidden) renderStats(); };
window.addEventListener('focus', refreshDay);
window.addEventListener('pageshow', refreshDay);
document.addEventListener('visibilitychange', refreshDay);
