/**
 * Módulo de Negócio e Domínio — Proposta Comercial Personalizada
 * EPM DevTech | BRS Reparações Automotivas
 * Fonte Única de Verdade para Propostas Comerciais (SPEC-027 / TASK-027-01)
 */

export type ProposalStatus = "draft" | "ready" | "accepted" | "expired" | "archived";

export interface CommercialItem {
  id: string;
  title: string;
  description: string;
  included: boolean;
  category?:
    "Frontend & Experiência" | "Infraestrutura & SEO" | "Conteúdo & Mídia" | "Gestão & Adicionais";
}

export interface PaymentCondition {
  title: string;
  description: string;
  highlight?: boolean;
}

export interface ProjectPhase {
  step: number;
  title: string;
  description: string;
  estimatedDuration?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProposalInvestment {
  totalValue: number;
  entryValue?: number;
  balanceValue?: number;
  balanceMoment?: string;
  installmentsDescription?: string;
  hasRecurringMonthly: boolean;
  recurringMonthlyValue?: number;
  recurringDescription?: string;
  thirdPartyCosts?: string;
}

export interface ProposalModule {
  id: string;
  name: string;
  category: string;
  price: number;
  isStartingPrice?: boolean;
  summary: string;
  problemSolved: string;
  deliverables: string[];
  exclusions: string[];
  dependencies: string[];
  recurringCostsNote: string;
  isAvailableForSelection: boolean;
  commercialNotes?: string;
}

export interface ModuleBundle {
  id: string;
  name: string;
  badge?: string;
  moduleIds: string[];
  description: string;
  referencePrice: number;
  isStartingPrice?: boolean;
  discountAmount?: number;
  finalPrice?: number;
  highlight?: boolean;
}

export interface RecurringCostItem {
  id: string;
  category: string;
  title: string;
  estimatedValueText: string;
  description: string;
  status: "included" | "third_party" | "optional_future" | "on_demand";
}

export interface ExecutionStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface CommercialProposal {
  id: string;
  slug: string;
  status: ProposalStatus;
  clientName: string;
  companyName: string;
  projectTitle: string;
  projectSubtitle?: string;
  author: "EPM DevTech";
  authorRole: string;
  authorContact: {
    name: string;
    email: string;
    phone?: string;
    whatsappNumber?: string;
  };
  issueDate?: string;
  validUntil?: string;
  estimatedTimeline?: string;
  isModularPortfolio?: boolean;
  modulesCatalog?: ProposalModule[];
  bundles?: ModuleBundle[];
  recurringCosts?: RecurringCostItem[];
  executionSteps?: ExecutionStep[];
  diagnosisAndOpportunity?: {
    title: string;
    description: string;
    objectives: string[];
  };
  solutionOverview: {
    title: string;
    description: string;
    highlights: string[];
  };
  scopeIncluded: CommercialItem[];
  scopeExcluded: CommercialItem[];
  investment: ProposalInvestment;
  paymentConditions: PaymentCondition[];
  developmentPhases: ProjectPhase[];
  responsibilities: {
    epmDevTech: string[];
    client: string[];
  };
  faq: FaqItem[];
  nextStepsBriefing: {
    title: string;
    description: string;
    steps: string[];
  };
  enabledSections?: {
    diagnosis?: boolean;
    solution?: boolean;
    modulesCatalog?: boolean;
    comparisonMatrix?: boolean;
    bundles?: boolean;
    recurringCosts?: boolean;
    scope?: boolean;
    investment?: boolean;
    conditions?: boolean;
    timeline?: boolean;
    responsibilities?: boolean;
    faq?: boolean;
    cta?: boolean;
  };
}

/**
 * Formata um valor numérico em Real Brasileiro (BRL) segundo as convenções oficiais (R$ X.XXX,XX).
 */
export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Palavras-chave proibidas que denotam placeholders ou contaminação de outros segmentos.
 */
const FORBIDDEN_PLACEHOLDER_PATTERNS = [
  /\[nome/i,
  /\[cliente/i,
  /\[valor/i,
  /\bTODO\b/,
  /\bTBD\b/,
  /\bPLACEHOLDER\b/i,
  /odontolog/i,
  /odonto/i,
  /dentista/i,
  /sorriso/i,
  /implante/i,
  /consultório odontológico/i,
];

/**
 * Valida a completude e consistência comercial de uma proposta antes de permitir envio ou exibição.
 */
export function validateProposalCompleteness(proposal: CommercialProposal): {
  isValid: boolean;
  missingFields: string[];
  errors: string[];
} {
  const missingFields: string[] = [];
  const errors: string[] = [];

  if (!proposal.slug || !/^[a-z0-9-]+$/.test(proposal.slug)) {
    missingFields.push("slug (deve conter apenas letras minúsculas, números e hífens)");
  }

  if (!proposal.clientName || !proposal.clientName.trim()) {
    missingFields.push("clientName");
  }

  if (!proposal.companyName || !proposal.companyName.trim()) {
    missingFields.push("companyName");
  }

  if (!proposal.projectTitle || !proposal.projectTitle.trim()) {
    missingFields.push("projectTitle");
  }

  if (!proposal.investment) {
    missingFields.push("investment");
  } else {
    if (typeof proposal.investment.totalValue !== "number" || proposal.investment.totalValue <= 0) {
      errors.push("O valor total do investimento deve ser um número maior que zero.");
    }

    if (proposal.investment.hasRecurringMonthly) {
      if (
        typeof proposal.investment.recurringMonthlyValue !== "number" ||
        proposal.investment.recurringMonthlyValue <= 0
      ) {
        errors.push(
          "Propostas com mensalidade devem definir um valor recorrente válido maior que zero.",
        );
      }
    } else {
      if (!proposal.investment.recurringDescription?.trim()) {
        missingFields.push(
          "investment.recurringDescription (explicitação de ausência de mensalidade)",
        );
      }
    }
  }

  if (!proposal.scopeIncluded || proposal.scopeIncluded.length === 0) {
    missingFields.push("scopeIncluded (mínimo de 1 entregável)");
  }

  if (!proposal.paymentConditions || proposal.paymentConditions.length === 0) {
    missingFields.push("paymentConditions");
  }

  if (!proposal.developmentPhases || proposal.developmentPhases.length === 0) {
    missingFields.push("developmentPhases");
  }

  // Verificação contra placeholders ou termos de outros domínios
  const jsonString = JSON.stringify(proposal);
  for (const pattern of FORBIDDEN_PLACEHOLDER_PATTERNS) {
    if (pattern.test(jsonString)) {
      errors.push(
        `A proposta contém placeholders ou termos não permitidos correspondentes ao padrão: ${pattern}`,
      );
      break;
    }
  }

  return {
    isValid: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors,
  };
}

/**
 * Constrói a mensagem padronizada de manifestação de interesse para envio honesto ao canal da EPM DevTech.
 */
export function generateAcceptanceMessage(
  proposal: CommercialProposal,
  clientContact?: { name?: string; notes?: string },
): string {
  const senderName = clientContact?.name?.trim() || proposal.clientName;
  const lines = [
    `Olá, equipe EPM DevTech!`,
    ``,
    `Tenho interesse na proposta comercial "${proposal.projectTitle}" elaborada para ${proposal.companyName}.`,
    `Ref. Proposta: ${proposal.slug}`,
    `Contato: ${senderName}`,
  ];

  if (clientContact?.notes?.trim()) {
    lines.push(`Observações: ${clientContact.notes.trim()}`);
  }

  lines.push(``);
  lines.push(
    `Gostaria de agendar o alinhamento de escopo e dar início à etapa de briefing do projeto.`,
  );

  return lines.join("\n");
}

/**
 * Calcula o total do investimento a partir dos módulos selecionados pelo cliente.
 */
export function calculateSelectedModulesTotal(
  selectedIds: string[],
  modules: ProposalModule[],
): {
  totalValue: number;
  hasVariableStartingPrice: boolean;
  selectedModules: ProposalModule[];
} {
  const selectedModules = modules.filter((mod) => selectedIds.includes(mod.id));
  const totalValue = selectedModules.reduce((sum, mod) => sum + mod.price, 0);
  const hasVariableStartingPrice = selectedModules.some((mod) => mod.isStartingPrice);

  return {
    totalValue,
    hasVariableStartingPrice,
    selectedModules,
  };
}

/**
 * Constrói a mensagem estruturada de interesse com base nos módulos selecionados.
 */
export function generateModularAcceptanceMessage(
  proposal: CommercialProposal,
  selectedModuleIds: string[],
  clientContact?: { name?: string; notes?: string },
): string {
  const catalog = proposal.modulesCatalog || [];
  const { totalValue, hasVariableStartingPrice, selectedModules } = calculateSelectedModulesTotal(
    selectedModuleIds,
    catalog,
  );
  const senderName = clientContact?.name?.trim() || proposal.clientName;

  const lines = [
    `Olá, equipe EPM DevTech!`,
    ``,
    `Tenho interesse na proposta comercial modular elaborada para ${proposal.companyName}.`,
    `Ref. Proposta: ${proposal.slug}`,
    `Contato: ${senderName}`,
    ``,
    `Módulos Selecionados para Alinhamento:`,
  ];

  if (selectedModules.length > 0) {
    selectedModules.forEach((mod) => {
      lines.push(
        `- ${mod.name} (${mod.category}): ${mod.isStartingPrice ? "A partir de " : ""}${formatCurrencyBRL(mod.price)}`,
      );
    });
    lines.push(``);
    lines.push(
      `Investimento Estimado de Implantação: ${hasVariableStartingPrice ? "A partir de " : ""}${formatCurrencyBRL(totalValue)}`,
    );
  } else {
    lines.push(`- (Nenhum módulo selecionado no momento — aberto para recomendação técnica)`);
  }

  if (clientContact?.notes?.trim()) {
    lines.push(``);
    lines.push(`Observações ou Dúvidas: ${clientContact.notes.trim()}`);
  }

  lines.push(``);
  lines.push(
    `Gostaria de agendar a reunião de alinhamento com a EPM DevTech para avançarmos ao briefing comercial.`,
  );

  return lines.join("\n");
}

/**
 * Repositório Canônico de Propostas Comerciais EPM DevTech
 */
export const commercialProposals: Record<string, CommercialProposal> = {
  "brs-digital-presence": {
    id: "prop-epm-brs-01",
    slug: "brs-digital-presence",
    status: "ready",
    clientName: "Direção & Proprietário BRS",
    companyName: "BRS Reparações Automotivas",
    projectTitle: "Presença Digital Institucional & Captação Automotiva de Alta Fidelidade",
    projectSubtitle:
      "Uma presença digital sob medida para valorizar a excelência técnica em Funilaria, Pintura e Martelinho de Ouro em Toledo-PR.",
    author: "EPM DevTech",
    authorRole: "Engenharia de Software & Estratégia Digital",
    authorContact: {
      name: "Engenharia & Comercial EPM DevTech",
      email: "contato@epmdevtech.com.br",
      phone: "(45) 99999-0000",
      whatsappNumber: "5545999990000",
    },
    issueDate: "13/10/2026",
    validUntil: "28/10/2026",
    estimatedTimeline: "15 a 20 dias úteis a partir da conclusão do briefing",
    diagnosisAndOpportunity: {
      title: "Diagnóstico & Objetivos de Posicionamento",
      description:
        "A BRS Reparações Automotivas oferece serviços artesanais e tecnológicos de alto padrão em Toledo-PR, mas precisa que sua presença digital transmita a mesma autoridade e precisão observadas na oficina física.",
      objectives: [
        "Apresentação profissional das 3 áreas de especialidade (Funilaria, Pintura em Estufa e Martelinho de Ouro PDR).",
        "Demonstração técnica de restaurações com comparadores visuais Antes e Depois autênticos.",
        "Canal dedicado de atendimento e parcerias para Corretores de Seguros e gestão de sinistros.",
        "Facilitação do fluxo de contato e solicitação de avaliação veicular em smartphones.",
        "Estrutura técnica otimizada para SEO local em Toledo e indexação por inteligências artificiais.",
      ],
    },
    solutionOverview: {
      title: "Solução Proposta",
      description:
        "Desenvolvimento de uma plataforma web institucional contemporânea, rápida e acessível, alinhada à identidade visual automotiva escura e dourada da BRS, construída sobre arquitetura moderna em React 19 e TanStack Start.",
      highlights: [
        "Arquitetura moderna SPA multipágina com SSR híbrido e navegação client-side instantânea.",
        "Design editorial premium (Sora e Manrope) com estética Anti-Card Slop e acabamento de luxo.",
        "Mecanismo de contato honesto que pré-formata a mensagem para envio direto pelo cliente.",
        "Acessibilidade completa WCAG AA com foco visível e respeito a preferências de movimento.",
        "Preparado para receber fotografias reais das instalações e homologação de WhatsApp oficial.",
      ],
    },
    scopeIncluded: [
      {
        id: "esc-1",
        title: "Website Institucional Multipágina & Arquitetura de Rotas",
        description:
          "Website completo em TanStack Router com rotas dedicadas para Início (/), Serviços (/servicos), Funilaria (/servicos/funilaria), Pintura (/servicos/pintura-automotiva) e Martelinho de Ouro (/servicos/martelinho-de-ouro).",
        included: true,
        category: "Frontend & Experiência",
      },
      {
        id: "esc-2",
        title: "Página Exclusiva para Corretores de Seguros",
        description:
          "Seção e rota específica (/para-corretores) estruturada para estabelecer credibilidade e parcerias com corretores de sinistros em Toledo e região.",
        included: true,
        category: "Frontend & Experiência",
      },
      {
        id: "esc-3",
        title: "Comparador Interativo Antes & Depois",
        description:
          "Componente interativo com controle deslizante para evidenciar o acabamento técnico de restaurações reais sem distorções visuais.",
        included: true,
        category: "Frontend & Experiência",
      },
      {
        id: "esc-4",
        title: "Fluxo Honesto de Contato e Avaliação",
        description:
          "Formulário estruturado que valida os dados e prepara a mensagem formatada para cópia e envio direto aos canais oficiais confirmados.",
        included: true,
        category: "Frontend & Experiência",
      },
      {
        id: "esc-5",
        title: "SEO Técnico Local & Dados Estruturados Schema.org",
        description:
          "Configuração canônica de metadados, OpenGraph, sitemap.xml, robots.txt, schema AutoBodyShop e documentação llms.txt para motores de IA.",
        included: true,
        category: "Infraestrutura & SEO",
      },
      {
        id: "esc-6",
        title: "Containerização Docker & Automação de Qualidade",
        description:
          "Ambiente conteinerizado reproduzível com Dockerfile multi-stage, esteira de testes automatizados e Makefile para operações simplificadas.",
        included: true,
        category: "Infraestrutura & SEO",
      },
      {
        id: "esc-7",
        title: "Treinamento & Homologação Guiada",
        description:
          "Acompanhamento da equipe da BRS durante a validação em ambiente de staging e entrega das instruções operacionais.",
        included: true,
        category: "Gestão & Adicionais",
      },
    ],
    scopeExcluded: [
      {
        id: "esc-exc-1",
        title: "Sessão Fotográfica Presencial e Vídeos de Drone",
        description:
          "As fotos reais das instalações da oficina devem ser fornecidas pelo cliente ou contratadas à parte com profissional local de Toledo.",
        included: false,
        category: "Conteúdo & Mídia",
      },
      {
        id: "esc-exc-2",
        title: "Gestão de Tráfego Pago e Campanhas de Anúncios",
        description:
          "Gestão contínua de Google Ads ou Meta Ads não está contemplada no valor de implantação, podendo ser orçada em contrato separado de marketing.",
        included: false,
        category: "Gestão & Adicionais",
      },
      {
        id: "esc-exc-3",
        title: "Sistemas Legados de Oficina / Emissão de NF-e",
        description:
          "Integrações de ERP automotivo ou controle de estoque interno não fazem parte do escopo institucional desta proposta.",
        included: false,
        category: "Gestão & Adicionais",
      },
      {
        id: "esc-exc-4",
        title: "Criação de Nova Identidade Visual / Logotipo",
        description:
          "O projeto aplica a marca BRS existente; redesenho ou branding completo não faz parte deste escopo.",
        included: false,
        category: "Conteúdo & Mídia",
      },
    ],
    investment: {
      totalValue: 3800.0,
      entryValue: 1900.0,
      balanceValue: 1900.0,
      balanceMoment: "50% após a aprovação final na homologação e antes da publicação oficial",
      installmentsDescription:
        "Condição padrão: 50% de entrada no aceite e 50% na publicação. Opção em até 3x sem acréscimo no cartão de crédito corporativo ou 5% de desconto para liquidação integral via PIX no início.",
      hasRecurringMonthly: false,
      recurringMonthlyValue: 0,
      recurringDescription:
        "Sem mensalidade obrigatória ou cobrança recorrente fixa. A BRS torna-se proprietária integral do projeto desenvolvido. Suportes adicionais e novas funcionalidades são combinados sob demanda.",
      thirdPartyCosts:
        "Custos diretos de terceiros: Registro do domínio (.com.br junto ao Registro.br por ~R$ 40/ano) e hospedagem cloud gerenciada (~R$ 0 a R$ 30/mês conforme tráfego) ficam sob titularidade direta da BRS.",
    },
    paymentConditions: [
      {
        title: "Entrada e Início",
        description:
          "50% do valor total (R$ 1.900,00) pago após a realização do alinhamento inicial e assinatura do contrato de prestação de serviços.",
        highlight: true,
      },
      {
        title: "Saldo Final na Homologação",
        description:
          "50% restante (R$ 1.900,00) pago após a validação completa do site pelo cliente em ambiente de homologação, antes do apontamento do domínio oficial.",
      },
      {
        title: "Formas de Pagamento Aceitas",
        description:
          "Transferência bancária via PIX, boleto bancário ou cartão de crédito corporativo em até 3 parcelas.",
      },
      {
        title: "Ressalva Jurídica",
        description:
          "Esta proposta resume os parâmetros técnicos e comerciais acordados. O desenvolvimento será formalizado através de Contrato de Prestação de Serviços Digitais, que prevalecerá para todos os efeitos legais.",
      },
    ],
    developmentPhases: [
      {
        step: 1,
        title: "Alinhamento & Briefing de Negócio",
        description:
          "Reunião de alinhamento com a EPM DevTech para coleta de informações essenciais, preferências de estilo e recebimento dos materiais da BRS.",
        estimatedDuration: "2 a 3 dias úteis",
      },
      {
        step: 2,
        title: "Direção Visual & Estrutura de Informação",
        description:
          "Organização do mapa de conteúdo, refinamento da arquitetura editorial e preparação do acervo fotográfico institucional.",
        estimatedDuration: "3 a 5 dias úteis",
      },
      {
        step: 3,
        title: "Desenvolvimento Frontend & Otimização",
        description:
          "Codificação das páginas, comparadores, testes automatizados, SEO técnico e adequação aos critérios WCAG AA de acessibilidade.",
        estimatedDuration: "6 a 8 dias úteis",
      },
      {
        step: 4,
        title: "Homologação & Validação pelo Cliente",
        description:
          "Disponibilização do site em ambiente de teste privado para navegação, testes e solicitação de ajustes previstos no escopo.",
        estimatedDuration: "3 a 4 dias úteis",
      },
      {
        step: 5,
        title: "Publicação Oficial & Entrega",
        description:
          "Apontamento de domínio, validação dos certificados SSL, submissão aos mecanismos de busca e entrega da documentação do projeto.",
        estimatedDuration: "1 a 2 dias úteis",
      },
    ],
    responsibilities: {
      epmDevTech: [
        "Execução completa do projeto conforme as especificações técnicas contratadas.",
        "Garantia de conformidade com os Quality Gates (testes, acessibilidade, linter e performance).",
        "Configuração de ambiente, certificados de segurança e deploy contínuo.",
        "Suporte técnico prioritário durante a etapa de homologação e 30 dias após a publicação.",
      ],
      client: [
        "Fornecimento das fotografias e logotipo da oficina em boa resolução.",
        "Validação e feedback nos prazos estipulados em cada marco de homologação.",
        "Disponibilização de acessos ao provedor de domínio (ex.: Registro.br) para apontamento de DNS.",
        "Definição e confirmação formal do número de WhatsApp caso venha a ser divulgado no site.",
      ],
    },
    faq: [
      {
        question: "O que está incluído no valor do investimento?",
        answer:
          "Está incluído todo o planejamento, design editorial, desenvolvimento das páginas, comparadores interativos, formulários, otimização de SEO, testes automatizados e acompanhamento na publicação.",
      },
      {
        question: "Existe alguma mensalidade obrigatória?",
        answer:
          "Não. A EPM DevTech entrega a plataforma concluída sem nenhuma taxa de manutenção mensal mandatória. A BRS só investe em manutenções ou novas funcionalidades caso solicite novas demandas pontuais no futuro.",
      },
      {
        question: "Como funciona a etapa de briefing?",
        answer:
          "Após a manifestação de interesse e formalização comercial, realizamos uma conversa orientada para coletar os dados reais da oficina, fotos e preferências. O cliente não precisa preencher questionários exaustivos sozinho.",
      },
      {
        question: "Quem fornece as fotos e textos do site?",
        answer:
          "A EPM DevTech estrutura toda a redação técnica editorial dos serviços. As fotos da oficina física devem ser fornecidas pela BRS. Enquanto as fotos definitivas não forem fornecidas, o site utiliza mídia de alta qualidade explicitamente identificada como ilustrativa.",
      },
      {
        question: "O que acontece ao clicar em 'Tenho interesse nesta proposta'?",
        answer:
          "O clique não realiza cobranças nem assina contrato. Ele apenas manifesta formalmente que a BRS tem interesse em avançar, abrindo o canal com a EPM DevTech para agendarmos o alinhamento inicial e o briefing.",
      },
    ],
    nextStepsBriefing: {
      title: "Próximos Passos Comerciais",
      description:
        "Como faremos a transição simples e transparente da proposta para o início da execução:",
      steps: [
        "Manifestação de interesse através do botão abaixo;",
        "Alinhamento dos termos contratuais e emissão do contrato de prestação de serviços;",
        "Agendamento da sessão de briefing guiada para recebimento dos dados da oficina;",
        "Início imediato do cronograma de desenvolvimento.",
      ],
    },
    enabledSections: {
      diagnosis: true,
      solution: true,
      scope: true,
      investment: true,
      conditions: true,
      timeline: true,
      responsibilities: true,
      faq: true,
      cta: true,
    },
  },
  "brs-reparacoes": {
    id: "prop-epm-brs-modular-02",
    slug: "brs-reparacoes",
    status: "ready",
    isModularPortfolio: true,
    clientName: "Direção & Equipe BRS",
    companyName: "BRS Reparações Automotivas",
    projectTitle: "Uma estrutura digital preparada para a próxima fase da BRS.",
    projectSubtitle:
      "Uma proposta de soluções digitais para fortalecer a presença online, organizar o atendimento e criar oportunidades de evolução para a operação da BRS Reparações Automotivas.",
    author: "EPM DevTech",
    authorRole: "Engenharia de Software & Arquitetura de Sistemas",
    authorContact: {
      name: "Engenharia & Comercial EPM DevTech",
      email: "contato@epmdevtech.com.br",
      phone: "(45) 99999-0000",
      whatsappNumber: "5545999990000",
    },
    issueDate: "13/10/2026",
    validUntil: "30/10/2026",
    estimatedTimeline:
      "Definido conforme o portfólio de módulos contratado (estimativa de 15 a 45 dias úteis)",
    diagnosisAndOpportunity: {
      title: "Diagnóstico & Oportunidades Potenciais do Setor",
      description:
        "Oportunidades estratégicas identificadas para o segmento de reparação e estética automotiva em Toledo e região, apresentadas como hipóteses de valor a validar durante a etapa de briefing comercial.",
      objectives: [
        "Facilitar o contato direto de clientes interessados em funilaria, pintura automotiva e martelinho de ouro.",
        "Apresentar os serviços especializados e trabalhos concluídos da oficina com fotografia e rigor técnico.",
        "Organizar solicitações de avaliação e triagem de agendamento em canal unificado.",
        "Melhorar o acompanhamento de contatos, orçamentos em aberto e relacionamento com corretores de seguros.",
        "Estruturar o acompanhamento transparente das etapas de reparo veicular na oficina.",
        "Obter indicadores comerciais e operacionais consolidados a partir dos dados gerados na operação.",
      ],
    },
    solutionOverview: {
      title: "Portfólio Modular de Software Sob Medida",
      description:
        "Cada solução digital foi concebida de forma independente e modular. A BRS tem total liberdade para iniciar pelo site institucional e acoplar novos módulos operacionais conforme sua demanda e momento de investimento.",
      highlights: [
        "Arquitetura modular independente: contrate apenas o que faz sentido agora.",
        "Transparência técnica: escopos, limitações e integrações explicitadas sem ambiguidades.",
        "Sem taxas surpresa: implantação com valor fechado e custos externos desvinculados.",
        "Identidade visual automotiva de alto padrão alinhada à estética da oficina em Toledo.",
      ],
    },
    modulesCatalog: [
      {
        id: "epm-web",
        name: "EPM Web",
        category: "Presença digital automotiva",
        price: 2490,
        isStartingPrice: false,
        summary:
          "Website institucional multipágina de alta performance com arquitetura de rotas dedicadas (TanStack Router) para o setor automotivo em Toledo-PR.",
        problemSolved:
          "Estabelece autoridade digital sólida, elimina impressões amadoras e apresenta os serviços especializados de forma técnica e transparente em URLs próprias.",
        deliverables: [
          "Website multipágina completo em TanStack Router com rotas independentes e navegação client-side instantânea.",
          "Rota principal (Início: /) com visão integrada, encaminhamento estratégico e componentes editoriais premium.",
          "Catálogo geral de serviços (/servicos) com visão integrada das especialidades técnicas.",
          "Rotas aprofundadas dedicadas para cada especialidade: Funilaria (/servicos/funilaria), Pintura em Estufa (/servicos/pintura-automotiva) e Martelinho de Ouro (/servicos/martelinho-de-ouro).",
          "Rota exclusiva para corretores de seguros (/para-corretores) estruturada para credenciamento e sinistros.",
          "Rota de galeria e portfólio de trabalhos concluídos (/trabalhos) com comparador interativo Antes/Depois.",
          "Rota institucional Sobre (/sobre) com história, diferenciais e posicionamento técnico da oficina.",
          "Rota dedicada de avaliação técnica e contato (/contato) com fluxo honesto de mensagem para canal oficial.",
          "Rota de políticas de privacidade e termos (/privacidade).",
          "SEO técnico avançado por rota: meta tags canônicas únicas, sitemap.xml estruturado e Schema.org AutoBodyShop.",
          "Acessibilidade completa WCAG AA e otimização responsiva para celulares, tablets e computadores.",
        ],
        exclusions: [
          "Agendamento com painel próprio interativo.",
          "CRM e funil comercial de contatos.",
          "Ordens de serviço e checklists operacionais.",
          "Área administrativa de cadastro dinâmico.",
          "Integração com ERP automotivo de oficina.",
          "Produção profissional presencial de fotos ou filmagens com drone.",
          "Gestão recorrente de redes sociais e publicações.",
          "Campanhas de tráfego pago (Google Ads / Meta Ads).",
        ],
        dependencies: [
          "Fornecimento de fotos reais das instalações ou uso autorizado de acervo ilustrativo.",
          "Definição dos canais oficiais confirmados de atendimento da oficina.",
        ],
        recurringCostsNote:
          "Hospedagem básica e domínio (.com.br) contratados sob titularidade da BRS.",
        isAvailableForSelection: true,
        commercialNotes: "Produto de entrada; não inclui módulos de gestão ou agendamento.",
      },
      {
        id: "epm-booking",
        name: "EPM Booking Auto",
        category: "Solicitações de avaliação e agendamento",
        price: 3990,
        isStartingPrice: false,
        summary:
          "Formulário estruturado de pré-agendamento e painel administrativo de triagem de solicitações.",
        problemSolved:
          "Organiza pedidos de orçamento e avaliação de sinistros, evitando contatos dispersos e perda de horários na oficina.",
        deliverables: [
          "Formulário estruturado para solicitação de avaliação e agendamento de serviços.",
          "Captura de dados de contato e informações essenciais do veículo (marca, modelo, placa/ano).",
          "Seleção guiada da especialidade desejada (Funilaria, Pintura, Martelinho ou Avaliação Geral).",
          "Seleção de data preferencial com base em regras e disponibilidade configuradas.",
          "Painel administrativo para visualizar, filtrar e atualizar o status das solicitações.",
          "Máquina de estados operacional: Recebido, Em Análise, Confirmado, Concluído e Cancelado.",
          "Registro cronológico com carimbo de data/hora e dados técnicos informados.",
          "Interface responsiva para operação em computadores, tablets da oficina e celulares.",
        ],
        exclusions: [
          "Confirmação em tempo real com agenda física sem integração homologada.",
          "Sincronização com Google Calendar ou agendas externas sem desenvolvimento sob medida.",
          "Pagamentos online ou antecipação financeira de orçamentos.",
          "Lembretes automáticos via SMS ou WhatsApp sem o módulo EPM Connect.",
        ],
        dependencies: [
          "EPM Web ou aplicação web homologada para hospedagem do fluxo.",
          "Definição das regras de horário e dias de atendimento pela equipe da BRS.",
        ],
        recurringCostsNote: "Consumo padrão de infraestrutura de banco de dados e hospedagem.",
        isAvailableForSelection: true,
        commercialNotes:
          "Diferencia estritamente solicitação de agendamento de reserva confirmada, preservando a autonomia da oficina.",
      },
      {
        id: "epm-crm",
        name: "EPM CRM Auto",
        category: "Gestão comercial e relacionamento",
        price: 4990,
        isStartingPrice: false,
        summary:
          "Funil comercial especializado para oficina automotiva, gestão de leads, orçamentos e histórico.",
        problemSolved:
          "Elimina orçamentos esquecidos no WhatsApp e falta de acompanhamento de clientes que cotaram e não fecharam.",
        deliverables: [
          "Cadastro centralizado de clientes (particulares e corretores parceiros).",
          "Cadastro e vinculação de histórico de veículos aos proprietários.",
          "Registro da origem de captação do contato (Instagram, indicação, balcão, site).",
          "Funil comercial configurável em 7 etapas: Novo Contato, Qualificação, Avaliação, Orçamento, Negociação, Fechado e Perdido.",
          "Registro de linha do tempo com histórico de notas, ligações e interações.",
          "Gestão de tarefas internas e lembretes de retorno para follow-up de orçamentos.",
          "Pesquisa rápida por nome, telefone, placa e filtros por etapa comercial.",
        ],
        exclusions: [
          "ERP administrativo completo, compras ou fornecedores.",
          "Emissão fiscal de NF-e / NFS-e.",
          "Disparos automatizados em massa de mensagens de marketing.",
          "Integrações nativas automáticas com sistemas de seguradoras (ex.: Cilia, Audatex).",
          "Importação irrestrita ou saneamento de planilhas desorganizadas legadas.",
          "Licenças pagas de softwares de terceiros.",
        ],
        dependencies: ["Definição do fluxo de atendimento e etapas comerciais padrão da BRS."],
        recurringCostsNote: "Infraestrutura de banco de dados seguro na nuvem.",
        isAvailableForSelection: true,
        commercialNotes:
          "Focado estritamente na conversão de novos orçamentos e relacionamento com corretores de seguros.",
      },
      {
        id: "epm-oficina",
        name: "EPM Oficina",
        category: "Gestão de ordens de serviço",
        price: 7490,
        isStartingPrice: false,
        summary:
          "Gestão operacional de ordens de serviço com checklist de entrada e registro de fotos do veículo.",
        problemSolved:
          "Previne contestações de avarias pré-existentes e padroniza as fases de funilaria, preparação, pintura e polimento.",
        deliverables: [
          "Abertura digital de Ordem de Serviço (OS) com numeração sequencial.",
          "Vinculação direta do cliente, dados do veículo e corretor parceiro.",
          "Discriminação técnica dos serviços contratados e peças a reparar.",
          "Checklist digital de entrada veicular (combustível, avarias externas, pertences).",
          "Upload e arquivamento de fotografias do estado de entrada do veículo (conforme limites de armazenamento).",
          "Controle do status de execução (Recebido, Funilaria, Pintura, Martelinho, Montagem, Polimento, Pronto para Entrega).",
          "Histórico cronológico de movimentações e observações internas da oficina.",
          "Painel de consulta rápida de ordens em andamento e histórico de finalizadas.",
        ],
        exclusions: [
          "Controle avançado de estoque, almoxarifado de tintas ou compras.",
          "Folha de pagamento de mecânicos e comissões.",
          "Contabilidade e fechamento fiscal.",
          "Emissão de nota fiscal ou integração tributária.",
          "ERP financeiro completo.",
          "Aplicativo nativo compilado para Android/iOS (opera via Web App responsivo).",
        ],
        dependencies: [
          "Infraestrutura de armazenamento de arquivos em nuvem (S3/R2 ou equivalente).",
          "Aparelho smartphone ou tablet da oficina com câmera e navegador web.",
        ],
        recurringCostsNote: "Armazenamento de imagens e banco de dados conforme volume de ordens.",
        isAvailableForSelection: true,
        commercialNotes:
          "Atende a um fluxo operacional bem delimitado e não deve ser confundido com ERP contábil/financeiro.",
      },
      {
        id: "epm-connect",
        name: "EPM Connect",
        category: "Notificações e integrações",
        price: 1990,
        isStartingPrice: true,
        summary:
          "Automação de notificações para clientes via WhatsApp ou e-mail sobre etapas de avaliação e reparo.",
        problemSolved:
          "Reduz ligações repetitivas de clientes perguntando se o carro está pronto, mantendo o proprietário informado.",
        deliverables: [
          "Configuração de 1 fluxo principal de notificação homologado.",
          "Elaboração e validação de modelos de mensagem padronizados.",
          "Notificações automáticas de recebimento de solicitação ou mudança de status da OS.",
          "Mecanismo de tratamento básico de falhas e logs de envio quando suportado pelo provedor.",
          "Documentação técnica da integração e parâmetros operacionais.",
        ],
        exclusions: [
          "Taxas e tarifas cobradas por mensagem pelos provedores oficiais (Meta/Twilio/Z-API).",
          "Garantia de entrega em aparelhos sem conexão ou números incorretos.",
          "Chatbot de inteligência artificial de conversação aberta complexa.",
          "Atendimento humano terceirizado.",
          "Fluxos adicionais ou integrações extras (orçadas sob demanda).",
        ],
        dependencies: [
          "Módulo EPM Booking Auto ou EPM Oficina contratado para fornecimento dos gatilhos.",
          "Contratação e aprovação de conta em provedor de mensageria selecionado.",
          "Número de WhatsApp oficial validado e aprovado pela BRS.",
        ],
        recurringCostsNote:
          "Tarifas de consumo de mensagens cobradas diretamente pelo provedor de API.",
        isAvailableForSelection: true,
        commercialNotes:
          "Preço de referência inicial para 1 fluxo; integrações adicionais exigem dimensionamento prévio.",
      },
      {
        id: "epm-insights",
        name: "EPM Insights",
        category: "Indicadores comerciais e operacionais",
        price: 2490,
        isStartingPrice: false,
        summary:
          "Painel executivo de indicadores de demanda, taxas de conversão e volume de serviços da oficina.",
        problemSolved:
          "Permite ao proprietário tomar decisões baseadas em números reais sobre quais serviços trazem mais retorno.",
        deliverables: [
          "Painel gerencial de indicadores alimentado pelos módulos contratados.",
          "Métricas de volume de solicitações por período (dia, semana, mês).",
          "Distribuição de demanda por etapa do funil comercial.",
          "Taxa de conversão de avaliações em serviços fechados (quando CRM contratado).",
          "Distribuição de ordens de serviço por status de execução (quando Oficina contratado).",
          "Filtros por período e visualização gráfica de tendências.",
        ],
        exclusions: [
          "Licenças pagas de softwares externos de BI (PowerBI, Tableau).",
          "Algoritmos preditivos de IA generativa.",
          "Métricas dependentes de fontes financeiras ou ERPs legados não integrados.",
          "Migração e saneamento de históricos antigos em papel/planilhas.",
        ],
        dependencies: [
          "Ao menos 1 módulo operacional contratado (EPM Booking Auto, EPM CRM Auto ou EPM Oficina).",
          "Alimentação contínua dos dados pela equipe da BRS.",
        ],
        recurringCostsNote:
          "Sem custo adicional de terceiros (roda sobre a infraestrutura da plataforma).",
        isAvailableForSelection: true,
        commercialNotes:
          "O módulo depende da existência e qualidade dos dados gerados no dia a dia da oficina.",
      },
    ],
    bundles: [
      {
        id: "presenca-digital",
        name: "Alternativa 1 — Presença Digital Multipágina",
        badge: "Entrada Essencial",
        moduleIds: ["epm-web"],
        description:
          "Website institucional multipágina completo com rotas dedicadas para posicionar a BRS com autoridade na internet e atrair novos contatos qualificados.",
        referencePrice: 2490,
        isStartingPrice: false,
        highlight: false,
      },
      {
        id: "captacao-agendamento",
        name: "Alternativa 2 — Captação e Agendamento",
        badge: "Recomendado para Captação",
        moduleIds: ["epm-web", "epm-booking"],
        description:
          "Website multipágina completo integrado ao formulário estruturado de pré-agendamento e triagem de solicitações de avaliação.",
        referencePrice: 6480,
        isStartingPrice: false,
        highlight: false,
      },
      {
        id: "gestao-comercial",
        name: "Alternativa 3 — Gestão Comercial",
        badge: "Foco em Conversão",
        moduleIds: ["epm-web", "epm-crm"],
        description:
          "Website multipágina completo conectado ao funil comercial para acompanhamento rigoroso de orçamentos e corretores de seguros parceiros.",
        referencePrice: 7480,
        isStartingPrice: false,
        highlight: false,
      },
      {
        id: "operacao-digital",
        name: "Alternativa 4 — Operação Digital",
        badge: "Operação Completa",
        moduleIds: ["epm-web", "epm-booking", "epm-crm", "epm-oficina"],
        description:
          "Fluxo completo do website multipágina ao pátio da oficina, com checklist de fotos de entrada e ordens de serviço digitais.",
        referencePrice: 18960,
        isStartingPrice: false,
        highlight: true,
      },
      {
        id: "ecossistema-expandido",
        name: "Alternativa 5 — Ecossistema Expandido",
        badge: "Ecossistema Integrado",
        moduleIds: [
          "epm-web",
          "epm-booking",
          "epm-crm",
          "epm-oficina",
          "epm-connect",
          "epm-insights",
        ],
        description:
          "Ecossistema completo: website multipágina com rotas dedicadas, agendamento, CRM, gestão de pátio, notificações automáticas e painel gerencial.",
        referencePrice: 23440,
        isStartingPrice: true,
        highlight: false,
      },
    ],
    recurringCosts: [
      {
        id: "rec-dominio",
        category: "Identidade & Endereçamento",
        title: "Registro de Domínio Oficial (.com.br)",
        estimatedValueText: "~ R$ 40,00 / ano",
        description:
          "Contratado e registrado diretamente no Registro.br sob a titularidade e CNPJ da BRS Reparações Automotivas.",
        status: "third_party",
      },
      {
        id: "rec-hospedagem",
        category: "Infraestrutura Cloud",
        title: "Hospedagem & CDN de Alta Performance",
        estimatedValueText: "R$ 0 a R$ 35,00 / mês",
        description:
          "Infraestrutura moderna em nuvem com certificado de segurança SSL automático e redundância global.",
        status: "third_party",
      },
      {
        id: "rec-storage",
        category: "Armazenamento",
        title: "Armazenamento de Fotos de OS (se Oficina contratada)",
        estimatedValueText: "A definir conforme volume",
        description:
          "Repositório seguro para guarda de fotos de entrada e vistorias dos veículos, tarifado por gigabyte utilizado.",
        status: "third_party",
      },
      {
        id: "rec-whatsapp",
        category: "Mensageria Oficial",
        title: "Provedor de WhatsApp / Mensagens (se Connect contratado)",
        estimatedValueText: "Conforme consumo de mensagens",
        description:
          "Tarifas diretas do provedor homologado (Meta Business / BSP) para envio de notificações aos clientes.",
        status: "third_party",
      },
      {
        id: "rec-suporte",
        category: "Sustentação",
        title: "Manutenção Preventiva & Suporte Contínuo",
        estimatedValueText: "A definir conforme infraestrutura e escopo",
        description:
          "Sem mensalidade mandatória. Suporte e evoluções podem ser combinados sob demanda ou em pacote opcional aprovado.",
        status: "on_demand",
      },
    ],
    executionSteps: [
      {
        step: 1,
        title: "Apresentação da Proposta",
        description:
          "Apresentação consultiva do portfólio modular pela EPM DevTech para avaliação da direção da BRS.",
        duration: "Etapa Concluída",
      },
      {
        step: 2,
        title: "Manifestação de Interesse",
        description:
          "A BRS seleciona os módulos prioritários e compartilha sua intenção de avançar para a fase técnica.",
        duration: "Iniciativa do Cliente",
      },
      {
        step: 3,
        title: "Reunião de Alinhamento",
        description:
          "Alinhamento comercial e técnico entre as lideranças para definir prioridades e expectativas operacionais.",
        duration: "1 dia útil",
      },
      {
        step: 4,
        title: "Briefing Funcional Orientado",
        description:
          "Coleta estruturada de regras da oficina, horários, fotos reais e definição das preferências visuais.",
        duration: "2 a 3 dias úteis",
      },
      {
        step: 5,
        title: "Definição de Escopo & Contrato",
        description:
          "Formalização do escopo técnico exato dos módulos escolhidos e emissão do Contrato de Prestação de Serviços.",
        duration: "2 dias úteis",
      },
      {
        step: 6,
        title: "Aprovação do Orçamento Definitivo",
        description:
          "Assinatura contratual e liberação da ordem de desenvolvimento com base nas condições acordadas.",
        duration: "Marco Formal",
      },
      {
        step: 7,
        title: "Desenvolvimento & Engenharia",
        description:
          "Codificação com arquitetura moderna, design editorial automotivo, testes e acessibilidade.",
        duration: "10 a 25 dias úteis",
      },
      {
        step: 8,
        title: "Validação & Homologação",
        description:
          "Apresentação da plataforma em ambiente de staging para testes práticos e aprovação pela equipe da BRS.",
        duration: "3 a 5 dias úteis",
      },
      {
        step: 9,
        title: "Publicação Oficial & Entrega",
        description:
          "Apontamento de domínio, emissão de SSL, entrega de credenciais e documentação operacional de uso.",
        duration: "1 a 2 dias úteis",
      },
    ],
    scopeIncluded: [
      {
        id: "mod-esc-1",
        title: "Website Multipágina com Arquitetura de Rotas Especializadas",
        description:
          "Plataforma digital completa em TanStack Router com rotas independentes (/servicos, /trabalhos, /para-corretores, /sobre, /contato) sob medida para a BRS.",
        included: true,
        category: "Frontend & Experiência",
      },
      {
        id: "mod-esc-2",
        title: "Arquitetura Editorial e Design System Exclusivo BRS",
        description:
          "Identidade visual automotiva escura e dourada, tipografia Sora/Manrope e conformidade Anti-Card Slop.",
        included: true,
        category: "Frontend & Experiência",
      },
      {
        id: "mod-esc-3",
        title: "Código-Fonte Proprietário e Licenciamento Claro",
        description:
          "A BRS torna-se detentora do projeto desenvolvido sem aprisionamento a mensalidades compulsórias.",
        included: true,
        category: "Infraestrutura & SEO",
      },
    ],
    scopeExcluded: [
      {
        id: "mod-exc-1",
        title: "Módulos Não Selecionados na Proposta",
        description:
          "Sistemas complementares (ex.: Oficina, CRM, Connect) só serão desenvolvidos se expressamente contratados.",
        included: false,
        category: "Gestão & Adicionais",
      },
      {
        id: "mod-exc-2",
        title: "Tarifas de Terceiros e Mensageria",
        description:
          "Custos de consumo de APIs oficiais e provedores de infraestrutura ficam sob contratação da oficina.",
        included: false,
        category: "Infraestrutura & SEO",
      },
    ],
    investment: {
      totalValue: 2490,
      entryValue: 1245,
      balanceValue: 1245,
      balanceMoment: "50% após homologação final e antes da publicação oficial",
      installmentsDescription:
        "Condição padrão: 50% de entrada no aceite e 50% na homologação. Opção em até 3x sem acréscimo no cartão corporativo ou 5% de desconto para liquidação integral via PIX no início.",
      hasRecurringMonthly: false,
      recurringMonthlyValue: 0,
      recurringDescription:
        "Sem mensalidade obrigatória na implantação. Despesas de infraestrutura e serviços externos são discriminadas de forma independente.",
      thirdPartyCosts:
        "Custos diretos de terceiros sob responsabilidade da BRS (domínio, hospedagem e consumo de mensageria).",
    },
    paymentConditions: [
      {
        title: "Entrada e Início",
        description:
          "50% do valor total dos módulos contratados pago após a reunião de alinhamento e assinatura do contrato.",
        highlight: true,
      },
      {
        title: "Saldo Final na Homologação",
        description:
          "50% restante pago após a validação completa pela BRS em ambiente de testes, antes do apontamento do domínio oficial.",
      },
      {
        title: "Formas de Pagamento",
        description:
          "PIX (com 5% de desconto à vista), boleto bancário ou cartão de crédito corporativo em até 3 parcelas sem acréscimo.",
      },
      {
        title: "Ressalva Jurídica",
        description:
          "Esta proposta resume os parâmetros técnicos e orçamentos sugeridos. O desenvolvimento será formalizado através de Contrato de Prestação de Serviços Digitais, que prevalecerá para todos os efeitos legais.",
      },
    ],
    developmentPhases: [
      {
        step: 1,
        title: "Alinhamento & Briefing Funcional",
        description:
          "Mapeamento detalhado dos processos e insumos dos módulos selecionados com a equipe da oficina.",
        estimatedDuration: "3 a 5 dias úteis",
      },
      {
        step: 2,
        title: "Engenharia & Desenvolvimento",
        description:
          "Codificação das soluções contratadas, integrações de formulários e testes de qualidade.",
        estimatedDuration: "10 a 25 dias úteis",
      },
      {
        step: 3,
        title: "Homologação & Validação",
        description:
          "Período de testes assistidos pela BRS em ambiente de homologação para validação de fluxos.",
        estimatedDuration: "3 a 5 dias úteis",
      },
      {
        step: 4,
        title: "Publicação & Entrega Técnica",
        description:
          "Apontamento de domínio, emissão de certificados e entrega da documentação operacional.",
        estimatedDuration: "1 a 2 dias úteis",
      },
    ],
    responsibilities: {
      epmDevTech: [
        "Desenvolvimento e entrega fiel dos módulos expressamente contratados no escopo.",
        "Garantia de conformidade técnica com acessibilidade WCAG AA, segurança e performance.",
        "Apoio técnico na configuração inicial do domínio e ambiente de hospedagem.",
        "Suporte técnico prioritário durante o período de homologação e 30 dias após a publicação.",
      ],
      client: [
        "Fornecimento das regras operacionais, horários de atendimento e fotos reais da oficina.",
        "Feedback e validação das entregas dentro dos prazos estipulados nos marcos do projeto.",
        "Contratação e fornecimento dos acessos ao domínio oficial (.com.br) e provedores.",
        "Definição formal dos colaboradores responsáveis pela operação dos sistemas.",
      ],
    },
    faq: [
      {
        question: "Posso contratar somente o website multipágina agora?",
        answer:
          "Sim! O módulo EPM Web é autônomo e foi projetado para ser contratado individualmente. Ele entrega um website multipágina completo com todas as rotas especializadas (/servicos, /trabalhos, /para-corretores, /sobre, /contato), design editorial de alta performance e SEO local, sem exigir nenhum módulo adicional.",
      },
      {
        question: "Posso adicionar o módulo de agendamento (Booking) no futuro?",
        answer:
          "Sim. A arquitetura modular da EPM DevTech permite acoplar o EPM Booking Auto a qualquer momento posterior, sem necessidade de reconstruir o site já implantado.",
      },
      {
        question: "O módulo Booking confirma horários automaticamente?",
        answer:
          "Não. O Booking Auto opera como um pré-agendamento estruturado para a oficina analisar e confirmar. Isso garante que a BRS mantenha o controle manual de sua capacidade operacional e disponibilidade de box.",
      },
      {
        question: "O CRM pode ser integrado ao site?",
        answer:
          "Sim. Quando contratados em conjunto, as solicitações do formulário do site e do Booking entram automaticamente no funil comercial do CRM como novos contatos a qualificar.",
      },
      {
        question: "O sistema envia mensagens automáticas pelo WhatsApp?",
        answer:
          "O envio de notificações automáticas é atendido pelo módulo EPM Connect, que conecta os fluxos do Booking ou da Oficina à API de mensageria selecionada. As tarifas por mensagem do provedor são contratadas à parte.",
      },
      {
        question: "Existe alguma mensalidade obrigatória de software?",
        answer:
          "Não há mensalidade mandatória de licenciamento de software. A BRS torna-se dona do código desenvolvido. Apenas custos de infraestrutura direta de terceiros (domínio e hospedagem) permanecem sob titularidade da oficina.",
      },
      {
        question: "Como funciona a etapa de briefing?",
        answer:
          "Após manifestar interesse nos módulos e assinarmos o contrato, a equipe da EPM DevTech conduz uma sessão interativa com a BRS para coletar os dados essenciais sem formulários cansativos.",
      },
      {
        question: "Os valores de implantação incluem integrações com sistemas externos?",
        answer:
          "Cada módulo inclui seu escopo de integração delimitado. Integrações com ERPs legados específicos, seguradoras (ex.: Cilia/Audatex) ou sistemas bancários exigem estudo de viabilidade e orçamento à parte.",
      },
      {
        question: "O que acontece ao clicar em 'Tenho interesse nesta proposta'?",
        answer:
          "O botão não efetua cobrança nem gera vínculo jurídico imediato. Ele prepara um resumo claro dos módulos que a BRS tem interesse em avaliar e direciona para o alinhamento com a EPM DevTech.",
      },
    ],
    nextStepsBriefing: {
      title: "Transição para o Briefing Comercial",
      description:
        "Como avançamos de forma segura da escolha dos módulos para o início do desenvolvimento:",
      steps: [
        "Selecione os módulos de seu interesse no simulador acima;",
        "Clique no botão de manifestação de interesse para enviar seu resumo;",
        "Realizamos a reunião de alinhamento para validar o escopo exato;",
        "Formalizamos o Contrato de Prestação de Serviços Digitais e iniciamos o briefing guiado.",
      ],
    },
    enabledSections: {
      diagnosis: true,
      solution: true,
      modulesCatalog: true,
      comparisonMatrix: true,
      bundles: true,
      recurringCosts: true,
      scope: false,
      investment: false,
      conditions: true,
      timeline: true,
      responsibilities: true,
      faq: true,
      cta: true,
    },
  },
};

/**
 * Busca uma proposta pelo slug cadastrado.
 */
export function getProposalBySlug(slug: string): CommercialProposal | undefined {
  return commercialProposals[slug];
}

/**
 * Lista todas as propostas cadastradas (utilizado apenas para rotas administrativas internas).
 */
export function listProposals(): CommercialProposal[] {
  return Object.values(commercialProposals);
}
