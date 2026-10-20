import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup, within } from "@testing-library/react";
import { BriefingOperacionalContainer } from "@/features/briefing/ui/briefing-operacional-container";
import { BRIEFING_DRAFT_KEY } from "@/features/briefing/domain/storage";
import { BRIEFING_SESSION_KEY } from "@/features/briefing/domain/access";
import { navigation, primaryNavigation } from "@/lib/brs";

async function enterBriefing() {
  const view = render(<BriefingOperacionalContainer />);

  const codeInput = await screen.findByLabelText("Código de acesso");
  fireEvent.change(codeInput, { target: { value: "MASTER-2026" } });
  fireEvent.click(screen.getByRole("button", { name: "Acessar briefing" }));

  await screen.findByRole("heading", { name: /Briefing operacional e credenciamento/i });
  return view;
}

describe("Briefing operacional — rota privada em 15 etapas", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("mantém /briefing fora da navegação pública", () => {
    const primaryHrefs = primaryNavigation.map(([, href]) => href);
    const allHrefs = navigation.map(([, href]) => href);

    expect(primaryHrefs).not.toContain("/briefing");
    expect(allHrefs).not.toContain("/briefing");
  });

  it("bloqueia o acesso sem código e libera as 15 etapas com o código de demonstração", async () => {
    render(<BriefingOperacionalContainer />);

    expect(
      await screen.findByRole("heading", { name: "Briefing operacional Master" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Etapa 01 de 15/)).not.toBeInTheDocument();

    const codeInput = screen.getByLabelText("Código de acesso");
    fireEvent.change(codeInput, { target: { value: "codigo-errado" } });
    fireEvent.click(screen.getByRole("button", { name: "Acessar briefing" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/Código de acesso inválido/i);
    expect(sessionStorage.getItem(BRIEFING_SESSION_KEY)).toBeNull();

    fireEvent.change(codeInput, { target: { value: "MASTER-2026" } });
    fireEvent.click(screen.getByRole("button", { name: "Acessar briefing" }));

    expect(
      await screen.findByRole("heading", { name: /Briefing operacional e credenciamento/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Etapa 01 de 15")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Identificação da empresa" })).toBeInTheDocument();
    expect(sessionStorage.getItem(BRIEFING_SESSION_KEY)).not.toBeNull();

    const stepButtons = screen.getAllByRole("button", { name: /^Etapa \d+:/ });
    expect(stepButtons).toHaveLength(15);
  });

  it("bloqueia o avanço sem obrigatório e permite avançar após marcar pendência", async () => {
    await enterBriefing();

    fireEvent.click(screen.getByRole("button", { name: /Próxima etapa/i }));

    expect(
      await screen.findByText(/Para avançar, informe ou marque como pendente/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Etapa 01 de 15")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Marcar .*Razão social.* como pendente/i));
    fireEvent.click(
      screen.getByLabelText(/Marcar .*Proprietário ou responsável legal.* como pendente/i),
    );
    fireEvent.click(screen.getByRole("button", { name: /Próxima etapa/i }));

    expect(
      await screen.findByRole("heading", { name: "Serviços e especialidades" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Revisar$/ }));
    const pendingHeading = await screen.findByText("Pendências registradas");
    const pendingSection = pendingHeading.closest("section");
    expect(pendingSection).not.toBeNull();
    expect(within(pendingSection!).getByText(/Etapa 1 — Razão social/)).toBeInTheDocument();
    expect(
      within(pendingSection!).getByText(/Etapa 1 — Proprietário ou responsável legal/),
    ).toBeInTheDocument();
  });

  it("restaura o rascunho local após recarregar a página", async () => {
    const view = await enterBriefing();

    const input = screen.getByLabelText(/^Razão social/);
    fireEvent.change(input, { target: { value: "Briefing Restaurado LTDA" } });

    await waitFor(
      () => {
        const raw = localStorage.getItem(BRIEFING_DRAFT_KEY);
        expect(raw).toContain("Briefing Restaurado LTDA");
      },
      { timeout: 2500 },
    );

    view.unmount();
    render(<BriefingOperacionalContainer />);

    expect(
      await screen.findByRole("heading", { name: /Briefing operacional e credenciamento/i }),
    ).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Briefing Restaurado LTDA")).toBeInTheDocument();
  });

  it("registra apenas metadados de imagens, sem enviar ou armazenar o arquivo", async () => {
    await enterBriefing();

    fireEvent.click(screen.getByRole("button", { name: "Etapa 13: Fotos e portfólio" }));

    expect(await screen.findByRole("heading", { name: "Fotos e portfólio" })).toBeInTheDocument();
    expect(screen.getByText("somente metadados")).toBeInTheDocument();

    const fileInput = screen.getByLabelText("Selecionar arquivos de imagem");
    const file = new File(["conteudo-binario-que-nao-deve-ser-lido"], "fachada.jpg", {
      type: "image/jpeg",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(await screen.findByText("fachada.jpg")).toBeInTheDocument();
    expect(screen.getByText(/Nenhum arquivo foi enviado ou armazenado/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Autorizo a avaliação desta imagem/i));

    await waitFor(
      () => {
        const raw = localStorage.getItem(BRIEFING_DRAFT_KEY) ?? "";
        expect(raw).toContain("fachada.jpg");
        expect(raw).toContain('"authorized":true');
        expect(raw).not.toContain("conteudo-binario-que-nao-deve-ser-lido");
      },
      { timeout: 2500 },
    );
  });

  it("conclui localmente e oferece exportação honesta na revisão", async () => {
    await enterBriefing();

    fireEvent.change(screen.getByLabelText(/^Razão social/), {
      target: { value: "LCL Chapeação LTDA" },
    });
    fireEvent.change(screen.getByLabelText(/^Proprietário ou responsável legal/), {
      target: { value: "Responsável Master" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Etapa 15: Observações e confirmação" }));
    expect(
      await screen.findByRole("heading", { name: "Observações e confirmação" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^Responsável pelo preenchimento/), {
      target: { value: "Responsável Master" },
    });
    fireEvent.click(screen.getByLabelText(/Declaro que as informações correspondem/i));
    fireEvent.click(screen.getByLabelText(/Estou ciente de que as informações serão usadas/i));

    fireEvent.click(screen.getByRole("button", { name: /^Revisar$/ }));
    expect(await screen.findByText("Revisão final")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Concluir localmente/i }));

    expect(await screen.findByText(/Briefing concluído localmente/)).toBeInTheDocument();
    expect(screen.getByText("Concluído localmente")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Baixar JSON/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Baixar relatório/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copiar relatório/i })).toBeInTheDocument();
    expect(screen.getByText(/não representa envio/i)).toBeInTheDocument();
    expect(screen.queryByText(/enviado com sucesso/i)).not.toBeInTheDocument();

    await waitFor(
      () => {
        expect(localStorage.getItem(BRIEFING_DRAFT_KEY)).toContain('"completed":true');
      },
      { timeout: 2500 },
    );
  });
});
