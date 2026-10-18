# Revisar erros

Prefixo: REV
Status: aprovado em 2026-10-18
Versão: 1.0
Código previsto: `progress.js` (cálculo da lista), `app.js` (telas)
Testes previstos: `tests/review.test.js`

Hoje a estudante sabe quantos desafios venceu, mas não tem um caminho direto para voltar às questões em que tropeçou. O modo “Revisar erros” reúne essas questões em uma sessão curta, na ordem de prioridade, com as mesmas regras de sempre. A lista é calculada a partir do progresso já salvo: nada novo é gravado.

Fica de fora desta versão: repetição espaçada (agendar revisões por data), revisão por trilha específica e estatísticas por tipo de erro.

### Decisões aprovadas

| Decisão | Escolha | Alternativas descartadas |
|---|---|---|
| Tamanho da sessão | Até **10** questões | 5; sem limite |
| Acertos com dica | **Entram** na revisão, depois das erradas | Só questões nunca acertadas |
| Onde fica o acesso | **Cartão na tela inicial** e botão em “Meu progresso”; o menu continua com 4 opções | Quinta opção no menu superior |

## REV-01 · Entram na revisão as questões tentadas e ainda não vencidas
Verificação: planejada (Fase 3 · automática)
- Dado o progresso salvo
- Então entra na revisão toda questão respondida pelo menos uma vez e ainda não vencida sem dica
- E questões nunca respondidas não entram, porque continuam disponíveis nas trilhas
- E questões já vencidas não entram

## REV-02 · A ordem segue a prioridade de aprendizagem
Verificação: planejada (Fase 3 · automática)
- Dado as questões que entram na revisão
- Então primeiro vêm as que nunca foram acertadas
- E depois as que só foram acertadas com dica
- E, dentro de cada grupo, a ordem é a das trilhas na apostila (20.1, 20.2, …, 21.5)

## REV-03 · A sessão é curta
Verificação: planejada (Fase 3 · automática)
- Dado que há mais de 10 questões para revisar
- Quando a sessão começa
- Então ela tem as 10 primeiras da ordem de prioridade
- E as demais ficam para a próxima sessão

## REV-04 · Respostas na revisão seguem as regras de sempre
Verificação: planejada (Fase 3 · automática)
- Dado uma questão em revisão
- Quando a estudante responde
- Então valem as mesmas regras das trilhas: tentativa registrada, XP por acerto, uso de dica registrado e meta diária atualizada (PROG-01 a PROG-07)
- E, se ela acertar sem dica, a questão é vencida e não aparece na próxima sessão de revisão

## REV-05 · A revisão não grava nenhum dado novo
Verificação: planejada (Fase 3 · automática)
- Dado o progresso salvo
- Quando a lista de revisão é calculada
- Então o progresso não é alterado
- E o formato salvo continua sendo a `schemaVersion` 2 (STOR-14)

## REV-06 · Questões que não existem mais no conteúdo são ignoradas
Verificação: planejada (Fase 3 · automática)
- Dado um progresso com IDs de questões que não existem no `content.js` atual
- Então essas questões não entram na revisão e não causam erro

## REV-07 · A lista da sessão não muda enquanto ela acontece
Verificação: planejada (Fase 3 · manual: navegador)
- Dado uma sessão de revisão em andamento
- Quando a estudante vence uma questão
- Então a questão continua na sessão atual, que segue até o fim na mesma ordem

## REV-08 · O acesso mostra quantas questões há para revisar
Verificação: planejada (Fase 3 · manual: navegador)
- Dado que há questões para revisar
- Então a tela inicial mostra um cartão com a quantidade e um botão para começar
- E a tela “Meu progresso” oferece o mesmo botão
- E, sem questões para revisar, o cartão some e “Meu progresso” mostra uma mensagem de incentivo

## REV-09 · Cada questão mostra de onde veio
Verificação: planejada (Fase 3 · manual: navegador)
- Dado uma questão em revisão
- Então a tela mostra a trilha de origem e a página da apostila
- E o motivo da revisão: “ainda não acertada” ou “acertada com dica”

## REV-10 · O fim da sessão mostra o resultado
Verificação: planejada (Fase 3 · manual: navegador)
- Dado o fim de uma sessão de revisão
- Então a tela mostra quantas questões foram vencidas nesta sessão e quantas ainda restam para revisar
- E oferece começar outra sessão, se ainda houver questões, ou voltar ao início

## REV-11 · A revisão é acessível
Verificação: planejada (Fase 3 · manual: navegador e leitor de tela)
- Dado a tela de revisão
- Então ela funciona só com teclado, o progresso da sessão (“questão 3 de 10”) é anunciado e nada ultrapassa a tela a partir de 320 px
