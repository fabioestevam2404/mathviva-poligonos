# Progresso de aprendizagem

Prefixo: PROG
Status: implementado
Versão: 1.0
Código: `progress.js`, `index.html`
Testes: `tests/progress.test.js`

O aplicativo acompanha três indicadores independentes: desafios vencidos (aprendizagem), XP e participação (esforço) e meta diária (constância). Esta spec define como cada um é calculado.

## PROG-01 · Desafio vencido é uma questão distinta acertada sem dica
Verificação: automática
- Dado que a estudante ainda não venceu a questão Q
- Quando ela acerta Q sem ter pedido a dica
- Então Q passa a contar como desafio vencido
- E responder Q de novo não aumenta a contagem
- E errar Q não conta como desafio vencido

## PROG-02 · Cada questão guarda seu histórico de respostas
Verificação: automática
- Dado que a estudante responde a questão Q
- Então ficam registrados o número de tentativas, de acertos e de dicas usadas
- E a primeira resposta (alternativa, se acertou, se usou dica, data e hora) é mantida para sempre
- E a última resposta é atualizada a cada nova tentativa

## PROG-03 · Acerto com dica não vence o desafio
Verificação: automática
- Dado que a estudante pediu a dica na questão Q
- Quando ela acerta Q
- Então ganha XP normalmente
- E Q não conta como desafio vencido
- E o uso da dica fica registrado

## PROG-04 · O feedback avisa quando a dica impediu a vitória
Verificação: manual (navegador: acertar uma questão depois de pedir a dica)
- Dado que a estudante acertou a questão Q depois de pedir a dica e Q ainda não está vencida
- Então a explicação informa que o desafio ainda não conta e convida a refazer sem dica

## PROG-05 · A vitória é permanente
Verificação: automática
- Dado que Q já foi vencida sem dica
- Quando a estudante responde Q de novo, com ou sem dica
- Então Q continua vencida

## PROG-06 · XP e participação são separados da aprendizagem
Verificação: automática
- Dado que a estudante acerta uma questão, mesmo repetida ou com dica
- Então ganha +10 XP
- E tentativas e acertos totais somam todas as respostas
- E errar não dá XP

## PROG-07 · A meta diária conta as respostas do dia
Verificação: automática
- Dado que a meta diária é de 5 respostas
- Quando a estudante responde questões em um dia
- Então o anel do dia mostra as respostas daquele dia, com qualquer resultado
- E o percentual é limitado a 100%
- E um novo dia começa do zero, sem alterar os totais acumulados

## PROG-08 · O dia é o do relógio local do aparelho
Verificação: automática
- Dado um horário em que a data local e a data UTC são diferentes (por exemplo, 22h30 em São Paulo)
- Quando a estudante responde
- Então a resposta conta para a data local

## PROG-09 · A meta é recalculada quando a página volta a ser usada
Verificação: manual (navegador: deixar a aba aberta até o dia seguinte e voltar a ela)
- Dado que a página ficou aberta desde um dia anterior
- Quando ela volta a ficar visível ou recebe foco
- Então o anel do dia é recalculado para a data atual

## PROG-10 · Estrelas da jornada a cada terço do total
Verificação: automática
- Dado o total de N desafios
- Então a k-ésima estrela acende com ⌈k × N ÷ 3⌉ desafios vencidos, até 3 estrelas
- E sem desafios não há estrela

## PROG-11 · Estrelas da trilha proporcionais ao seu tamanho
Verificação: automática
- Dado uma trilha com T questões e V vencidas
- Então há 0 estrelas com V = 0, 1 estrela ao começar, 2 com metade ou mais e 3 com todas vencidas

## PROG-12 · Só IDs de questão válidos são registrados
Verificação: automática
- Dado um ID vazio, ausente, não textual ou com caracteres inválidos
- Quando se tenta registrar uma resposta
- Então o registro é recusado com erro
