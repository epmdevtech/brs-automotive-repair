import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BriefingField, BriefingValue } from "../domain/types";

interface BriefingFieldProps {
  field: BriefingField;
  value: BriefingValue | undefined;
  pending: boolean;
  showError: boolean;
  errorMessage?: string | undefined;
  onChange: (value: BriefingValue) => void;
  onPendingChange: (pending: boolean) => void;
}

export function BriefingFieldInput({
  field,
  value,
  pending,
  showError,
  errorMessage,
  onChange,
  onPendingChange,
}: BriefingFieldProps) {
  const helpId = field.help ? `${field.id}-help` : undefined;
  const errorId = `${field.id}-error`;
  const answered = pending || (field.type === "checkbox" ? value === true : isNonEmpty(value));
  const hasError = showError && Boolean(field.required) && !answered;
  const describedBy =
    [helpId, hasError ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  if (field.type === "checkbox") {
    return (
      <div className={cn("space-y-1.5", field.span === 2 && "sm:col-span-2")}>
        <label
          htmlFor={field.id}
          className="flex cursor-pointer items-start gap-3 rounded-md border border-white/10 bg-white/[0.02] p-3 text-sm leading-relaxed text-neutral-300"
        >
          <input
            id={field.id}
            name={field.id}
            type="checkbox"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
            aria-required={field.required ? true : undefined}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedBy}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--brand-primary)]"
          />
          <span>
            {field.label}
            {field.required ? (
              <span className="ml-1 text-[var(--brand-text-accent)]" aria-hidden="true">
                *
              </span>
            ) : null}
          </span>
        </label>
        {field.help ? (
          <p id={helpId} className="text-xs text-neutral-500">
            {field.help}
          </p>
        ) : null}
        {hasError ? (
          <p id={errorId} role="alert" className="text-xs text-red-300">
            Confirmação obrigatória. Marque a declaração para continuar.
          </p>
        ) : null}
      </div>
    );
  }

  const stringValue = typeof value === "string" ? value : "";
  const controlClass = cn(
    "border-white/15 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-[var(--brand-primary)]",
    pending && "opacity-60",
  );

  return (
    <div className={cn("space-y-1.5", field.span === 2 && "sm:col-span-2")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={field.id} className="text-sm font-medium text-neutral-200">
          {field.label}
          {field.required ? (
            <span className="ml-1 text-[var(--brand-text-accent)]" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>

        {field.allowPending ? (
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-neutral-400">
            <input
              type="checkbox"
              checked={pending}
              onChange={(event) => onPendingChange(event.target.checked)}
              className="size-3.5 cursor-pointer accent-[var(--brand-primary)]"
              aria-label={`Marcar “${field.label}” como pendente`}
            />
            Pendente
          </label>
        ) : null}
      </div>

      {field.type === "textarea" ? (
        <Textarea
          id={field.id}
          name={field.id}
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          maxLength={field.maxLength}
          disabled={pending}
          aria-invalid={hasError ? true : undefined}
          aria-required={field.required ? true : undefined}
          aria-describedby={describedBy}
          className={cn(controlClass, "min-h-20")}
        />
      ) : field.type === "select" ? (
        <select
          id={field.id}
          name={field.id}
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          disabled={pending}
          aria-invalid={hasError ? true : undefined}
          aria-required={field.required ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed md:text-sm",
            controlClass,
          )}
        >
          <option value="">Selecione…</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={field.id}
          name={field.id}
          type={field.type}
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          min={field.min}
          max={field.max}
          autoComplete={field.autoComplete}
          inputMode={field.inputMode}
          disabled={pending}
          aria-invalid={hasError ? true : undefined}
          aria-required={field.required ? true : undefined}
          aria-describedby={describedBy}
          className={controlClass}
        />
      )}

      {field.help ? (
        <p id={helpId} className="text-xs text-neutral-500">
          {field.help}
        </p>
      ) : null}

      {pending ? (
        <p className="text-xs text-amber-300/90">
          Marcado como pendente. A informação não será tratada como confirmada.
        </p>
      ) : null}

      {hasError ? (
        <p id={errorId} role="alert" className="text-xs text-red-300">
          {errorMessage ?? "Campo obrigatório: informe uma resposta ou marque como pendente."}
        </p>
      ) : null}
    </div>
  );
}

function isNonEmpty(value: BriefingValue | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
