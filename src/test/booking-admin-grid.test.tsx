import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminLogin } from "../features/booking/ui/admin/admin-login";
import { AdminGridView } from "../features/booking/ui/admin/admin-grid-view";
import {
  loginAdmin,
  logoutAdmin,
  isAdminAuthenticated,
  getAdminSession,
  DEMO_CREDENTIALS,
} from "../features/booking/domain/auth";
import {
  addBlockedPeriod,
  getBlockedPeriods,
  isPeriodBlocked,
} from "../features/booking/domain/blocks";
import { localBookingRepository } from "../features/booking/data/local/local-repository";

describe("Domain: Admin Auth & Session Management", () => {
  beforeEach(() => {
    logoutAdmin();
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("authenticates successfully with canonical demo credentials", () => {
    const result = loginAdmin(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe(DEMO_CREDENTIALS.email);
      expect(result.value.role).toBe("Administrador / Oficina");
    }
    expect(isAdminAuthenticated()).toBe(true);
    expect(getAdminSession()?.email).toBe(DEMO_CREDENTIALS.email);
  });

  it("rejects invalid credentials with an explicit error", () => {
    const result = loginAdmin("outro@brs.com", "senhaerrada");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Credenciais inválidas");
    }
    expect(isAdminAuthenticated()).toBe(false);
  });

  it("clears session on logoutAdmin", () => {
    loginAdmin(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    expect(isAdminAuthenticated()).toBe(true);

    logoutAdmin();
    expect(isAdminAuthenticated()).toBe(false);
    expect(getAdminSession()).toBeNull();
  });
});

describe("Domain: Period Blocking Management", () => {
  it("allows adding a blocked period and detecting collision", () => {
    const start = new Date(2026, 9, 20, 10, 0);
    const end = new Date(2026, 9, 20, 12, 0);

    const block = addBlockedPeriod({
      professionalId: "bruno-funilaria",
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      reason: "Manutenção de Estufa",
    });

    expect(block.id).toBeDefined();
    expect(getBlockedPeriods()).toContainEqual(
      expect.objectContaining({ reason: "Manutenção de Estufa" }),
    );

    // Test collision
    const testSlotStart = new Date(2026, 9, 20, 10, 30);
    const testSlotEnd = new Date(2026, 9, 20, 11, 30);
    expect(isPeriodBlocked(testSlotStart, testSlotEnd, "bruno-funilaria")).toBe(true);

    // Unrelated professional should not collide
    expect(isPeriodBlocked(testSlotStart, testSlotEnd, "tecnico-martelinho")).toBe(false);
  });
});

describe("UI: AdminLogin Component", () => {
  it("renders the login card matching the benchmark visual layout", () => {
    render(<AdminLogin onLoginSuccess={vi.fn()} />);

    expect(screen.getByText(/Acesso Administrativo/i)).toBeInTheDocument();
    expect(screen.getByText(/Painel da Oficina/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nome@master.local/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Senha de acesso", { selector: "input" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar no Painel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Preencher dados demo em 1 clique/i }),
    ).toBeInTheDocument();
  });

  it("pre-fills demo credentials on 1-click button click", () => {
    render(<AdminLogin onLoginSuccess={vi.fn()} />);

    const demoBtn = screen.getByRole("button", { name: /Preencher dados demo em 1 clique/i });
    fireEvent.click(demoBtn);

    const emailInput = screen.getByPlaceholderText(/nome@master.local/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Senha de acesso", {
      selector: "input",
    }) as HTMLInputElement;

    expect(emailInput.value).toBe(DEMO_CREDENTIALS.email);
    expect(passwordInput.value).toBe(DEMO_CREDENTIALS.password);
  });

  it("invokes onLoginSuccess on valid submission", () => {
    const handleSuccess = vi.fn();
    render(<AdminLogin onLoginSuccess={handleSuccess} />);

    fireEvent.click(screen.getByRole("button", { name: /Preencher dados demo em 1 clique/i }));
    fireEvent.click(screen.getByRole("button", { name: /Entrar no Painel/i }));

    expect(handleSuccess).toHaveBeenCalledTimes(1);
    expect(handleSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ email: DEMO_CREDENTIALS.email }),
    );
  });

  it("displays error message on invalid submission", () => {
    render(<AdminLogin onLoginSuccess={vi.fn()} />);

    const emailInput = screen.getByPlaceholderText(/nome@master.local/i);
    const passwordInput = screen.getByLabelText("Senha de acesso", { selector: "input" });

    fireEvent.change(emailInput, { target: { value: "invalido@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "senhaerrada" } });

    fireEvent.click(screen.getByRole("button", { name: /Entrar no Painel/i }));

    expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument();
  });
});

describe("UI: AdminGridView Component", () => {
  it("renders the day grid platform with columns for each technician", () => {
    render(<AdminGridView onLogout={vi.fn()} />);

    expect(screen.getByText(/Agenda dos Técnicos/i)).toBeInTheDocument();
    expect(screen.getByText(/EPM BOOKING/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Equipe Técnica Master/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Técnico Martelinho de Ouro/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Técnico Pintura em Estufa/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Novo Agendamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Bloquear Período/i)).toBeInTheDocument();
  });

  it("allows switching tabs between Dia, Lista and Guincho", () => {
    render(<AdminGridView onLogout={vi.fn()} />);

    const listTab = screen.getByRole("button", { name: /Lista/i });
    fireEvent.click(listTab);
    expect(screen.getByText(/Listagem Cronológica de Atendimentos/i)).toBeInTheDocument();

    const levaTab = screen.getByRole("button", { name: /Guincho/i });
    fireEvent.click(levaTab);
    expect(screen.getByText(/Roteiro de Remoção com Guincho/i)).toBeInTheDocument();
  });

  it("opens manual booking dialog when clicking + Livre", () => {
    render(<AdminGridView onLogout={vi.fn()} />);

    const livreButtons = screen.getAllByRole("button", { name: /\+ Livre/i });
    expect(livreButtons.length).toBeGreaterThan(0);

    fireEvent.click(livreButtons[0]);

    expect(screen.getByText(/Novo Agendamento na Baia Técnica/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex: João da Silva/i)).toBeInTheDocument();
  });

  it("triggers onLogout when clicking Sair", () => {
    const handleLogout = vi.fn();
    render(<AdminGridView onLogout={handleLogout} />);

    const logoutBtn = screen.getByRole("button", { name: /Sair/i });
    fireEvent.click(logoutBtn);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
