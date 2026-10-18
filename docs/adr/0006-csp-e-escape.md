# ADR-0006 · CSP restritiva e gerador de HTML seguro

- **Status:** Aceito
- **Data:** 2026-10-18
- **Specs relacionadas:** P5, SEC-04, SEC-05, STOR-14

## Contexto

A interface montava telas com `innerHTML` a partir de template strings, sem escapar nenhum valor: a função `esc()` existia, mas não era chamada. O conteúdo vinha do `content.js` revisado e os dados salvos eram validados, então não havia falha explorável. Mas bastaria um descuido futuro (um texto com `<`, um campo novo exibido sem validação) para abrir uma brecha de injeção de script. O JavaScript também ficava embutido no `index.html`, o que impedia uma política de segurança de conteúdo útil.

## Decisão

1. **Gerador `html`** (`html.js`): um *tagged template* que escapa toda interpolação por padrão. Só fragmentos criados por ele entram sem escape, e não existe forma de inserir HTML cru. Um teste garante que toda atribuição a `innerHTML` em `app.js` usa o gerador.
2. **JavaScript fora do HTML:** o código da interface foi para `app.js`.
3. **CSP via `<meta>`** (o GitHub Pages não permite cabeçalhos HTTP próprios):
   `default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'`.
4. **Datas validadas:** campos de data no armazenamento só aceitam o formato ISO, eliminando o último texto livre vindo do `localStorage`.

## Alternativas consideradas

- **Chamar `esc()` manualmente em cada interpolação:** depende de disciplina; um esquecimento basta para abrir uma brecha. O gerador inverte o padrão: o seguro é o automático.
- **Montar o DOM com `createElement`:** seguro, mas muito mais verboso para as telas atuais.
- **Proibir estilos inline (`style-src 'self'`):** exigiria remover 16 atributos `style` dos modelos. Injeção de estilo tem impacto muito menor que injeção de script, e o escape já impede atributos injetados. Pode ser revisto depois.

## Consequências

- Script injetado, script de outro site e envio de dados para fora são bloqueados pelo navegador (verificado no Edge, inclusive abrindo por `file://`).
- Texto do conteúdo não pode mais usar marcação HTML (por exemplo, `<b>`); hoje nenhum texto usa.
- `frame-ancestors` não funciona via `<meta>`; a proteção contra exibição em `iframe` de terceiros exigiria cabeçalho HTTP, indisponível no GitHub Pages.
