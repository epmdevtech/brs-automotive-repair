import type { CepLookupResult } from "./cep-service";
import type { BriefingSectionValues } from "./section-schemas";

/**
 * Mapeamento dos campos de endereço da etapa 1. O preenchimento automático
 * nunca sobrescreve um valor já preenchido pela pessoa: a edição manual
 * sempre tem precedência.
 */
export const ADDRESS_FIELD_IDS = {
  street: "empresa.endereco",
  number: "empresa.enderecoNumero",
  complement: "empresa.enderecoComplemento",
  neighborhood: "empresa.bairro",
  city: "empresa.cidade",
  state: "empresa.estado",
} as const;

export interface AddressFillResult {
  values: BriefingSectionValues;
  /** Campos preenchidos automaticamente. */
  filled: string[];
}

export function applyCepLookup(
  values: BriefingSectionValues,
  result: CepLookupResult,
): AddressFillResult {
  const next: BriefingSectionValues = { ...values };
  const filled: string[] = [];

  const candidates: [string, string][] = [
    [ADDRESS_FIELD_IDS.street, result.logradouro],
    [ADDRESS_FIELD_IDS.neighborhood, result.bairro],
    [ADDRESS_FIELD_IDS.city, result.cidade],
    [ADDRESS_FIELD_IDS.state, result.uf],
  ];

  for (const [fieldId, value] of candidates) {
    if (value.length === 0) continue;
    const current = next[fieldId];
    if (typeof current === "string" && current.trim().length > 0) continue;
    next[fieldId] = value;
    filled.push(fieldId);
  }

  return { values: next, filled };
}
