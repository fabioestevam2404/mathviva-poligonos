# Salvamento e recuperação dos dados

Prefixo: STOR
Status: implementado
Versão: 1.0
Código: `progress.js` (`loadProgress`, `saveProgress`, `sanitize`, `migrateLegacy`), `index.html`
Testes: `tests/progress.test.js`

O progresso fica no `localStorage` do navegador. O armazenamento pode estar bloqueado, cheio, corrompido ou editado à mão. Esta spec garante que nada disso derrube o aplicativo ou apague dados originais.

Chaves usadas:

| Chave | Uso |
|---|---|
| `mathviva-poligonos-progress` | Dados atuais, `schemaVersion: 2` |
| `mathviva-poligonos-v1-progress` | Formato da primeira versão; somente leitura |
| `mathviva-poligonos-progress-backup` | Cópia do original antes de regravar dados danificados |

## STOR-01 · Os dados salvos têm formato versionado
Verificação: automática
- Dado um estado de progresso
- Quando ele é salvo e depois carregado
- Então o conteúdo é idêntico e inclui `schemaVersion: 2`

## STOR-02 · Primeiro acesso começa vazio
Verificação: automática
- Dado que não há dados salvos
- Quando o aplicativo abre
- Então o progresso começa vazio, sem aviso

## STOR-03 · Ler e gravar nunca derruba o aplicativo
Verificação: automática
- Dado que o armazenamento está inacessível ou lança erro em qualquer operação
- Então carregar e salvar não lançam exceção
- E o aplicativo segue funcionando com o progresso em memória

## STOR-04 · Falha de gravação é informada sem perder o estado
Verificação: automática
- Dado que o armazenamento recusa a gravação (por exemplo, cota cheia)
- Quando o aplicativo tenta salvar
- Então o resultado informa a falha e o erro
- E o estado em memória permanece intacto

## STOR-05 · Aviso acessível quando o armazenamento falha de fato
Verificação: manual (navegador: bloquear o armazenamento do site e recarregar)
- Dado que ler ou gravar falhou
- Então aparece um aviso com `role="alert"` explicando o problema
- E o aviso some quando uma gravação seguinte dá certo
- E nenhum aviso aparece só por estar em janela anônima, se a gravação funciona

## STOR-06 · Dados ilegíveis são tratados como corrompidos
Verificação: automática
- Dado que a chave atual contém JSON inválido, um valor que não é objeto ou uma `schemaVersion` desconhecida
- Quando o aplicativo abre
- Então o estado é corrompido, o conteúdo original vai para a chave de backup e o progresso recomeça

## STOR-07 · Campos inválidos são descartados individualmente
Verificação: automática
- Dado que alguns campos dos dados salvos são inválidos
- Quando o aplicativo abre
- Então só os campos inválidos são descartados, o restante é mantido e o estado é marcado como reparado

## STOR-08 · O original nunca é sobrescrito sem cópia
Verificação: automática
- Dado que os dados estão corrompidos ou foram reparados
- Quando a cópia para a chave de backup falha
- Então o aplicativo não grava nada na chave atual durante a visita
- E funciona apenas em memória
- E, quando a cópia funciona, a gravação segue liberada

## STOR-09 · Migração da primeira versão sem inventar acertos
Verificação: automática
- Dado que só existem dados no formato da primeira versão
- Quando o aplicativo abre
- Então o XP é mantido e os totais antigos ficam em `legacy`
- E nenhuma questão é marcada como vencida e nenhuma atividade diária é criada
- E valores antigos inválidos são descartados
- E a chave antiga não é alterada

## STOR-10 · Totais de participação incluem o histórico antigo
Verificação: automática
- Dado que existem totais migrados em `legacy`
- Então tentativas e acertos exibidos somam o histórico antigo e as respostas novas

## STOR-11 · Formato antigo ilegível é sinalizado e preservado
Verificação: automática
- Dado que a chave da primeira versão contém dados ilegíveis
- Quando o aplicativo abre
- Então o estado é marcado como corrompido e a chave antiga continua intacta

## STOR-12 · Dados atuais corrompidos recorrem ao histórico antigo
Verificação: automática
- Dado que a chave atual está corrompida e existe a chave da primeira versão legível
- Quando o aplicativo abre
- Então o histórico antigo é migrado, e o estado continua sinalizado como corrompido

## STOR-13 · O histórico diário guarda os últimos 120 dias com atividade
Verificação: automática
- Dado que há registros de atividade em mais de 120 dias diferentes
- Quando uma nova resposta é registrada
- Então só os 120 dias mais recentes são mantidos
