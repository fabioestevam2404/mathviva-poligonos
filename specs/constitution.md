# Constituição do MathViva 9

Princípios que valem para todo o projeto. Uma spec, um plano ou um código que contrarie um destes princípios não entra na `main`. Mudar um princípio exige um registro de decisão (ADR, em `docs/adr/`) aprovado pelo responsável pelo projeto.

## P1 · A spec é a fonte da verdade

Todo comportamento do aplicativo está descrito em uma spec em `specs/`, com requisitos identificados (por exemplo, `PROG-03`). Mudar um comportamento começa pela spec, e a spec é aprovada antes do código. Código sem requisito correspondente é considerado defeito de processo.

## P2 · Todo requisito é verificável

Cada requisito declara como é verificado:

- `automática`: há pelo menos um teste cujo título cita o ID, como `[PROG-03]`;
- `manual`: a verificação depende de pessoa ou navegador real, e a spec diz o que conferir;
- `planejada`: o requisito ainda não foi implementado; a spec indica a fase prevista.

O comando `npm run check` falha se um requisito automático não tiver teste ou se um teste citar um requisito que não existe.

## P3 · A aprendizagem vem antes da pontuação

O indicador de aprendizagem (desafios vencidos sem dica) nunca é inflado por repetição, dica ou atalhos. XP e participação premiam o esforço, mas ficam separados dele.

## P4 · O progresso da estudante é preservado

Nenhuma mudança pode apagar ou invalidar o progresso já salvo. IDs de questão são permanentes. Mudanças no formato dos dados salvos criam uma nova `schemaVersion`, com migração e testes. Dados originais nunca são sobrescritos sem uma cópia antes.

## P5 · Os dados não saem do aparelho

O aplicativo não envia dados a nenhum servidor, não usa contas nem rastreamento e não carrega scripts ou recursos de terceiros. Funciona offline depois de carregado.

## P6 · Conteúdo próprio, apostila como referência

A apostila usada em sala orienta sequência, termos e notação. Textos, exemplos e questões são escritos do zero. Nenhuma página, imagem ou trecho do material é copiado ou versionado.

## P7 · Simplicidade e zero dependências

O aplicativo é estático: HTML, CSS e JavaScript sem frameworks, sem etapa de build e sem pacotes de terceiros. Os testes usam apenas o Node. Qualquer exceção exige um ADR.

## P8 · Acessível e utilizável no celular

A interface funciona com teclado e leitor de tela, respeita a redução de movimento e não ultrapassa a largura da tela a partir de 320 px.
