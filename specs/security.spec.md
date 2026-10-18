# Segurança e privacidade

Prefixo: SEC
Status: parcialmente implementado
Versão: 1.0
Código: todo o repositório
Testes: `tests/repo.test.js`

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
Verificação: planejada (Fase 2)
- Dado o `index.html`
- Então o JavaScript do aplicativo fica em arquivo próprio
- E a página declara uma CSP que só permite scripts do próprio site

## SEC-05 · Texto dinâmico sempre escapado
Verificação: planejada (Fase 2)
- Dado qualquer texto que não venha do `content.js` revisado
- Então ele é inserido na página com escape ou como texto, nunca como HTML

## SEC-06 · A `main` só muda por pull request aprovado com CI verde
Verificação: manual (configuração do repositório no GitHub)
- Dado o repositório no GitHub
- Então a `main` exige pull request, verificação “Checagem” aprovada e revisão do responsável
- E a varredura de segredos está ativa
