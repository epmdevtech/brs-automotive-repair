import { useEffect, useRef, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { lookupCep, type CepLookupResult } from "../domain/cep-service";
import { isValidCep } from "../domain/masks";
import type { BriefingField, BriefingValue } from "../domain/types";
import { DateField } from "./fields/date-field";
import { MaskedTextField } from "./fields/masked-text-field";
import { RadioGroupField } from "./fields/radio-group-field";

interface BriefingFieldProps {
  field: BriefingField;
  value: BriefingValue | undefined;
  pending: boolean;
  showError: boolean;
  errorMessage?: string | undefined;
  onChange: (value: BriefingValue) => void;
  onPendingChange: (pending: boolean) => void;
  onCepResolved?: ((result: CepLookupResult) => void) | undefined;
}

export function BriefingFieldInput({
  field,
  value,
  pending,
  showError,
  errorMessage,
  onChange,
  onPendingChange,
  onCepResolved,
}: BriefingFieldProps) {
  const helpId = field.help ? `${field.id}-help` : undefined;
  const errorId = `${field.id}-error`;
  const answered = pending || (field.type === "checkbox" ? value === true : isNonEmpty(value));
  const hasError = showError && !answered;
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
            {errorMessage ?? "Confirmação obrigatória. Marque a declaração para continuar."}
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

  const label = (
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
  );

  const help = field.help ? (
    <p id={helpId} className="text-xs text-neutral-500">
      {field.help}
    </p>
  ) : null;

  const error = hasError ? (
    <p id={errorId} role="alert" className="text-xs text-red-300">
      {errorMessage ?? "Campo obrigatório: informe uma resposta ou marque como pendente."}
    </p>
  ) : null;

  if (field.type === "select" && field.control === "radio") {
    return (
      <div className={cn("space-y-1.5", field.span === 2 && "sm:col-span-2")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-neutral-200">
            {field.label}
            {field.required ? (
              <span className="ml-1 text-[var(--brand-text-accent)]" aria-hidden="true">
                *
              </span>
            ) : null}
          </span>
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
        <RadioGroupField
          field={field}
          value={value}
          invalid={hasError}
          describedBy={describedBy}
          disabled={pending}
          onChange={onChange}
        />
        {help}
        {error}
      </div>
    );
  }

  if (field.format === "date") {
    return (
      <div className={cn("space-y-1.5", field.span === 2 && "sm:col-span-2")}>
        {label}
        <DateField
          id={field.id}
          value={stringValue || undefined}
          invalid={hasError}
          describedBy={describedBy}
          disabled={pending}
          onChange={(canonical) => onChange(canonical)}
        />
        {help}
        {error}
      </div>
    );
  }

  if (field.format === "cep") {
    return (
      <CepField
        field={field}
        value={stringValue}
        pending={pending}
        hasError={hasError}
        describedBy={describedBy}
        onChange={onChange}
        onCepResolved={onCepResolved}
        label={label}
        help={help}
        error={error}
      />
    );
  }

  if (field.format === "cnpj" || field.format === "phone" || field.format === "decimal") {
    return (
      <div className={cn("space-y-1.5", field.span === 2 && "sm:col-span-2")}>
        {label}
        <MaskedTextField
          field={field}
          value={value}
          invalid={hasError}
          describedBy={describedBy}
          disabled={pending}
          onChange={onChange}
        />
        {help}
        {error}
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", field.span === 2 && "sm:col-span-2")}>
      {label}

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
            "flex h-10 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed md:text-sm",
            controlClass,
          )}
        >
          <option value="">Selecione…</option>
          {(field.options ?? []).map((option) => (
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

      {help}

      {pending ? (
        <p className="text-xs text-amber-300/90">
          Marcado como pendente. A informação não será tratada como confirmada.
        </p>
      ) : null}

      {error}
    </div>
  );
}

interface CepFieldProps {
  field: BriefingField;
  value: string;
  pending: boolean;
  hasError: boolean;
  describedBy: string | undefined;
  onChange: (value: BriefingValue) => void;
  onCepResolved?: ((result: CepLookupResult) => void) | undefined;
  label: ReactNode;
  help: ReactNode;
  error: ReactNode;
}

/**
 * Campo de CEP com máscara e consulta assistida. A consulta é um auxílio:
 * falha, timeout ou CEP inexistente apenas geram aviso e nunca impedem o
 * preenchimento manual do endereço.
 */
function CepField({
  field,
  value,
  pending,
  hasError,
  describedBy,
  onChange,
  onCepResolved,
  label,
  help,
  error,
}: CepFieldProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "not_found">("idle");
  const lastQueryRef = useRef<string>("");
  const callbackRef = useRef(onCepResolved);
  callbackRef.current = onCepResolved;

  useEffect(() => {
    if (!isValidCep(value)) {
      setStatus("idle");
      return;
    }

    if (lastQueryRef.current === value) return;
    lastQueryRef.current = value;

    const timer = setTimeout(async () => {
      setStatus("loading");
      const result = await lookupCep(value);
      if (!result) {
        setStatus("not_found");
        return;
      }
      setStatus("found");
      callbackRef.current?.(result);
    }, 600);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={cn("space-y-1.5", field.span === 2 && "sm:col-span-2")}>
      {label}
      <MaskedTextField
        field={field}
        value={value}
        invalid={hasError}
        describedBy={describedBy}
        disabled={pending}
        onChange={onChange}
      />
      <p aria-live="polite" className="text-xs text-neutral-500">
        {status === "loading"
          ? "Consultando CEP…"
          : status === "not_found"
            ? "CEP não localizado. Preencha o endereço manualmente."
            : status === "found"
              ? "Endereço preenchido a partir do CEP. Confira e ajuste se necessário."
              : ""}
      </p>
      {help}
      {error}
    </div>
  );
}

function isNonEmpty(value: BriefingValue | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
