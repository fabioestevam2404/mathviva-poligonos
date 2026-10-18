# MathViva 9 — Jornada dos Polígonos

Aplicativo web educativo, responsivo e sem dependências externas, dedicado ao estudo aprofundado de polígonos convexos, polígonos regulares e suas aplicações no 9º ano.

## Como abrir

Abra `index.html` em um navegador atualizado. O conteúdo principal funciona sem instalação e sem conexão com a internet. Mantenha `content.js` e `progress.js` na mesma pasta de `index.html`: o primeiro contém as trilhas e questões; o segundo, as regras de progresso e de salvamento. O progresso é guardado no armazenamento local do navegador (`localStorage`).

## O que já está incluído

- Nove trilhas na ordem da apostila usada em sala (Módulos 20 e 21), cada uma com a indicação das páginas correspondentes.
- 52 questões de múltipla escolha com dicas e explicações detalhadas.
- Aplicações em pavimentação, arquitetura, estruturas, sinalização, natureza, design e tecnologia.
- Em cada trilha: explicação em linguagem acessível, exemplo resolvido em etapas, dica e questões de múltipla escolha com feedback explicado.
- Jornada visual com mapa de trilhas, missões curtas, estrelas, XP e celebrações de acerto.
- Mascote Luma com mensagens de incentivo e painel de progresso local.
- Central de resumos com teoria detalhada, comparações cotidianas, fórmulas, erros frequentes e verificação final.
- Revisão completa exibida ao fim de cada matéria, com opção de refazer os desafios.
- Layout adaptável para computador e celular, navegação por teclado e feedback anunciado por leitores de tela.

## Conteúdo alinhado à apostila

As trilhas acompanham a sequência, os termos e a notação da apostila de Matemática usada em sala. Cada lição, resumo e conclusão indica as páginas para consulta (por exemplo, “📖 Na apostila: Módulo 20 · p. 251–252”).

| Trilha | Tema | Apostila |
|---|---|---|
| 20.1 | Linhas poligonais e polígonos | Módulo 20 · p. 249–250 |
| 20.2 | Convexo, côncavo e regular | Módulo 20 · p. 250–251 |
| 20.3 | Diagonais (incluindo as que passam pelo centro) | Módulo 20 · p. 251–252 |
| 20.4 | Soma dos ângulos internos e externos | Módulo 20 · p. 253–255 |
| 21.1 | Ângulos do polígono regular | Módulo 20 · p. 251 · Módulo 21 · p. 262–263 |
| 21.2 | Construção de polígonos regulares (transferidor, régua e compasso, fluxograma) | Módulo 20 · p. 254–255 · Módulo 21 · p. 263–265, 272–273 |
| 21.3 | Inscrição, circunscrição e apótema | Módulo 21 · p. 265–266 |
| 21.4 | Polígonos regulares notáveis (triângulo equilátero, quadrado, hexágono) | Módulo 21 · p. 266–271 |
| 21.5 | Área e aplicações | Módulo 21 · p. 272–279 |

**Direitos autorais:** a apostila serve apenas de referência. Nenhum texto, exemplo, exercício ou imagem dela é copiado para o aplicativo: explicações e questões são escritas do zero, no mesmo nível e estilo, com outros números e situações. As fotos das páginas usadas como referência não fazem parte do repositório. Isso vale mesmo com o repositório privado, porque o site publicado no GitHub Pages continua acessível a quem tiver o link.

**Notação usada (a mesma da apostila):** Sᵢ e Sₑ (somas dos ângulos internos e externos), âᵢ e âₑ (ângulo interno e externo do polígono regular), α (ângulo central), d (diagonais), dc (diagonais que passam pelo centro), ℓ (lado), R e r (raios das circunferências circunscrita e inscrita), aₚ (apótema), p (semiperímetro) e S (área).

### “Estamos aqui na escola”

O mapa destaca com “📍 Estamos aqui na escola” a trilha que está sendo vista em sala, e o cartão lateral sugere começar por ela. A configuração fica no final de `content.js`:

```js
const school = { currentTopic: 'm20-poligonos' };
```

Quando a turma avançar, troque o valor pelo id da nova trilha (por exemplo `'m20-diagonais'` ou `'m21-inscricao'`). Use `null` para não destacar nenhuma. Mudar a marcação não altera o progresso salvo.

### Como acrescentar ou alterar conteúdo

O conteúdo fica em `content.js`. Para uma nova trilha, acrescente um objeto em `topics` e o resumo correspondente em `topicGuides`. Regras para não perder o progresso salvo:

- **Nunca renomeie nem reaproveite o ID de uma questão.** Para trocar uma questão por outra diferente, crie um ID novo.
- Corrigir o texto de uma questão sem mudar o sentido nem a posição da alternativa certa pode ser feito mantendo o ID.
- Mover uma questão para outra trilha é seguro: o progresso é salvo por questão, e não por trilha.
- Depois de mudar a lista, atualize o retrato de IDs em `tests/content.test.js`; o teste falha de propósito até que isso seja feito.

## Como o progresso funciona

O aplicativo acompanha três indicadores diferentes, que não se misturam:

| Indicador | O que mede | Onde aparece |
|---|---|---|
| **Desafios vencidos** | Questões **diferentes** acertadas **sem usar a dica** ao menos uma vez. Repetir uma questão já vencida não aumenta esse número. | Barra e estrelas de cada trilha (1 ao começar, 2 com metade, 3 com tudo), faixa “Conquistas da jornada” (estrelas a cada terço do total: 18, 35 e 52), “Meu progresso” (de 0 a 52). |
| **XP e participação** | +10 XP por resposta certa, mesmo repetida ou com dica. As tentativas e os acertos totais também contam todas as respostas. | Cartão “XP conquistados”, “pontos de coragem”, “acertos” e “aproveitamento”. |
| **Meta diária** | Respostas dadas **hoje**, segundo a data local do dispositivo (meta: 5). Começa do zero a cada dia e é recalculada quando a página volta a ficar visível ou recebe foco, por exemplo ao reabrir uma aba deixada aberta desde o dia anterior. | Anel “Seu ritmo de hoje”. |

As estrelas da faixa “Conquistas da jornada” representam o progresso acumulado, e não o dia; por isso a faixa não se chama mais “Missão de hoje”.

Regras importantes:

- **Dica:** um acerto feito depois de pedir a dica rende XP, mas não vence o desafio. A estudante é avisada no feedback e pode refazer a questão sem dica depois. Usar a dica numa questão já vencida não desfaz a conquista.
- **Repetição:** para cada questão ficam registrados o número de tentativas, a primeira resposta, a última resposta (alternativa, se acertou e se usou dica), quantas vezes a dica foi usada e quando a questão foi vencida.
- **Identificação:** cada questão tem um ID fixo no código (por exemplo, `angulos-03` ou `m21-notaveis-02`). O progresso é salvo por esse ID, e não pela posição da questão na lista nem pela trilha. Por isso a reorganização das trilhas na ordem da apostila não apagou nenhum desafio já vencido.

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

## Desenvolvimento orientado por especificação (SDD)

O comportamento do aplicativo está descrito em specs, e as specs são a fonte da verdade. Toda mudança segue o ciclo: **especificar → aprovar a spec → planejar → implementar com testes → verificar → pull request**.

- `specs/constitution.md`: os princípios do projeto (aprendizagem antes da pontuação, progresso preservado, dados no aparelho, conteúdo próprio, zero dependências, acessibilidade).
- `specs/*.spec.md`: um requisito por comportamento, com ID (por exemplo, `PROG-03`), critérios em Dado / Quando / Então e a forma de verificação (`automática`, `manual` ou `planejada`).
- `specs/RASTREABILIDADE.md`: matriz gerada automaticamente, ligando cada requisito aos testes que o verificam.
- `specs/_template.md`: modelo para uma funcionalidade nova.

| Spec | Prefixo | Assunto |
|---|---|---|
| `progress.spec.md` | PROG | Desafios vencidos, dica, XP, meta diária, estrelas |
| `storage.spec.md` | STOR | Salvamento, validação, backup e migração |
| `content.spec.md` | CONT | Formato e estabilidade do conteúdo |
| `security.spec.md` | SEC | Privacidade, recursos externos, fotos da apostila, proteção da `main` |

Todo teste cita no título os requisitos que verifica, como `test('[PROG-03] …')`. O comando `npm run check` falha se um requisito automático ficar sem teste, se um teste não citar requisito ou citar um que não existe, ou se a matriz estiver desatualizada. O mesmo comando roda no GitHub Actions a cada pull request (`.github/workflows/ci.yml`), e o modelo de pull request pede a spec e os requisitos afetados. As regras para agentes de IA, como o Claude Code, estão em `CLAUDE.md`.

## Estrutura

- `index.html`: interface (HTML, CSS e JavaScript da página).
- `content.js`: conteúdo didático — trilhas, questões e resumos, na ordem da apostila.
- `progress.js`: regras de progresso, estrelas, meta diária, validação, migração e acesso protegido ao `localStorage`.
- `specs/`: constituição, specs com requisitos, modelo e matriz de rastreabilidade.
- `tests/content.test.js`: testes do conteúdo (estrutura, IDs e gabaritos estáveis, gabaritos recalculados pelas fórmulas).
- `tests/progress.test.js`: testes das regras de progresso e de salvamento.
- `tests/repo.test.js`: testes de segurança sobre os arquivos do repositório.
- `scripts/check-specs.js`: verificação de rastreabilidade entre specs e testes.
- `.github/`: fluxo de verificação contínua e modelo de pull request.
- `CLAUDE.md`: instruções do fluxo SDD para agentes.
- `package.json`: apenas os comandos de verificação; o aplicativo não precisa de instalação.
- `README.md`: este guia.

## Testes

Requer Node.js 22 ou superior; não há dependências para instalar.

```bash
npm run check        # specs, rastreabilidade e testes (o mesmo que o CI roda)
npm test             # só os testes
npm run specs:write  # regera specs/RASTREABILIDADE.md depois de mudar specs ou títulos de testes
```

Os testes cobrem:

- ordem das trilhas igual à da apostila e IDs estáveis das 52 questões, incluindo as 30 da primeira versão;
- estrutura completa de cada trilha, questão e resumo;
- gabaritos das questões numéricas recalculados pelas fórmulas (diagonais, somas e medidas de ângulos, perímetro, área e relações dos polígonos notáveis);
- repetição de questão, primeira e última resposta e uso de dica;
- mudança de dia na data local, inclusive perto da meia-noite, quando a data UTC já é outra;
- dados corrompidos ou parcialmente inválidos, inclusive com falha ao gravar a cópia de segurança;
- armazenamento indisponível ou cheio;
- migração do formato antigo;
- estrelas das trilhas e das conquistas da jornada;
- marcação “Estamos aqui na escola” apontando para uma trilha existente;
- posição e texto da resposta correta das 30 questões originais;
- retenção dos últimos 120 dias de atividade;
- ausência de recursos externos, de envio de dados e de imagens ou PDFs versionados.

Os testes automatizados cobrem o conteúdo e as regras, mas não a interface: veja “Verificação manual” abaixo.

## Verificação manual

- **Navegação anônima ou privada:** abra o aplicativo, responda uma questão e confira que o anel diário avança. O aviso **não** deve aparecer se o navegador permitir gravar. Feche e reabra a janela anônima: o progresso terá sido apagado pelo navegador, e esse é o comportamento esperado.
- **Falha real de armazenamento:** bloqueie o armazenamento de dados do site nas configurações do navegador e recarregue. O aviso deve aparecer e ser anunciado pelo leitor de tela.
- **Virada do dia:** com o aplicativo aberto, responda uma questão, deixe a aba aberta até depois da meia-noite (ou adiante o relógio do sistema), troque de aba e volte. O anel “Seu ritmo de hoje” deve voltar a 0%.
- **Conteúdo com a estudante:** percorra as trilhas novas (21.2 a 21.4) e confira se a linguagem e o nível estão de acordo com o que foi visto em sala.
- **Telas pequenas:** confira em 320, 360 e 390 px de largura que nada ultrapassa a tela e que as quatro opções do menu aparecem, em duas linhas.

## Próximos passos possíveis

1. Validar linguagem, nível e trilhas com a estudante e o responsável.
2. Acrescentar modo de revisão dos erros e níveis de dificuldade (os dados por questão já permitem isso).
3. Incluir os próximos módulos da apostila conforme o planejamento escolar.
4. Evoluir para perfis sincronizados entre dispositivos apenas se isso for necessário.
