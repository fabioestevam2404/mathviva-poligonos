// Testes de segurança e privacidade sobre os arquivos do repositório (specs/security.spec.md).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const APP_FILES = ['index.html', 'content.js', 'progress.js'];

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
