# Matriz de rastreabilidade

Gerada por `npm run specs:write`. Não edite à mão: altere as specs ou os testes e gere de novo.

Requisitos: 40 · automáticos: 33 · manuais: 5 · planejados: 2 · testes: 37

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
| **CONT-08** · O conteúdo existe em um só lugar | automática | `content.test.js` · o index.html carrega o conteúdo de content.js, sem cópia embutida |
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

## Segurança e privacidade (`security.spec.md`)

| Requisito | Verificação | Testes |
|---|---|---|
| **SEC-01** · O aplicativo não carrega recursos de terceiros | automática | `repo.test.js` · o index.html só carrega scripts e estilos do próprio projeto |
| **SEC-02** · Os dados da estudante não saem do aparelho | automática | `repo.test.js` · o código do aplicativo não envia dados para fora do aparelho |
| **SEC-03** · Fotos e imagens da apostila nunca são versionadas | automática | `repo.test.js` · nenhuma imagem ou PDF é versionado no repositório |
| **SEC-04** · Política de segurança de conteúdo (CSP) | planejada: Fase 2 | — |
| **SEC-05** · Texto dinâmico sempre escapado | planejada: Fase 2 | — |
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
