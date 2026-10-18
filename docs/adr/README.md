# Registros de decisão de arquitetura (ADR)

Cada ADR registra uma decisão importante: o contexto, o que foi decidido, as alternativas e as consequências. Um ADR aceito não é editado depois; se a decisão mudar, um novo ADR o substitui e o antigo passa a “Substituído por ADR-NNNN”.

Mudar um princípio de `specs/constitution.md` exige um ADR aprovado.

| ADR | Decisão | Status |
|---|---|---|
| [0001](0001-aplicativo-estatico.md) | Aplicativo estático, sem servidor | Aceito |
| [0002](0002-progresso-no-localstorage.md) | Progresso no `localStorage`, com formato versionado e migração | Aceito |
| [0003](0003-conteudo-proprio.md) | Conteúdo próprio, com a apostila apenas como referência | Aceito |
| [0004](0004-ids-permanentes.md) | IDs permanentes por questão | Aceito |
| [0005](0005-desenvolvimento-orientado-por-especificacao.md) | Desenvolvimento orientado por especificação (SDD) | Aceito |
| [0006](0006-csp-e-escape.md) | CSP restritiva e gerador de HTML seguro | Aceito |
| [0007](0007-acoes-fixadas-por-sha.md) | Ações do CI fixadas por SHA | Aceito |

Para uma decisão nova, copie [`_template.md`](_template.md) com o próximo número.
