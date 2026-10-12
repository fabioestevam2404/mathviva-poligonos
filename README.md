# MathViva 9 — Jornada dos Polígonos

Aplicativo web educativo, responsivo e sem dependências externas, dedicado ao estudo aprofundado de polígonos convexos, polígonos regulares e suas aplicações no 9º ano.

## Como abrir

Abra `index.html` em um navegador atualizado. O conteúdo principal funciona sem instalação e sem conexão com a internet. Mantenha `progress.js` na mesma pasta de `index.html`: ele contém as regras de progresso e de salvamento. O progresso é guardado no armazenamento local do navegador (`localStorage`).

## O que já está incluído

- Seis trilhas progressivas: fundamentos dos polígonos; convexidade; polígonos regulares; ângulos; diagonais, perímetro e área; aplicações práticas.
- Trinta questões de múltipla escolha com dicas e explicações detalhadas.
- Aplicações em pavimentação, arquitetura, estruturas, sinalização, natureza, design e tecnologia.
- Em cada trilha: explicação em linguagem acessível, exemplo resolvido em etapas, dica e cinco questões de múltipla escolha com feedback explicado.
- Jornada visual com mapa de fases, missões curtas, estrelas, XP e celebrações de acerto.
- Mascote Luma com mensagens de incentivo e painel de progresso local.
- Central de resumos com teoria detalhada, comparações cotidianas, fórmulas, erros frequentes e verificação final.
- Revisão completa exibida ao fim de cada matéria, com opção de refazer os desafios.
- Layout adaptável para computador e celular, navegação por teclado e feedback anunciado por leitores de tela.

## Como o progresso funciona

O aplicativo acompanha três indicadores diferentes, que não se misturam:

| Indicador | O que mede | Onde aparece |
|---|---|---|
| **Desafios vencidos** | Questões **diferentes** acertadas **sem usar a dica** ao menos uma vez. Repetir uma questão já vencida não aumenta esse número. | Barra e estrelas de cada fase, faixa “Conquistas da jornada” (uma estrela a cada 10 desafios vencidos, até 3), “Meu progresso” (de 0 a 30). |
| **XP e participação** | +10 XP por resposta certa, mesmo repetida ou com dica. As tentativas e os acertos totais também contam todas as respostas. | Cartão “XP conquistados”, “pontos de coragem”, “acertos” e “aproveitamento”. |
| **Meta diária** | Respostas dadas **hoje**, segundo a data local do dispositivo (meta: 5). Começa do zero a cada dia e é recalculada quando a página volta a ficar visível ou recebe foco, por exemplo ao reabrir uma aba deixada aberta desde o dia anterior. | Anel “Seu ritmo de hoje”. |

As estrelas da faixa “Conquistas da jornada” representam o progresso acumulado, e não o dia; por isso a faixa não se chama mais “Missão de hoje”.

Regras importantes:

- **Dica:** um acerto feito depois de pedir a dica rende XP, mas não vence o desafio. A estudante é avisada no feedback e pode refazer a questão sem dica depois. Usar a dica numa questão já vencida não desfaz a conquista.
- **Repetição:** para cada questão ficam registrados o número de tentativas, a primeira resposta, a última resposta (alternativa, se acertou e se usou dica), quantas vezes a dica foi usada e quando a questão foi vencida.
- **Identificação:** cada questão tem um ID fixo no código (por exemplo, `angulos-03`). O progresso é salvo por esse ID, e não pela posição da questão na lista.

### Armazenamento e segurança dos dados

- Os dados ficam na chave `mathviva-poligonos-progress`, com `schemaVersion: 2`.
- Toda leitura e gravação é protegida. O aviso acessível (`role="alert"`) aparece **somente quando a leitura ou a gravação falha de fato**, por exemplo com armazenamento bloqueado nas configurações de privacidade ou cota cheia. Nesses casos o aplicativo continua funcionando com o progresso em memória. O aviso some quando uma gravação seguinte dá certo.
- Janelas anônimas ou privadas normalmente **permitem** gravar no `localStorage`, então nelas o aviso em geral não aparece. Porém o navegador apaga esses dados ao fechar a janela: o progresso de uma sessão anônima não fica guardado, e o aplicativo não tem como detectar isso.
- Ao abrir, os dados são validados campo a campo. Entradas inválidas são descartadas e o restante é preservado. Antes de regravar dados ilegíveis ou reparados, uma cópia do conteúdo original é guardada em `mathviva-poligonos-progress-backup`, e um aviso é exibido.
- Se essa cópia **não puder** ser gravada (por exemplo, por falta de espaço), o aplicativo **não sobrescreve** o original: continua funcionando só em memória e exibe um aviso de que as respostas daquela visita não serão salvas.

### Migração da versão anterior

A versão anterior salvava somente totais (`answered`, `correct`, `xp`, acertos por tema e `lastStudy`) na chave `mathviva-poligonos-v1-progress`. Ela não registrava quais questões foram respondidas nem o uso de dica. Por isso, na migração:

- o XP é mantido;
- os totais antigos ficam guardados no campo `legacy` e continuam somados em tentativas, acertos e aproveitamento, com uma nota explicativa em “Meu progresso”;
- **nenhuma questão é marcada como vencida** e nenhuma atividade diária é criada a partir dos dados antigos;
- a chave antiga não é alterada nem apagada.

## Limitações conhecidas

- O progresso fica **somente neste navegador, neste dispositivo**. Limpar os dados do site, usar outro navegador ou outro aparelho começa uma jornada nova. Não há sincronização nem conta de usuário.
- A meta diária depende do relógio e do fuso horário do dispositivo. Se a data estiver errada ou o fuso mudar, as respostas são contadas no dia que o aparelho informar. A virada do dia é percebida ao responder, ao voltar para a aba ou ao focar a janela; com a página parada e visível, o anel só se atualiza após uma dessas ações.
- Se a cópia de segurança de dados danificados não puder ser feita, nada é salvo até que o problema seja resolvido (por exemplo, liberando espaço ou limpando os dados do site, o que apaga o progresso antigo).
- O histórico diário guarda os últimos 120 dias com atividade.
- Com o aplicativo aberto em duas abas ao mesmo tempo, a última aba a salvar sobrescreve a outra.
- Em alguns navegadores, páginas abertas por `file://` compartilham o mesmo armazenamento. Outra cópia do aplicativo aberta assim lê e grava o mesmo progresso.
- Os dados não são protegidos contra edição manual: quem abrir as ferramentas do navegador pode alterá-los. A validação evita falhas, não fraudes.
- O XP pode crescer refazendo questões já vencidas. Isso é intencional (premia a prática), e por esse motivo o XP não é usado como medida de aprendizagem.

## Estrutura

- `index.html`: aplicação (HTML, CSS, conteúdo didático e interface).
- `progress.js`: regras de progresso, meta diária, validação, migração e acesso protegido ao `localStorage`. Também pode ser carregado pelo Node para os testes.
- `tests/progress.test.js`: testes automatizados das regras.
- `package.json`: apenas o comando de testes; o aplicativo não precisa de instalação.
- `README.md`: este guia.

## Testes

Requer Node.js 20 ou superior; não há dependências para instalar.

```bash
npm test
```

Os testes cobrem:

- IDs estáveis das 30 questões, lidos diretamente do `index.html`;
- repetição de questão, primeira e última resposta e uso de dica;
- mudança de dia na data local, inclusive perto da meia-noite, quando a data UTC já é outra;
- dados corrompidos ou parcialmente inválidos, inclusive com falha ao gravar a cópia de segurança;
- armazenamento indisponível ou cheio;
- migração do formato antigo;
- estrelas das conquistas da jornada.

Os testes automatizados cobrem as regras de `progress.js`, mas não a interface: veja “Verificação manual” abaixo.

## Verificação manual

- **Navegação anônima ou privada:** abra o aplicativo, responda uma questão e confira que o anel diário avança. O aviso **não** deve aparecer se o navegador permitir gravar. Feche e reabra a janela anônima: o progresso terá sido apagado pelo navegador, e esse é o comportamento esperado.
- **Falha real de armazenamento:** bloqueie o armazenamento de dados do site nas configurações do navegador e recarregue. O aviso deve aparecer e ser anunciado pelo leitor de tela.
- **Virada do dia:** com o aplicativo aberto, responda uma questão, deixe a aba aberta até depois da meia-noite (ou adiante o relógio do sistema), troque de aba e volte. O anel “Seu ritmo de hoje” deve voltar a 0%.
- **Telas pequenas:** confira em 320, 360 e 390 px de largura que nada ultrapassa a tela e que as quatro opções do menu aparecem, em duas linhas.

## Próximos passos possíveis

1. Validar linguagem, nível e trilhas com a estudante e o responsável.
2. Acrescentar modo de revisão dos erros e níveis de dificuldade (os dados por questão já permitem isso).
3. Incluir novas trilhas conforme o planejamento escolar.
4. Evoluir para perfis sincronizados entre dispositivos apenas se isso for necessário.
