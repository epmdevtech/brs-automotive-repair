import type { BriefingField, BriefingValue } from "../../domain/types";
import { cn } from "@/lib/utils";

interface RadioGroupFieldProps {
  field: BriefingField;
  value: BriefingValue | undefined;
  invalid: boolean;
  describedBy: string | undefined;
  disabled?: boolean;
  onChange: (value: BriefingValue) => void;
}

/**
 * Radio group para respostas mutuamente exclusivas com poucas opções.
 * Usa inputs nativos (teclado e leitor de tela por padrão) com fieldset/legend
 * para announced o contexto da pergunta.
 */
export function RadioGroupField({
  field,
  value,
  invalid,
  describedBy,
  disabled,
  onChange,
}: RadioGroupFieldProps) {
  const stringValue = typeof value === "string" ? value : "";

  return (
    <fieldset
      className={cn(
        "rounded-md border border-white/10 bg-white/[0.02] p-3",
        invalid && "border-red-400/50",
      )}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={describedBy}
    >
      <legend className="sr-only">{field.label}</legend>
      <div className="flex flex-wrap gap-2">
        {(field.options ?? []).map((option) => {
          const optionId = `${field.id}-${option.value}`;
          const checked = stringValue === option.value;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--brand-primary)]",
                checked
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                id={optionId}
                name={field.id}
                type="radio"
                value={option.value}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(option.value)}
                className="size-4 cursor-pointer accent-[var(--brand-primary)]"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
