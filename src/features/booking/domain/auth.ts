import type { Result } from "./types";

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  loginTime: string;
}

export const DEMO_CREDENTIALS = {
  email: "admin@master.local",
  password: "demo123",
  name: "Avaliador Técnico",
  role: "Administrador / Oficina",
};

const SESSION_KEY = "master_admin_session";

export function getAdminSession(): AdminUser | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function loginAdmin(email: string, pass: string): Result<AdminUser, string> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (
    cleanEmail === DEMO_CREDENTIALS.email.toLowerCase() &&
    cleanPass === DEMO_CREDENTIALS.password
  ) {
    const user: AdminUser = {
      email: DEMO_CREDENTIALS.email,
      name: DEMO_CREDENTIALS.name,
      role: DEMO_CREDENTIALS.role,
      loginTime: new Date().toISOString(),
    };

    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }

    return { ok: true, value: user };
  }

  return {
    ok: false,
    error: "Credenciais inválidas. Utilize os dados de demonstração fornecidos.",
  };
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
