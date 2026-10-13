export const company = {
  name: "BRS Reparações Automotivas",
  legalName: "Brs Comercio de Pecas Automotivas LTDA",
  tradeName: "Brs Comercio de Pecas Automotivas",
  cnpj: "53.877.400/0001-46",
  cnpjRaw: "53877400000146",
  foundedDate: "2024-02-09",
  foundedFormatted: "09/02/2024",
  founder: {
    name: "Bruno",
    role: "Fundador e Especialista Técnico",
    experienceYearsText: "Anos de experiência consolidada no segmento automotivo",
    bio: "À frente da BRS, Bruno reúne anos de vivência e dedicação prática ao setor automotivo — unindo conhecimento aprofundado em funilaria, pintura e fornecimento de peças com uma conduta pautada em diagnóstico honesto e respeito rigoroso ao padrão de fábrica de cada veículo.",
  },
  phone: "(45) 2035-9440",
  phoneHref: "tel:+554520359440",
  instagram: "https://www.instagram.com/brsreparacoes/",
  city: "Toledo, Paraná",
  whatsappConfirmed: false,
  siteUrl: "http://brs.localhost",
};

export function canonicalUrl(path: string = "/"): string {
  const base = company.siteUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath === "/" ? "/" : normalizedPath}`;
}

export const navigation = [
  ["Início", "/"],
  ["Serviços", "/servicos"],
  ["Nosso trabalho", "/trabalhos"],
  ["Para corretores", "/para-corretores"],
  ["A BRS", "/sobre"],
  ["Contato", "/contato"],
] as const;

/**
 * Itens da navbar. "Contato" não aparece aqui porque o CTA "Solicitar avaliação" já
 * leva a `/contato`; o rodapé continua usando a lista completa em `navigation`.
 */
export const primaryNavigation = navigation.filter(([, href]) => href !== "/contato");

export type ServicePath =
  "/servicos/funilaria" | "/servicos/pintura-automotiva" | "/servicos/martelinho-de-ouro";

export interface ServiceDetail {
  slug: string;
  path: ServicePath;
  title: string;
  short: string;
  description: string;
  fullDescription: string;
  applications: string[];
  limitations: string[];
  processSteps: { title: string; desc: string }[];
}

export const services: ServiceDetail[] = [
  {
    slug: "funilaria",
    path: "/servicos/funilaria",
    title: "Funilaria automotiva",
    short: "Funilaria",
    description:
      "Reparação de danos na lataria, com atenção às linhas, aos encaixes e à recuperação visual do veículo.",
    fullDescription:
      "A funilaria técnica da BRS atua na recuperação de painéis, portas, paralamas, capôs e componentes metálicos avariados por colisões. O trabalho prioriza o restabelecimento milimétrico das folgas e vincos originais do fabricante, empregando ferramentas de repuxo e conformação adequadas para manter a resistência do material.",
    applications: [
      "Deformações médias e grandes em portas, laterais, capô e paralamas",
      "Desalinhamento de linhas de cintura e frestas entre componentes adjacentes",
      "Recuperação de peças metálicas sem perda da integridade estrutural",
      "Adequação prévia da superfície para nivelamento e pintura",
    ],
    limitations: [
      "Peças com estiramento excessivo ou ruptura estrutural irreversível demandam substituição por peça nova homologada",
      "Componentes de segurança com deformação plástica severa não são recuperados por motivos de integridade estrutural",
    ],
    processSteps: [
      {
        title: "1. Diagnóstico e desmontagem técnica",
        desc: "Inspeção visual e desmontagem criteriosa de forros, chicotes e acabamentos plásticos para livre acesso à chapa.",
      },
      {
        title: "2. Conformação e repuxamento milimétrico",
        desc: "Trabalho progressivo na lataria com ferramentas especializadas para retornar a chapa à geometria original.",
      },
      {
        title: "3. Conferência de alinhamento e gaps",
        desc: "Validação das linhas de junção, frestas de portas e encaixes com medições precisas antes da fase de pintura.",
      },
    ],
  },
  {
    slug: "pintura-automotiva",
    path: "/servicos/pintura-automotiva",
    title: "Pintura automotiva",
    short: "Pintura",
    description:
      "Preparação e pintura voltadas à uniformidade de cor, à qualidade do acabamento e à integração visual da peça reparada.",
    fullDescription:
      "O setor de pintura da BRS opera com cabine com controle térmico e filtragem de partículas para evitar contaminações. O processo abrange desde o lixamento técnico com primers anticorrosivos de alta aderência até a colorimetria rigorosa e aplicação de verniz de alto sólido, assegurando brilho, durabilidade e transição imperceptível em relação às peças vizinhas.",
    applications: [
      "Repintura de painéis reparados em funilaria ou substituídos",
      "Correção de riscos profundos, arranhões com perda de camada de verniz e marcas de atrito",
      "Recuperação de para-choques e acabamentos plásticos com promotores de aderência",
      "Pintura localizada e técnica de alongamento para correspondência exata de tonalidade",
    ],
    limitations: [
      "Cores perolizadas e tricamada exigem acerto de tonalidade e técnica de alongamento nas peças vizinhas",
      "Veículos com repinturas anteriores de baixa qualidade podem exigir remoção total de camadas comprometidas",
      "Requer período de cura pós-serviço: recomenda-se evitar lavagens agressivas ou ceras abrasivas nas primeiras semanas",
    ],
    processSteps: [
      {
        title: "1. Preparação de superfície e mascaramento",
        desc: "Isolamento minucioso do veículo, lixamento técnico e aplicação de primers anticorrosivos de alta aderência.",
      },
      {
        title: "2. Colorimetria e aplicação em estufa",
        desc: "Ajuste preciso da fórmula de cor do fabricante e aplicação em cabine com controle de partículas e temperatura.",
      },
      {
        title: "3. Aplicação de verniz e cura térmica",
        desc: "Aplicação uniforme de verniz de alto sólido e ciclo de cura térmica controlada para máxima resistência e brilho.",
      },
    ],
  },
  {
    slug: "martelinho-de-ouro",
    path: "/servicos/martelinho-de-ouro",
    title: "Martelinho de ouro",
    short: "Martelinho de ouro",
    description:
      "Reparação de amassados que pode preservar a pintura original, quando as características do dano permitem.",
    fullDescription:
      "O martelinho de ouro (Paintless Dent Removal — PDR) é uma técnica artesanal de alta precisão que restaura amassados na lataria sem a necessidade de lixar, aplicar massa plástica ou repintar o veículo. Através de alavancas especiais pelo verso do painel ou tração controlada por ventosas térmicas pela face externa, a chapa retorna à sua posição de fábrica preservando 100% da tinta e do verniz originais.",
    applications: [
      "Amassados causados por chuvas de granizo em teto, capô e colunas",
      "Pequenas colisões de estacionamento e batidas de porta",
      "Vincos suaves e depressões sem rompimento da camada de tinta",
      "Veículos que valorizam a manutenção rigorosa da originalidade de fábrica",
    ],
    limitations: [
      "Inaplicável se a tinta ou o verniz estiverem trincados, descascados ou com fratura visível",
      "Amassados em bordas de chapa com dupla camada estrutural ou reforços internos inacessíveis podem exigir métodos combinados de funilaria",
      "Chapas metálicas que sofreram estiramento elástico severo (ponto de estiramento ultrapassado) não permitem retorno total pelo PDR",
    ],
    processSteps: [
      {
        title: "1. Análise com luminária técnica de linhas",
        desc: "Inspeção com iluminação de contraste especial para mapear cada milímetro da depressão e a integridade do verniz.",
      },
      {
        title: "2. Massagem milimétrica da chapa",
        desc: "Acesso ao verso da peça com alavancas anatômicas ou tração suave por ventosas adesivas térmicas.",
      },
      {
        title: "3. Nivelamento microscópico e acabamento",
        desc: "Eliminação de micro-tensões residuais na chapa, restabelecendo o reflexo natural e a uniformidade de fábrica.",
      },
    ],
  },
];

export interface AestheticServiceDetail {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  description: string;
  applications: string[];
  limitations: string[];
  benefits: string[];
}

export const aestheticServices: AestheticServiceDetail[] = [
  {
    slug: "espelhamento",
    title: "Espelhamento de pintura automotiva",
    short: "Espelhamento",
    tagline: "Nivelamento do verniz e eliminação de micro-riscos",
    description:
      "Polimento técnico em etapas de corte, refino e lustro para nivelar a camada superficial do verniz. Remove marcas de lavagem (swirls), teias de aranha e oxidações superficiais, restaurando a nitidez ótica e o reflexo espelhado da pintura.",
    applications: [
      "Veículos com verniz opaco ou com micro-riscos circulares de lavagens inadequadas",
      "Pinturas sem brilho ou com oxidação superficial decorrente de exposição solar",
      "Preparação automotiva antes de eventos, revenda ou aplicação de proteção cerâmica",
      "Restauração do brilho profundo em cores escuras ou sólidas que evidenciam imperfeições",
    ],
    limitations: [
      "Não recupera riscos profundos que ultrapassaram o verniz e atingiram a tinta base ou a chapa",
      "Exige espessura mínima de verniz saudável para suportar o processo de polimento",
    ],
    benefits: [
      "Eliminação de até 90% dos micro-riscos e hologramas superficiais",
      "Reflexo nítido de espelho e toque aveludado na carroceria",
      "Acabamento com ceras e selantes técnicos de alta ancoragem",
    ],
  },
  {
    slug: "vitrificacao",
    title: "Vitrificação cerâmica de pintura",
    short: "Vitrificação",
    tagline: "Proteção nanotecnológica duradoura contra intempéries",
    description:
      "Aplicação de revestimento cerâmico (coating de sílica / SiO2) que se ancora molecularmente aos microporos do verniz. Forma um escudo vítreo de alta dureza resistente a raios ultravioleta, seiva de árvores, fezes de pássaros e agentes químicos.",
    applications: [
      "Veículos zero quilômetro para blindar e conservar a pintura original desde o início",
      "Veículos recém-polidos ou repintados para prolongar o brilho e facilitar a lavagem",
      "Proteção preventiva para veículos que ficam expostos a sol, chuva e contaminantes industriais",
      "Proprietários que exigem repelência hidrofóbica e máxima facilidade de manutenção",
    ],
    limitations: [
      "Exige polimento técnico e descontaminação prévia obrigatória antes da aplicação do vitrificador",
      "Demanda tempo de cura inicial (mínimo de 24 a 48 horas) antes do contato com chuva ou lavagem",
      "Não protege contra impactos de pedriscos em rodovias ou danos mecânicos severos",
    ],
    benefits: [
      "Durabilidade e proteção contínua de até 1 a 3 anos sob manutenção adequada",
      "Alta repelência hidrofóbica: a água e a sujeira deslizam sem aderir",
      "Filtro UV potente que retarda o desbotamento precoce do verniz",
    ],
  },
  {
    slug: "polimento-de-parabrisa",
    title: "Polimento técnico de para-brisa",
    short: "Polimento de para-brisa",
    tagline: "Restauração da clareza óptica e remoção de marcas de palheta",
    description:
      "Processo especializado de polimento em vidro automotivo utilizando discos especiais e óxido de cério. Remove riscos finos causados por palhetas desgastadas, manchas de chuva ácida (marcas d'água minerais) e contaminações aderidas ao vidro.",
    applications: [
      "Para-brisas com marcas curvas causadas por palhetas ressecadas ou areia",
      "Manchas persistentes de chuva ácida (calcificação) que não saem em lavagens comuns",
      "Refração e ofuscamento incômodo à noite sob a luz de faróis contrários",
      "Vidros laterais ou traseiros com marcas minerais e perda de nitidez",
    ],
    limitations: [
      "Inaplicável em trincas, lascas (olhos de boi) ou fissuras estruturais (que exigem reparo de trinca ou troca)",
      "Riscos que agarram na unha com profundidade excessiva podem gerar distorção óptica se polidos em excesso",
    ],
    benefits: [
      "Visibilidade e segurança noturna e sob chuva restabelecidas",
      "Economia significativa evitando a substituição desnecessária do para-brisa original",
      "Eliminação do efeito de ofuscamento contra os faróis de outros veículos",
    ],
  },
];

export const allOfferedServices = [
  ...services.map((s) => s.short),
  ...aestheticServices.map((s) => s.short),
];

export type ContactValues = {
  name: string;
  phone: string;
  vehicle: string;
  service: string;
  description: string;
  audience: string;
};

export function validateContact(values: ContactValues) {
  const errors: Partial<Record<keyof ContactValues, string>> = {};
  if (!values.name.trim()) errors.name = "Informe seu nome.";
  const digits = values.phone.replace(/\D/g, "").length;
  if (digits < 10 || digits > 13) errors.phone = "Informe um telefone válido com DDD.";
  if (!values.description.trim()) errors.description = "Conte brevemente o que você precisa.";
  return errors;
}

export function contactMessage(values: ContactValues) {
  const intro =
    values.audience === "corretor"
      ? "Olá! Gostaria de conversar sobre uma possível parceria para atendimento de segurados."
      : "Olá! Conheci a BRS pelo site e gostaria de solicitar uma avaliação para meu veículo.";
  return [
    intro,
    `Nome: ${values.name.trim()}`,
    `Telefone: ${values.phone.trim()}`,
    values.vehicle && `Veículo: ${values.vehicle.trim()}`,
    values.service && `Serviço: ${values.service}`,
    `Atendimento: ${values.audience}`,
    `Descrição: ${values.description.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
}
