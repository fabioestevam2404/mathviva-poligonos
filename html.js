/*
 * Gerador de HTML seguro do MathViva 9 (SEC-05).
 *
 *   el.innerHTML = html`<h2>${titulo}</h2><ul>${itens.map(i => html`<li>${i}</li>`)}</ul>`;
 *
 * Toda interpolação é escapada por padrão. Só passam sem escape fragmentos criados pelo próprio
 * `html` (inclusive dentro de listas). `null`, `undefined` e `false` viram texto vazio, o que permite
 * `${condicao && html`…`}`. Não existe forma de inserir HTML cru: isso é proposital.
 *
 * Script clássico (funciona em file://), também carregável pelo Node nos testes.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MathVivaHtml = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** Converte qualquer valor em texto seguro para HTML (conteúdo e atributos entre aspas). */
  function esc(value) {
    return String(value).replace(/[&<>"']/g, c => ESCAPES[c]);
  }

  /** Fragmento de HTML já seguro. Só o `html` cria instâncias. */
  class SafeHtml {
    constructor(value) { this.value = value; Object.freeze(this); }
    toString() { return this.value; }
  }

  function render(value) {
    if (value instanceof SafeHtml) return value.value;
    if (Array.isArray(value)) return value.map(render).join('');
    if (value === null || value === undefined || value === false) return '';
    return esc(value);
  }

  function html(strings, ...values) {
    let out = strings[0];
    for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
    return new SafeHtml(out);
  }

  return { esc, html, isSafe: v => v instanceof SafeHtml };
});
