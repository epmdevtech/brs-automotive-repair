/**
 * Identificadores canônicos das 15 etapas do briefing.
 *
 * O `section_key` é a chave persistida em `briefing_answers.section_key`
 * e não pode mudar sem migração e revisão da SPEC.
 */
export const BRIEFING_SECTION_KEYS = [
  "company_identification",
  "services",
  "facility",
  "equipment",
  "team",
  "operations",
  "capacity",
  "quality",
  "compliance",
  "technology",
  "suppliers",
  "accreditation_interest",
  "portfolio",
  "website_content",
  "observations",
] as const;

export type BriefingSectionKey = (typeof BRIEFING_SECTION_KEYS)[number];

export function isBriefingSectionKey(value: unknown): value is BriefingSectionKey {
  return typeof value === "string" && (BRIEFING_SECTION_KEYS as readonly string[]).includes(value);
}
