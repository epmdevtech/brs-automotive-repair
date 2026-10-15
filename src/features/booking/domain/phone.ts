import type { Result } from "./types";

/**
 * Relação exata dos 67 Códigos de Discagem Direta a Distância (DDDs) oficiais do Brasil.
 */
export const VALID_BRAZILIAN_DDDS = new Set([
  // SP (11 a 19)
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  // RJ / ES (21, 22, 24, 27, 28)
  "21",
  "22",
  "24",
  "27",
  "28",
  // MG (31 a 35, 37, 38)
  "31",
  "32",
  "33",
  "34",
  "35",
  "37",
  "38",
  // PR / SC (41 a 49 - 45 é Toledo e Oeste do Paraná)
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  // RS (51, 53, 54, 55)
  "51",
  "53",
  "54",
  "55",
  // DF / GO / MT / MS / AC / RO / TO (61 a 69)
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  // BA / SE (71, 73, 74, 75, 77, 79)
  "71",
  "73",
  "74",
  "75",
  "77",
  "79",
  // PE / AL / PB / RN / CE / PI (81 a 89)
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  // PA / AM / RR / AP / MA (91 a 99)
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
]);

/**
 * Valida se o DDD fornecido pertence à lista de DDDs oficiais.
 */
export function isValidDDD(ddd: string | number): boolean {
  return VALID_BRAZILIAN_DDDS.has(String(ddd));
}

/**
 * Normaliza um número de telefone para o padrão internacional canônico E.164 (+55...).
 * Aceita entradas com ou sem código do país, com ou sem pontuação.
 */
export function normalizePhoneE164(input: string): Result<string, string> {
  if (!input || typeof input !== "string") {
    return { ok: false, error: "Telefone não informado." };
  }

  // Extrai apenas dígitos
  let digits = input.replace(/\D/g, "");

  // Se começou com 0 nacional, remove
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Trata prefixo internacional 55 se já foi digitado
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }

  // Um telefone válido no Brasil possui 10 dígitos (fixo) ou 11 dígitos (celular)
  if (digits.length !== 10 && digits.length !== 11) {
    return {
      ok: false,
      error: "O telefone deve conter DDD + número (10 ou 11 dígitos).",
    };
  }

  const ddd = digits.slice(0, 2);
  if (!isValidDDD(ddd)) {
    return {
      ok: false,
      error: `O DDD (${ddd}) informado não é um DDD oficial válido no Brasil.`,
    };
  }

  // Para celulares (11 dígitos), o primeiro dígito do número deve ser 9
  if (digits.length === 11 && digits[2] !== "9") {
    return {
      ok: false,
      error: "Celulares com DDD devem iniciar com o dígito 9.",
    };
  }

  const canonicalE164 = `+55${digits}`;
  return { ok: true, value: canonicalE164 };
}

/**
 * Formata um telefone E.164 ou numérico puro para máscara legível:
 * Celular: (45) 99999-9999
 * Fixo: (45) 3000-0000
 */
export function formatPhoneBR(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone;
}
