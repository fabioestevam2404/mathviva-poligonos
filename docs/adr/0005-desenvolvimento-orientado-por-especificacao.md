# ADR-0005 · Desenvolvimento orientado por especificação (SDD)

- **Status:** Aceito
- **Data:** 2026-10-18
- **Specs relacionadas:** P1, P2

## Contexto

As regras do aplicativo estavam espalhadas entre o README, os testes e o histórico de conversas. Mudanças feitas com ajuda de agentes de IA precisam de um contrato claro e verificável, e o responsável pelo projeto precisa revisar comportamento, não código.

## Decisão

- O comportamento é descrito em specs (`specs/*.spec.md`), com requisitos identificados, critérios em Dado / Quando / Então e a forma de verificação.
- A spec é aprovada antes do código.
- Todo teste cita no título os requisitos que verifica. `scripts/check-specs.js` falha se houver requisito automático sem teste, teste sem requisito ou matriz de rastreabilidade desatualizada.
- O CI roda `npm run check` em todo pull request. O `CLAUDE.md` descreve o fluxo para agentes.

## Alternativas consideradas

- **GitHub Spec Kit:** automatiza o ciclo com comandos próprios, mas adiciona ferramentas e convenções além do necessário para um projeto deste tamanho. O formato adotado é compatível em espírito e permite migrar no futuro.
- **Testes como única documentação:** precisos, mas difíceis de revisar para quem não programa.

## Consequências

- Mudanças começam por uma spec legível; requisitos sem teste e testes sem propósito são detectados automaticamente.
- Há um custo extra por mudança: escrever ou atualizar a spec e regerar a matriz.
- Requisitos que dependem de navegador ou de pessoa ficam explícitos como verificação manual.
