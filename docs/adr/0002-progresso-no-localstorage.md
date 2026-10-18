# ADR-0002 · Progresso no localStorage, com formato versionado e migração

- **Status:** Aceito
- **Data:** 2026-10-12 (registrado em 2026-10-18)
- **Specs relacionadas:** P4, STOR-01 a STOR-14

## Contexto

Sem servidor (ADR-0001), o progresso precisa ficar no próprio navegador. A primeira versão gravava totais sem versão e quebrava o app inteiro quando os dados estavam corrompidos ou o armazenamento estava bloqueado.

## Decisão

- O progresso fica no `localStorage`, em um único objeto JSON com `schemaVersion` (hoje 2), cujo formato é definido em `schemas/progress-v2.schema.json`.
- Toda leitura e gravação passa por `progress.js` e nunca lança exceção.
- Os dados são validados campo a campo ao carregar; só números, booleanos e datas em formato ISO são mantidos.
- Antes de regravar dados danificados, o original é copiado para uma chave de backup. Se a cópia falhar, nada é gravado.
- Mudar o formato exige nova `schemaVersion`, migração a partir da anterior e testes. A chave da versão anterior nunca é alterada.

## Alternativas consideradas

- **IndexedDB:** maior capacidade e acesso assíncrono, mas o volume de dados é pequeno e a API é bem mais complexa.
- **Cookies:** enviados ao servidor a cada requisição e com limite de tamanho; não fazem sentido sem backend.

## Consequências

- O app nunca quebra por causa do armazenamento, e o progresso antigo nunca é apagado sem cópia.
- Limpar os dados do site apaga o progresso; não há sincronização entre aparelhos.
- Com duas abas abertas, a última a salvar prevalece.
