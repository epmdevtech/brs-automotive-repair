import { z } from "zod";
import { BRIEFING_STEPS } from "./steps";
import {
  isValidCep,
  isValidCnpj,
  isValidDecimal,
  isValidEmail,
  isValidInteger,
  isValidIsoDate,
  isValidPhone,
} from "./masks";
import { pruneConditionalValues } from "./conditional";
import type { BriefingField, BriefingStep } from "./types";

export type BriefingSectionValues = Record<string, string | boolean>;
export type BriefingSectionPending = Record<string, boolean>;

export interface BriefingSectionPayload {
  values: BriefingSectionValues;
  pending: BriefingSectionPending;
}

export const MAX_SECTION_PAYLOAD_BYTES = 200 * 1024;

const REQUIRED_MESSAGE = "Campo obrigatório";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NUMBER_PATTERN = /^-?\d+([.,]\d+)?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_PATTERN = /^[\d\s()+.-]{8,30}$/;
const INVALID_OPTION_MESSAGE = "Selecione uma das opções disponíveis";
const INVALID_EMAIL_MESSAGE = "Informe um e-mail válido";
const INVALID_NUMBER_MESSAGE = "Informe um número válido";
const INVALID_CEP_MESSAGE = "Informe um CEP com 8 dígitos";
const INVALID_CNPJ_MESSAGE = "Informe um CNPJ válido (dígitos verificadores)";
const INVALID_PHONE_MESSAGE = "Informe um telefone com DDD válido";
const INVALID_INTEGER_MESSAGE = "Informe um número inteiro";
const INVALID_DATE_MESSAGE = "Informe uma data válida";

function baseStringSchema(field: BriefingField): z.ZodString {
  const max = field.maxLength ?? 5000;
  return z.string().trim().max(max);
}

/**
 * Aplica o formato esperado do campo. Valores vazios são ignorados: campo não
 * preenchido é tratado como "não respondido" (e reportado como obrigatório
 * quando for o caso), nunca como formato inválido.
 */
function withFormat(schema: z.ZodString, field: BriefingField) {
  return schema.superRefine((value, ctx) => {
    if (value.length === 0) return;

    const invalid = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message });

    switch (field.format) {
      case "cep":
        if (!isValidCep(value)) invalid(INVALID_CEP_MESSAGE);
        return;
      case "cnpj":
        if (!isValidCnpj(value)) invalid(INVALID_CNPJ_MESSAGE);
        return;
      case "phone":
        if (!isValidPhone(value)) invalid(INVALID_PHONE_MESSAGE);
        return;
      case "integer":
        if (!isValidInteger(value)) invalid(INVALID_INTEGER_MESSAGE);
        return;
      case "decimal":
        if (!isValidDecimal(value)) invalid(INVALID_NUMBER_MESSAGE);
        return;
      case "date":
        if (!isValidIsoDate(value)) invalid(INVALID_DATE_MESSAGE);
        return;
      case "email":
        if (!isValidEmail(value)) invalid(INVALID_EMAIL_MESSAGE);
        return;
      default:
        break;
    }

    if (field.type === "email" && !EMAIL_PATTERN.test(value)) {
      invalid(INVALID_EMAIL_MESSAGE);
      return;
    }
    if (field.type === "number" && !NUMBER_PATTERN.test(value)) {
      invalid(INVALID_NUMBER_MESSAGE);
      return;
    }
    if (field.type === "date" && !DATE_PATTERN.test(value)) {
      invalid("Informe uma data válida (AAAA-MM-DD)");
      return;
    }
    if (field.type === "tel" && !PHONE_PATTERN.test(value)) {
      invalid("Informe um telefone válido");
    }
  });
}

function fieldSchema(field: BriefingField, isPending: boolean): z.ZodTypeAny {
  if (field.type === "checkbox") {
    if (!field.required) return z.boolean().optional();
    return z.literal(true, {
      errorMap: () => ({ message: "Confirmação obrigatória para prosseguir" }),
    });
  }

  const base = baseStringSchema(field);
  const isRequired = field.required && !isPending;

  if (field.options && field.options.length > 0) {
    const allowed = new Set(field.options.map((option) => option.value));
    const withLength = isRequired ? base.min(1, REQUIRED_MESSAGE) : base;

    const refined = withLength.superRefine((value, ctx) => {
      if (value.length > 0 && !allowed.has(value)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: INVALID_OPTION_MESSAGE });
      }
    });

    return isRequired ? refined : refined.optional();
  }

  return isRequired
    ? withFormat(base.min(1, REQUIRED_MESSAGE), field)
    : withFormat(base, field).optional();
}

/**
 * Monta o schema Zod de uma etapa. Campos marcados como pendentes são
 * aceitos vazios; campos obrigatórios não marcados exigem preenchimento.
 */
export function buildSectionSchema(
  step: BriefingStep,
  pending: BriefingSectionPending = {},
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of step.fields) {
    shape[field.id] = fieldSchema(field, pending[field.id] === true);
  }

  return z.object(shape);
}

export const BRIEFING_SECTION_SCHEMAS: Record<
  string,
  z.ZodObject<Record<string, z.ZodTypeAny>>
> = Object.fromEntries(BRIEFING_STEPS.map((step) => [step.id, buildSectionSchema(step, {})]));

export function getSectionSchema(
  stepId: string,
  pending: BriefingSectionPending = {},
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const step = BRIEFING_STEPS.find((item) => item.id === stepId);
  if (!step) {
    throw new Error(`Etapa desconhecida: ${stepId}`);
  }
  return buildSectionSchema(step, pending);
}

export function getStepBySectionKey(sectionKey: string): BriefingStep | undefined {
  return BRIEFING_STEPS.find((step) => step.id === sectionKey);
}

/**
 * Valida a seção no servidor. Retorna os valores normalizados ou o primeiro
 * erro encontrado com o campo e a mensagem em pt-BR.
 */
export function validateSectionPayload(
  step: BriefingStep,
  payload: BriefingSectionPayload,
):
  | { ok: true; values: BriefingSectionValues; pending: BriefingSectionPending }
  | { ok: false; fieldId: string; message: string } {
  const pending: BriefingSectionPending = {};
  for (const [fieldId, isPending] of Object.entries(payload.pending ?? {})) {
    if (isPending === true) pending[fieldId] = true;
  }

  // Campos condicionais ocultados não entram na validação nem no payload.
  const pruned = pruneConditionalValues(step.id, payload.values ?? {}, pending);

  const schema = buildSectionSchema(step, pruned.pending);
  const result = schema.safeParse(pruned.values);

  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      fieldId: issue?.path[0]?.toString() ?? step.fields[0]?.id ?? "desconhecido",
      message: issue?.message ?? "Dados inválidos",
    };
  }

  const values: BriefingSectionValues = {};
  for (const [key, value] of Object.entries(result.data)) {
    if (typeof value === "boolean") {
      if (value) values[key] = true;
      continue;
    }
    if (typeof value === "string" && value.trim().length > 0) {
      values[key] = value;
    }
  }

  return { ok: true, values, pending: pruned.pending };
}

export function estimateSectionBytes(payload: BriefingSectionPayload): number {
  return new TextEncoder().encode(JSON.stringify(payload)).length;
}
