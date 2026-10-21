import type { BriefingSectionValues } from "./section-schemas";

/**
 * Regras condicionais do briefing (ADR-002).
 *
 * Um campo dependente só é exibido, validado e enviado quando a resposta
 * controladora permitir. Campo ocultado nunca é enviado e a resposta anterior
 * não é apagada em silêncio: a interface avisa o cliente sobre o descarte.
 */
export interface ConditionalRule {
  id: string;
  section: string;
  /** Campo que decide a exibição. */
  controller: string;
  /** Campos que dependem da resposta controladora. */
  dependents: string[];
  /** Mensagem exibida quando uma resposta preenchida deixa de ser considerada. */
  notice: string;
  isVisible: (values: BriefingSectionValues) => boolean;
}

const isYes = (value: unknown) => value === "sim";
const isNotNo = (value: unknown) => value !== "nao";

export const CONDITIONAL_RULES: ConditionalRule[] = [
  {
    id: "empresa-outras-unidades",
    section: "company_identification",
    controller: "empresa.outrasUnidades",
    dependents: ["empresa.unidadesAdicionais"],
    notice:
      "Como a resposta sobre outras unidades mudou, as unidades informadas não serão enviadas.",
    isVisible: (values) => isNotNo(values["empresa.outrasUnidades"]),
  },
  {
    id: "servicos-terceirizados",
    section: "services",
    controller: "servicos.chapeacao",
    dependents: ["servicos.terceirizadosDetalhe"],
    notice:
      "Nenhum serviço está marcado como terceirizado, então o detalhe de terceirização não será enviado.",
    isVisible: (values) => hasTercirizadoService(values),
  },
  {
    id: "equipe-ampliacao",
    section: "team",
    controller: "equipe.ampliar",
    dependents: ["equipe.condicoesAmpliacao"],
    notice:
      "A ampliação de equipe não está mais prevista, então as condições informadas não serão enviadas.",
    isVisible: (values) => isYes(values["equipe.ampliar"]),
  },
  {
    id: "fornecedores-pecas-contratante",
    section: "suppliers",
    controller: "fornecedores.pecasContratante",
    dependents: ["fornecedores.pecasContratanteDetalhes"],
    notice:
      "As peças por conta do contratante não se aplicam, então os detalhes não serão enviados.",
    isVisible: (values) => isYes(values["fornecedores.pecasContratante"]),
  },
  {
    id: "credenciamento-associacoes",
    section: "accreditation_interest",
    controller: "credenciamento.associacoes",
    dependents: ["credenciamento.quaisAssociacoes"],
    notice:
      "As associações de proteção veicular não são prioridade, então as associações informadas não serão enviadas.",
    isVisible: (values) => isYes(values["credenciamento.associacoes"]),
  },
  {
    id: "credenciamento-frotas",
    section: "accreditation_interest",
    controller: "credenciamento.frotas",
    dependents: ["credenciamento.quaisFrotas"],
    notice: "Frotas e locadoras não são prioridade, então as frotas informadas não serão enviadas.",
    isVisible: (values) => isYes(values["credenciamento.frotas"]),
  },
];

const SERVICE_FIELDS = [
  "servicos.chapeacao",
  "servicos.pintura",
  "servicos.martelinho",
  "servicos.recuperacaoAmassados",
  "servicos.paraChoques",
  "servicos.preparacaoAcabamento",
  "servicos.polimento",
  "servicos.desmontagemMontagem",
  "servicos.recuperacaoPecas",
  "servicos.colisao",
  "servicos.levaTraz",
  "servicos.frotas",
  "servicos.complementares",
];

function hasTercirizadoService(values: BriefingSectionValues): boolean {
  return SERVICE_FIELDS.some((fieldId) => values[fieldId] === "terceirizado");
}

export function getConditionalRules(section: string): ConditionalRule[] {
  return CONDITIONAL_RULES.filter((rule) => rule.section === section);
}

/** Identificadores de campos que devem ser ocultados com os valores atuais. */
export function getHiddenFieldIds(section: string, values: BriefingSectionValues): string[] {
  return getConditionalRules(section)
    .filter((rule) => !rule.isVisible(values))
    .flatMap((rule) => rule.dependents);
}

export interface PrunedSection {
  values: BriefingSectionValues;
  pending: Record<string, boolean>;
  /** Campos que estavam preenchidos e deixaram de ser enviados. */
  discarded: { fieldId: string; notice: string }[];
}

/**
 * Remove do payload os valores de campos condicionais ocultados. A remoção é
 * reportada para que a interface avise o cliente, em vez de apagar a resposta
 * silenciosamente.
 */
export function pruneConditionalValues(
  section: string,
  values: BriefingSectionValues,
  pending: Record<string, boolean> = {},
): PrunedSection {
  const hidden = getHiddenFieldIds(section, values);
  if (hidden.length === 0) {
    return { values, pending, discarded: [] };
  }

  const nextValues: BriefingSectionValues = {};
  for (const [fieldId, value] of Object.entries(values)) {
    if (!hidden.includes(fieldId)) nextValues[fieldId] = value;
  }

  const nextPending: Record<string, boolean> = {};
  for (const [fieldId, value] of Object.entries(pending)) {
    if (!hidden.includes(fieldId)) nextPending[fieldId] = value;
  }

  const discarded = getConditionalRules(section)
    .filter((rule) => !rule.isVisible(values))
    .flatMap((rule) =>
      rule.dependents
        .filter((fieldId) => values[fieldId] !== undefined || pending[fieldId] === true)
        .map((fieldId) => ({ fieldId, notice: rule.notice })),
    );

  return { values: nextValues, pending: nextPending, discarded };
}
