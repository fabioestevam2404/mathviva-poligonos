# ADR-0001 · Aplicativo estático, sem servidor

- **Status:** Aceito
- **Data:** 2026-10-12 (registrado em 2026-10-18)
- **Specs relacionadas:** P5, P7, SEC-01, SEC-02

## Contexto

O aplicativo é usado por uma estudante, em casa e no celular, para acompanhar as aulas. Precisa abrir rápido, funcionar sem internet depois de carregado, não ter custo de hospedagem e não coletar dados de uma menor de idade.

## Decisão

O aplicativo é um conjunto de arquivos estáticos (HTML, CSS e JavaScript), publicados pelo GitHub Pages e executados inteiramente no navegador. Não há servidor de aplicação, banco de dados, contas nem rastreamento. Não há frameworks nem etapa de build: os arquivos do repositório são exatamente os que o navegador recebe.

## Alternativas consideradas

- **Aplicação com backend e banco de dados:** permitiria sincronizar entre aparelhos, mas traz custo, manutenção, autenticação e a responsabilidade de guardar dados pessoais de uma estudante. Nada disso é necessário hoje.
- **Framework de interface com build (React, Vue):** facilitaria telas complexas, mas adiciona dependências que envelhecem e uma etapa de build para um app de poucas telas.

## Consequências

- Custo zero, privacidade por construção e funcionamento offline.
- O app abre com dois cliques no `index.html`, inclusive sem internet.
- O progresso fica preso ao navegador e ao aparelho (ver ADR-0002). Sincronização exigiria rever esta decisão.
- A interface é escrita em JavaScript direto; a segurança da geração de HTML é tratada no ADR-0006.
