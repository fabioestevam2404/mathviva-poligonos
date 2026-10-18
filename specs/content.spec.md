# Conteúdo didático

Prefixo: CONT
Status: implementado
Versão: 1.1
Código: `content.js`, `index.html`, `schemas/content.schema.json`
Testes: `tests/content.test.js`, `tests/schema.test.js`

O conteúdo acompanha a apostila de Matemática usada em sala (Módulos 20 e 21). A tabela de trilhas, páginas e notação está no `README.md`, seção “Conteúdo alinhado à apostila”.

## CONT-01 · As trilhas seguem a ordem da apostila
Verificação: automática
- Dado o conjunto de trilhas
- Então elas aparecem na ordem dos módulos e seções da apostila (20.1, 20.2, …, 21.5)
- E o módulo de cada trilha corresponde ao seu código

## CONT-02 · Cada questão tem um ID explícito, único e estável
Verificação: automática
- Dado o conjunto de questões
- Então cada uma tem um ID escrito no código, sem repetição, só com letras minúsculas, números, `_` e `-`
- E a lista de IDs por trilha só muda de propósito, com o retrato dos testes atualizado junto

## CONT-03 · Nenhuma questão da primeira versão é removida
Verificação: automática
- Dado os 30 IDs da primeira versão (`fundamentos-01` a `aplicacoes-05`)
- Então todos continuam presentes
- E a resposta correta de cada um mantém a mesma posição e o mesmo texto, porque o progresso salvo guarda a posição escolhida

## CONT-04 · Toda questão é completa
Verificação: automática
- Dado uma questão
- Então ela tem enunciado, 4 alternativas diferentes, a indicação da correta, uma dica e uma explicação

## CONT-05 · Toda trilha é completa e indica a apostila
Verificação: automática
- Dado uma trilha
- Então ela tem nome, descrição, ideia principal, exemplo com 4 passos, pelo menos 4 questões e a referência de páginas no formato “Módulo NN · p. …”
- E tem um resumo com analogia, pelo menos 4 seções, fórmulas e checagem final

## CONT-06 · Os gabaritos numéricos conferem com as fórmulas
Verificação: automática
- Dado uma questão cuja resposta vem de cálculo (diagonais, somas e medidas de ângulos, perímetro, área, relações dos polígonos notáveis)
- Então a alternativa marcada como correta é igual ao valor recalculado pela fórmula

## CONT-07 · “Estamos aqui na escola” aponta para uma trilha existente
Verificação: automática
- Dado o valor de `school.currentTopic`
- Então ele é `null` ou o ID de uma trilha existente

## CONT-08 · O conteúdo existe em um só lugar
Verificação: automática
- Dado o `index.html`
- Então nem ele nem `app.js` contêm cópia do conteúdo
- E a página carrega `content.js`, `progress.js`, `html.js` e por último `app.js`

## CONT-10 · O conteúdo segue o contrato formal
Verificação: automática
- Dado o `content.js`
- Então ele é válido segundo `schemas/content.schema.json`
- E o validador recusa exemplos de conteúdo malformado (campo faltando, tipo errado, ID fora do padrão, alternativa a mais)

## CONT-09 · Texto próprio, apostila apenas como referência
Verificação: manual (revisão de conteúdo no pull request)
- Dado uma trilha ou questão nova
- Então explicações, exemplos e enunciados são escritos do zero, com números e situações diferentes dos da apostila
- E a linguagem e o nível são revisados com a estudante ou o responsável
