# MathViva 9 — instruções para agentes

Aplicativo estático de estudo de polígonos para o 9º ano, alinhado à apostila usada em sala. Este projeto segue **desenvolvimento orientado por especificação (SDD)**. Antes de qualquer mudança, leia `specs/constitution.md`.

## Fluxo obrigatório

1. **Especificar.** Toda mudança de comportamento começa na spec em `specs/` (nova ou existente), com requisitos `## XXXX-NN · título`, a linha `Verificação:` e critérios em Dado / Quando / Então. Use `specs/_template.md` para funcionalidades novas.
2. **Aprovar.** Apresente a spec ao responsável e espere aprovação antes de escrever código.
3. **Planejar.** Descreva os arquivos afetados e os riscos. Decisões que mudam um princípio da constituição exigem um ADR.
4. **Implementar.** Código e testes juntos. Todo teste cita no título os requisitos que verifica, por exemplo `test('[PROG-03] …')`.
5. **Verificar.** Rode `npm run check`. Se mudou specs ou títulos de testes, rode `npm run specs:write` e inclua `specs/RASTREABILIDADE.md`. Confira no navegador os requisitos com verificação manual.
6. **Entregar.** Branch `melhoria/*` → commit → push → pull request usando o modelo. Nunca faça commit ou push sem pedido explícito do responsável, e nunca direto na `main`.

## Regras que não podem ser quebradas

- **IDs de questão são permanentes** (`content.js`). Não renomeie, não remova, não reaproveite, e não mude a posição da resposta correta das questões existentes.
- **Dados salvos:** mudar o formato exige nova `schemaVersion`, migração e testes. Nunca grave por cima de dados originais sem cópia (STOR-08).
- **Apostila:** use apenas como referência de sequência, termos e notação. Não copie textos, exemplos ou exercícios. Nunca adicione fotos, imagens ou PDFs ao repositório (SEC-03).
- **Sem dependências e sem recursos externos** (P5, P7, SEC-01, SEC-02).
- **HTML só pelo gerador seguro:** em `app.js`, toda atribuição a `innerHTML` usa `` html`…` ``; nunca use `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval` nem JavaScript embutido no `index.html` (SEC-04, SEC-05).
- **Contratos:** mudou o formato do conteúdo ou dos dados salvos? Atualize o schema em `schemas/` junto.
- **Idioma:** conteúdo, specs e mensagens em português do Brasil.

## Mapa do código

| Arquivo | Papel | Spec |
|---|---|---|
| `content.js` | Trilhas, questões, resumos, `school.currentTopic` | `specs/content.spec.md` |
| `progress.js` | Regras de progresso, estrelas, meta diária, salvamento, fila de revisão | `specs/progress.spec.md`, `specs/storage.spec.md`, `specs/review.spec.md` |
| `html.js` | Gerador de HTML seguro (escapa tudo por padrão) | `specs/security.spec.md` (SEC-05) |
| `app.js` | Interface: telas, cliques, avisos | todas |
| `index.html` | Estrutura da página, estilos e CSP; sem JavaScript embutido | `specs/security.spec.md` (SEC-04) |
| `schemas/*.json` | Contratos do conteúdo e dos dados salvos | CONT-10, STOR-14 |
| `docs/adr/` | Registros de decisão de arquitetura | `specs/constitution.md` |
| `tests/*.test.js` | Testes (Node, sem dependências) | todas |
| `scripts/check-specs.js` | Rastreabilidade spec ↔ teste | `specs/constitution.md` (P2) |
| `scripts/validate-schema.js` | Validador de JSON Schema mínimo, usado nos testes | CONT-10, STOR-14 |

## Comandos

- `npm run check`: specs, rastreabilidade e testes (é o mesmo que o CI roda)
- `npm test`: só os testes
- `npm run specs:write`: regera `specs/RASTREABILIDADE.md`
