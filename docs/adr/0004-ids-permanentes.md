# ADR-0004 · IDs permanentes por questão

- **Status:** Aceito
- **Data:** 2026-10-12 (registrado em 2026-10-18)
- **Specs relacionadas:** P4, CONT-02, CONT-03, PROG-02

## Contexto

O progresso precisa sobreviver a reorganizações do conteúdo. Se ele fosse guardado pela posição da questão na lista, qualquer mudança de ordem atribuiria acertos à questão errada.

## Decisão

Cada questão tem um ID escrito no código (por exemplo, `m21-notaveis-02`), e o progresso é salvo por esse ID. IDs nunca são renomeados, removidos nem reaproveitados. A posição da alternativa correta das questões existentes também não muda, porque o progresso guarda a alternativa escolhida pela posição.

## Alternativas consideradas

- **Índice da questão na trilha:** simples, mas quebra em qualquer reorganização.
- **Hash do enunciado:** dispensa escrever IDs, mas corrigir um erro de digitação apagaria o progresso daquela questão.

## Consequências

- Foi possível reorganizar 6 fases em 9 trilhas sem perder nenhum desafio vencido.
- Questões podem mudar de trilha livremente.
- Trocar uma questão por outra de sentido diferente exige um ID novo. Testes travam a lista de IDs (CONT-02) e o gabarito das questões originais (CONT-03).
