export const company = {
  name: "BRS Reparações Automotivas",
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

export interface ServiceDetail {
  slug: string;
  path: string;
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
