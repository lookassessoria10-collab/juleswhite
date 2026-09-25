// Conteúdo da apresentação "Técnicas Laboratoriais de Reprodução Humana"
// Cada slide é a lâmina original (imagem); o texto abaixo é a transcrição usada
// no modo leitura (celular), na busca do sumário e para acessibilidade.

export const MODULES = [
  { id: 0, short: "Abertura", title: "Abertura", slides: [1] },
  { id: 1, short: "01", title: "Andrologia & Preparo", slides: [2, 3, 4] },
  { id: 2, short: "02", title: "Estímulo & Coleta", slides: [5, 6, 7, 8] },
  { id: 3, short: "03", title: "ICSI & Desenvolvimento", slides: [9, 10, 11, 12, 13] },
  { id: 4, short: "04", title: "Biópsia Embrionária", slides: [14, 15, 16] },
  { id: 5, short: "05", title: "Criopreservação", slides: [17, 18, 19, 20, 21] },
  { id: 6, short: "06", title: "A Transferência", slides: [22, 23, 24] },
  { id: 7, short: "Final", title: "Resultados & Próximos Passos", slides: [25, 26, 27] },
];

// Áreas clicáveis (em % da lâmina) dos 6 cartões dos slides "A Sua Jornada Conosco"
const JOURNEY_HOTSPOTS = [
  { x: 4.1, y: 23.8, w: 23.5, h: 28.3, go: 3, label: "Ir para Módulo 01: Andrologia & Preparo" },
  { x: 37.9, y: 24.0, w: 23.5, h: 28.3, go: 6, label: "Ir para Módulo 02: Estímulo & Coleta" },
  { x: 72.2, y: 23.8, w: 23.5, h: 28.3, go: 10, label: "Ir para Módulo 03: ICSI & Desenvolvimento" },
  { x: 4.1, y: 65.3, w: 23.5, h: 28.3, go: 15, label: "Ir para Módulo 04: Biópsia Embrionária" },
  { x: 37.9, y: 65.5, w: 23.5, h: 28.3, go: 18, label: "Ir para Módulo 05: Criopreservação" },
  { x: 72.2, y: 65.3, w: 23.5, h: 28.3, go: 23, label: "Ir para Módulo 06: A Transferência" },
];

const JOURNEY_TEXT = `
<ol class="journey-list">
  <li><b>Andrologia & Preparo</b> — Avaliação, seleção e preparo criterioso dos espermatozoides.</li>
  <li><b>Estimulação & Coleta</b> — Acompanhamento do desenvolvimento e aspiração dos folículos.</li>
  <li><b>ICSI & Desenvolvimento</b> — A união de precisão dos gametas e cultivo embrionário.</li>
  <li><b>Biópsia Embrionária</b> — Análise genética (PGT) para avaliação da saúde do embrião.</li>
  <li><b>Criopreservação</b> — Vitrificação segura de óvulos e embriões para o tempo ideal.</li>
  <li><b>A Transferência</b> — O momento do reencontro com depósito no endométrio.</li>
</ol>`;

const journey = (step) => ({
  title: "A Sua Jornada Conosco",
  kind: "jornada",
  step,
  text: JOURNEY_TEXT,
  alt: `Mapa da jornada em 6 etapas, com a etapa ${step} em destaque.`,
  hotspots: JOURNEY_HOTSPOTS.map((h, i) => ({ ...h, type: "go", active: i + 1 === step })),
});

export const SLIDES = [
  null, // índice 0 vazio para numerar a partir de 1
  {
    title: "Técnicas Laboratoriais de Reprodução Humana",
    kind: "capa",
    text: `<p class="lead">Ciência, precisão e acolhimento no seu processo de fertilização.</p><p>Jules White — Reprodução Assistida e Fertilidade.</p>`,
    alt: "Capa: Técnicas Laboratoriais de Reprodução Humana, Jules White.",
  },
  journey(1),
  {
    title: "Módulo 01 · Andrologia",
    kind: "modulo",
    text: `<p class="lead">O cuidado no preparo dos espermatozoides.</p>
<ul><li>Avaliação criteriosa da motilidade e morfologia seminal.</li>
<li>Seleção dos espermatozoides de melhor potencial fertilizante.</li>
<li>Preparo personalizado para a etapa de fertilização.</li></ul>`,
    alt: "Módulo 01, Andrologia, com foto de espermatozoide ao microscópio.",
  },
  {
    title: "Seleção Seminal Avançada",
    kind: "conteudo",
    text: `<p class="lead">Tecnologias para encontrar os melhores gametas.</p>
<h4>Gradiente de Densidade</h4><p>Separação dos espermatozoides mais móveis e saudáveis. O sêmen é colocado sobre camadas de gradiente (55% e 80%); após o preparo, ficam separados o plasma seminal, os espermatozoides imóveis/mortos e outras células, e — no fundo — os espermatozoides móveis.</p>
<h4>Tecnologia ZyMōt™</h4><p>Microfluídica que seleciona espermatozoides com menor fragmentação de DNA, sem centrifugação.</p>`,
    alt: "Ilustração do gradiente de densidade em tubos de ensaio e dispositivo ZyMōt.",
  },
  journey(2),
  {
    title: "Módulo 02 · Estímulo & Coleta",
    kind: "modulo",
    text: `<p class="lead">Acompanhamento do desenvolvimento dos folículos.</p>
<h4>Estimulação Hormonal</h4><p>Indução do crescimento de múltiplos folículos.</p>
<h4>Ultrassonografia Seriada</h4><p>Mapeamento preciso do momento ideal para a aspiração.</p>`,
    alt: "Módulo 02: caneta de medicação hormonal e imagem de ultrassom dos folículos.",
  },
  {
    title: "Aspiração Folicular",
    kind: "conteudo",
    text: `<p class="lead">Um procedimento simples, rápido e sob sedação.</p>
<ul><li>Coleta dos oócitos guiada por ultrassom transvaginal.</li>
<li>Procedimento indolor realizado em centro cirúrgico/ambulatorial.</li></ul>
<div class="fact"><b>Fato importante</b> Em média, cerca de <strong>60% a 80%</strong> dos folículos contêm óvulos maduros.</div>`,
    alt: "Ilustração anatômica da aspiração folicular guiada por agulha.",
  },
  {
    title: "Procura e Maturação Folicular",
    kind: "conteudo",
    text: `<p class="lead">Identificando os óvulos prontos para a fertilização.</p>
<h4>Óvulos Coletados</h4><p>Identificação do complexo cumulus-oócito no líquido aspirado.</p>
<h4>Denudação & Seleção</h4><p>Identificação dos óvulos em Metáfase II (MII), os únicos maduros para a ICSI.</p>`,
    alt: "Fotos de microscópio: complexos cumulus-oócito e óvulo maduro em metáfase II.",
  },
  journey(3),
  {
    title: "Módulo 03 · Injeção Intracitoplasmática (ICSI)",
    kind: "modulo",
    text: `<p class="lead">A união de precisão entre o espermatozoide e o óvulo.</p>
<ul><li>Introdução direta de um único espermatozoide pré-selecionado dentro do óvulo maduro.</li>
<li>Realizado com micromanipuladores de altíssima precisão no laboratório de embriologia.</li>
<li>Aumenta significativamente as chances de fertilização bem-sucedida.</li></ul>`,
    alt: "Módulo 03: micropipeta injetando espermatozoide em óvulo.",
  },
  {
    title: "ICSI",
    kind: "conteudo",
    text: `<p class="lead">Injeção intracitoplasmática de espermatozoides.</p><p>Sequência de três imagens de microscópio mostrando a micropipeta entrando no óvulo, depositando o espermatozoide e sendo retirada.</p>`,
    alt: "Três fotos em sequência do procedimento de ICSI ao microscópio.",
  },
  {
    title: "O Desenvolvimento do Embrião",
    kind: "conteudo",
    text: `<p class="lead">Os primeiros dias de vida no laboratório.</p>
<ol class="timeline"><li><b>D0</b> ICSI</li><li><b>D1</b> Zigoto</li><li><b>D2</b> 4 células</li><li><b>D3</b> 8 células</li><li><b>D4</b> Mórula</li><li><b>D5/D6</b> Blastocisto</li></ol>`,
    alt: "Ilustração do desenvolvimento embrionário do dia 0 ao dia 5/6.",
  },
  {
    title: "Dia 1 · Dia 3 · Dia 5/6",
    kind: "conteudo",
    text: `<h4>Dia 1</h4><p>Confirmação da fertilização (surgimento dos 2 pronúcleos — zigoto).</p>
<h4>Dia 3</h4><p>Clivagem (embrião com 6 a 8 células).</p>
<h4>Dia 5/6</h4><p>Blastocisto (embrião expandido, pronto para implantação ou biópsia).</p>`,
    alt: "Fotos reais de embrião no dia 1, dia 3 e dia 5/6.",
  },
  journey(4),
  {
    title: "Módulo 04 · Biópsia Embrionária",
    kind: "modulo",
    text: `<p class="lead">Teste Genético Pré-Implantacional (PGT-A).</p>
<ul><li>Remoção segura de poucas células da camada externa do blastocisto (trofectoderma).</li>
<li>Avaliação de alterações cromossômicas (como Síndrome de Down e outras aneuploidias).</li>
<li>Permite selecionar embriões euploides (saudáveis), aumentando a taxa de sucesso por transferência.</li></ul>`,
    alt: "Módulo 04: embriologista trabalhando ao microscópio.",
  },
  {
    title: "Genética e Idade Materna",
    kind: "conteudo",
    text: `<p class="lead">Compreendendo a proporção de embriões euploides.</p>
<p>Taxa de embriões saudáveis por idade materna:</p>
<div class="bars" role="list">
  <div role="listitem" style="--v:60"><span>34–35</span><i></i><b>60%</b></div>
  <div role="listitem" style="--v:47"><span>36–37</span><i></i><b>47%</b></div>
  <div role="listitem" style="--v:34"><span>38–39</span><i></i><b>34%</b></div>
  <div role="listitem" style="--v:27"><span>40–41</span><i></i><b>27%</b></div>
  <div role="listitem" style="--v:16"><span>42–43</span><i></i><b>16%</b></div>
  <div role="listitem" style="--v:11"><span>&gt;44</span><i></i><b>11%</b></div>
</div>`,
    alt: "Gráfico de barras: taxa de embriões saudáveis cai de 60% (34–35 anos) para 11% (acima de 44).",
  },
  journey(5),
  {
    title: "Módulo 05 · Criopreservação",
    kind: "modulo",
    text: `<p class="lead">Vitrificação ultrarrápida de óvulos e embriões.</p>
<ul><li>Armazenamento em tanques de nitrogênio líquido a −196 °C.</li>
<li>Paralisação completa do tempo biológico do embrião sem perda de qualidade.</li>
<li>Permite o preparo ideal do endométrio para uma transferência segura no ciclo seguinte.</li></ul>`,
    alt: "Módulo 05: tanque de nitrogênio líquido sendo manuseado.",
  },
  {
    title: "Criopreservação",
    kind: "conteudo",
    text: `<p class="lead">Gametas e embriões.</p><p>Óvulos e embriões são armazenados em nitrogênio líquido a <strong>−196 °C</strong>.</p>`,
    alt: "Ilustração de tubos com embriões e óvulos congelados a −196 °C.",
  },
  {
    title: "Preparação do Útero",
    kind: "conteudo",
    text: `<p class="lead">Criando o ambiente perfeito para a implantação.</p>
<h4>Ciclo Hormonal Preparado ou Ciclo Natural</h4><p>Adequação ao perfil de cada paciente.</p>
<h4>Espessura Endometrial Ideal</h4><p>Acompanhamento por ultrassom até atingir o padrão trilaminar.</p>
<h4>Suporte Progestagênico</h4><p>Sincronização exata da janela de implantação.</p>`,
    alt: "Preparação do útero: equipe médica realizando ultrassom.",
  },
  {
    title: "Transferência Embrionária",
    kind: "conteudo",
    text: `<p>Ilustração anatômica: o embrião é levado por um cateter, através da vagina, até o útero. Estão indicados útero, embrião, tuba uterina, ovário, cateter e vagina.</p>`,
    alt: "Ilustração anatômica da transferência embrionária com cateter.",
  },
  journey(6),
  {
    title: "Módulo 06 · A Transferência",
    kind: "modulo",
    text: `<p class="lead">O momento mais esperado da jornada.</p>
<ul><li>Procedimento rápido, simples e que não exige anestesia.</li>
<li>Depósito do embrião na cavidade uterina com cateter de alta flexibilidade guiado por ultrassom.</li>
<li>Você pode acompanhar em tempo real pelo monitor da sala.</li></ul>`,
    alt: "Módulo 06: blastocisto ao microscópio.",
  },
  {
    title: "O Teste de Confirmação (Beta-hCG)",
    kind: "conteudo",
    text: `<p class="lead">Aguardando o resultado com suporte contínuo.</p>
<h4>Aguardando a Implantação</h4><p>Exame de sangue realizado cerca de 9 a 12 dias após a transferência.</p>
<h4>Manutenção de Medicamentos</h4><p>Acompanhamento e orientação médica constante durante a espera.</p>`,
    alt: "Mãos segurando um teste de gravidez.",
  },
  {
    title: "A Escalada da FIV",
    kind: "conteudo",
    text: `<p class="lead">Entendendo a evolução numérica ao longo do tratamento.</p>
<p>Exemplo a partir de 10 oócitos captados (taxa de passagem para a etapa seguinte):</p>
<ol class="ladder">
  <li><b>10</b> Oócitos captados <em>→ 80%</em></li>
  <li><b>8</b> Oócitos maduros <em>→ 70–75%</em></li>
  <li><b>6–7</b> Oócitos fertilizados <em>→ 80%</em></li>
  <li><b>4–5</b> Embriões <em>→ 40–50%</em></li>
  <li><b>4–5</b> Blastocistos <em>→ 10–70%</em></li>
  <li><b>2–3</b> Blastocistos euploides <em>→ 60%</em></li>
  <li><b>♥</b> Bebê</li>
</ol>`,
    alt: "Pirâmide da escalada da FIV: de 10 oócitos captados até o bebê.",
  },
  {
    title: "Seus Próximos Passos",
    kind: "conteudo",
    text: `<p class="lead">Planejamento do seu plano de tratamento individualizado.</p><p>Toque nos itens para marcar o que já foi feito:</p>`,
    checklist: [
      "Alinhamento do protocolo de estimulação ovariana.",
      "Solicitação/Confirmação de exames prévios do casal.",
      "Agendamento do início da medicação.",
    ],
    alt: "Lista de próximos passos do tratamento.",
    hotspots: [
      { x: 2.5, y: 50.2, w: 93, h: 8, type: "check", i: 0 },
      { x: 2.5, y: 62.4, w: 95, h: 8, type: "check", i: 1 },
      { x: 2.5, y: 74.6, w: 70, h: 8, type: "check", i: 2 },
    ],
  },
  {
    title: "Estamos Prontos para Caminhar com Você",
    kind: "capa",
    text: `<p class="lead">Ciência de ponta com o carinho que a sua história merece.</p><p>Jules White — Reprodução Assistida e Fertilidade.</p>`,
    alt: "Casal sorrindo segurando um teste de gravidez, com o logotipo Jules White.",
  },
];

// Perguntas que levam direto ao slide (guia e sumário)
export const QUESTIONS = [
  { id: "semen", q: "Como os espermatozoides são selecionados?", slides: [3, 4] },
  { id: "zymot", q: "O que é a tecnologia ZyMōt™?", slides: [4] },
  { id: "estimulo", q: "Como funciona a estimulação hormonal?", slides: [6] },
  { id: "coleta", q: "A coleta dos óvulos dói?", slides: [7] },
  { id: "maduros", q: "Quantos óvulos costumam estar maduros?", slides: [7, 8] },
  { id: "icsi", q: "O que é ICSI?", slides: [10, 11] },
  { id: "embriao", q: "Como o embrião se desenvolve dia a dia?", slides: [12, 13] },
  { id: "pgt", q: "O que é o teste genético PGT-A?", slides: [15] },
  { id: "idade", q: "A idade influencia a saúde dos embriões?", slides: [16] },
  { id: "cong", q: "Como funciona o congelamento?", slides: [18, 19] },
  { id: "utero", q: "Como o útero é preparado?", slides: [20] },
  { id: "transf", q: "Como é a transferência do embrião?", slides: [21, 23] },
  { id: "beta", q: "Quando faço o teste de gravidez?", slides: [24] },
  { id: "chances", q: "Como os números evoluem em cada etapa?", slides: [25] },
  { id: "passos", q: "Quais são os meus próximos passos?", slides: [26] },
];

// Momento da jornada → perguntas pré-selecionadas no guia
export const MOMENTS = [
  { id: "inicio", icon: "🌱", label: "Estou começando a pesquisar", hint: "Quero uma visão geral do processo", pre: ["semen", "estimulo", "icsi", "transf", "chances", "passos"] },
  { id: "estimulo", icon: "💉", label: "Vou iniciar a estimulação", hint: "Medicação, ultrassom e coleta", pre: ["estimulo", "coleta", "maduros", "semen"] },
  { id: "lab", icon: "🔬", label: "Meus embriões estão no laboratório", hint: "Fertilização, cultivo e genética", pre: ["icsi", "embriao", "pgt", "idade", "cong"] },
  { id: "transf", icon: "🤍", label: "Vou fazer a transferência", hint: "Preparo do útero e o grande dia", pre: ["utero", "transf", "beta"] },
];

// Quiz "Teste o que você aprendeu"
export const QUIZ = [
  { q: "Qual tecnologia seleciona espermatozoides com menor fragmentação de DNA, sem centrifugação?", a: ["Gradiente de densidade", "Tecnologia ZyMōt™", "Vitrificação", "Ultrassonografia seriada"], c: 1, slide: 4, why: "O ZyMōt™ usa microfluídica para selecionar espermatozoides com menos fragmentação de DNA — e sem centrifugar." },
  { q: "Em média, qual a proporção de folículos que contém óvulos maduros?", a: ["10% a 20%", "30% a 40%", "60% a 80%", "Praticamente 100%"], c: 2, slide: 7, why: "Em média, cerca de 60% a 80% dos folículos aspirados contêm óvulos maduros." },
  { q: "Quais óvulos são os únicos maduros para a ICSI?", a: ["Os que estão em Metáfase II (MII)", "Os que estão no estágio de mórula", "Todos os óvulos coletados", "Os zigotos"], c: 0, slide: 8, why: "Após a denudação, identificam-se os óvulos em Metáfase II (MII) — os únicos maduros para a ICSI." },
  { q: "Em que dia o embrião chega ao estágio de blastocisto?", a: ["Dia 1", "Dia 3", "Dia 5/6", "Dia 10"], c: 2, slide: 13, why: "No dia 5/6 o embrião está expandido (blastocisto), pronto para implantação ou biópsia." },
  { q: "O que o PGT-A avalia?", a: ["O tipo sanguíneo do embrião", "Alterações cromossômicas, como a Síndrome de Down", "A espessura do endométrio", "A motilidade dos espermatozoides"], c: 1, slide: 15, why: "O PGT-A avalia alterações cromossômicas (aneuploidias) para selecionar embriões euploides." },
  { q: "Entre 34 e 35 anos, qual a taxa média de embriões saudáveis (euploides)?", a: ["11%", "34%", "60%", "90%"], c: 2, slide: 16, why: "Aos 34–35 anos a taxa é de cerca de 60%, caindo para 11% acima dos 44 anos." },
  { q: "A que temperatura óvulos e embriões ficam armazenados?", a: ["−18 °C", "−80 °C", "−196 °C", "0 °C"], c: 2, slide: 18, why: "Eles ficam em tanques de nitrogênio líquido a −196 °C, com o tempo biológico paralisado." },
  { q: "A transferência embrionária exige anestesia?", a: ["Sim, anestesia geral", "Não, é rápida e simples", "Sim, sedação profunda", "Só em casos de congelamento"], c: 1, slide: 23, why: "É um procedimento rápido e simples, que não exige anestesia — e você pode acompanhar pelo monitor." },
  { q: "Cerca de quantos dias após a transferência é feito o Beta-hCG?", a: ["1 a 2 dias", "9 a 12 dias", "30 dias", "60 dias"], c: 1, slide: 24, why: "O exame de sangue é feito cerca de 9 a 12 dias após a transferência." },
];
