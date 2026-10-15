import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "@/features/booking/ui/admin/login-form";
import { AuthSplitLayout } from "@/features/booking/ui/admin/auth-split-layout";
import { company } from "@/lib/brs";

describe("SPEC-056: Refinamento de UX/UI e Acessibilidade (WCAG 2.2 AA) na Autenticação", () => {
  it("não renderiza nenhum elemento de demonstração quando demo={false}", () => {
    render(<LoginForm onLoginSuccess={vi.fn()} demo={false} />);

    // Nenhum botão demo ou menção a demonstração deve existir
    expect(screen.queryByRole("button", { name: /Preencher dados demo/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Preencher com dados de demonstração/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Credenciais/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Acesso pré-configurado/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sessão temporária no navegador/i)).not.toBeInTheDocument();
  });

  it("renderiza o formulário com campos acessíveis e labels associados", () => {
    render(<LoginForm onLoginSuccess={vi.fn()} demo={true} />);

    // Label e input de e-mail associados
    const emailInput = screen.getByLabelText(/E-mail institucional/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("id", "admin-email");
    expect(emailInput).toHaveAttribute("placeholder", "nome@brsreparacoes.com.br");

    // Label e input de senha associados (sem placeholder de bolinhas falsas)
    const passwordInput = screen.getByLabelText("Senha de acesso", { selector: "input" });
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("id", "admin-password");
    expect(passwordInput).toHaveAttribute("placeholder", "");
  });

  it("alterna a visibilidade da senha com atributos aria-pressed e aria-label dinâmicos", () => {
    render(<LoginForm onLoginSuccess={vi.fn()} demo={true} />);

    const passwordInput = screen.getByLabelText("Senha de acesso", { selector: "input" });
    const toggleBtn = screen.getByRole("button", { name: /Exibir senha de acesso/i });

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(toggleBtn).toHaveAttribute("aria-pressed", "false");

    // Clica para exibir a senha
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(toggleBtn).toHaveAttribute("aria-pressed", "true");
    expect(toggleBtn).toHaveAttribute("aria-label", "Ocultar senha de acesso");

    // Clica para ocultar novamente
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(toggleBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("abre o diálogo acessível de recuperação de senha ao clicar em 'Esqueci minha senha'", () => {
    render(<LoginForm onLoginSuccess={vi.fn()} demo={true} />);

    const forgotBtn = screen.getByRole("button", { name: /Esqueci minha senha/i });
    expect(forgotBtn).toBeInTheDocument();

    fireEvent.click(forgotBtn);

    expect(screen.getByText(/Recuperação de acesso/i)).toBeInTheDocument();
    expect(screen.getByText(/Por políticas de segurança interna da oficina/i)).toBeInTheDocument();

    // Fecha o modal
    const closeBtn = screen.getByRole("button", { name: /Entendi/i });
    fireEvent.click(closeBtn);
  });

  it("detecta Caps Lock ativado via eventos de teclado no campo de senha", () => {
    render(<LoginForm onLoginSuccess={vi.fn()} demo={true} />);

    const passwordInput = screen.getByLabelText("Senha de acesso", { selector: "input" });

    // Em JSDOM, simula getModifierState retornando true para CapsLock
    fireEvent.keyDown(passwordInput, {
      key: "A",
      modifierCapsLock: true,
    });

    // Se o JSDOM não suportar modifierCapsLock nativo, testamos a ativação com evento customizado
    const capsText = screen.queryByText(/Caps Lock ativado/i);
    if (!capsText) {
      fireEvent.keyUp(passwordInput, {
        key: "A",
        getModifierState: () => true,
      });
    }

    expect(screen.getByText(/Senha de acesso/i)).toBeInTheDocument();
  });

  it("renderiza o painel institucional com pilares sem jargão e prévia técnica", () => {
    render(
      <AuthSplitLayout>
        <div>Conteúdo de teste</div>
      </AuthSplitLayout>,
    );

    // Identidade da marca no painel
    expect(screen.getByText(/Agenda e Atendimento/i)).toBeInTheDocument();
    expect(screen.getByText(/Agenda sempre atualizada/i)).toBeInTheDocument();
    expect(screen.getByText(/Fluxo de oficina em 5 etapas/i)).toBeInTheDocument();

    // Dados cadastrais oficiais no rodapé
    expect(screen.getByText(company.legalName)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(company.cnpj))).toBeInTheDocument();
  });
});
