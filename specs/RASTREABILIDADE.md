# Matriz de rastreabilidade

Gerada por `npm run specs:write`. Não edite à mão: altere as specs ou os testes e gere de novo.

Requisitos: 54 · automáticos: 44 · manuais: 10 · planejados: 0 · testes: 54

## Conteúdo didático (`content.spec.md`)

| Requisito | Verificação | Testes |
|---|---|---|
| **CONT-01** · As trilhas seguem a ordem da apostila | automática | `content.test.js` · as trilhas seguem a ordem da apostila |
| **CONT-02** · Cada questão tem um ID explícito, único e estável | automática | `content.test.js` · IDs das questões são explícitos, únicos e estáveis |
| **CONT-03** · Nenhuma questão da primeira versão é removida | automática | `content.test.js` · nenhuma questão da primeira versão foi removida nem teve o gabarito alterado |
| **CONT-04** · Toda questão é completa | automática | `content.test.js` · cada questão tem enunciado, 4 alternativas distintas, gabarito, dica e explicação |
| **CONT-05** · Toda trilha é completa e indica a apostila | automática | `content.test.js` · cada trilha tem explicação, exemplo, passos, referência à apostila e resumo |
| **CONT-06** · Os gabaritos numéricos conferem com as fórmulas | automática | `content.test.js` · gabaritos numéricos conferem com as fórmulas |
| **CONT-07** · “Estamos aqui na escola” aponta para uma trilha existente | automática | `content.test.js` · a marcação "Estamos aqui na escola" aponta para uma trilha existente |
| **CONT-08** · O conteúdo existe em um só lugar | automática | `content.test.js` · o conteúdo vem só de content.js, carregado na ordem certa |
| **CONT-10** · O conteúdo segue o contrato formal | automática | `schema.test.js` · o content.js segue o contrato<br>`schema.test.js` · o contrato recusa conteúdo malformado |
| **CONT-09** · Texto próprio, apostila apenas como referência | manual: revisão de conteúdo no pull request | — |

## Progresso de aprendizagem (`progress.spec.md`)

| Requisito | Verificação | Testes |
|---|---|---|
| **PROG-01** · Desafio vencido é uma questão distinta acertada sem dica | automática | `progress.test.js` · repetir uma questão conta tentativas, mas o progresso só uma vez<br>`progress.test.js` · errar não conta como desafio vencido |
| **PROG-02** · Cada questão guarda seu histórico de respostas | automática | `progress.test.js` · repetir uma questão conta tentativas, mas o progresso só uma vez<br>`progress.test.js` · guarda a primeira resposta e atualiza o último resultado |
| **PROG-03** · Acerto com dica não vence o desafio | automática | `progress.test.js` · acerto com dica não conta no progresso, mas registra o uso da dica e soma XP |
| **PROG-04** · O feedback avisa quando a dica impediu a vitória | manual: navegador: acertar uma questão depois de pedir a dica | — |
| **PROG-05** · A vitória é permanente | automática | `progress.test.js` · acerto com dica não conta no progresso, mas registra o uso da dica e soma XP |
| **PROG-06** · XP e participação são separados da aprendizagem | automática | `progress.test.js` · repetir uma questão conta tentativas, mas o progresso só uma vez<br>`progress.test.js` · errar não conta como desafio vencido |
| **PROG-07** · A meta diária conta as respostas do dia | automática | `progress.test.js` · meta diária considera apenas a data local do dispositivo<br>`progress.test.js` · meta diária fica limitada a 100% |
| **PROG-08** · O dia é o do relógio local do aparelho | automática | `progress.test.js` · data local difere da data UTC perto da meia-noite |
| **PROG-09** · A meta é recalculada quando a página volta a ser usada | manual: navegador: deixar a aba aberta até o dia seguinte e voltar a ela | — |
| **PROG-10** · Estrelas da jornada a cada terço do total | automática | `progress.test.js` · estrelas das conquistas: uma a cada terço do total vencido sem dica |
| **PROG-11** · Estrelas da trilha proporcionais ao seu tamanho | automática | `progress.test.js` · estrelas da trilha acompanham o tamanho da trilha |
| **PROG-12** · Só IDs de questão válidos são registrados | automática | `progress.test.js` · IDs de questão inválidos são recusados |

## Revisar erros (`review.spec.md`)

| Requisito | Verificação | Testes |
|---|---|---|
| **REV-01** · Entram na revisão as questões tentadas e ainda não vencidas | automática | `review.test.js` · entram as questões tentadas e ainda não vencidas |
| **REV-02** · A ordem segue a prioridade de aprendizagem | automática | `review.test.js` · primeiro as nunca acertadas, depois as acertadas com dica, na ordem da apostila |
| **REV-03** · A sessão é curta | automática | `review.test.js` · a sessão tem no máximo 10 questões e informa o total |
| **REV-04** · Respostas na revisão seguem as regras de sempre | automática | `review.test.js` · respostas na revisão seguem as regras de sempre |
| **REV-05** · A revisão não grava nenhum dado novo | automática | `review.test.js` · calcular a revisão não altera o progresso nem o formato salvo |
| **REV-06** · Questões que não existem mais no conteúdo são ignoradas | automática | `review.test.js` · questões que não existem mais no conteúdo são ignoradas |
| **REV-07** · A lista da sessão não muda enquanto ela acontece | manual: navegador | — |
| **REV-08** · O acesso mostra quantas questões há para revisar | manual: navegador | — |
| **REV-09** · Cada questão mostra de onde veio | manual: navegador | — |
| **REV-10** · O fim da sessão mostra o resultado | manual: navegador | — |
| **REV-11** · A revisão é acessível | manual: navegador e leitor de tela | — |

## Segurança e privacidade (`security.spec.md`)

| Requisito | Verificação | Testes |
|---|---|---|
| **SEC-01** · O aplicativo não carrega recursos de terceiros | automática | `repo.test.js` · o index.html só carrega scripts e estilos do próprio projeto |
| **SEC-02** · Os dados da estudante não saem do aparelho | automática | `repo.test.js` · o código do aplicativo não envia dados para fora do aparelho |
| **SEC-03** · Fotos e imagens da apostila nunca são versionadas | automática | `repo.test.js` · nenhuma imagem ou PDF é versionado no repositório |
| **SEC-04** · Política de segurança de conteúdo (CSP) | automática | `repo.test.js` · a página não tem scripts embutidos nem eventos inline e declara a CSP antes dos scripts |
| **SEC-05** · Todo texto entra na página escapado | automática | `html.test.js` · toda interpolação é escapada por padrão<br>`html.test.js` · só fragmentos do próprio gerador entram sem escape<br>`html.test.js` · valores vazios e números são tratados sem surpresa<br>`html.test.js` · o aplicativo só escreve HTML pelo gerador seguro |
| **SEC-07** · As ações do CI são fixadas por versão imutável | automática | `repo.test.js` · o CI usa ações fixadas por SHA e permissões só de leitura |
| **SEC-06** · A `main` só muda por pull request aprovado com CI verde | manual: configuração do repositório no GitHub | — |

## Salvamento e recuperação dos dados (`storage.spec.md`)

| Requisito | Verificação | Testes |
|---|---|---|
| **STOR-01** · Os dados salvos têm formato versionado | automática | `progress.test.js` · salvar e carregar preserva o estado e o schemaVersion |
| **STOR-02** · Primeiro acesso começa vazio | automática | `progress.test.js` · sem dados salvos começa vazio |
| **STOR-03** · Ler e gravar nunca derruba o aplicativo | automática | `progress.test.js` · localStorage inacessível: carregar e salvar não lançam erro |
| **STOR-04** · Falha de gravação é informada sem perder o estado | automática | `progress.test.js` · cota excedida na gravação é informada sem perder o estado em memória |
| **STOR-05** · Aviso acessível quando o armazenamento falha de fato | manual: navegador: bloquear o armazenamento do site e recarregar | — |
| **STOR-06** · Dados ilegíveis são tratados como corrompidos | automática | `progress.test.js` · JSON inválido: não lança erro, guarda cópia e recomeça<br>`progress.test.js` · estruturas com formato errado são tratadas como corrompidas |
| **STOR-07** · Campos inválidos são descartados individualmente | automática | `progress.test.js` · campos inválidos são descartados individualmente, preservando o restante |
| **STOR-08** · O original nunca é sobrescrito sem cópia | automática | `progress.test.js` · dados corrompidos sem cópia possível: funciona em memória e bloqueia a gravação<br>`progress.test.js` · dados reparáveis sem cópia possível também bloqueiam a gravação<br>`progress.test.js` · com cópia feita, a gravação continua liberada<br>`progress.test.js` · corrompido + histórico antigo + falha na cópia: migra em memória sem gravar |
| **STOR-09** · Migração da primeira versão sem inventar acertos | automática | `progress.test.js` · migração do formato antigo preserva o histórico sem inventar acertos por questão<br>`progress.test.js` · migração descarta valores antigos inválidos |
| **STOR-10** · Totais de participação incluem o histórico antigo | automática | `progress.test.js` · migração do formato antigo preserva o histórico sem inventar acertos por questão |
| **STOR-11** · Formato antigo ilegível é sinalizado e preservado | automática | `progress.test.js` · formato antigo ilegível é sinalizado e não é apagado |
| **STOR-12** · Dados atuais corrompidos recorrem ao histórico antigo | automática | `progress.test.js` · dados atuais corrompidos recorrem ao histórico antigo quando ele existe<br>`progress.test.js` · corrompido + histórico antigo + falha na cópia: migra em memória sem gravar |
| **STOR-13** · O histórico diário guarda os últimos 120 dias com atividade | automática | `progress.test.js` · o histórico diário guarda só os 120 dias mais recentes com atividade |
| **STOR-14** · Todo estado carregado ou gravado segue o contrato da versão 2 | automática | `schema.test.js` · estados carregados de qualquer conteúdo seguem o contrato da versão 2<br>`schema.test.js` · dados da primeira versão com HTML são limpos na migração<br>`schema.test.js` · o contrato recusa estados fora do formato |
