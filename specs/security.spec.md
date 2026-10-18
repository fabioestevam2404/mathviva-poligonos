# Segurança e privacidade

Prefixo: SEC
Status: implementado
Versão: 1.1
Código: todo o repositório; `html.js` e `app.js` para SEC-04 e SEC-05
Testes: `tests/repo.test.js`, `tests/html.test.js`
Decisões: `docs/adr/0006-csp-e-escape.md`, `docs/adr/0007-acoes-fixadas-por-sha.md`

Requisitos que protegem a privacidade da estudante, os direitos autorais da apostila e a integridade do aplicativo.

## SEC-01 · O aplicativo não carrega recursos de terceiros
Verificação: automática
- Dado o `index.html`
- Então todo `<script src>` e todo `<link href>` apontam para arquivos do próprio projeto

## SEC-02 · Os dados da estudante não saem do aparelho
Verificação: automática
- Dado o código do aplicativo (`index.html`, `content.js`, `progress.js`)
- Então ele não usa `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` nem `EventSource`

## SEC-03 · Fotos e imagens da apostila nunca são versionadas
Verificação: automática
- Dado os arquivos versionados no git
- Então nenhum é imagem (`.jpg`, `.jpeg`, `.png`, `.heic`, `.webp`, `.gif`) nem PDF
- E o `.gitignore` impede que esses arquivos sejam adicionados por engano

## SEC-04 · Política de segurança de conteúdo (CSP)
Verificação: automática
- Dado o `index.html`
- Então nenhum script está embutido na página: todo JavaScript vem de arquivos do projeto
- E nenhum elemento usa atributos de evento inline (`onclick="…"` e semelhantes)
- E a página declara, antes de qualquer script, uma CSP com `default-src 'none'`, `script-src 'self'` e `connect-src 'none'`
- E a CSP também fixa `base-uri 'none'`, `form-action 'none'` e `object-src 'none'`

## SEC-05 · Todo texto entra na página escapado
Verificação: automática
- Dado qualquer valor inserido em um modelo de HTML do aplicativo (conteúdo, números, dados salvos)
- Então ele é escapado por padrão, de modo que `<`, `>`, `&`, `"` e `'` aparecem como texto
- E só fragmentos produzidos pelo próprio gerador de HTML seguro entram sem escape
- E toda atribuição a `innerHTML` em `app.js` usa esse gerador; `outerHTML`, `insertAdjacentHTML` e `document.write` não são usados

## SEC-07 · As ações do CI são fixadas por versão imutável
Verificação: automática
- Dado o fluxo `.github/workflows/ci.yml`
- Então toda ação externa (`uses:`) é referenciada pelo SHA completo de 40 caracteres do commit, com a versão em comentário
- E o fluxo declara permissões apenas de leitura

## SEC-06 · A `main` só muda por pull request aprovado com CI verde
Verificação: manual (configuração do repositório no GitHub)
- Dado o repositório no GitHub
- Então a `main` exige pull request, verificação “Checagem” aprovada e revisão do responsável
- E a varredura de segredos está ativa
