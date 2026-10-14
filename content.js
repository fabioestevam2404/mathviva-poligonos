/*
 * Conteúdo didático do MathViva 9 — trilhas, questões e resumos.
 * A sequência, os termos e a notação acompanham a apostila usada em sala (Módulos 20 e 21),
 * mas todos os textos, exemplos e questões são próprios: nada é transcrito do material.
 *
 * IDs de questão são estáveis: o progresso salvo depende deles. Nunca renomeie ou reutilize um ID;
 * para trocar uma questão por outra diferente, crie um ID novo.
 * Script clássico (funciona em file://), também carregável pelo Node nos testes.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MathVivaContent = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const topics = [
    // ───────────── Módulo 20 · Polígonos convexos ─────────────
    {
      id: 'm20-poligonos', module: 20, code: '20.1', ref: 'Módulo 20 · p. 249–250',
      name: 'Linhas poligonais e polígonos', desc: 'Reconheça polígonos, seus nomes e o que não é polígono.',
      icon: '🔷', color: '#e6f1ff', tag: 'POLÍGONOS', minutes: 7,
      lesson: 'Uma linha poligonal é formada por segmentos de reta ligados pelas pontas. Ela pode ser aberta ou fechada, e seus segmentos podem ou não se cruzar. Quando a linha é fechada e os segmentos não se cruzam, ela delimita uma região do plano: essa figura é um polígono. Cada segmento é um lado, e cada ponto de encontro de dois lados é um vértice.',
      example: 'Uma linha fechada de 8 segmentos que não se cruzam é polígono? Qual é o nome dele?',
      steps: ['Verifique se a linha é fechada: o último segmento termina onde o primeiro começa.', 'Verifique se os segmentos se cruzam fora dos vértices: aqui, não se cruzam.', 'Então a linha delimita uma região do plano e é um polígono.', 'Conte os lados: 8 lados formam um octógono.'],
      questions: [
        { id: 'fundamentos-01', q: 'Qual descrição representa corretamente um polígono?', opts: ['Figura fechada formada por segmentos de reta', 'Qualquer figura com curvas', 'Toda figura tridimensional', 'Uma linha aberta com três partes'], a: 0, hint: 'Observe duas condições essenciais: a figura precisa estar fechada e usar apenas trechos retos.', why: 'Exatamente! Um polígono é uma figura plana fechada cuja borda é formada por segmentos de reta que não se cruzam.' },
        { id: 'fundamentos-02', q: 'Como se chama um polígono de 8 lados?', opts: ['Hexágono', 'Heptágono', 'Octógono', 'Decágono'], a: 2, hint: 'Pense no prefixo “octo”, presente também em octavo.', why: 'Octógono possui 8 lados, 8 vértices e 8 ângulos internos.' },
        { id: 'fundamentos-03', q: 'Qual destas figuras não é um polígono?', opts: ['Triângulo', 'Quadrado', 'Círculo', 'Pentágono'], a: 2, hint: 'Procure a figura cuja borda não é formada por segmentos de reta.', why: 'O círculo tem uma borda curva; portanto, não é polígono.' },
        { id: 'fundamentos-04', q: 'Um polígono de 6 lados recebe qual nome?', opts: ['Pentágono', 'Hexágono', 'Heptágono', 'Eneágono'], a: 1, hint: 'O prefixo “hexa” representa seis.', why: 'Um hexágono possui 6 lados. Um exemplo aparece nos favos de mel.' },
        { id: 'fundamentos-05', q: 'Uma linha poligonal fechada cujos segmentos se cruzam é classificada como:', opts: ['Polígono simples', 'Polígono regular', 'Linha poligonal que não é polígono', 'Círculo'], a: 2, hint: 'Para ser polígono, a linha precisa ser fechada e os segmentos não podem se cruzar.', why: 'Quando os segmentos se cruzam, a linha fechada não delimita uma única região. Por isso ela não é considerada polígono.' },
        { id: 'm20-poligonos-01', q: 'Como se chama o polígono de 20 lados?', opts: ['Decágono', 'Pentadecágono', 'Icoságono', 'Dodecágono'], a: 2, hint: '“Icosa” é o prefixo grego para vinte.', why: 'Icoságono tem 20 lados. Pentadecágono tem 15, dodecágono tem 12 e decágono tem 10.' }
      ]
    },
    {
      id: 'm20-classificacao', module: 20, code: '20.2', ref: 'Módulo 20 · p. 250–251',
      name: 'Convexo, côncavo e regular', desc: 'Classifique polígonos e identifique seus elementos.',
      icon: '🛡️', color: '#e5f7ee', tag: 'CLASSIFICAÇÃO', minutes: 8,
      lesson: 'Um polígono é convexo quando todo segmento com extremos em dois pontos de sua região interior fica inteiramente dentro dela; caso contrário, é côncavo (não convexo). No convexo, todos os ângulos internos medem menos de 180°. Um polígono é regular quando é equilátero (lados congruentes) e equiângulo (ângulos internos congruentes) ao mesmo tempo.',
      example: 'Como decidir se um polígono é convexo e se ele é regular?',
      steps: ['Procure uma “entrada” na borda e teste um segmento entre dois pontos internos.', 'Se algum segmento sai da figura, o polígono é côncavo.', 'Para ser regular, confira os lados: todos têm a mesma medida?', 'Confira também os ângulos internos: só é regular se as duas respostas forem “sim”.'],
      questions: [
        { id: 'convexos-01', q: 'Qual propriedade define melhor um polígono convexo?', opts: ['Todos os lados têm o mesmo tamanho', 'Todo segmento entre pontos internos fica dentro dele', 'Possui exatamente quatro lados', 'Tem pelo menos um ângulo de 180°'], a: 1, hint: 'Imagine ligar dois pontos internos com uma linha reta.', why: 'Essa é a definição geométrica de convexidade: o segmento permanece inteiramente no interior ou na borda.' },
        { id: 'convexos-02', q: 'Em um polígono convexo, cada ângulo interno é:', opts: ['Menor que 180°', 'Igual a 180°', 'Maior que 180°', 'Sempre igual a 90°'], a: 0, hint: 'Um ângulo maior que 180° faz a figura “avançar” para dentro, criando uma reentrância.', why: 'Em polígonos convexos, todos os ângulos internos são menores que 180°. Basta um ângulo maior que 180° para o polígono ser côncavo.' },
        { id: 'convexos-03', q: 'Todo triângulo é convexo?', opts: ['Sim', 'Não', 'Somente o equilátero', 'Somente o retângulo'], a: 0, hint: 'É possível criar uma reentrância usando apenas três lados?', why: 'Sim. Com três lados não é possível formar uma reentrância; todo triângulo é convexo.' },
        { id: 'm20-classificacao-01', q: 'No pentágono ABCDE, qual destes segmentos é uma diagonal?', opts: ['AB', 'BC', 'AC', 'EA'], a: 2, hint: 'Diagonal liga dois vértices que não são vizinhos.', why: 'A e C não são consecutivos, então AC é diagonal. AB, BC e EA ligam vértices vizinhos: são lados.' },
        { id: 'regulares-01', q: 'Para um polígono ser regular, ele precisa ter:', opts: ['Somente ângulos iguais', 'Somente lados iguais', 'Lados e ângulos internos iguais', 'Uma diagonal apenas'], a: 2, hint: 'Regularidade reúne duas condições ao mesmo tempo.', why: 'Polígono regular é equilátero e equiângulo: lados e ângulos internos são iguais.' },
        { id: 'regulares-02', q: 'Qual figura é sempre um polígono regular?', opts: ['Todo retângulo', 'Todo losango', 'Todo triângulo equilátero', 'Todo trapézio'], a: 2, hint: 'Verifique lados e ângulos, não apenas uma das propriedades.', why: 'O triângulo equilátero tem três lados iguais e três ângulos de 60°, portanto é regular.' },
        { id: 'regulares-03', q: 'Um losango é necessariamente regular?', opts: ['Sim, porque tem lados iguais', 'Não, pois seus ângulos podem ser diferentes', 'Sim, porque tem diagonais', 'Não, porque não é polígono'], a: 1, hint: 'Ter lados iguais é suficiente para ser regular?', why: 'Não. Um losango é equilátero, mas seus ângulos podem não ser iguais; somente o quadrado é losango regular.' }
      ]
    },
    {
      id: 'm20-diagonais', module: 20, code: '20.3', ref: 'Módulo 20 · p. 251–252',
      name: 'Diagonais', desc: 'Conte diagonais e descubra quantas passam pelo centro.',
      icon: '🧭', color: '#ffe7ef', tag: 'DIAGONAIS', minutes: 9,
      lesson: 'Diagonal é o segmento que liga dois vértices não consecutivos. De cada vértice de um polígono convexo de n lados partem n − 3 diagonais, e o total é d = n(n − 3)/2: dividimos por 2 porque cada diagonal foi contada pelas suas duas pontas. Em um polígono regular, se n é par, n/2 diagonais passam pelo centro; se n é ímpar, nenhuma passa.',
      example: 'Quantas diagonais tem um octógono convexo? E, se ele for regular, quantas passam pelo centro?',
      steps: ['De cada vértice partem n − 3 = 8 − 3 = 5 diagonais.', 'Contando por todos os vértices: 8 × 5 = 40, mas cada diagonal foi contada duas vezes.', 'Total: d = 8 × 5 ÷ 2 = 20 diagonais.', 'Como 8 é par, no octógono regular passam pelo centro dc = 8 ÷ 2 = 4 diagonais.'],
      questions: [
        { id: 'diagonais_areas-01', q: 'Quantas diagonais possui um hexágono?', opts: ['6', '8', '9', '12'], a: 2, hint: 'Use d = n(n − 3)/2, com n = 6.', why: 'd = 6 × 3 ÷ 2 = 9 diagonais.' },
        { id: 'diagonais_areas-02', q: 'De um único vértice de um octógono partem quantas diagonais?', opts: ['4', '5', '6', '8'], a: 1, hint: 'Não ligamos o vértice a ele mesmo nem aos dois vizinhos.', why: 'De cada vértice partem n − 3 = 8 − 3 = 5 diagonais.' },
        { id: 'm20-diagonais-01', q: 'Um polígono convexo tem 20 diagonais. Quantos lados ele tem?', opts: ['6', '7', '8', '10'], a: 2, hint: 'Teste os valores em d = n(n − 3)/2 até obter 20.', why: 'Para n = 8: 8 × 5 ÷ 2 = 20. Então o polígono tem 8 lados (octógono).' },
        { id: 'm20-diagonais-02', q: 'Quantas diagonais de um hexágono regular passam pelo seu centro?', opts: ['0', '2', '3', '6'], a: 2, hint: 'Para n par, dc = n/2.', why: '6 é par, então dc = 6 ÷ 2 = 3. Cada uma liga um vértice ao vértice oposto.' },
        { id: 'm20-diagonais-03', q: 'Quantas diagonais de um heptágono regular passam pelo centro?', opts: ['0', '3', '3,5', '7'], a: 0, hint: 'Veja se o número de lados é par ou ímpar.', why: '7 é ímpar: nenhum vértice tem um vértice exatamente oposto, então nenhuma diagonal passa pelo centro (dc = 0).' },
        { id: 'm20-diagonais-04', q: 'Em um polígono regular, 12 diagonais passam pelo centro. Quantos lados ele tem?', opts: ['6', '12', '24', '48'], a: 2, hint: 'Se n é par, dc = n/2. Então n = 2 × dc.', why: 'n = 2 × 12 = 24 lados.' }
      ]
    },
    {
      id: 'm20-angulos', module: 20, code: '20.4', ref: 'Módulo 20 · p. 253–255',
      name: 'Soma dos ângulos internos e externos', desc: 'Use a triangulação para somar os ângulos de qualquer polígono convexo.',
      icon: '📐', color: '#fff0d2', tag: 'ÂNGULOS', minutes: 9,
      lesson: 'Traçando as diagonais que partem de um único vértice, um polígono convexo de n lados fica dividido em n − 2 triângulos. Como cada triângulo soma 180°, a soma dos ângulos internos é Sᵢ = 180°(n − 2). Em cada vértice, o ângulo interno e o externo são suplementares (somam 180°), e a soma dos ângulos externos de qualquer polígono convexo é sempre Sₑ = 360°.',
      example: 'Qual é a soma dos ângulos internos de um heptágono convexo? E a dos externos?',
      steps: ['Do vértice escolhido partem 7 − 3 = 4 diagonais, que formam 7 − 2 = 5 triângulos.', 'Sᵢ = 180° × (7 − 2) = 180° × 5 = 900°.', 'Cada par interno + externo soma 180°: são 7 × 180° = 1260° no total.', 'Sₑ = 1260° − 900° = 360°, como em qualquer polígono convexo.'],
      questions: [
        { id: 'convexos-04', q: 'Qual é a soma dos ângulos internos de um pentágono convexo?', opts: ['360°', '450°', '540°', '720°'], a: 2, hint: 'Use Sᵢ = 180°(n − 2), com n = 5.', why: 'Sᵢ = 180° × (5 − 2) = 180° × 3 = 540°.' },
        { id: 'convexos-05', q: 'Um quadrilátero possui ângulos de 80°, 100° e 110°. O quarto ângulo mede:', opts: ['60°', '70°', '80°', '90°'], a: 1, hint: 'A soma dos ângulos internos de qualquer quadrilátero convexo é 360°.', why: 'O quarto ângulo é 360° − (80° + 100° + 110°) = 70°.' },
        { id: 'diagonais_areas-03', q: 'Ao traçar as diagonais de um vértice, um decágono convexo fica dividido em quantos triângulos?', opts: ['7', '8', '9', '10'], a: 1, hint: 'A quantidade de triângulos é n − 2.', why: '10 − 2 = 8 triângulos, o que também explica a soma dos ângulos internos.' },
        { id: 'angulos-01', q: 'Qual é a soma dos ângulos internos de um decágono?', opts: ['1080°', '1260°', '1440°', '1800°'], a: 2, hint: 'Um decágono tem n = 10. Use Sᵢ = 180°(n − 2).', why: 'Sᵢ = 180° × 8 = 1440°.' },
        { id: 'm20-angulos-01', q: 'Qual é a soma das medidas dos ângulos externos de um polígono convexo de 15 lados?', opts: ['180°', '360°', '2340°', '2700°'], a: 1, hint: 'A soma dos externos não depende do número de lados.', why: 'Em qualquer polígono convexo, Sₑ = 360°. O valor 2340° seria a soma dos internos: 180° × 13.' },
        { id: 'm20-angulos-02', q: 'A soma dos ângulos internos de um polígono convexo é 1800°. Quantos lados ele tem?', opts: ['10', '11', '12', '13'], a: 2, hint: 'Resolva 180°(n − 2) = 1800°.', why: 'n − 2 = 1800 ÷ 180 = 10, então n = 12 (dodecágono).' }
      ]
    },
    // ───────────── Módulo 21 · Polígonos regulares e aplicações ─────────────
    {
      id: 'm21-angulos-regulares', module: 21, code: '21.1', ref: 'Módulo 20 · p. 251 · Módulo 21 · p. 262–263',
      name: 'Ângulos do polígono regular', desc: 'Calcule os ângulos central, interno e externo de polígonos regulares.',
      icon: '💎', color: '#f0e9ff', tag: 'REGULARES', minutes: 8,
      lesson: 'Em um polígono regular, todos os ângulos internos são iguais, assim como os externos. Por isso cada um é a soma dividida por n: âᵢ = 180°(n − 2)/n e âₑ = 360°/n. O polígono regular também tem um centro: ligando-o a dois vértices consecutivos, obtemos o ângulo central α = 360°/n, que tem a mesma medida do ângulo externo.',
      example: 'Quais são os ângulos de um decágono regular?',
      steps: ['Ângulo interno: âᵢ = 180° × 8 ÷ 10 = 144°.', 'Ângulo externo: âₑ = 360° ÷ 10 = 36°.', 'Conferência: 144° + 36° = 180°.', 'Ângulo central: α = 360° ÷ 10 = 36°.'],
      questions: [
        { id: 'regulares-04', q: 'Quanto mede o ângulo central de um hexágono regular?', opts: ['30°', '45°', '60°', '120°'], a: 2, hint: 'Divida a volta completa, 360°, pelo número de lados.', why: 'α = 360° ÷ 6 = 60°. Cada setor central do hexágono regular mede 60°.' },
        { id: 'angulos-02', q: 'Quanto mede cada ângulo interno de um octógono regular?', opts: ['120°', '135°', '140°', '145°'], a: 1, hint: 'Calcule Sᵢ = 1080° e divida pelos 8 ângulos iguais.', why: 'âᵢ = 1080° ÷ 8 = 135°.' },
        { id: 'angulos-03', q: 'Quanto mede cada ângulo externo de um octógono regular?', opts: ['30°', '40°', '45°', '60°'], a: 2, hint: 'A soma dos ângulos externos é Sₑ = 360°.', why: 'âₑ = 360° ÷ 8 = 45°. Interno e externo também somam 180°: 135° + 45°.' },
        { id: 'angulos-04', q: 'Um polígono regular tem ângulo externo de 30°. Quantos lados possui?', opts: ['10', '12', '15', '18'], a: 1, hint: 'Use n = 360° ÷ âₑ.', why: 'n = 360° ÷ 30° = 12. É um dodecágono regular.' },
        { id: 'angulos-05', q: 'Se cada ângulo interno de um polígono regular mede 150°, quantos lados ele tem?', opts: ['10', '12', '15', '18'], a: 1, hint: 'O ângulo externo é 180° − 150°.', why: 'âₑ = 30°. Assim, n = 360° ÷ 30° = 12 lados.' },
        { id: 'm21-angulos-regulares-01', q: 'Quanto mede cada ângulo interno de um polígono regular de 24 lados?', opts: ['150°', '160°', '165°', '172,5°'], a: 2, hint: 'Calcule primeiro âₑ = 360° ÷ 24 e depois âᵢ = 180° − âₑ.', why: 'âₑ = 15°, então âᵢ = 180° − 15° = 165°.' },
        { id: 'regulares-05', q: 'Quantos eixos de simetria possui um pentágono regular?', opts: ['2', '3', '5', '10'], a: 2, hint: 'Em um polígono regular, a quantidade de eixos de simetria acompanha o número de lados.', why: 'Um pentágono regular possui 5 eixos de simetria.' }
      ]
    },
    {
      id: 'm21-construcao', module: 21, code: '21.2', ref: 'Módulo 20 · p. 254–255 · Módulo 21 · p. 263–265, 272–273',
      name: 'Construção de polígonos regulares', desc: 'Construa com transferidor, régua e compasso e descreva os passos em fluxograma.',
      icon: '✏️', color: '#f3f9e3', tag: 'CONSTRUÇÃO', minutes: 9,
      lesson: 'Construir um polígono regular é seguir um algoritmo: uma sequência de passos que, feita corretamente, sempre leva ao mesmo resultado. Com transferidor, calculamos o ângulo interno e repetimos “traçar um lado de medida ℓ e marcar âᵢ” até a figura fechar. Com régua e compasso, dividimos uma circunferência em n partes iguais e ligamos os pontos. Um fluxograma organiza esses passos em caixas ligadas por setas.',
      example: 'Como construir um hexágono regular de lado 4 cm usando transferidor?',
      steps: ['Calcule o ângulo interno: âᵢ = 180° × 4 ÷ 6 = 120°.', 'Trace o lado AB com 4 cm.', 'Em B, marque 120° com o transferidor e trace BC com 4 cm; repita nos vértices seguintes.', 'Depois do sexto lado, a figura fecha no ponto A: o hexágono está pronto.'],
      questions: [
        { id: 'm21-construcao-01', q: 'Para construir um octógono regular com transferidor, que ângulo deve ser marcado em cada vértice?', opts: ['45°', '108°', '135°', '144°'], a: 2, hint: 'Cada vértice recebe o ângulo interno: âᵢ = 180°(n − 2)/n.', why: 'âᵢ = 180° × 6 ÷ 8 = 135°.' },
        { id: 'm21-construcao-02', q: 'Por que é possível construir um hexágono regular juntando 6 triângulos equiláteros com um vértice comum?', opts: ['Porque 6 × 60° = 360° e todos os lados ficam iguais', 'Porque todo triângulo soma 180°', 'Porque o hexágono tem 6 diagonais', 'Porque triângulos equiláteros são côncavos'], a: 0, hint: 'Observe os ângulos que se encontram no vértice comum.', why: 'Os seis ângulos de 60° completam a volta de 360° em torno do centro, e todos os lados medem ℓ. O resultado é um hexágono regular em que R = ℓ.' },
        { id: 'm21-construcao-03', q: 'Para construir um pentágono regular a partir de uma circunferência, em quantas partes iguais ela deve ser dividida, e quanto mede cada arco?', opts: ['5 partes de 72°', '5 partes de 108°', '10 partes de 36°', '6 partes de 60°'], a: 0, hint: 'Cada vértice fica sobre a circunferência; o arco entre dois vértices corresponde ao ângulo central.', why: 'São 5 vértices, então 5 partes iguais de 360° ÷ 5 = 72°, o ângulo central do pentágono regular.' },
        { id: 'm21-construcao-04', q: 'Num fluxograma de construção de polígono regular, qual passo vem logo depois de “marcar n pontos igualmente espaçados na circunferência”?', opts: ['Definir a medida do lado', 'Ligar os pontos consecutivos com segmentos de reta', 'Traçar a circunferência', 'Apagar a circunferência e recomeçar'], a: 1, hint: 'Os pontos marcados são os vértices. O que falta para obter os lados?', why: 'Com os vértices marcados, basta ligar pontos consecutivos para obter os lados do polígono.' }
      ]
    },
    {
      id: 'm21-inscricao', module: 21, code: '21.3', ref: 'Módulo 21 · p. 265–266',
      name: 'Inscrição, circunscrição e apótema', desc: 'Relacione polígonos regulares às circunferências inscrita e circunscrita.',
      icon: '⭕', color: '#e9f0ff', tag: 'CIRCUNFERÊNCIAS', minutes: 9,
      lesson: 'Um polígono está inscrito em uma circunferência quando todos os seus vértices estão sobre ela, e circunscrito quando todos os seus lados a tangenciam. Todo polígono regular é inscritível e circunscritível, e as duas circunferências têm o mesmo centro, que é o centro do polígono. O raio da circunscrita (R) vai do centro a um vértice; o raio da inscrita (r) vai do centro ao ponto médio de um lado e coincide com o apótema: aₚ = r.',
      example: 'Em um quadrado de lado 10 cm, quanto medem o apótema e o raio da circunferência inscrita?',
      steps: ['O centro do quadrado é o encontro das diagonais.', 'O apótema vai do centro, perpendicularmente, até o ponto médio de um lado: mede metade do lado, 5 cm.', 'A circunferência inscrita toca os lados nesses pontos médios, então r = 5 cm.', 'Logo aₚ = r = 5 cm.'],
      questions: [
        { id: 'm21-inscricao-01', q: 'Um polígono está inscrito em uma circunferência quando:', opts: ['todos os seus lados tangenciam a circunferência', 'todos os seus vértices pertencem à circunferência', 'o centro da circunferência é um dos vértices', 'a circunferência fica inteira fora do polígono e longe dele'], a: 1, hint: 'Inscrito = “escrito dentro”: os cantos do polígono encostam na circunferência.', why: 'No polígono inscrito, todos os vértices estão sobre a circunferência. Quando todos os lados a tangenciam, o polígono é circunscrito.' },
        { id: 'm21-inscricao-02', q: 'Em um polígono regular, o apótema é igual a:', opts: ['o raio da circunferência circunscrita', 'a metade do lado', 'o raio da circunferência inscrita', 'o perímetro dividido por n'], a: 2, hint: 'O apótema vai do centro ao ponto médio de um lado, exatamente onde a circunferência inscrita toca o lado.', why: 'aₚ = r: o apótema é o raio da circunferência inscrita. A igualdade com a metade do lado só vale no quadrado.' },
        { id: 'm21-inscricao-03', q: 'Em um mesmo polígono regular, comparando o raio R da circunferência circunscrita com o raio r da inscrita:', opts: ['R = r sempre', 'R > r sempre', 'R < r sempre', 'depende da medida do lado'], a: 1, hint: 'R termina num vértice; r termina no meio de um lado, que fica mais perto do centro.', why: 'O ponto médio de um lado está mais perto do centro que os vértices, então R > r. As duas circunferências têm o mesmo centro, mas nunca o mesmo raio.' },
        { id: 'm21-inscricao-04', q: 'Qual destas figuras pode ser inscrita em uma circunferência, com todos os vértices sobre ela?', opts: ['Estrela de 6 pontas', 'Hexágono regular', 'Seta côncava qualquer', 'Linha poligonal aberta'], a: 1, hint: 'Todo polígono regular é inscritível.', why: 'O hexágono regular tem todos os vértices à mesma distância do centro. Na estrela, os vértices das reentrâncias ficam mais perto do centro que as pontas.' }
      ]
    },
    {
      id: 'm21-notaveis', module: 21, code: '21.4', ref: 'Módulo 21 · p. 266–271',
      name: 'Polígonos regulares notáveis', desc: 'Relacione lado, R e r no triângulo equilátero, no quadrado e no hexágono.',
      icon: '🔺', color: '#ffece0', tag: 'NOTÁVEIS', minutes: 10,
      lesson: 'Triângulo equilátero, quadrado e hexágono regular aparecem com tanta frequência que vale conhecer as relações entre o lado ℓ e os raios R e r. Elas saem do teorema de Pitágoras ou das razões trigonométricas de 30°, 45° e 60° em um triângulo retângulo formado pelo centro, por um vértice e pelo ponto médio de um lado.',
      example: 'Um quadrado está inscrito em uma circunferência de raio 6 cm. Quanto mede o lado?',
      steps: ['A diagonal do quadrado inscrito é um diâmetro: 2R = 12 cm.', 'A diagonal de um quadrado de lado ℓ mede ℓ√2.', 'Então ℓ√2 = 12, logo ℓ = 12/√2 = 12√2/2 = 6√2 cm.', 'Conferência pela relação do quadrado: ℓ = R√2 = 6√2 cm.'],
      questions: [
        { id: 'm21-notaveis-01', q: 'Um hexágono regular está inscrito em uma circunferência de raio 9 cm. Quanto mede seu lado?', opts: ['4,5 cm', '9 cm', '9√3 cm', '18 cm'], a: 1, hint: 'O hexágono regular se divide em 6 triângulos equiláteros com vértice no centro.', why: 'Nesses triângulos equiláteros, o lado do hexágono é igual ao raio: ℓ = R = 9 cm.' },
        { id: 'm21-notaveis-02', q: 'Um quadrado está circunscrito a uma circunferência de raio 7 cm. Quanto mede o lado do quadrado?', opts: ['7 cm', '7√2 cm', '14 cm', '14√2 cm'], a: 2, hint: 'A circunferência inscrita toca os lados nos pontos médios; um diâmetro atravessa o quadrado de um lado ao oposto.', why: 'ℓ = 2r = 2 × 7 = 14 cm.' },
        { id: 'm21-notaveis-03', q: 'Um triângulo equilátero está inscrito em uma circunferência de raio 5√3 cm. Quanto mede seu lado?', opts: ['5 cm', '10 cm', '15 cm', '15√3 cm'], a: 2, hint: 'No triângulo equilátero inscrito, ℓ = R√3.', why: 'ℓ = 5√3 × √3 = 5 × 3 = 15 cm.' },
        { id: 'm21-notaveis-04', q: 'Qual é o apótema de um hexágono regular de lado 8 cm?', opts: ['4 cm', '4√3 cm', '8 cm', '8√3 cm'], a: 1, hint: 'O apótema é a altura de um dos 6 triângulos equiláteros: h = ℓ√3/2.', why: 'aₚ = 8√3 ÷ 2 = 4√3 cm.' },
        { id: 'm21-notaveis-05', q: 'No triângulo equilátero, o centro divide a altura h em duas partes. Qual relação está correta?', opts: ['R = h/3 e r = 2h/3', 'R = 2h/3 e r = h/3', 'R = r = h/2', 'R = h e r = 0'], a: 1, hint: 'O centro coincide com o baricentro, que divide a altura na razão 2 : 1, com a parte maior até o vértice.', why: 'Do centro ao vértice são 2/3 da altura (R = 2h/3) e do centro ao lado, 1/3 (r = h/3). Por isso R = 2r.' }
      ]
    },
    {
      id: 'm21-area', module: 21, code: '21.5', ref: 'Módulo 21 · p. 272–279',
      name: 'Área e aplicações', desc: 'Calcule perímetro e área com o apótema e resolva problemas do cotidiano.',
      icon: '🏙️', color: '#e6f7f4', tag: 'ÁREA E APLICAÇÕES', minutes: 10,
      lesson: 'Ligando o centro de um polígono regular de n lados aos vértices, ele fica dividido em n triângulos isósceles congruentes, cada um com base ℓ e altura aₚ. Somando as áreas: S = n · ℓ · aₚ/2. Como n · ℓ é o perímetro, e metade do perímetro é o semiperímetro p, a área também pode ser escrita S = p · aₚ.',
      example: 'Calcule o perímetro e a área de um hexágono regular de lado 6 cm e apótema 3√3 cm.',
      steps: ['Perímetro: 6 × 6 = 36 cm.', 'Semiperímetro: p = 36 ÷ 2 = 18 cm.', 'Área: S = p · aₚ = 18 × 3√3.', 'S = 54√3 cm².'],
      questions: [
        { id: 'diagonais_areas-04', q: 'Qual é o perímetro de um pentágono regular de lado 7 cm?', opts: ['28 cm', '30 cm', '35 cm', '49 cm'], a: 2, hint: 'Multiplique o número de lados pela medida de cada lado.', why: 'P = 5 × 7 = 35 cm.' },
        { id: 'diagonais_areas-05', q: 'Um polígono regular tem perímetro 36 cm e apótema 5 cm. Qual é sua área?', opts: ['90 cm²', '120 cm²', '180 cm²', '360 cm²'], a: 0, hint: 'Use S = p · aₚ, com o semiperímetro p = 36 ÷ 2.', why: 'p = 18 cm, então S = 18 × 5 = 90 cm².' },
        { id: 'aplicacoes-01', q: 'Quais polígonos regulares pavimentam o plano sozinhos, sem lacunas?', opts: ['Triângulo equilátero, quadrado e hexágono regular', 'Pentágono e octógono regulares', 'Somente o círculo', 'Todos os polígonos regulares'], a: 0, hint: 'Os ângulos em torno de um ponto precisam somar exatamente 360°.', why: '60°, 90° e 120° dividem 360° exatamente. Por isso triângulos equiláteros, quadrados e hexágonos regulares pavimentam o plano.' },
        { id: 'aplicacoes-02', q: 'A placa de “PARE” tem tradicionalmente qual formato?', opts: ['Pentágono regular', 'Hexágono regular', 'Octógono regular', 'Decágono regular'], a: 2, hint: 'Conte mentalmente os lados da conhecida placa vermelha.', why: 'A placa de parada usa um octógono, formato reconhecível mesmo quando a mensagem está pouco visível.' },
        { id: 'aplicacoes-03', q: 'Por que triângulos aparecem em pontes e treliças?', opts: ['Porque sempre têm área maior', 'Porque oferecem rigidez estrutural', 'Porque possuem quatro diagonais', 'Apenas por decoração'], a: 1, hint: 'Tente deformar um triângulo mantendo os comprimentos dos lados.', why: 'O triângulo é geometricamente rígido; por isso ajuda a distribuir forças sem deformar facilmente.' },
        { id: 'aplicacoes-04', q: 'Por que as células hexagonais são eficientes em favos e algumas malhas?', opts: ['Deixam grandes espaços vazios', 'Preenchem o plano e compartilham lados', 'Não possuem perímetro', 'São figuras curvas'], a: 1, hint: 'Observe como células vizinhas aproveitam a mesma parede.', why: 'Hexágonos cobrem o plano sem lacunas e compartilham paredes, favorecendo o aproveitamento de espaço e material.' },
        { id: 'aplicacoes-05', q: 'Uma praça quadrada de lado 20 m terá uma cerca em toda a borda. Quantos metros de cerca são necessários?', opts: ['40 m', '60 m', '80 m', '400 m'], a: 2, hint: 'A cerca acompanha o perímetro, não a área.', why: 'P = 4 × 20 = 80 m de cerca. A área, 400 m², responderia quanto espaço existe dentro da praça.' }
      ]
    }
  ];

  // Resumos detalhados: [título da seção, texto]. A última seção ocupa a largura toda.
  const topicGuides = {
    'm20-poligonos': {
      title: 'Linhas poligonais e polígonos: o vocabulário da geometria',
      analogy: 'Pense em cercar um terreno usando apenas barras retas. Para a cerca realmente delimitar uma região, ela precisa fechar completamente, e as barras não podem se cruzar no meio do caminho. Essa é a ideia essencial de um polígono.',
      sections: [
        ['Linha poligonal', 'Uma linha poligonal é uma sequência de segmentos de reta em que cada segmento começa onde o anterior termina. Ela é aberta quando as pontas não se encontram e fechada quando o último segmento volta ao ponto de partida.'],
        ['Quando a linha vira polígono', 'Polígono é a figura plana delimitada por uma linha poligonal fechada cujos segmentos não se cruzam. Se a linha é aberta, não existe região fechada; se os segmentos se cruzam, a linha não delimita uma única região. Nos dois casos, não há polígono.'],
        ['Elementos do polígono', 'Os segmentos são os lados. O encontro de dois lados consecutivos é um vértice. A abertura entre dois lados consecutivos, voltada para dentro, forma um ângulo interno. Em um polígono de n lados há também n vértices e n ângulos internos.'],
        ['Nomes pelo número de lados', '3: triângulo; 4: quadrilátero; 5: pentágono; 6: hexágono; 7: heptágono; 8: octógono; 9: eneágono; 10: decágono; 11: undecágono; 12: dodecágono; 15: pentadecágono; 20: icoságono. Para outros valores, é correto dizer “polígono de n lados”.'],
        ['Por que curvas não valem', 'Lados de polígono são segmentos de reta. Um círculo ou qualquer figura com um trecho curvo não é polígono, mesmo que seja fechada.'],
        ['Como reconhecer sem decorar', 'Faça quatro perguntas: está no plano? A linha está fechada? A borda usa somente segmentos? Os segmentos se cruzam? Depois conte os lados e dê o nome.']
      ],
      formulas: ['n lados = n vértices = n ângulos internos', 'linha aberta → não é polígono', 'segmentos que se cruzam → não é polígono', 'curva ≠ lado de polígono'],
      check: 'Aponte na figura um lado, um vértice e um ângulo interno. Depois confirme que a linha é fechada e não se cruza, conte os lados e dê o nome do polígono.'
    },
    'm20-classificacao': {
      title: 'Classificação: convexo, côncavo e regular',
      analogy: 'Imagine esticar um elástico ao redor de alguns pregos. O elástico cria uma borda sem reentrâncias: esse contorno é convexo. Se empurrarmos um pedaço da borda para dentro, surge uma concavidade, como numa seta ou numa estrela.',
      sections: [
        ['Convexo pelo segmento', 'Um polígono é convexo quando, escolhidos quaisquer dois pontos de sua região interior, todo o segmento entre eles permanece dentro do polígono. Se encontrarmos um único segmento que passa por fora, o polígono é côncavo, também chamado de não convexo.'],
        ['Teste pelos ângulos', 'Em um polígono convexo, todos os ângulos internos medem menos de 180°. Em um côncavo, pelo menos um ângulo interno mede mais de 180°, e é nele que a figura “avança” para dentro.'],
        ['Elementos e notação', 'No polígono ABCDE, os lados são AB, BC, CD, DE e EA, e os vértices são A, B, C, D e E. Os ângulos internos são indicados por Â, B̂, Ĉ… Segmentos que ligam vértices não consecutivos, como AC e BD, são diagonais. O ângulo externo de um vértice é formado por um lado e pelo prolongamento do lado vizinho.'],
        ['Equilátero e equiângulo', 'Equilátero: todos os lados com a mesma medida. Equiângulo: todos os ângulos internos com a mesma medida. Um losango é equilátero sem ser necessariamente equiângulo; um retângulo é equiângulo sem ser necessariamente equilátero.'],
        ['Regular = as duas condições', 'Polígono regular é equilátero e equiângulo ao mesmo tempo. Triângulo equilátero, quadrado, pentágono regular e hexágono regular são os exemplos mais comuns.'],
        ['Classificações independentes', 'Convexidade descreve o formato: há ou não reentrância. Regularidade descreve medidas iguais. Um polígono pode ser convexo e irregular. Todo polígono regular estudado aqui é convexo.']
      ],
      formulas: ['convexo: cada ângulo interno < 180°', 'côncavo: algum ângulo interno > 180°', 'diagonal: vértices não consecutivos', 'regular = equilátero + equiângulo'],
      check: 'Confirme separadamente: há reentrância? Todos os lados são iguais? Todos os ângulos internos são iguais? Se só uma das duas últimas respostas for “sim”, o polígono não é regular.'
    },
    'm20-diagonais': {
      title: 'Diagonais: contar sem desenhar todas',
      analogy: 'Pense em n pessoas sentadas em volta de uma mesa redonda. Cada uma quer apertar a mão de quem não está ao seu lado. Cada aperto de mão entre duas pessoas não vizinhas é como uma diagonal: contamos os de cada pessoa e dividimos por 2, porque cada aperto envolve duas pessoas.',
      sections: [
        ['O que é diagonal', 'Diagonal é o segmento que liga dois vértices não consecutivos. Lados ligam vértices vizinhos; diagonais ligam os que não são vizinhos. O triângulo é o único polígono sem diagonais.'],
        ['Diagonais de um vértice', 'Em um polígono de n lados, um vértice não forma diagonal com ele mesmo nem com seus dois vizinhos. Sobram n − 3 vértices, então partem n − 3 diagonais de cada vértice.'],
        ['Total de diagonais', 'Multiplicando n × (n − 3), cada diagonal é contada duas vezes, uma por extremidade. Por isso d = n(n − 3)/2. Exemplo: decágono → 10 × 7 ÷ 2 = 35.'],
        ['Problema inverso', 'Se o enunciado dá o número de diagonais e pede n, teste valores de n na fórmula ou use n(n − 3) = 2d. Para d = 35: n(n − 3) = 70, e n = 10 funciona, pois 10 × 7 = 70.'],
        ['Diagonais pelo centro', 'Em um polígono regular com número par de lados, cada vértice tem um vértice oposto, e a diagonal entre eles passa pelo centro. São dc = n/2 diagonais. Com n ímpar, não há vértices opostos e dc = 0.'],
        ['Plano de resolução', 'Identifique n e decida o que é pedido: as diagonais de um vértice (n − 3), o total (n(n − 3)/2) ou as que passam pelo centro (n/2 ou 0). Confira com um caso pequeno: o quadrado tem 2 diagonais, e as duas passam pelo centro.']
      ],
      formulas: ['de um vértice: n − 3', 'd = n(n − 3)/2', 'n par: dc = n/2', 'n ímpar: dc = 0'],
      check: 'Confira se a pergunta é sobre um vértice, sobre o total ou sobre as diagonais que passam pelo centro. Teste a fórmula no quadrado (n = 4): d = 2 e dc = 2.'
    },
    'm20-angulos': {
      title: 'Soma dos ângulos internos e externos',
      analogy: 'Dar uma volta completa ao redor de uma praça equivale a girar 360°. A cada esquina você muda de direção. A soma dessas mudanças de direção, que são os ângulos externos, completa exatamente uma volta inteira, qualquer que seja o formato da praça.',
      sections: [
        ['Triangulação', 'Escolhendo um vértice de um polígono convexo e traçando as diagonais que partem dele, formamos n − 2 triângulos sem sair da figura. Essa decomposição permite entender a soma dos ângulos e calcular áreas por partes.'],
        ['Soma dos internos', 'Cada triângulo soma 180° e são n − 2 triângulos, então Sᵢ = 180°(n − 2). A soma depende apenas do número de lados, não do tamanho nem do formato do polígono convexo. Um hexágono, por exemplo, forma 4 triângulos e soma 720°.'],
        ['Ângulo externo', 'O ângulo externo de um vértice é formado por um lado e pelo prolongamento do lado vizinho. Interno e externo do mesmo vértice ficam sobre uma reta, por isso são suplementares: somam 180°.'],
        ['Soma dos externos', 'Somando interno + externo em todos os n vértices, obtemos 180°n. Retirando a soma dos internos, 180°(n − 2) = 180°n − 360°, sobram 360°. Por isso Sₑ = 360° em qualquer polígono convexo.'],
        ['Problemas inversos', 'Se a soma dos internos é dada, divida por 180° e some 2 para achar n. Exemplo: 2520° ÷ 180° = 14, então n = 16.'],
        ['Estratégia', 'Escreva n, decida se o enunciado fala da soma ou de um ângulo isolado e confira a plausibilidade: a soma dos internos aumenta 180° a cada lado a mais, e a dos externos fica sempre em 360°.']
      ],
      formulas: ['triângulos = n − 2', 'Sᵢ = 180°(n − 2)', 'interno + externo = 180°', 'Sₑ = 360°'],
      check: 'Não confunda a soma dos ângulos internos com a medida de um único ângulo: sem saber que o polígono é regular, só é possível calcular a soma.'
    },
    'm21-angulos-regulares': {
      title: 'Ângulos do polígono regular: central, interno e externo',
      analogy: 'Uma roda funciona bem quando suas partes são distribuídas igualmente em torno do centro. O polígono regular segue essa lógica: lados, ângulos e vértices se repetem com a mesma medida ao redor de um ponto central.',
      sections: [
        ['Por que dividir por n', 'Em um polígono qualquer, conhecemos apenas a soma dos ângulos. No regular, os n ângulos internos são iguais, então cada um vale Sᵢ/n; o mesmo raciocínio vale para os externos.'],
        ['Ângulo interno', 'âᵢ = 180°(n − 2)/n. Para o octógono: 180° × 6 ÷ 8 = 135°.'],
        ['Ângulo externo', 'âₑ = 360°/n. Como interno e externo são suplementares, também vale âᵢ = 180° − âₑ, que costuma ser a conta mais rápida.'],
        ['Ângulo central', 'O centro de um polígono regular está à mesma distância de todos os vértices. O ângulo com vértice no centro e lados passando por dois vértices consecutivos é o ângulo central: α = 360°/n, a mesma medida do ângulo externo.'],
        ['Descobrir n', 'Se o enunciado dá o ângulo externo ou o central, n = 360° ÷ âₑ. Se dá o interno, calcule antes âₑ = 180° − âᵢ. Exemplo: âᵢ = 144° → âₑ = 36° → n = 10.'],
        ['Simetria', 'Um polígono regular de n lados possui n eixos de simetria e simetria de rotação em múltiplos de 360°/n. Essa repetição aparece em logotipos, mandalas, mosaicos e peças mecânicas.']
      ],
      formulas: ['âᵢ = 180°(n − 2)/n', 'âₑ = 360°/n', 'âᵢ + âₑ = 180°', 'α = 360°/n', 'eixos de simetria = n'],
      check: 'Antes de usar âᵢ ou âₑ, confirme que o enunciado diz “regular”. No final, verifique se âᵢ + âₑ = 180°.'
    },
    'm21-construcao': {
      title: 'Construção: o polígono regular como algoritmo',
      analogy: 'Uma receita funciona porque descreve passos em ordem: quem segue as mesmas instruções chega ao mesmo bolo. Construções geométricas são iguais: com os mesmos passos e as mesmas medidas, qualquer pessoa obtém o mesmo polígono.',
      sections: [
        ['Algoritmo', 'Algoritmo é uma sequência finita de passos bem definidos. Na geometria, ele garante que a construção possa ser repetida com régua, compasso, transferidor ou software e sempre gere a mesma figura.'],
        ['Com transferidor', 'Calcule âᵢ. Trace um lado de medida ℓ; no vértice final, marque âᵢ e trace o próximo lado com a mesma medida. Repita até voltar ao ponto inicial. Se a figura não fechar, algum ângulo ou alguma medida foi marcada errada.'],
        ['Com régua e compasso', 'Trace uma circunferência e divida-a em n arcos iguais, cada um correspondendo ao ângulo central 360°/n. Os pontos de divisão são os vértices; ligando pontos consecutivos, obtém-se o polígono. Para n = 3, 4 e 6, essa divisão pode ser feita só com régua e compasso.'],
        ['Triângulo e hexágono', 'Para o triângulo equilátero de lado ℓ: trace o segmento AB, faça arcos de raio ℓ com centro em A e em B e use o ponto de encontro como terceiro vértice. O hexágono regular sai de seis triângulos equiláteros com um vértice comum, pois 6 × 60° = 360°.'],
        ['Fluxograma', 'Um fluxograma representa o algoritmo com caixas e setas: início, passos e fim. Ele ajuda a conferir a ordem, a perceber passos que se repetem e a transformar a construção em instruções para um programa.'],
        ['Software de geometria dinâmica', 'Programas como o GeoGebra têm ferramentas de segmento e de polígono regular. Ao mover um vértice, a figura se ajusta mantendo suas propriedades, o que permite testar ideias com vários valores de n.']
      ],
      formulas: ['âᵢ = 180°(n − 2)/n', 'arco de cada lado = 360°/n', 'hexágono = 6 triângulos equiláteros'],
      check: 'Antes de construir, escreva n, ℓ e o ângulo que será usado. Ao terminar, meça um lado e um ângulo para conferir se a figura ficou regular.'
    },
    'm21-inscricao': {
      title: 'Polígonos regulares e suas circunferências',
      analogy: 'Imagine uma pizza redonda que cabe exatamente numa caixa quadrada, encostando nos quatro lados: ela é a circunferência inscrita. Agora imagine a caixa sobre uma bandeja redonda que encosta nos quatro cantos: essa é a circunferência circunscrita. O quadrado fica entre duas circunferências com o mesmo centro.',
      sections: [
        ['Polígono inscrito', 'Um polígono está inscrito em uma circunferência quando todos os seus vértices pertencem a ela. Dizemos também que a circunferência está circunscrita ao polígono.'],
        ['Polígono circunscrito', 'Um polígono está circunscrito a uma circunferência quando todos os seus lados a tangenciam, isto é, cada lado a toca em um único ponto. Nesse caso, a circunferência está inscrita no polígono.'],
        ['Todo regular tem as duas', 'Os vértices de um polígono regular estão todos à mesma distância do centro, e os lados também. Por isso sempre existem a circunferência inscrita e a circunscrita, com o mesmo centro do polígono.'],
        ['Raio R e raio r', 'R é a distância do centro a um vértice, o raio da circunscrita. r é a distância do centro a um lado, o raio da inscrita. Como os lados ficam mais perto do centro que os vértices, sempre R > r.'],
        ['Apótema', 'Apótema é o segmento que vai do centro ao ponto médio de um lado, formando 90° com ele. Sua medida é igual à do raio da circunferência inscrita: aₚ = r. Não confunda: R termina no vértice; aₚ termina no lado.'],
        ['Onde aparece', 'Tampos de mesa, porcas, bases de esculturas e peças cortadas de chapas redondas: sempre que um polígono precisa caber em um círculo, ou um círculo em um polígono, entram R e r.']
      ],
      formulas: ['inscrito: vértices na circunferência', 'circunscrito: lados tangentes', 'aₚ = r', 'R > r'],
      check: 'Desenhe o polígono com as duas circunferências e marque R até um vértice e aₚ = r até o meio de um lado. Depois confira qual das duas medidas o enunciado pede.'
    },
    'm21-notaveis': {
      title: 'Triângulo equilátero, quadrado e hexágono: relações métricas',
      analogy: 'Em uma caixa de ferramentas, algumas peças são usadas o tempo todo. Triângulo equilátero, quadrado e hexágono regular são as ferramentas mais comuns da geometria: aparecem em pisos, logotipos, porcas e estruturas. Por isso vale ter suas relações à mão.',
      sections: [
        ['O triângulo retângulo-chave', 'Ligue o centro O a um vértice e ao ponto médio M de um lado. O triângulo formado tem hipotenusa R, um cateto aₚ = r e outro cateto ℓ/2, com ângulo reto em M. O ângulo em O é metade do ângulo central: 60° no triângulo equilátero, 45° no quadrado e 30° no hexágono.'],
        ['Triângulo equilátero', 'A altura é h = ℓ√3/2. O centro coincide com o baricentro, que divide a altura na razão 2 : 1: R = 2h/3 e r = h/3. Daí vêm ℓ = R√3, R = ℓ√3/3, r = ℓ√3/6 e R = 2r.'],
        ['Quadrado', 'A diagonal do quadrado inscrito é um diâmetro: ℓ√2 = 2R, logo ℓ = R√2 e R = ℓ√2/2. A circunferência inscrita tem diâmetro igual ao lado: ℓ = 2r, ou r = ℓ/2.'],
        ['Hexágono regular', 'Ele se divide em 6 triângulos equiláteros de lado ℓ com vértice no centro, então R = ℓ. O apótema é a altura de um desses triângulos: r = aₚ = ℓ√3/2.'],
        ['Trabalhando com radicais', '√3 × √3 = 3 e √2 × √2 = 2. Para tirar um radical do denominador, multiplique em cima e embaixo por ele: 12/√2 = 12√2/2 = 6√2. Quando o enunciado permitir, use √2 ≈ 1,4 e √3 ≈ 1,7 apenas no final da conta.'],
        ['Estratégia', 'Identifique o polígono, veja se a circunferência é inscrita (r) ou circunscrita (R), escreva a relação correspondente e só então substitua os números. Desenhar o triângulo formado por O, um vértice e M evita trocar R por r.']
      ],
      formulas: ['triângulo: ℓ = R√3, r = ℓ√3/6, R = 2r', 'quadrado: ℓ = R√2, ℓ = 2r', 'hexágono: ℓ = R, r = ℓ√3/2', 'sen 30° = 1/2', 'sen 45° = √2/2', 'sen 60° = √3/2'],
      check: 'Confira a ordem de grandeza: em qualquer polígono regular, R > r. Para o mesmo R, o lado do hexágono é igual a R, o do quadrado é maior e o do triângulo é maior ainda.'
    },
    'm21-area': {
      title: 'Área do polígono regular e aplicações',
      analogy: 'Ao planejar uma praça, a cerca depende do contorno, que é o perímetro. O piso depende da região interna, que é a área. Cada medida responde a uma necessidade diferente, e escolher a certa é metade da solução.',
      sections: [
        ['Perímetro e semiperímetro', 'Perímetro é a soma dos lados; no polígono regular, P = n · ℓ. O semiperímetro é a metade do perímetro: p = P/2. As unidades são lineares, como cm ou m.'],
        ['Área pela decomposição', 'Ligando o centro aos vértices, formamos n triângulos isósceles congruentes de base ℓ e altura aₚ. Cada um tem área ℓ · aₚ/2; somando os n triângulos: S = n · ℓ · aₚ/2 = p · aₚ.'],
        ['Unidades e interpretação', 'Perímetro usa unidades simples (cm, m); área usa unidades quadradas (cm², m²). Se o lado de uma figura dobra, o perímetro dobra, mas a área de figuras semelhantes fica quatro vezes maior.'],
        ['Pavimentação do plano', 'Pavimentar é cobrir uma superfície sem lacunas nem sobreposições. Entre os polígonos regulares, só o triângulo equilátero, o quadrado e o hexágono fazem isso sozinhos, porque seus ângulos internos (60°, 90° e 120°) completam 360° em torno de cada ponto de encontro.'],
        ['Formas no cotidiano', 'Triângulos dão rigidez a pontes, torres e telhados; hexágonos cobrem o plano compartilhando paredes, como nos favos; o octógono da placa de parada é reconhecível de longe. A escolha do formato influencia resistência, espaço e custo.'],
        ['Modelagem de problemas', 'Transforme a situação em desenho, anote as medidas, identifique o polígono e escolha a grandeza: ângulo, diagonal, perímetro ou área. Ao final, interprete o número no contexto e confira a unidade.']
      ],
      formulas: ['P = n · ℓ', 'p = P/2', 'S = n · ℓ · aₚ/2', 'S = p · aₚ', 'cerca → perímetro', 'piso → área'],
      check: 'Pergunte o que está sendo medido: a borda, o interior ou a ligação entre vértices. Confira se a resposta precisa de unidade linear ou quadrada.'
    }
  };

  /*
   * Onde a turma está na escola. Atualize `currentTopic` com o id da trilha vista em sala
   * (por exemplo 'm20-diagonais' ou 'm21-inscricao'); o mapa destaca essa trilha com “📍 Estamos aqui”.
   * Use null para não destacar nenhuma.
   */
  const school = { currentTopic: 'm20-poligonos' };

  return { topics, topicGuides, school };
});
