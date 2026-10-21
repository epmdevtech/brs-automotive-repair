/**
 * Formatação de datas para exibição, determinística entre servidor e cliente.
 *
 * `toLocaleString` produz formatos diferentes conforme o fuso e o locale do
 * runtime, o que quebra a hidratação do SSR. Aqui a data é sempre exibida em
 * UTC, no padrão brasileiro, a partir do valor canônico persistido.
 */

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** `2026-10-20T19:44:07.840Z` → `20/10/2026`. */
export function formatDateUtc(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
}

/** `2026-10-20T19:44:07.840Z` → `20/10/2026, 16:44` (UTC). */
export function formatDateTimeUtc(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return `${formatDateUtc(iso)}, ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

/** `2026-10-20T19:44:07.840Z` → `20/10/2026, 16:44:07` (UTC). */
export function formatDateTimeSecondsUtc(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return `${formatDateUtc(iso)}, ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
    date.getUTCSeconds(),
  )}`;
}
