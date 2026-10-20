export const BRIEFING_DEMO_ACCESS_CODE = "MASTER-2026";
export const BRIEFING_SESSION_KEY = "master_briefing_access_v1";
export const BRIEFING_SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function configuredAccessCode(): string {
  const configured = import.meta.env["VITE_BRIEFING_ACCESS_CODE"];
  return typeof configured === "string" && configured.trim().length > 0
    ? configured.trim()
    : BRIEFING_DEMO_ACCESS_CODE;
}

export function authorizeBriefing(code: string): boolean {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") return false;

  const expected = configuredAccessCode().toUpperCase();
  const received = code.trim().toUpperCase();
  if (received.length === 0 || received !== expected) return false;

  try {
    sessionStorage.setItem(
      BRIEFING_SESSION_KEY,
      JSON.stringify({ expiresAt: Date.now() + BRIEFING_SESSION_DURATION_MS }),
    );
    return true;
  } catch {
    return false;
  }
}

export function isBriefingAuthorized(): boolean {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") return false;

  try {
    const raw = sessionStorage.getItem(BRIEFING_SESSION_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as { expiresAt?: unknown };
    if (typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Date.now()) {
      sessionStorage.removeItem(BRIEFING_SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function revokeBriefingAccess(): void {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") return;

  try {
    sessionStorage.removeItem(BRIEFING_SESSION_KEY);
  } catch {
    return;
  }
}
