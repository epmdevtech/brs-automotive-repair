import { useId, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatCep, formatCnpj, formatDecimal, formatPhone } from "../../domain/masks";
import type { BriefingField, BriefingValue } from "../../domain/types";

interface MaskedTextFieldProps {
  field: BriefingField;
  value: BriefingValue | undefined;
  invalid: boolean;
  describedBy: string | undefined;
  disabled?: boolean;
  onChange: (value: BriefingValue) => void;
}

function applyMask(field: BriefingField, raw: string): string {
  switch (field.format) {
    case "cep":
      return formatCep(raw);
    case "cnpj":
      return formatCnpj(raw);
    case "phone":
      return formatPhone(raw);
    case "decimal":
      return formatDecimal(raw);
    default:
      return raw;
  }
}

const MAX_LENGTH_BY_FORMAT: Record<string, number> = {
  cep: 9,
  cnpj: 18,
  phone: 15,
  decimal: 18,
};

/**
 * Entrada de texto com máscara do domínio. A máscara é apenas apresentação:
 * a validação continua no schema Zod, compartilhado com o servidor.
 */
export function MaskedTextField({
  field,
  value,
  invalid,
  describedBy,
  disabled,
  onChange,
}: MaskedTextFieldProps) {
  const generatedId = useId();
  const inputId = field.id || generatedId;
  const stringValue = typeof value === "string" ? value : "";
  const maxLength = MAX_LENGTH_BY_FORMAT[field.format ?? ""];

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(applyMask(field, event.target.value));
  }

  return (
    <Input
      id={inputId}
      name={field.id}
      type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"}
      inputMode={field.inputMode}
      value={stringValue}
      onChange={handleChange}
      placeholder={field.placeholder}
      maxLength={maxLength}
      autoComplete={field.autoComplete}
      disabled={disabled}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        "border-white/15 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-[var(--brand-primary)]",
      )}
    />
  );
}
