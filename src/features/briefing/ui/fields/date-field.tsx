import { useEffect, useRef, useState } from "react";
import { formatDateBr, isValidDateBr, parseDateBr } from "../../domain/masks";
import { cn } from "@/lib/utils";

interface DateFieldProps {
  id: string;
  value: string | undefined;
  invalid?: boolean;
  describedBy?: string | undefined;
  disabled?: boolean;
  onChange: (canonical: string) => void;
  onBlur?: () => void;
}

const SEGMENTS = [
  { key: "day", label: "Dia", max: 2 },
  { key: "month", label: "Mês", max: 2 },
  { key: "year", label: "Ano", max: 4 },
] as const;

type SegmentKey = (typeof SEGMENTS)[number]["key"];

/**
 * Entrada de data civil em segmentos dd/mm/aaaa, com navegação por teclado e
 * validação de calendário (inclui anos bissextos). O valor entregue é a forma
 * canônica `YYYY-MM-DD`, que é o que o banco recebe.
 */
export function DateField({
  id,
  value,
  invalid,
  describedBy,
  disabled,
  onChange,
  onBlur,
}: DateFieldProps) {
  const initial = value ? formatDateBr(value) : "";
  const [segments, setSegments] = useState<Record<SegmentKey, string>>(() => ({
    day: initial.slice(0, 2),
    month: initial.slice(3, 5),
    year: initial.slice(6, 10),
  }));
  const inputsRef = useRef<Partial<Record<SegmentKey, HTMLInputElement | null>>>({});
  const lastValueRef = useRef<string | undefined>(value);

  useEffect(() => {
    if (lastValueRef.current === value) return;
    lastValueRef.current = value;
    const next = value ? formatDateBr(value) : "";
    setSegments({ day: next.slice(0, 2), month: next.slice(3, 5), year: next.slice(6, 10) });
  }, [value]);

  function commit(next: Record<SegmentKey, string>) {
    setSegments(next);
    const composed = `${next.day}/${next.month}/${next.year}`;
    if (next.day.length === 2 && next.month.length === 2 && next.year.length === 4) {
      if (isValidDateBr(composed)) {
        const canonical = parseDateBr(composed);
        if (canonical) {
          lastValueRef.current = canonical;
          onChange(canonical);
        }
      }
    }
  }

  function focusSegment(key: SegmentKey) {
    inputsRef.current[key]?.focus();
    inputsRef.current[key]?.select();
  }

  function handleChange(key: SegmentKey, raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, SEGMENTS.find((s) => s.key === key)?.max ?? 2);
    const next = { ...segments, [key]: digits };
    commit(next);

    if (key === "day" && digits.length === 2) focusSegment("month");
    if (key === "month" && digits.length === 2) focusSegment("year");
  }

  function handleKeyDown(key: SegmentKey, event: React.KeyboardEvent<HTMLInputElement>) {
    const order: SegmentKey[] = ["day", "month", "year"];
    const index = order.indexOf(key);

    if (event.key === "ArrowRight" && index < order.length - 1) {
      event.preventDefault();
      focusSegment(order[index + 1]!);
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusSegment(order[index - 1]!);
    }
    if (event.key === "Backspace" && segments[key].length === 0 && index > 0) {
      event.preventDefault();
      focusSegment(order[index - 1]!);
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1",
        invalid && "border-red-400/60",
      )}
    >
      <span className="sr-only" id={`${id}-label`}>
        Data
      </span>
      {SEGMENTS.map((segment, index) => (
        <div key={segment.key} className="flex items-center gap-1">
          <input
            ref={(element) => {
              inputsRef.current[segment.key] = element;
            }}
            id={index === 0 ? id : `${id}-${segment.key}`}
            name={index === 0 ? id : undefined}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "bday" : "off"}
            placeholder={segment.label}
            aria-label={segment.label}
            value={segments[segment.key]}
            disabled={disabled}
            onChange={(event) => handleChange(segment.key, event.target.value)}
            onKeyDown={(event) => handleKeyDown(segment.key, event)}
            onBlur={onBlur}
            aria-invalid={invalid ? true : undefined}
            aria-describedby={describedBy}
            className="w-9 bg-transparent text-center text-base text-white outline-none placeholder:text-neutral-600 focus:text-white md:text-sm"
          />
          {index < SEGMENTS.length - 1 ? (
            <span aria-hidden="true" className="text-neutral-500">
              /
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
