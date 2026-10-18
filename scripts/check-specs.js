#!/usr/bin/env node
/*
 * Confere a rastreabilidade entre specs e testes (princípio P2 da constituição).
 *
 *   node scripts/check-specs.js           valida e confere se specs/RASTREABILIDADE.md está atualizado
 *   node scripts/check-specs.js --write   valida e regrava specs/RASTREABILIDADE.md
 *
 * Regras:
 *   - cada spec (specs/*.spec.md) declara "Prefixo: XXXX" e requisitos "## XXXX-NN · título";
 *   - logo abaixo de cada título vem "Verificação: automática | manual (…) | planejada (…)";
 *   - todo requisito automático é citado como [XXXX-NN] no título de pelo menos um teste;
 *   - todo teste cita pelo menos um requisito, e só requisitos automáticos existentes.
 * Sem dependências: usa apenas o Node.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SPECS = path.join(ROOT, 'specs');
const TESTS = path.join(ROOT, 'tests');
const MATRIX = path.join(SPECS, 'RASTREABILIDADE.md');

const read = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const errors = [];
const fail = msg => errors.push(msg);

const HEADING = /^## ([A-Z]{2,6}-\d{2}) · (.+)$/;
const VERIFY = /^Verificação: (automática|manual|planejada)(?: \((.+)\))?$/;

// ── Specs ──────────────────────────────────────────────────────────────
const specFiles = fs.readdirSync(SPECS).filter(f => f.endsWith('.spec.md') && !f.startsWith('_')).sort();
const requirements = new Map(); // id → { id, title, kind, note, spec }
const specs = [];

for (const file of specFiles) {
  const lines = read(path.join(SPECS, file)).split('\n');
  const title = (lines.find(l => l.startsWith('# ')) || `# ${file}`).slice(2).trim();
  const prefixLine = lines.find(l => l.startsWith('Prefixo: '));
  const prefix = prefixLine ? prefixLine.slice('Prefixo: '.length).trim() : null;
  if (!prefix) fail(`${file}: falta a linha "Prefixo: XXXX".`);
  const spec = { file, title, prefix, ids: [] };
  specs.push(spec);

  lines.forEach((line, i) => {
    if (line.startsWith('## ') && !HEADING.test(line)) {
      fail(`${file}:${i + 1}: título de requisito fora do formato "## XXXX-NN · título": ${line}`);
      return;
    }
    const m = line.match(HEADING);
    if (!m) return;
    const [, id, reqTitle] = m;
    if (prefix && !id.startsWith(prefix + '-')) fail(`${file}:${i + 1}: ${id} não usa o prefixo ${prefix}.`);
    if (requirements.has(id)) fail(`${file}:${i + 1}: ${id} repetido (já existe em ${requirements.get(id).spec}).`);
    const v = (lines[i + 1] || '').match(VERIFY);
    if (!v) { fail(`${file}:${i + 2}: ${id} precisa da linha "Verificação: automática | manual (…) | planejada (…)".`); return; }
    const [, kind, note] = v;
    if (kind !== 'automática' && !note) fail(`${file}:${i + 2}: ${id} é ${kind}; explique entre parênteses o que conferir ou quando será feito.`);
    requirements.set(id, { id, title: reqTitle, kind, note: note || '', spec: file });
    spec.ids.push(id);
  });
  if (!spec.ids.length) fail(`${file}: nenhum requisito encontrado.`);
}

// ── Testes ─────────────────────────────────────────────────────────────
const TEST_CALL = /\btest\(\s*(['"`])((?:\\.|(?!\1).)*)\1/g;
const CITATION = /\[([A-Z]{2,6}-\d{2})\]/g;
const coverage = new Map([...requirements.keys()].map(id => [id, []]));
let testCount = 0;

for (const file of fs.readdirSync(TESTS).filter(f => f.endsWith('.test.js')).sort()) {
  const src = read(path.join(TESTS, file));
  for (const m of src.matchAll(TEST_CALL)) {
    testCount++;
    const name = m[2];
    const line = src.slice(0, m.index).split('\n').length;
    const ids = [...name.matchAll(CITATION)].map(c => c[1]);
    if (!ids.length) { fail(`tests/${file}:${line}: o teste "${name}" não cita nenhum requisito [XXXX-NN].`); continue; }
    for (const id of ids) {
      const req = requirements.get(id);
      if (!req) { fail(`tests/${file}:${line}: o teste cita ${id}, que não existe em nenhuma spec.`); continue; }
      if (req.kind !== 'automática') { fail(`tests/${file}:${line}: o teste cita ${id}, mas a spec diz "Verificação: ${req.kind}". Marque-o como automática.`); continue; }
      coverage.get(id).push({ file, name: name.replace(CITATION, '').trim() });
    }
  }
}

for (const [id, req] of requirements) {
  if (req.kind === 'automática' && !coverage.get(id).length) fail(`${req.spec}: ${id} é automática, mas nenhum teste cita [${id}].`);
}

// ── Matriz de rastreabilidade ──────────────────────────────────────────
const esc = s => s.replace(/\|/g, '\\|');
const out = [
  '# Matriz de rastreabilidade',
  '',
  'Gerada por `npm run specs:write`. Não edite à mão: altere as specs ou os testes e gere de novo.',
  ''
];
const count = { automática: 0, manual: 0, planejada: 0 };
for (const r of requirements.values()) count[r.kind]++;
out.push(`Requisitos: ${requirements.size} · automáticos: ${count['automática']} · manuais: ${count.manual} · planejados: ${count.planejada} · testes: ${testCount}`, '');
for (const spec of specs) {
  out.push(`## ${spec.title} (\`${spec.file}\`)`, '', '| Requisito | Verificação | Testes |', '|---|---|---|');
  for (const id of spec.ids) {
    const r = requirements.get(id);
    const how = r.kind === 'automática' ? 'automática' : `${r.kind}: ${r.note}`;
    const tests = coverage.get(id).map(t => `\`${t.file}\` · ${t.name}`).join('<br>') || '—';
    out.push(`| **${id}** · ${esc(r.title)} | ${esc(how)} | ${esc(tests)} |`);
  }
  out.push('');
}
const matrix = out.join('\n');

if (process.argv.includes('--write')) {
  if (!errors.length) fs.writeFileSync(MATRIX, matrix);
} else {
  const current = fs.existsSync(MATRIX) ? read(MATRIX) : '';
  if (!errors.length && current !== matrix) fail('specs/RASTREABILIDADE.md está desatualizado. Rode "npm run specs:write" e inclua o arquivo no commit.');
}

// ── Resultado ──────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`✖ Rastreabilidade com ${errors.length} problema(s):\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✔ ${requirements.size} requisitos em ${specs.length} specs (${count['automática']} automáticos, ${count.manual} manuais, ${count.planejada} planejados), ${testCount} testes rastreados.`);
if (process.argv.includes('--write')) console.log('  specs/RASTREABILIDADE.md atualizado.');
