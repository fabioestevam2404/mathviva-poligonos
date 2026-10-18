// Testes de segurança e privacidade sobre os arquivos do repositório (specs/security.spec.md).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const APP_FILES = ['index.html', 'content.js', 'progress.js', 'html.js', 'app.js'];

test('[SEC-01] o index.html só carrega scripts e estilos do próprio projeto', () => {
  const html = read('index.html');
  const refs = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m => m[1]);
  assert.ok(refs.length > 0, 'esperava encontrar os scripts do projeto');
  for (const ref of refs) {
    assert.ok(!/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(ref), `recurso externo: ${ref}`);
    assert.ok(fs.existsSync(path.join(ROOT, ref)), `arquivo referenciado não existe: ${ref}`);
  }
});

test('[SEC-02] o código do aplicativo não envia dados para fora do aparelho', () => {
  const forbidden = /\b(?:fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource)/;
  for (const f of APP_FILES) {
    const m = read(f).match(forbidden);
    assert.equal(m, null, `${f} usa ${m && m[0]}`);
  }
});

test('[SEC-04] a página não tem scripts embutidos nem eventos inline e declara a CSP antes dos scripts', () => {
  const html = read('index.html');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length > 0);
  for (const [, attrs, body] of scripts) {
    assert.match(attrs, /\bsrc\s*=/, 'todo <script> precisa de src');
    assert.equal(body.trim(), '', 'nenhum código dentro de <script>');
  }
  assert.doesNotMatch(html, /\son[a-z]+\s*=\s*["']/i, 'sem atributos de evento inline');
  assert.doesNotMatch(html, /javascript:/i, 'sem URLs javascript:');

  // O valor da CSP contém apóstrofos ('none', 'self'), por isso o atributo usa aspas duplas.
  const meta = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
  assert.ok(meta, 'falta a meta de Content-Security-Policy');
  assert.ok(meta.index < html.search(/<script\b/i), 'a CSP precisa vir antes do primeiro script');
  const csp = Object.fromEntries(meta[1].split(';').map(d => d.trim().split(/\s+/)).filter(p => p[0]).map(([k, ...v]) => [k, v]));
  assert.deepEqual(csp['default-src'], ["'none'"]);
  assert.deepEqual(csp['script-src'], ["'self'"], 'scripts só do próprio site, sem unsafe-inline nem unsafe-eval');
  assert.deepEqual(csp['connect-src'], ["'none'"], 'nenhuma conexão de rede');
  assert.deepEqual(csp['base-uri'], ["'none'"]);
  assert.deepEqual(csp['form-action'], ["'none'"]);
  assert.deepEqual(csp['object-src'], ["'none'"]);
});

test('[SEC-07] o CI usa ações fixadas por SHA e permissões só de leitura', () => {
  const ci = read('.github/workflows/ci.yml');
  const uses = [...ci.matchAll(/^\s*-?\s*uses:\s*(\S+)(.*)$/gm)];
  assert.ok(uses.length > 0, 'esperava encontrar ações no CI');
  for (const [, ref, rest] of uses) {
    assert.match(ref, /^[\w.-]+\/[\w.-]+@[0-9a-f]{40}$/, `ação não fixada por SHA completo: ${ref}`);
    assert.match(rest, /#\s*v\d+\.\d+\.\d+/, `informe a versão em comentário: ${ref}`);
  }
  assert.match(ci, /^permissions:\s*\n\s+contents:\s*read\s*$/m, 'permissões do fluxo devem ser só de leitura');
  assert.doesNotMatch(ci, /:\s*write\b/, 'nenhuma permissão de escrita');
});

test('[SEC-03] nenhuma imagem ou PDF é versionado no repositório', () => {
  let tracked;
  try {
    tracked = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' }).split('\0').filter(Boolean);
  } catch (e) {
    // Sem git (por exemplo, numa cópia baixada como .zip) não há o que versionar.
    return;
  }
  const media = tracked.filter(f => /\.(?:jpe?g|png|heic|webp|gif|pdf)$/i.test(f));
  assert.deepEqual(media, [], 'arquivos de imagem ou PDF não podem ser versionados');
});
