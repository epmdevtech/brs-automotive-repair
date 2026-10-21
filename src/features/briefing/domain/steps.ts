import type {
  BriefingField,
  BriefingFieldOption,
  BriefingPhotoCategory,
  BriefingStep,
} from "./types";

const YES_NO_CONFIRM: BriefingFieldOption[] = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const YES_NO_PARTIAL: BriefingFieldOption[] = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
  { value: "parcial", label: "Parcialmente" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const EXECUTION: BriefingFieldOption[] = [
  { value: "proprio", label: "Executado pela equipe própria" },
  { value: "terceirizado", label: "Terceirizado" },
  { value: "nao_oferecido", label: "Não oferecido" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const STRUCTURE: BriefingFieldOption[] = [
  { value: "adequada", label: "Existe e está adequada" },
  { value: "melhoria", label: "Existe, mas precisa de melhoria" },
  { value: "nao_possui", label: "Não possui" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const EQUIPMENT: BriefingFieldOption[] = [
  { value: "propria", label: "Própria" },
  { value: "alugada", label: "Alugada" },
  { value: "compartilhada", label: "Compartilhada" },
  { value: "nao_possui", label: "Não possui" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const PROCESS: BriefingFieldOption[] = [
  { value: "formalizado_registrado", label: "Formalizado e registrado" },
  { value: "formalizado_sem_registro", label: "Formalizado, sem registro" },
  { value: "informal", label: "Realizado de forma informal" },
  { value: "precisa_estruturar", label: "Ainda precisa ser estruturado" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const DOCUMENT: BriefingFieldOption[] = [
  { value: "disponivel", label: "Disponível" },
  { value: "pendente", label: "Pendente" },
  { value: "nao_aplicavel", label: "Não se aplica" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const SYSTEM: BriefingFieldOption[] = [
  { value: "utiliza", label: "Utiliza" },
  { value: "nao_utiliza", label: "Não utiliza" },
  { value: "parcial", label: "Utiliza parcialmente" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const AUTHORIZATION: BriefingFieldOption[] = [
  { value: "autorizo", label: "Autorizo" },
  { value: "nao_autorizo", label: "Não autorizo" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const PHOTO_STATUS: BriefingFieldOption[] = [
  { value: "autorizadas", label: "Tenho fotos com autorização" },
  { value: "sem_autorizacao", label: "Tenho fotos, mas sem autorização" },
  { value: "nao_tenho", label: "Não tenho fotos" },
  { value: "confirmar", label: "Precisa confirmar" },
];

const UFS: BriefingFieldOption[] = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
].map((uf) => ({ value: uf, label: uf }));

type FieldExtras = Partial<Pick<BriefingField, "type">> &
  Omit<BriefingField, "id" | "label" | "type" | "options">;

function text(id: string, label: string, extras: FieldExtras = {}): BriefingField {
  return { id, label, type: "text", ...extras };
}

function textarea(id: string, label: string, extras: FieldExtras = {}): BriefingField {
  return { id, label, type: "textarea", rows: 3, ...extras };
}

function checkbox(id: string, label: string, extras: FieldExtras = {}): BriefingField {
  return { id, label, type: "checkbox", ...extras };
}

function selectRadio(
  id: string,
  label: string,
  options: BriefingFieldOption[],
  extras: FieldExtras = {},
): BriefingField {
  return { ...select(id, label, options, extras), control: "radio" };
}

function select(
  id: string,
  label: string,
  options: BriefingFieldOption[],
  extras: FieldExtras = {},
): BriefingField {
  return { id, label, type: "select", options, ...extras };
}

function serviceField(id: string, label: string): BriefingField {
  return select(id, label, EXECUTION, { span: 2 });
}

function structureField(id: string, label: string): BriefingField {
  return select(id, label, STRUCTURE, { span: 2 });
}

function equipmentField(id: string, label: string): BriefingField {
  return select(id, label, EQUIPMENT, { span: 2 });
}

function processField(id: string, label: string): BriefingField {
  return select(id, label, PROCESS, { span: 2 });
}

function documentField(id: string, label: string): BriefingField {
  return selectRadio(id, label, DOCUMENT, { span: 2 });
}

function systemField(id: string, label: string): BriefingField {
  return selectRadio(id, label, SYSTEM, { span: 2 });
}

function photoStatusField(id: string, label: string): BriefingField {
  return select(id, label, PHOTO_STATUS, { span: 2, allowPending: true });
}

export const BRIEFING_STEPS: BriefingStep[] = [
  {
    id: "company_identification",
    number: 1,
    title: "Identificação da empresa",
    shortLabel: "Empresa",
    description:
      "Dados cadastrais e institucionais da Master. Nada será publicado automaticamente no site.",
    kind: "fields",
    fields: [
      text("empresa.razaoSocial", "Razão social", {
        required: true,
        allowPending: true,
        placeholder: "Ex.: LCL Chapeação LTDA",
        autoComplete: "organization",
        span: 2,
      }),
      text("empresa.nomeFantasia", "Nome fantasia", {
        placeholder: "Ex.: Master Chapeação e Pinturas",
        span: 2,
      }),
      text("empresa.cnpj", "CNPJ da empresa", {
        format: "cnpj",
        placeholder: "00.000.000/0000-00",
        inputMode: "numeric",
        allowPending: true,
        help: "Usado apenas para conferência cadastral. Não comprova regularidade fiscal e não será exibido publicamente sem autorização.",
        span: 2,
      }),
      text("empresa.anoFundacao", "Ano de fundação", {
        format: "integer",
        inputMode: "numeric",
        placeholder: "Ex.: 2023",
        help: "Entre 1900 e o ano atual.",
        span: 1,
      }),
      text("empresa.tempoMercado", "Tempo de atuação no mercado (anos)", {
        inputMode: "numeric",
        placeholder: "Ex.: 3",
        help: "Quantos anos a oficina atua no mercado, contados a partir da fundação.",
        span: 1,
      }),
      text("empresa.proprietario", "Proprietário ou responsável legal", {
        required: true,
        allowPending: true,
        autoComplete: "name",
        span: 1,
      }),
      text("empresa.responsavelComercial", "Responsável pelo atendimento comercial", {
        span: 1,
      }),
      text("empresa.telefone", "Telefone comercial", {
        type: "tel",
        format: "phone",
        inputMode: "tel",
        autoComplete: "tel",
        placeholder: "(45) 99999-9999",
        help: "Com DDD. Fixo ou celular.",
        span: 1,
      }),
      text("empresa.whatsapp", "WhatsApp comercial", {
        type: "tel",
        format: "phone",
        inputMode: "tel",
        placeholder: "(45) 99999-9999",
        help: "Preencha apenas se o número recebe WhatsApp. Será divulgado apenas após confirmação formal.",
        span: 1,
      }),
      text("empresa.email", "E-mail comercial", {
        type: "email",
        format: "email",
        inputMode: "email",
        autoComplete: "email",
        placeholder: "contato@empresa.com.br",
        help: "Usado para contato sobre o briefing e sobre o projeto do site.",
        span: 2,
      }),
      text("empresa.cep", "CEP", {
        format: "cep",
        inputMode: "numeric",
        autoComplete: "postal-code",
        placeholder: "00000-000",
        help: "A consulta é apenas um auxílio: o endereço pode ser digitado manualmente.",
        span: 1,
      }),
      text("empresa.endereco", "Logradouro", {
        autoComplete: "street-address",
        placeholder: "Ex.: Av. das Indústrias",
        help: "Preencha com o endereço completo.",
        span: 1,
      }),
      text("empresa.enderecoNumero", "Número", {
        inputMode: "numeric",
        placeholder: "Ex.: 1234",
        help: "Preencha “S/N” quando o local não tiver número.",
        span: 1,
      }),
      text("empresa.enderecoComplemento", "Complemento", {
        placeholder: "Ex.: Galpão 2",
        span: 1,
      }),
      text("empresa.bairro", "Bairro", { span: 1 }),
      text("empresa.cidade", "Cidade", { autoComplete: "address-level2", span: 1 }),
      select("empresa.estado", "Estado", UFS, {
        autoComplete: "address-level1",
        span: 1,
      }),
      text("empresa.horarioFuncionamento", "Horário de funcionamento", { span: 1 }),
      selectRadio("empresa.atendeSabado", "Atende aos sábados?", YES_NO_CONFIRM, { span: 1 }),
      selectRadio("empresa.outrasUnidades", "Possui outras unidades?", YES_NO_CONFIRM, { span: 1 }),
      textarea("empresa.unidadesAdicionais", "Quais outras unidades e em quais municípios?", {
        placeholder: "Ex.: unidade de Estrela, na região de Toledo",
        help: "Aparece quando a resposta for “sim” ou “precisa confirmar”.",
        span: 2,
      }),
      textarea("empresa.regiaoAtendida", "Região geográfica atendida", {
        placeholder: "Ex.: Toledo, Marechal Cândido Rondon, Cascavel e região",
        help: "Cidades e raio de atendimento habitual.",
        span: 2,
      }),
      textarea("empresa.historia", "História da empresa", { span: 2 }),
      textarea("empresa.diferenciais", "Diferenciais comerciais", { span: 2 }),
      textarea("empresa.missaoVisaoValores", "Missão, visão e valores, se definidos", {
        span: 2,
      }),
    ],
  },
  {
    id: "services",
    number: 2,
    title: "Serviços e especialidades",
    shortLabel: "Serviços",
    description:
      "Indique como cada serviço é realizado. Nenhum serviço será anunciado no site sem confirmação.",
    kind: "fields",
    fields: [
      serviceField("servicos.chapeacao", "Chapeação e funilaria"),
      serviceField("servicos.pintura", "Pintura automotiva"),
      serviceField("servicos.martelinho", "Martelinho de ouro"),
      serviceField("servicos.recuperacaoAmassados", "Recuperação de amassados"),
      serviceField("servicos.paraChoques", "Reparação de para-choques"),
      serviceField("servicos.preparacaoAcabamento", "Preparação e acabamento de pintura"),
      serviceField("servicos.polimento", "Polimento e revitalização"),
      serviceField("servicos.desmontagemMontagem", "Desmontagem e montagem de componentes"),
      serviceField("servicos.recuperacaoPecas", "Recuperação ou substituição de peças"),
      serviceField("servicos.colisao", "Reparação de danos de colisão"),
      serviceField("servicos.levaTraz", "Leva e traz"),
      serviceField("servicos.frotas", "Atendimento a frotas"),
      serviceField("servicos.complementares", "Serviços complementares"),
      textarea("servicos.especialidadesPrincipais", "Quais são as principais especialidades?", {
        span: 2,
      }),
      textarea("servicos.atividadesInternas", "Quais atividades são realizadas internamente?", {
        span: 2,
      }),
      textarea("servicos.atividadesTerceirizadas", "Quais atividades são terceirizadas?", {
        span: 2,
      }),
      textarea("servicos.terceirizadosDetalhe", "Quais atividades são terceirizadas e com quem?", {
        placeholder: "Ex.: tercerização de pintura em partner externo",
        help: "Aparece quando algum serviço está marcado como terceirizado.",
        span: 2,
      }),
      textarea("servicos.tiposVeiculos", "Quais tipos de veículos são atendidos?", {
        placeholder: "Ex.: Passenger, SUVs, picapes e vans",
        help: "Categoria, aplicação e models mais frequentes.",
        span: 2,
      }),
      textarea(
        "servicos.volumesPorEspecialidade",
        "Volume aproximado por especialidade (opcional)",
        {
          placeholder: "Ex.: funilaria 6 veículos/semana; pintura 4 veículos/semana",
          help: "Ajuda a dimensionar a operação. Estimativas são bem-vindas.",
          span: 2,
        },
      ),
      textarea(
        "servicos.limitacoes",
        "Existem limitações por marca, modelo, tamanho ou complexidade?",
        { span: 2 },
      ),
      textarea(
        "servicos.publicoAtendido",
        "Atende clientes particulares, empresas, frotas, corretores ou seguradoras?",
        { span: 2 },
      ),
      select(
        "servicos.encaminhamentoSeguradora",
        "Já recebeu veículos encaminhados por seguradora ou associação?",
        YES_NO_CONFIRM,
        { span: 2 },
      ),
      textarea("servicos.exemplosTrabalhos", "Exemplos de trabalhos concluídos", { span: 2 }),
    ],
  },
  {
    id: "facility",
    number: 3,
    title: "Estrutura física",
    shortLabel: "Estrutura",
    description:
      "Avalie a existência e as condições de cada área. Use “Precisa confirmar” quando não tiver certeza.",
    kind: "fields",
    fields: [
      structureField("estrutura.fachada", "Fachada identificada"),
      structureField("estrutura.recepcao", "Recepção"),
      structureField("estrutura.salaEspera", "Sala de espera"),
      structureField("estrutura.administrativo", "Área administrativa"),
      structureField("estrutura.avaliacaoOrcamento", "Área de avaliação e orçamento"),
      structureField("estrutura.funilaria", "Área de funilaria"),
      structureField("estrutura.preparacaoPintura", "Área de preparação e pintura"),
      structureField("estrutura.cabinePintura", "Cabine de pintura"),
      structureField("estrutura.preparacaoTintas", "Área de preparação de tintas"),
      structureField("estrutura.desmontagemMontagem", "Área de desmontagem e montagem"),
      structureField("estrutura.patio", "Pátio de veículos"),
      structureField("estrutura.vagasCobertas", "Vagas cobertas"),
      structureField("estrutura.vagasDescobertas", "Vagas descobertas"),
      structureField("estrutura.aguardandoReparo", "Área para veículos aguardando reparo"),
      structureField("estrutura.veiculosFinalizados", "Área para veículos finalizados"),
      structureField("estrutura.entrega", "Área de entrega"),
      structureField("estrutura.estacionamentoClientes", "Estacionamento para clientes"),
      structureField("estrutura.segurancaAcesso", "Recursos de segurança e controle de acesso"),
      text("estrutura.metragem", "Metragem aproximada da oficina", {
        placeholder: "Ex.: 450 m²",
        span: 1,
      }),
      text("estrutura.veiculosAcomodados", "Veículos acomodados simultaneamente", {
        inputMode: "numeric",
        span: 1,
      }),
      text("estrutura.veiculosReparados", "Veículos reparados simultaneamente", {
        inputMode: "numeric",
        span: 1,
      }),
      select("estrutura.imovel", "Estrutura própria ou alugada?", [
        { value: "propria", label: "Própria" },
        { value: "alugada", label: "Alugada" },
        { value: "mista", label: "Mista" },
        { value: "confirmar", label: "Precisa confirmar" },
      ]),
      textarea("estrutura.limitacoesFisicas", "Limitações físicas relevantes", { span: 2 }),
      textarea("estrutura.seguranca", "Procedimentos e recursos de segurança aplicáveis", {
        span: 2,
      }),
    ],
  },
  {
    id: "equipment",
    number: 4,
    title: "Equipamentos e ferramentas",
    shortLabel: "Equipamentos",
    description:
      "Registre a origem de cada equipamento. Quantidades e observações podem ser detalhadas no campo final.",
    kind: "fields",
    fields: [
      equipmentField("equipamentos.funilaria", "Ferramentas de funilaria"),
      equipmentField("equipamentos.martelinho", "Equipamentos para martelinho de ouro"),
      equipmentField("equipamentos.soldagem", "Equipamentos de soldagem"),
      equipmentField("equipamentos.lixamento", "Ferramentas de lixamento e preparação"),
      equipmentField("equipamentos.compressor", "Compressor de ar"),
      equipmentField("equipamentos.cabine", "Cabine de pintura"),
      equipmentField("equipamentos.pistolas", "Pistolas e equipamentos de pintura"),
      equipmentField("equipamentos.misturaTintas", "Equipamentos para mistura de tintas"),
      equipmentField("equipamentos.desmontagem", "Ferramentas de desmontagem e montagem"),
      equipmentField("equipamentos.elevador", "Elevador automotivo"),
      equipmentField("equipamentos.mesaAlinhadora", "Mesa alinhadora ou medição estrutural"),
      equipmentField("equipamentos.avaliacaoDanos", "Equipamentos de avaliação de danos"),
      equipmentField("equipamentos.epi", "Equipamentos de proteção individual"),
      equipmentField("equipamentos.computadores", "Computadores para orçamento"),
      equipmentField("equipamentos.registroFotografico", "Câmera ou celular para registro"),
      equipmentField("equipamentos.outros", "Outros equipamentos relevantes"),
      select("equipamentos.manutencaoPreventiva", "Possui manutenção preventiva?", YES_NO_PARTIAL, {
        span: 2,
      }),
      textarea(
        "equipamentos.quantidadesObservacoes",
        "Quantidades, estado de conservação e observações",
        { span: 2 },
      ),
      textarea("equipamentos.limitacoesTecnicas", "Limitações técnicas conhecidas", { span: 2 }),
    ],
  },
  {
    id: "team",
    number: 5,
    title: "Equipe e responsabilidades",
    shortLabel: "Equipe",
    description:
      "Informe apenas dados profissionais. Não registre CPF, RG ou endereço residencial de colaboradores.",
    kind: "fields",
    fields: [
      text("equipe.totalColaboradores", "Total de colaboradores (pessoas)", {
        format: "integer",
        inputMode: "numeric",
        placeholder: "Ex.: 12",
        span: 1,
      }),
      text("equipe.profissionaisReparacao", "Profissionais de reparação (pessoas)", {
        format: "integer",
        inputMode: "numeric",
        placeholder: "Ex.: 8",
        span: 1,
      }),
      text("equipe.administrativo", "Pessoas na administração e atendimento (pessoas)", {
        format: "integer",
        inputMode: "numeric",
        placeholder: "Ex.: 4",
        span: 1,
      }),
      textarea("equipe.funcoes", "Funções existentes", { span: 2 }),
      textarea("equipe.especialidades", "Especialidades da equipe", { span: 2 }),
      textarea("equipe.qualificacoes", "Cursos e qualificações relevantes", { span: 2 }),
      text("equipe.respAvaliacao", "Responsável pela avaliação inicial", { span: 1 }),
      text("equipe.respOrcamentos", "Responsável pelos orçamentos", { span: 1 }),
      text("equipe.respQualidade", "Responsável pelo controle de qualidade", { span: 1 }),
      text("equipe.respEntrega", "Responsável pela entrega", { span: 1 }),
      textarea("equipe.atividadesTerceirizadas", "Atividades terceirizadas", { span: 2 }),
      textarea("equipe.condicoesAmpliacao", "Como a equipe é ampliada quando necessário?", {
        placeholder: "Ex.: mais dois profissionais por temporada e contratos temporários",
        help: "Aparece quando a resposta for “sim”.",
        span: 2,
      }),
      selectRadio(
        "equipe.ampliar",
        "Capacidade de ampliar a equipe quando necessário",
        YES_NO_CONFIRM,
        {
          span: 2,
        },
      ),
    ],
  },
  {
    id: "operations",
    number: 6,
    title: "Processos operacionais",
    shortLabel: "Processos",
    description:
      "Mapeie o fluxo real de atendimento. Não presuma processos formalizados. Use “Precisa confirmar” quando necessário.",
    kind: "fields",
    fields: [
      processField("processos.primeiroContato", "Primeiro contato"),
      processField("processos.recepcaoCadastro", "Recepção e cadastro do veículo"),
      processField("processos.inspecaoInicial", "Inspeção inicial"),
      processField("processos.registroFotografico", "Registro fotográfico"),
      processField("processos.avaliacaoDanos", "Avaliação dos danos"),
      processField("processos.orcamento", "Elaboração do orçamento"),
      processField("processos.pecasMateriais", "Identificação de peças e materiais"),
      processField("processos.aprovacaoOrcamento", "Aprovação do orçamento"),
      processField("processos.autorizacaoInicio", "Autorização para início"),
      processField("processos.planejamentoExecucao", "Planejamento e execução do reparo"),
      processField("processos.controleAndamento", "Controle de andamento"),
      processField("processos.comunicacaoAtrasos", "Comunicação de atrasos ou serviços adicionais"),
      processField("processos.inspecaoFinal", "Inspeção final"),
      processField("processos.registroResultado", "Registro do resultado"),
      processField("processos.autorizacaoLiberacao", "Autorização para liberação"),
      processField("processos.entrega", "Entrega do veículo"),
      processField("processos.reclamacoes", "Tratamento de reclamações e correções"),
      textarea("processos.descricaoFluxo", "Como o fluxo é realizado na prática", { span: 2 }),
      textarea("processos.responsaveis", "Quem é responsável por cada etapa", { span: 2 }),
      textarea("processos.registros", "Onde ficam os registros digitais ou físicos", { span: 2 }),
      textarea("processos.pendenciasProcesso", "Processos que ainda precisam ser estruturados", {
        span: 2,
      }),
    ],
  },
  {
    id: "capacity",
    number: 7,
    title: "Capacidade operacional e prazos",
    shortLabel: "Capacidade",
    description:
      "Diferencie números comprovados de estimativas. Nenhum indicador será tratado como auditado.",
    kind: "fields",
    fields: [
      text("capacidade.mediaRecebidos", "Veículos recebidos (média por dia)", {
        format: "integer",
        inputMode: "numeric",
        placeholder: "Ex.: 6",
        help: "Quantidade diária média de veículos que entram na oficina.",
        span: 1,
      }),
      text("capacidade.mediaEntregues", "Veículos entregues (média por dia)", {
        format: "integer",
        inputMode: "numeric",
        placeholder: "Ex.: 5",
        help: "Quantidade diária média de veículos finalizados.",
        span: 1,
      }),
      text("capacidade.servicosSimultaneos", "Veículos em serviço ao mesmo tempo", {
        format: "integer",
        inputMode: "numeric",
        placeholder: "Ex.: 10",
        help: "Capacidade real de trabalho simultâneo, considerando as baias.",
        span: 1,
      }),
      text("capacidade.capacidadeAdicional", "Capacidade adicional (veículos)", {
        format: "integer",
        inputMode: "numeric",
        placeholder: "Ex.: 4",
        help: "Quantos veículos a mais a oficina conseguiria atender em um pico.",
        span: 1,
      }),
      text("capacidade.prazoSimples", "Prazo de reparos simples (dias)", {
        inputMode: "numeric",
        placeholder: "Ex.: 5",
        help: "Prazo médio de um reparo simples, como amaciamento ou pintura de painel.",
        span: 1,
      }),
      text("capacidade.prazoComplexos", "Prazo de reparos complexos (dias)", {
        inputMode: "numeric",
        placeholder: "Ex.: 20",
        help: "Prazo médio de um reparo completo de funilaria.",
        span: 1,
      }),
      selectRadio(
        "capacidade.prazoBase",
        "Os prazos acima são contados em:",
        [
          { value: "uteis", label: "Dias úteis" },
          { value: "corridos", label: "Dias corridos" },
          { value: "confirmar", label: "Precisa confirmar" },
        ],
        {
          help: "Define a base de cálculo usada nos prazos informados.",
          span: 2,
        },
      ),
      textarea("capacidade.sazonalidade", "Sazonalidade da demanda", { span: 2 }),
      textarea("capacidade.definicaoPrazos", "Como os prazos são definidos", { span: 2 }),
      textarea("capacidade.atrasos", "Tratamento de atrasos por peças ou autorização", {
        span: 2,
      }),
      select("capacidade.historico", "Existe histórico de produção?", YES_NO_CONFIRM, {
        span: 2,
      }),
      select(
        "capacidade.indicadores",
        "Os números informados são comprovados ou estimativas?",
        [
          { value: "comprovados", label: "Comprovados por registros" },
          { value: "estimativas", label: "Estimativas do responsável" },
          { value: "misto", label: "Misto" },
          { value: "confirmar", label: "Precisa confirmar" },
        ],
        { span: 2 },
      ),
    ],
  },
  {
    id: "quality",
    number: 8,
    title: "Qualidade, garantia e rastreabilidade",
    shortLabel: "Qualidade",
    description:
      "Não informe certificações, garantias ou indicadores sem comprovação. Pendências são bem-vindas.",
    kind: "fields",
    fields: [
      selectRadio("qualidade.checklistFinal", "Checklist de inspeção final", YES_NO_PARTIAL, {
        span: 2,
      }),
      textarea("qualidade.padroes", "Padrões de qualidade para pintura e acabamento", {
        span: 2,
      }),
      selectRadio("qualidade.fotos", "Fotos antes, durante e depois do serviço", YES_NO_PARTIAL, {
        span: 2,
      }),
      selectRadio("qualidade.historico", "Histórico dos reparos", YES_NO_PARTIAL, { span: 2 }),
      selectRadio("qualidade.retrabalho", "Controle de retrabalho", YES_NO_PARTIAL, { span: 2 }),
      selectRadio("qualidade.reclamacoes", "Registro de reclamações", YES_NO_PARTIAL, { span: 2 }),
      textarea("qualidade.politicaGarantia", "Política de garantia", { span: 2 }),
      text("qualidade.prazoGarantia", "Prazo de garantia informado aos clientes", {
        placeholder: "Ex.: 90 dias em pintura, 6 meses em funilaria",
        help: "Pode ser informado em dias, meses ou por tipo de serviço.",
        span: 2,
      }),
      textarea("qualidade.atendimentoGarantia", "Procedimentos de atendimento em garantia", {
        span: 2,
      }),
      selectRadio(
        "qualidade.rastreabilidade",
        "Rastreabilidade de peças e materiais",
        YES_NO_PARTIAL,
        {
          span: 2,
        },
      ),
      textarea("qualidade.origemPecas", "Origem e tipo das peças utilizadas", { span: 2 }),
      textarea("qualidade.indicadores", "Indicadores de qualidade acompanhados", { span: 2 }),
      textarea("qualidade.certificacoes", "Certificações e programas de qualidade", { span: 2 }),
    ],
  },
  {
    id: "compliance",
    number: 9,
    title: "Documentação e regularidade",
    shortLabel: "Documentos",
    description:
      "Marque o status de cada documento. “Disponível” não significa regularidade validada; a EPM DevTech fará a conferência.",
    kind: "fields",
    fields: [
      documentField("documentos.cartaoCnpj", "Cartão do CNPJ"),
      documentField("documentos.contratoSocial", "Contrato social ou documento de constituição"),
      documentField("documentos.inscricaoMunicipal", "Inscrição municipal, quando aplicável"),
      documentField("documentos.alvara", "Alvará de funcionamento, quando exigido"),
      documentField("documentos.licencasAmbientais", "Licenças ambientais aplicáveis"),
      documentField("documentos.autorizacoes", "Autorizações das atividades e instalações"),
      documentField("documentos.notaFiscal", "Capacidade de emissão de notas fiscais"),
      documentField("documentos.comprovanteEndereco", "Comprovante de endereço empresarial"),
      documentField("documentos.regularidadeFiscal", "Documentos fiscais e de regularidade"),
      documentField("documentos.dadosBancarios", "Dados bancários empresariais"),
      documentField("documentos.segurancaTrabalho", "Documentos de segurança do trabalho"),
      documentField("documentos.seguro", "Apólice de seguro empresarial ou responsabilidade civil"),
      documentField("documentos.certificados", "Certificados e qualificações profissionais"),
      text("documentos.responsavel", "Responsável por manter os documentos atualizados", {
        span: 2,
      }),
      textarea("documentos.validades", "Datas de validade e documentos que precisam de validação", {
        span: 2,
      }),
      textarea("documentos.observacoes", "Observações sobre regularidade documental", {
        help: "Não informe números completos de conta, senhas ou documentos pessoais sensíveis.",
        span: 2,
      }),
    ],
  },
  {
    id: "technology",
    number: 10,
    title: "Sistemas e tecnologia",
    shortLabel: "Sistemas",
    description: "Indique quais recursos tecnológicos já fazem parte da operação.",
    kind: "fields",
    fields: [
      systemField("sistemas.gestao", "Sistema de gestão"),
      systemField("sistemas.orcamento", "Sistema de orçamento"),
      systemField("sistemas.seguradoras", "Plataformas de seguradoras ou sinistros"),
      systemField("sistemas.vistoriaFotos", "Capacidade de realizar vistoria por fotos"),
      systemField("sistemas.planilhas", "Planilhas de controle"),
      systemField("sistemas.entradaSaida", "Registro de entrada e saída de veículos"),
      systemField("sistemas.pecas", "Controle de peças e materiais"),
      systemField("sistemas.prazos", "Acompanhamento de prazos"),
      systemField("sistemas.historico", "Histórico por veículo"),
      systemField("sistemas.aprovacaoDigital", "Aprovação digital"),
      systemField("sistemas.processosManuais", "Processos ainda manuais"),
      textarea("sistemas.quais", "Quais sistemas, planilhas ou plataformas são usados?", {
        span: 2,
      }),
      textarea("sistemas.limitacoes", "Limitações ou necessidades de melhoria", { span: 2 }),
    ],
  },
  {
    id: "suppliers",
    number: 11,
    title: "Fornecedores e terceiros",
    shortLabel: "Fornecedores",
    description:
      "Informe apenas o necessário para o levantamento. Evite dados comerciais confidenciais.",
    kind: "fields",
    fields: [
      textarea("fornecedores.pecas", "Fornecedores de peças e materiais", { span: 2 }),
      select(
        "fornecedores.indicados",
        "É possível trabalhar com fornecedores indicados pelo contratante?",
        YES_NO_CONFIRM,
        { span: 2 },
      ),
      textarea("fornecedores.recebimento", "Como é feito o recebimento e a conferência de peças?", {
        span: 2,
      }),
      textarea("fornecedores.incorreticas", "Tratamento de peças incorretas ou atrasadas", {
        span: 2,
      }),
      select(
        "fornecedores.pecasContratante",
        "Utiliza peças fornecidas pela contratante?",
        YES_NO_CONFIRM,
        { span: 2 },
      ),
      textarea("fornecedores.terceirizados", "Serviços terceirizados e parceiros", { span: 2 }),
      textarea("fornecedores.criterios", "Critérios de seleção de fornecedores", { span: 2 }),
      textarea(
        "fornecedores.pecasContratanteDetalhes",
        "Quais peças ficam por conta do contratante?",
        {
          placeholder: "Ex.: vidros e itens de terceiros",
          help: "Aparece quando a resposta for “sim”.",
          span: 2,
        },
      ),
      textarea("fornecedores.custos", "Como custos adicionais são comunicados e autorizados", {
        span: 2,
      }),
    ],
  },
  {
    id: "accreditation_interest",
    number: 12,
    title: "Interesse em credenciamento",
    shortLabel: "Credenciamento",
    description:
      "Registre o interesse comercial. Não há garantia de aprovação ou credenciamento automático.",
    kind: "fields",
    fields: [
      textarea("credenciamento.seguradoras", "Quais seguradoras pretende atender?", {
        placeholder: "Ex.: HDI Seguros, Zurich, Porto Seguro",
        help: "A lista de requisitos e o processo de cada seguradora são confirmados depois com a EPM DevTech.",
        span: 2,
      }),
      selectRadio("credenciamento.jaPossui", "Já possui credenciamento?", YES_NO_CONFIRM, {
        span: 2,
      }),
      textarea("credenciamento.candidaturas", "Candidaturas em andamento", { span: 2 }),
      textarea("credenciamento.negativas", "Já houve negativa? Qual motivo foi informado?", {
        span: 2,
      }),
      selectRadio(
        "credenciamento.associacoes",
        "Interesse em associações de proteção veicular?",
        YES_NO_CONFIRM,
        {
          span: 2,
        },
      ),
      textarea("credenciamento.quaisAssociacoes", "Quais associações de proteção veicular?", {
        placeholder: "Ex.: associação de reparadores da região",
        help: "Aparece quando a resposta for “sim”.",
        span: 2,
      }),
      selectRadio(
        "credenciamento.frotas",
        "Interesse em frotas empresariais e locadoras?",
        YES_NO_CONFIRM,
        {
          span: 2,
        },
      ),
      textarea("credenciamento.quaisFrotas", "Quais frotas ou locadoras?", {
        placeholder: "Ex.: transportadora local, locadora de veículos",
        help: "Aparece quando a resposta for “sim”.",
        span: 2,
      }),
      text("credenciamento.regiao", "Região prioritária", { span: 1 }),
      text("credenciamento.volume", "Volume adicional pretendido", { span: 1 }),
      selectRadio(
        "credenciamento.negociacao",
        "Capacidade de negociar preços e condições?",
        YES_NO_CONFIRM,
        {
          span: 2,
        },
      ),
      selectRadio(
        "credenciamento.procedimentos",
        "Capacidade de cumprir procedimentos de vistoria, orçamento e autorização?",
        YES_NO_CONFIRM,
        { span: 2 },
      ),
      text("credenciamento.responsavel", "Responsável pelo relacionamento comercial", {
        span: 2,
      }),
      textarea("credenciamento.dificuldades", "Principais dificuldades atuais", { span: 2 }),
      textarea("credenciamento.adicionais", "Seguradoras ou organizações adicionais", { span: 2 }),
    ],
  },
  {
    id: "portfolio",
    number: 13,
    title: "Fotos e portfólio",
    shortLabel: "Fotos",
    description:
      "Envie fotos da estrutura e dos serviços. Os arquivos ficam em armazenamento privado, acessíveis apenas por você e pela equipe autorizada, e o envio não autoriza publicação no site.",
    kind: "photos",
    fields: [
      photoStatusField("fotos.fachada", "Fachada"),
      photoStatusField("fotos.entrada", "Entrada e identificação"),
      photoStatusField("fotos.recepcao", "Recepção"),
      photoStatusField("fotos.vistaGeral", "Vista geral da oficina"),
      photoStatusField("fotos.funilaria", "Área de funilaria"),
      photoStatusField("fotos.pintura", "Área de pintura"),
      photoStatusField("fotos.cabine", "Cabine de pintura"),
      photoStatusField("fotos.equipamentos", "Equipamentos"),
      photoStatusField("fotos.patio", "Pátio"),
      photoStatusField("fotos.entrega", "Área de entrega"),
      photoStatusField("fotos.equipe", "Equipe, mediante autorização"),
      photoStatusField("fotos.trabalhos", "Trabalhos concluídos"),
      photoStatusField("fotos.antesDepois", "Antes e depois"),
      select(
        "fotos.autorizacaoPublicacao",
        "Autoriza a avaliação das imagens para publicação futura?",
        AUTHORIZATION,
        { span: 2, help: "A autorização pode ser revisada antes da publicação." },
      ),
      textarea(
        "fotos.restricoes",
        "Restrições, placas, rostos ou imagens que não devem ser usadas",
        {
          span: 2,
        },
      ),
      textarea("fotos.observacoes", "Observações sobre o acervo fotográfico", { span: 2 }),
    ],
  },
  {
    id: "website_content",
    number: 14,
    title: "Informações para o site",
    shortLabel: "Site",
    description:
      "Estas respostas alimentam a revisão da EPM DevTech. Nada será publicado automaticamente.",
    kind: "fields",
    fields: [
      text("site.telefone", "Telefone público", {
        type: "tel",
        format: "phone",
        inputMode: "tel",
        placeholder: "(45) 99999-9999",
        span: 1,
      }),
      text("site.whatsapp", "WhatsApp público", {
        type: "tel",
        format: "phone",
        inputMode: "tel",
        placeholder: "(45) 99999-9999",
        span: 1,
      }),
      text("site.email", "E-mail público", {
        type: "email",
        format: "email",
        inputMode: "email",
        placeholder: "contato@empresa.com.br",
        span: 2,
      }),
      text("site.endereco", "Endereço para divulgação", { span: 2 }),
      text("site.horarios", "Horários de funcionamento", { span: 2 }),
      textarea("site.redesSociais", "Redes sociais oficiais", { span: 2 }),
      textarea("site.servicosDestaque", "Serviços que devem receber destaque", { span: 2 }),
      textarea("site.diferenciais", "Diferenciais comprováveis", { span: 2 }),
      selectRadio("site.autorizacaoImagens", "Autoriza o uso das imagens no site?", AUTHORIZATION, {
        span: 2,
      }),
      selectRadio(
        "site.autorizacaoInformacoes",
        "Autoriza o uso das informações institucionais no site?",
        AUTHORIZATION,
        { span: 2 },
      ),
      textarea("site.naoDivulgar", "Informações que não devem ser divulgadas", { span: 2 }),
      text("site.responsavelAprovacao", "Responsável pela aprovação final do conteúdo", {
        placeholder: "Informe a função, não dados pessoais",
        span: 2,
      }),
      text("site.responsavelConteudo", "Quem responde pelo conteúdo publicado no site?", {
        placeholder: "Ex.: Proprietário",
        help: "Informe a função. Não é necessário enviar documentos pessoais.",
        span: 2,
      }),
    ],
  },
  {
    id: "observations",
    number: 15,
    title: "Observações e confirmação",
    shortLabel: "Confirmação",
    description:
      "Revise as informações e registre as declarações. O envio registra o briefing para análise da EPM DevTech e não representa credenciamento nem publicação.",
    kind: "fields",
    fields: [
      textarea("confirmacao.observacoes", "Observações gerais", { span: 2 }),
      textarea("confirmacao.melhorias", "Melhorias planejadas", { span: 2 }),
      textarea("confirmacao.documentosPendentes", "Documentos ainda pendentes", { span: 2 }),
      textarea("confirmacao.informacoesConfirmar", "Informações que precisam de confirmação", {
        span: 2,
      }),
      text("confirmacao.responsavel", "Responsável pelo preenchimento", {
        required: true,
        allowPending: true,
        autoComplete: "name",
        span: 2,
      }),
      text("confirmacao.data", "Data de conclusão", {
        type: "date",
        format: "date",
        help: "Preenchida em dia, mês e ano. O valor é gravado no formato AAAA-MM-DD.",
        span: 2,
      }),
      checkbox(
        "confirmacao.veracidade",
        "Declaro que as informações correspondem ao meu conhecimento e que itens incertos foram marcados como pendentes.",
        { required: true, span: 2 },
      ),
      checkbox(
        "confirmacao.ciencia",
        "Estou ciente de que as informações serão usadas para o projeto do site e para a preparação de credenciamento.",
        { required: true, span: 2 },
      ),
      checkbox(
        "confirmacao.autorizacaoPublicacao",
        "Autorizo a EPM DevTech a avaliar as informações para publicação futura, respeitando as restrições registradas.",
        { span: 2 },
      ),
    ],
  },
];

export const PHOTO_CATEGORIES: BriefingPhotoCategory[] = [
  { id: "fachada", label: "Fachada" },
  { id: "entrada", label: "Entrada e identificação" },
  { id: "recepcao", label: "Recepção" },
  { id: "vistaGeral", label: "Vista geral da oficina" },
  { id: "funilaria", label: "Área de funilaria" },
  { id: "pintura", label: "Área de pintura" },
  { id: "cabine", label: "Cabine de pintura" },
  { id: "equipamentos", label: "Equipamentos" },
  { id: "patio", label: "Pátio" },
  { id: "entrega", label: "Área de entrega" },
  { id: "equipe", label: "Equipe, mediante autorização" },
  { id: "trabalhos", label: "Trabalhos concluídos" },
  { id: "antesDepois", label: "Antes e depois" },
];

export const TOTAL_BRIEFING_FIELDS = BRIEFING_STEPS.reduce(
  (total, step) => total + step.fields.length,
  0,
);
