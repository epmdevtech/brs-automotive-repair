import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BriefingContainer } from "@/components/brs/briefing/briefing-container";
import { navigation, primaryNavigation } from "@/lib/brs";
import { BRIEFING_STORAGE_KEY } from "@/lib/briefing";

describe("Briefing Route & UI Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("garante que a rota /briefing NÃO está presente na barra de navegação pública nem no rodapé", () => {
    const primaryHrefs = primaryNavigation.map(([, href]) => href);
    const allHrefs = navigation.map(([, href]) => href);

    expect(primaryHrefs).not.toContain("/briefing");
    expect(allHrefs).not.toContain("/briefing");
  });

  it("renderiza o container de briefing com título e o stepper de 9 etapas", () => {
    render(<BriefingContainer />);

    expect(screen.getByText("Execução de Briefing Técnico")).toBeInTheDocument();
    expect(screen.getByText(/Portal de Engenharia de Briefings EPM DEVTECH/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Dados Cadastrais e Contratante/i)).toBeInTheDocument();
    expect(screen.getByText("Contratante")).toBeInTheDocument();
    expect(screen.getByText("Identidade")).toBeInTheDocument();
    expect(screen.getByText("Equipe")).toBeInTheDocument();
    expect(screen.getByText("Serviços")).toBeInTheDocument();
    expect(screen.getByText("Agenda")).toBeInTheDocument();
    expect(screen.getByText("Unidades")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
    expect(screen.getByText("Técnico")).toBeInTheDocument();
    expect(screen.getByText("Revisão")).toBeInTheDocument();
  });

  it("permite navegar para a etapa de Identidade Visual e exibe o auditor de contraste WCAG", () => {
    render(<BriefingContainer />);

    // Clica no botão do stepper para a etapa 2 (Identidade)
    const stepIdentidadeBtn = screen.getByText("Identidade");
    fireEvent.click(stepIdentidadeBtn);

    expect(screen.getByText(/2\. Identidade Visual & Design Tokens/i)).toBeInTheDocument();
    expect(screen.getByText(/Auditor de Contraste WCAG 2\.2 em Tempo Real/i)).toBeInTheDocument();
  });

  it("persiste dados editados no localStorage através do autosave", async () => {
    render(<BriefingContainer />);

    const inputRazaoSocial = screen.getByPlaceholderText(/Brs Comercio de Pecas/i);
    expect(inputRazaoSocial).toBeInTheDocument();

    // Digita nova razão social dentro de act
    await act(async () => {
      fireEvent.change(inputRazaoSocial, {
        target: { value: "Oficina Mecânica Teste EPM LTDA" },
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    const savedRaw = localStorage.getItem(BRIEFING_STORAGE_KEY);
    expect(savedRaw).not.toBeNull();
    const saved = JSON.parse(savedRaw!);
    expect(saved.contratante?.razao_social).toBe("Oficina Mecânica Teste EPM LTDA");
  });

  it("permite avançar até a etapa de revisão e exibe os botões de exportação", () => {
    render(<BriefingContainer />);

    // Clica no botão de Revisão no Stepper
    const stepRevisaoBtn = screen.getByText("Revisão");
    fireEvent.click(stepRevisaoBtn);

    expect(screen.getByText(/9\. Validação, Revisão & Exportação/i)).toBeInTheDocument();
    expect(screen.getByText(/Baixar briefing-completo\.json/i)).toBeInTheDocument();
    expect(screen.getByText(/Baixar booking-config\.json/i)).toBeInTheDocument();
    expect(screen.getByText(/Copiar JSON Completo/i)).toBeInTheDocument();
  });
});
