import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { buildContentSecurityPolicy, buildSecurityHeaders } from "@/lib/security-headers";
import {
  ALLOWED_POST_LOGIN_PATHS,
  DEFAULT_POST_LOGIN_PATH,
  sanitizeRedirectTarget,
} from "@/lib/redirect";
import { resolveBriefingCookieOptions } from "@/features/briefing/server/supabase-server";

/**
 * Regressões de segurança introduzidas pela auditoria do briefing
 * (OWASP A01/A02/A07:2025).
 */
describe("Cabeçalhos de segurança", () => {
  it("AC-SEC-01: aplica CSP, nosniff, DENY, referrer e permissions-policy", () => {
    const headers = buildSecurityHeaders({ isSecureRequest: false, isDevelopment: false });

    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
  });

  it("AC-SEC-02: HSTS só é enviado em requisições HTTPS", () => {
    const insecure = buildSecurityHeaders({ isSecureRequest: false, isDevelopment: false });
    const secure = buildSecurityHeaders({ isSecureRequest: true, isDevelopment: false });

    expect(insecure["strict-transport-security"]).toBeUndefined();
    expect(secure["strict-transport-security"]).toContain("max-age=63072000");
  });

  it("AC-SEC-03: em desenvolvimento a CSP relaxa apenas o script e a conexão", () => {
    const development = buildContentSecurityPolicy({
      isSecureRequest: false,
      isDevelopment: true,
    });

    expect(development).toContain("'unsafe-eval'");
    expect(development).toContain("ws:");
    expect(development).toContain("default-src 'self'");
  });

  it("AC-SEC-04: a CSP de produção mantém as diretivas restritivas", () => {
    const production = buildContentSecurityPolicy({
      isSecureRequest: true,
      isDevelopment: false,
    });

    expect(production).not.toContain("'unsafe-eval'");
    expect(production).not.toContain("upgrade-insecure-requests;");
    expect(production).toContain("upgrade-insecure-requests");
    expect(production).toContain("base-uri 'self'");
    expect(production).toContain("form-action 'self'");
  });
});

describe("Redirecionamento após login", () => {
  it("AC-SEC-05: aceita apenas caminhos internos permitidos", () => {
    expect(sanitizeRedirectTarget("/briefing")).toBe("/briefing");
    expect(sanitizeRedirectTarget("/admin/briefings")).toBe("/admin/briefings");
    expect(sanitizeRedirectTarget("/admin/briefings/123")).toBe("/admin/briefings/123");
  });

  it("AC-SEC-06: rejeita destinos externos e esquemas perigosos", () => {
    const payloads = [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "javascript:alert(1)",
      "http://evil.example/briefing",
      "/etc/passwd",
      "/briefing\r\nSet-Cookie: a=b",
    ];

    for (const payload of payloads) {
      expect(sanitizeRedirectTarget(payload)).toBe(DEFAULT_POST_LOGIN_PATH);
    }
  });

  it("AC-SEC-07: valores ausentes ou vazios caem no destino padrão", () => {
    expect(sanitizeRedirectTarget(undefined)).toBe(DEFAULT_POST_LOGIN_PATH);
    expect(sanitizeRedirectTarget(null)).toBe(DEFAULT_POST_LOGIN_PATH);
    expect(sanitizeRedirectTarget("   ")).toBe(DEFAULT_POST_LOGIN_PATH);
    expect(ALLOWED_POST_LOGIN_PATHS).toContain(DEFAULT_POST_LOGIN_PATH);
  });
});

describe("Cookie de sessão", () => {
  it("AC-SEC-08: o cookie da sessão é httpOnly, sameSite lax e secure em HTTPS", () => {
    expect(resolveBriefingCookieOptions(true)).toEqual({
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: true,
    });

    expect(resolveBriefingCookieOptions(false)).toEqual({
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: false,
    });
  });

  it("AC-SEC-09: a aplicação não usa mais o cookie padrão legível por script", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "src/features/briefing/server/supabase-server.ts"),
      "utf-8",
    );

    expect(source).toContain("cookieOptions: resolveBriefingCookieOptions");
    expect(source).not.toContain("httpOnly: false");
  });
});

describe("Gatilho de proteção do papel (profiles.role)", () => {
  const migrationPath = path.resolve(
    process.cwd(),
    "supabase/migrations/20261021000200_profile_role_guard_hardening.sql",
  );

  it("AC-SEC-10: o gatilho é security invoker, para que current_user seja a sessão real", () => {
    const sql = fs.readFileSync(migrationPath, "utf-8");
    const definition = sql.slice(
      sql.indexOf("create or replace function public.guard_profile_role()"),
    );

    expect(definition).toContain("security invoker");
    expect(definition.slice(0, 800)).not.toMatch(/security\s+definer/i);
  });

  it("AC-SEC-11: a atualização de profiles é restrita à coluna display_name", () => {
    const sql = fs.readFileSync(migrationPath, "utf-8");

    expect(sql).toContain("revoke update on public.profiles from authenticated");
    expect(sql).toContain("grant update (display_name) on public.profiles to authenticated");
  });

  it("AC-SEC-12: a migração anterior não combina security definer com current_user", () => {
    const previous = fs.readFileSync(
      path.resolve(
        process.cwd(),
        "supabase/migrations/20261021000100_profile_role_guard_privileged.sql",
      ),
      "utf-8",
    );

    // A combinação `security definer` + `current_user in ('postgres', ...)`
    // é o defeito que permitia a elevação de privilégio.
    expect(previous).toMatch(/security\s+definer/i);
    expect(previous).toContain("current_user in ('postgres', 'supabase_admin')");
  });
});
