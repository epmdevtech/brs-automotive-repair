import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent, cleanup, within } from "@testing-library/react";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "@/routeTree.gen";
import { navigation, primaryNavigation } from "@/lib/brs";
import { buildRouteHead } from "@/lib/seo";

const loadOwnBriefingMock = vi.fn();
const saveBriefingSectionMock = vi.fn();
const submitBriefingMock = vi.fn();
const listAdminBriefingsMock = vi.fn();
const signInWithPasswordMock = vi.fn();

vi.mock("@/features/briefing/server/functions", () => ({
  loadOwnBriefing: (...args: unknown[]) => loadOwnBriefingMock(...args),
  saveBriefingSection: (...args: unknown[]) => saveBriefingSectionMock(...args),
  submitBriefing: (...args: unknown[]) => submitBriefingMock(...args),
  listAdminBriefings: (...args: unknown[]) => listAdminBriefingsMock(...args),
  signInWithPassword: (...args: unknown[]) => signInWithPasswordMock(...args),
  getBriefingSessionInfo: vi.fn(),
  signOutBriefing: vi.fn(),
  loadAdminBriefing: vi.fn(),
  changeAdminBriefingStatus: vi.fn(),
  requestBriefingComplement: vi.fn(),
  addBriefingInternalNote: vi.fn(),
  uploadBriefingFile: vi.fn(),
  createBriefingFileUrl: vi.fn(),
  deleteBriefingFile: vi.fn(),
}));

const { BriefingOperacionalContainer } =
  await import("@/features/briefing/ui/briefing-operacional-container");
const { BriefingLoginForm } = await import("@/features/briefing/ui/briefing-login-form");
const { BriefingAdminList } = await import("@/features/briefing/ui/admin/briefing-admin-list");

const EMPTY_DETAIL = {
  briefing: {
    id: "briefing-1",
    companyName: "LCL Chapeação LTDA",
    status: "draft" as const,
    createdAt: "2026-10-20T10:00:00.000Z",
    updatedAt: "2026-10-20T10:00:00.000Z",
    submittedAt: null,
    completedAt: null,
    clientMessage: null,
  },
  sections: {
    company_identification: {
      values: { "empresa.razaoSocial": "LCL Chapeação LTDA" },
      pending: {},
    },
  },
  files: [],
  activity: [],
};

describe("SPEC-073 — interface do briefing persistido", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("1. Isolamento das rotas privadas", () => {
    it("mantém as rotas de briefing e administration fora da navegação pública", () => {
      const publicHrefs = [...primaryNavigation, ...navigation].map(([, href]) => href);

      for (const path of [
        "/briefing",
        "/briefing/confirmacao",
        "/admin/briefings",
        "/admin/briefings/1",
      ]) {
        expect(publicHrefs).not.toContain(path);
      }
    });

    it("mantém as rotas privadas com noindex", () => {
      const head = buildRouteHead({
        title: "Briefing",
        description: "Briefing operacional",
        path: "/briefing",
        noindex: true,
      });

      const robots = head.meta.find((meta) => meta.name === "robots");
      expect(robots?.content).toContain("noindex");
      expect(robots?.content).toContain("nofollow");
    });

    it("registra as rotas privadas na árvore do roteador", () => {
      const queryClient = new QueryClient();
      const router = createRouter({ routeTree, context: { queryClient } });

      for (const path of [
        "/briefing",
        "/briefing/confirmacao",
        "/admin/briefings",
        "/admin/briefings/00000000-0000-4000-8000-000000000000",
      ]) {
        const matches = router.matchRoutes(path);
        expect(matches.length).toBeGreaterThan(0);
        expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
      }
    });
  });

  describe("2. Degradação honesta sem backend configurado", () => {
    it("informa que a persistência está indisponível e não simula gravação", async () => {
      loadOwnBriefingMock.mockResolvedValue({
        ok: false,
        error: {
          code: "not_configured",
          message: "Persistência indisponível: configure SUPABASE_URL e SUPABASE_ANON_KEY.",
        },
      });

      render(<BriefingOperacionalContainer />);

      expect(
        await screen.findByRole("heading", { name: /Persistência indisponível/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/configure SUPABASE_URL/i)).toBeInTheDocument();
      expect(saveBriefingSectionMock).not.toHaveBeenCalled();
      expect(submitBriefingMock).not.toHaveBeenCalled();
    });

    it("exibe erro de carregamento com nova tentativa quando o serviço falha", async () => {
      loadOwnBriefingMock.mockResolvedValue({
        ok: false,
        error: { code: "unavailable", message: "Falha de comunicação com o serviço de dados." },
      });

      render(<BriefingOperacionalContainer />);

      expect(
        await screen.findByRole("heading", { name: /Não foi possível carregar o briefing/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Tentar novamente/i })).toBeInTheDocument();
    });
  });

  describe("3. Formulário persistido", () => {
    it("restaura as respostas vindas do servidor e mantém as 15 etapas", async () => {
      loadOwnBriefingMock.mockResolvedValue({ ok: true, data: EMPTY_DETAIL });

      render(<BriefingOperacionalContainer />);

      expect(
        await screen.findByRole("heading", { name: /Briefing operacional e credenciamento/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Etapa 01 de 15")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Identificação da empresa" })).toBeInTheDocument();
      await waitFor(() => {
        expect(loadOwnBriefingMock).toHaveBeenCalled();
      });
    });

    it("envia a etapa ao servidor com os valores preenchidos", async () => {
      loadOwnBriefingMock.mockResolvedValue({ ok: true, data: EMPTY_DETAIL });
      saveBriefingSectionMock.mockResolvedValue({
        ok: true,
        data: { savedAt: "2026-10-20T12:00:00.000Z", sectionKey: "company_identification" },
      });

      render(<BriefingOperacionalContainer />);

      const razaoSocial = (await screen.findAllByLabelText(/Razão social/)).find(
        (element) => element.tagName === "INPUT",
      );
      fireEvent.change(razaoSocial!, { target: { value: "LCL Chapeação LTDA" } });

      const proprietario = screen
        .getAllByLabelText(/Proprietário ou responsável legal/)
        .find((element) => element.tagName === "INPUT");
      fireEvent.change(proprietario!, { target: { value: "Maria Master" } });

      await waitFor(
        () => {
          expect(saveBriefingSectionMock).toHaveBeenCalled();
        },
        { timeout: 4000 },
      );

      const payload = saveBriefingSectionMock.mock.calls.at(-1)?.[0] as {
        data: { sectionKey: string; values: Record<string, string> };
      };
      expect(payload.data.sectionKey).toBe("company_identification");
      expect(payload.data.values["empresa.razaoSocial"]).toBe("LCL Chapeação LTDA");
    });
  });

  describe("4. Login sem credenciais fixas", () => {
    it("valida o formulário antes de chamar o servidor", async () => {
      render(<BriefingLoginForm onAuthenticated={vi.fn()} />);

      fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

      expect(await screen.findByText("Informe o e-mail")).toBeInTheDocument();
      expect(signInWithPasswordMock).not.toHaveBeenCalled();
    });

    it("informa falha de autenticação sem expor credenciais padrão", async () => {
      signInWithPasswordMock.mockResolvedValue({
        ok: true,
        data: {
          authenticated: false,
          email: null,
          role: null,
          message: "E-mail ou senha inválidos.",
        },
      });

      render(<BriefingLoginForm onAuthenticated={vi.fn()} />);

      fireEvent.change(screen.getByLabelText("E-mail"), {
        target: { value: "responsavel@master.com" },
      });
      fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "senha-forte" } });
      fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

      expect(await screen.findByRole("alert")).toHaveTextContent(/E-mail ou senha inválidos/i);
      expect(screen.queryByText(/demo123|MASTER-2026/i)).not.toBeInTheDocument();
    });

    it("encerra a autenticação quando o servidor confirma a sessão", async () => {
      const onAuthenticated = vi.fn();
      signInWithPasswordMock.mockResolvedValue({
        ok: true,
        data: {
          authenticated: true,
          email: "responsavel@master.com",
          role: "client",
          message: null,
        },
      });

      render(<BriefingLoginForm onAuthenticated={onAuthenticated} />);

      fireEvent.change(screen.getByLabelText("E-mail"), {
        target: { value: "responsavel@master.com" },
      });
      fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "senha-forte" } });
      fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

      await waitFor(() => {
        expect(onAuthenticated).toHaveBeenCalled();
      });
    });
  });

  describe("5. Painel administrativo", () => {
    it("lista os briefings retornados pelo servidor", async () => {
      listAdminBriefingsMock.mockResolvedValue({
        ok: true,
        data: {
          items: [
            {
              id: "briefing-1",
              companyName: "LCL Chapeação LTDA",
              status: "submitted",
              createdAt: "2026-10-20T10:00:00.000Z",
              updatedAt: "2026-10-20T10:00:00.000Z",
              submittedAt: "2026-10-20T11:00:00.000Z",
              completedAt: null,
              clientMessage: null,
            },
          ],
          total: 1,
          page: 1,
          pageSize: 20,
        },
      });

      render(<BriefingAdminList />);

      expect(await screen.findByText("LCL Chapeação LTDA")).toBeInTheDocument();
      const table = screen.getByRole("table");
      expect(within(table).getByText("Enviado")).toBeInTheDocument();
      expect(listAdminBriefingsMock).toHaveBeenCalled();
    });

    it("repassa a busca e o filtro de situação ao servidor", async () => {
      listAdminBriefingsMock.mockResolvedValue({
        ok: true,
        data: { items: [], total: 0, page: 1, pageSize: 20 },
      });

      render(<BriefingAdminList />);

      fireEvent.change(screen.getByLabelText("Buscar por empresa"), {
        target: { value: "LCL" },
      });
      fireEvent.change(screen.getByLabelText("Situação"), { target: { value: "in_review" } });

      await waitFor(() => {
        const lastCall = listAdminBriefingsMock.mock.calls.at(-1)?.[0] as {
          data: { search?: string; status?: string };
        };
        expect(lastCall.data.search).toBe("LCL");
        expect(lastCall.data.status).toBe("in_review");
      });
    });
  });

  afterEach(() => {
    cleanup();
  });
});
