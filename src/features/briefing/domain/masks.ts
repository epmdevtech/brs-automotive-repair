/**
 * Máscaras e validadores do briefing (ADR-002).
 *
 * Funções puras, sem dependência de DOM, usadas tanto pela interface quanto
 * pelo schema Zod do servidor. O valor persistido é o valor canônico do tipo:
 * texto com máscara para CEP/CNPJ/telefone, `YYYY-MM-DD` para datas civis e
 * texto com separadores pt-BR para números.
 */

export function onlyDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

/* -------------------------------------------------------------------------- */
/* CEP                                                                         */
/* -------------------------------------------------------------------------- */

export function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isValidCep(value: string): boolean {
  return onlyDigits(value).length === 8;
}

/* -------------------------------------------------------------------------- */
/* CNPJ                                                                        */
/* -------------------------------------------------------------------------- */

export function formatCnpj(value: string): string {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function cnpjDigit(digits: string, weights: number[]): number {
  const sum = digits
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * (weights[index] ?? 0), 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value);

  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const first = cnpjDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = cnpjDigit(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return first === Number(digits[12]) && second === Number(digits[13]);
}

/* -------------------------------------------------------------------------- */
/* Telefone                                                                    */
/* -------------------------------------------------------------------------- */

const VALID_DDD = /^(1[1-9]|2[12478]|3[1-8]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])$/;

export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return "";

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (digits.length <= 2) return ddd;
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) {
    const landline = rest.slice(0, 4);
    return `(${ddd}) ${landline}-${rest.slice(4)}`;
  }
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 10 && digits.length !== 11) return false;
  return VALID_DDD.test(digits.slice(0, 2));
}

/* -------------------------------------------------------------------------- */
/* Número decimal pt-BR                                                        */
/* -------------------------------------------------------------------------- */

export function formatDecimal(value: string): string {
  const clean = value.replace(/[^\d,.-]/g, "");
  const negative = clean.startsWith("-");
  const [rawInteger = "", rawDecimal] = clean.replace("-", "").split(",");
  const digits = rawInteger.replace(/\D/g, "").slice(0, 15);

  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  if (rawDecimal === undefined) return `${negative ? "-" : ""}${grouped}`;
  return `${negative ? "-" : ""}${grouped},${rawDecimal.replace(/\D/g, "").slice(0, 4)}`;
}

export function parseDecimal(value: string): number | null {
  const clean = value.trim().replace(/\./g, "").replace(",", ".");
  if (clean.length === 0) return null;
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isValidDecimal(value: string): boolean {
  return parseDecimal(value) !== null;
}

export function isValidInteger(value: string): boolean {
  const parsed = parseDecimal(value);
  return parsed !== null && Number.isInteger(parsed) && parsed >= 0;
}

/* -------------------------------------------------------------------------- */
/* Datas civis                                                                 */
/* -------------------------------------------------------------------------- */

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(month: number, year: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/** Valida e converte `dd/mm/aaaa` para a forma canônica `YYYY-MM-DD`. */
export function parseDateBr(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (year < 1900 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(month, year)) return null;

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isValidDateBr(value: string): boolean {
  return parseDateBr(value) !== null;
}

/** Converte a forma canônica `YYYY-MM-DD` para a exibição `dd/mm/aaaa`. */
export function formatDateBr(canonical: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(canonical.trim());
  if (!match) return canonical;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function isValidIsoDate(canonical: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(canonical.trim());
  if (!match) return false;
  return parseDateBr(`${match[3]}/${match[2]}/${match[1]}`) === canonical.trim();
}

/* -------------------------------------------------------------------------- */
/* E-mail                                                                      */
/* -------------------------------------------------------------------------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: string): string {
  return value.trim();
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(normalizeEmail(value));
}
