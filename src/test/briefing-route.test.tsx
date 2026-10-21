import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup, within } from "@testing-library/react";
import { BRIEFING_DRAFT_KEY } from "@/features/briefing/domain/storage";
import { navigation, primaryNavigation } from "@/lib/brs";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return { ...actual, useNavigate: () => navigateMock };
});

const loadOwnBriefingMock = vi.fn();
const saveBriefingSectionMock = vi.fn();
const submitBriefingMock = vi.fn();
const uploadBriefingFileMock = vi.fn();

vi.mock("@/features/briefing/server/functions", () => ({
  loadOwnBriefing: (...args: unknown[]) => loadOwnBriefingMock(...args),
  saveBriefingSection: (...args: unknown[]) => saveBriefingSectionMock(...args),
  submitBriefing: (...args: unknown[]) => submitBriefingMock(...args),
  uploadBriefingFile: (...args: unknown[]) => uploadBriefingFileMock(...args),
  getBriefingSessionInfo: vi.fn(),
  signInWithPassword: vi.fn(),
  signOutBriefing: vi.fn(),
  listAdminBriefings: vi.fn(),
  loadAdminBriefing: vi.fn(),
  changeAdminBriefingStatus: vi.fn(),
  requestBriefingComplement: vi.fn(),
  addBriefingInternalNote: vi.fn(),
  createBriefingFileUrl: vi.fn(),
  deleteBriefingFile: vi.fn(),
}));

const { BriefingOperacionalContainer } =
  await import("@/features/briefing/ui/briefing-operacional-container");

const EMPTY_DETAIL = {
  briefing: {
    id: "briefing-1",
    companyName: "",
    status: "draft" as const,
    createdAt: "2026-10-20T10:00:00.000Z",
    updatedAt: "2026-10-20T10:00:00.000Z",
    submittedAt: null,
    completedAt: null,
    clientMessage: null,
  },
  sections: {},
  files: [],
  activity: [],
};

async function openBriefing() {
  loadOwnBriefingMock.mockResolvedValue({ ok: true, data: EMPTY_DETAIL });
  const view = render(<BriefingOperacionalContainer />);

  await screen.findByRole("heading", { name: /Briefing operacional e credenciamento/i });
  return view;
}

describe("Briefing operacional — rota privada em 15 etapas com persistência real", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    loadOwnBriefingMock.mockResolvedValue({ ok: true, data: EMPTY_DETAIL });
    saveBriefingSectionMock.mockResolvedValue({
      ok: true,
      data: { savedAt: "2026-10-20T12:00:00.000Z", sectionKey: "company_identification" },
    });
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

  it("carrega o rascunho do servidor e apresenta as 15 etapas", async () => {
    await openBriefing();

    expect(loadOwnBriefingMock).toHaveBeenCalled();
    expect(screen.getByText("Etapa 01 de 15")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Identificação da empresa" })).toBeInTheDocument();

    const stepButtons = screen.getAllByRole("button", { name: /^Etapa \d+:/ });
    expect(stepButtons).toHaveLength(15);
  });

  it("bloqueia o avanço sem obrigatório e permite avançar após marcar pendência", async () => {
    await openBriefing();

    fireEvent.click(screen.getByRole("button", { name: /Próxima etapa/i }));

    expect(await screen.findByText(/Para avançar, corrija os campos abaixo/i)).toBeInTheDocument();
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

  it("mantém o cache local do navegador como apoio, sem tratá-lo como persistência", async () => {
    const view = await openBriefing();

    const input = screen
      .getAllByLabelText(/Razão social/)
      .find((element) => element.tagName === "INPUT")!;
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

  it("envia as imagens ao armazenamento privado e informa o resultado real", async () => {
    uploadBriefingFileMock.mockResolvedValue({
      ok: true,
      data: {
        id: "file-1",
        originalName: "fachada.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 42,
        category: "fachada",
        createdAt: "2026-10-20T12:00:00.000Z",
      },
    });

    await openBriefing();

    fireEvent.click(screen.getByRole("button", { name: "Etapa 13: Fotos e portfólio" }));

    expect(await screen.findByRole("heading", { name: "Fotos e portfólio" })).toBeInTheDocument();

    const fileInput = screen.getByLabelText("Selecionar arquivos de imagem");
    const file = new File(["conteudo-binario"], "fachada.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(
      await screen.findByText(/arquivo\(s\) enviado\(s\) ao armazenamento privado/i),
    ).toBeInTheDocument();
    expect(uploadBriefingFileMock).toHaveBeenCalled();
    expect(screen.getByText("fachada.jpg")).toBeInTheDocument();
  });

  it("não confirma envio quando o servidor recusa a submissão", async () => {
    submitBriefingMock.mockResolvedValue({
      ok: false,
      error: { code: "validation", message: 'Etapa "Serviços e especialidades" incompleta.' },
    });

    await openBriefing();

    fireEvent.click(screen.getByRole("button", { name: /^Revisar$/ }));
    expect(await screen.findByText("Revisão final")).toBeInTheDocument();

    const confirmacao = screen.getByRole("checkbox", { name: /Confirmo que as informações/i });
    fireEvent.click(confirmacao);
    fireEvent.click(screen.getByRole("button", { name: /Enviar para análise/i }));

    await waitFor(() => {
      const alerts = screen.queryAllByRole("alert");
      expect(alerts.some((alert) => /incompleta/i.test(alert.textContent ?? ""))).toBe(true);
    });
    expect(screen.getByRole("button", { name: /Enviar para análise/i })).toBeInTheDocument();
    expect(screen.queryByText(/Briefing registrado no servidor/i)).not.toBeInTheDocument();
  });

  it("envia o briefing ao servidor e confirma apenas com persistência verificada", async () => {
    submitBriefingMock.mockResolvedValue({
      ok: true,
      data: {
        briefingId: "briefing-1",
        status: "submitted",
        submittedAt: "2026-10-20T12:00:00.000Z",
      },
    });

    await openBriefing();

    fireEvent.click(screen.getByRole("button", { name: /^Revisar$/ }));
    const enviar = await screen.findByRole("button", { name: /Enviar para análise/i });
    expect(enviar).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox", { name: /Confirmo que as informações/i }));
    fireEvent.click(screen.getByRole("button", { name: /Enviar para análise/i }));

    expect(
      await screen.findByText(/Briefing enviado e registrado no banco de dados/i),
    ).toBeInTheDocument();
    expect(submitBriefingMock).toHaveBeenCalled();
  });
});
