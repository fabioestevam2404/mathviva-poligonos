// Gerador de HTML seguro (specs/security.spec.md, SEC-05).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { html, esc, isSafe } = require('../html.js');

const str = v => String(v);

test('[SEC-05] toda interpolação é escapada por padrão', () => {
  const ataque = `<img src=x onerror="alert('x')">&`;
  assert.equal(str(html`<p>${ataque}</p>`), '<p>&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;</p>');
  assert.equal(str(html`<a title="${'" onclick="x'}">t</a>`), '<a title="&quot; onclick=&quot;x">t</a>', 'escapa também dentro de atributos');
  assert.equal(esc('a < b > c & "d" \'e\''), 'a &lt; b &gt; c &amp; &quot;d&quot; &#39;e&#39;');
});

test('[SEC-05] só fragmentos do próprio gerador entram sem escape', () => {
  const item = html`<li>${'<b>'}</li>`;
  assert.ok(isSafe(item));
  assert.equal(str(html`<ul>${[item, item]}</ul>`), '<ul><li>&lt;b&gt;</li><li>&lt;b&gt;</li></ul>', 'listas de fragmentos são unidas');
  assert.equal(str(html`<ul>${['<li>', '</li>']}</ul>`), '<ul>&lt;li&gt;&lt;/li&gt;</ul>', 'listas de texto continuam escapadas');
  const falso = { value: '<script>', toString() { return '<script>'; } };
  assert.equal(str(html`${falso}`), '&lt;script&gt;', 'objetos que imitam fragmentos são escapados');
  assert.ok(Object.isFrozen(item), 'fragmentos não podem ser alterados depois de criados');
});

test('[SEC-05] valores vazios e números são tratados sem surpresa', () => {
  assert.equal(str(html`[${null}|${undefined}|${false}|${0}|${''}]`), '[|||0|]', 'null, undefined e false viram vazio; 0 continua 0');
  assert.equal(str(html`${true && html`<i>ok</i>`}`), '<i>ok</i>');
  assert.equal(str(html`${12.5}%`), '12.5%');
});

test('[SEC-05] o aplicativo só escreve HTML pelo gerador seguro', () => {
  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const assignments = [...app.matchAll(/\.innerHTML\s*=\s*([^;\n]{0,12})/g)].map(m => m[1].trim());
  assert.ok(assignments.length >= 6, 'esperava encontrar as telas do aplicativo');
  for (const rhs of assignments) assert.ok(rhs.startsWith('html`'), `innerHTML recebe algo que não é html\`…\`: ${rhs}`);
  assert.doesNotMatch(app, /\b(?:outerHTML|insertAdjacentHTML|document\.write)\b/);
  assert.doesNotMatch(app, /\beval\s*\(|new Function\s*\(/, 'sem execução de texto como código');
});
