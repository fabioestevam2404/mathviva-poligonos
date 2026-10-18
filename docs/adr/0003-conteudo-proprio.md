# ADR-0003 · Conteúdo próprio, com a apostila apenas como referência

- **Status:** Aceito
- **Data:** 2026-10-14 (registrado em 2026-10-18)
- **Specs relacionadas:** P6, CONT-09, SEC-03

## Contexto

Para o estudo acompanhar as aulas, o conteúdo precisava seguir a apostila usada pela escola. A apostila é material protegido por direitos autorais, e o site é público no GitHub Pages, mesmo que o repositório seja privado.

## Decisão

A apostila define a sequência das trilhas, os termos, a notação e as páginas de referência. Explicações, exemplos e questões são escritos do zero, com números e situações diferentes. Fotos e digitalizações da apostila nunca são versionadas: o `.gitignore` e um teste (SEC-03) bloqueiam imagens e PDFs.

## Alternativas consideradas

- **Transcrever a apostila:** mais rápido, mas viola direitos autorais em um site público.
- **Conteúdo genérico, sem relação com a apostila:** sem problema de direitos, mas desalinhado do que a estudante vê em sala.

## Consequências

- O estudo acompanha a sala sem expor o material da escola.
- Cada questão nova dá trabalho de autoria e precisa de revisão de linguagem e nível (CONT-09, verificação manual).
- Os gabaritos de questões com cálculo são recalculados pelos testes (CONT-06), compensando o risco de erro de autoria.
