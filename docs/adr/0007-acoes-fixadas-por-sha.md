# ADR-0007 · Ações do CI fixadas por SHA

- **Status:** Aceito
- **Data:** 2026-10-18
- **Specs relacionadas:** P7, SEC-07

## Contexto

O CI usa ações de terceiros (`actions/checkout`, `actions/setup-node`). Referenciá-las por tag (`@v4`) significa executar o que estiver naquela tag no momento, e tags podem ser movidas, inclusive por um invasor que comprometa o repositório da ação.

## Decisão

Toda ação externa é referenciada pelo SHA completo do commit, com a versão em comentário (`actions/checkout@11d5960… # v4.4.0`). O fluxo tem permissão apenas de leitura e não guarda credenciais no checkout. Um teste (SEC-07) bloqueia referências por tag e permissões de escrita.

## Alternativas consideradas

- **Tags de versão maior (`@v4`):** recebem correções automaticamente, mas também qualquer alteração maliciosa.
- **Sem CI:** elimina o risco, mas perde a verificação automática de cada pull request (ADR-0005).

## Consequências

- O código executado no CI é exatamente o revisado.
- Atualizar uma ação é uma mudança explícita: obter o SHA da nova versão (por exemplo, com `git ls-remote --tags`) e trocá-lo no fluxo. O Dependabot pode automatizar isso no futuro.
