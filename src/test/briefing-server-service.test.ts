import { describe, it, expect, beforeEach } from "vitest";
import {
  addInternalNote,
  changeBriefingStatus,
  listBriefings,
  loadBriefingDetailById,
  loadOwnBriefing,
  requestComplement,
  saveSection,
  submitBriefing,
} from "@/features/briefing/server/briefing-service";
import {
  createBriefingFileUrl,
  deleteBriefingFile,
  uploadBriefingFile,
} from "@/features/briefing/server/file-service";
import { exportBriefingPdf } from "@/features/briefing/server/pdf-service";
import {
  requireBriefingAdmin,
  requireBriefingSession,
} from "@/features/briefing/server/auth-service";
import { BRIEFING_SECTION_KEYS } from "@/features/briefing/domain/section-keys";
import { BRIEFING_STEPS } from "@/features/briefing/domain/steps";
import {
  createFakeState,
  createFakeSupabaseClient,
  type FakeSupabaseState,
} from "./helpers/fake-supabase";

const CLIENT_A = "user-a";
const CLIENT_B = "user-b";
const ADMIN = "admin-1";

function seedState(): FakeSupabaseState {
  const state = createFakeState();
  state.tables["profiles"] = [
    { id: CLIENT_A, role: "client", display_name: "Cliente A" },
    { id: CLIENT_B, role: "client", display_name: "Cliente B" },
    { id: ADMIN, role: "admin", display_name: "Administrador" },
  ];
  state.tables["briefings"] = [
    {
      id: "briefing-a",
      company_name: "LCL Chapeação LTDA",
      owner_user_id: CLIENT_A,
      status: "draft",
      client_message: null,
      submitted_at: null,
      completed_at: null,
      created_at: "2026-10-20T10:00:00.000Z",
      updated_at: "2026-10-20T10:00:00.000Z",
    },
    {
      id: "briefing-b",
      company_name: "Outra Oficina",
      owner_user_id: CLIENT_B,
      status: "draft",
      client_message: null,
      submitted_at: null,
      completed_at: null,
      created_at: "2026-10-20T10:00:00.000Z",
      updated_at: "2026-10-20T10:00:00.000Z",
    },
  ];
  return state;
}

function clientSession(state: FakeSupabaseState, userId: string, role: "client" | "admin") {
  state.user = { id: userId, email: `${userId}@exemplo.com` };
  state.role = role;
  return createFakeSupabaseClient(state);
}

function completeAllSections(state: FakeSupabaseState, briefingId: string) {
  for (const key of BRIEFING_SECTION_KEYS) {
    const step = BRIEFING_STEPS.find((item) => item.id === key)!;
    const values: Record<string, string | boolean> = {};
    const pending: Record<string, boolean> = {};

    for (const field of step.fields) {
      if (!field.required) continue;
      if (field.type === "checkbox") {
        values[field.id] = true;
        continue;
      }
      values[field.id] = "não informado";
      pending[field.id] = true;
    }

    state.tables["briefing_answers"].push({
      id: `answer-${key}`,
      briefing_id: briefingId,
      section_key: key,
      answers: { values, pending },
      created_at: "2026-10-20T10:00:00.000Z",
      updated_at: "2026-10-20T10:00:00.000Z",
    });
  }
}

describe("SPEC-073 — camada de servidor do briefing", () => {
  let state: FakeSupabaseState;

  beforeEach(() => {
    state = seedState();
  });

  describe("1. Sessão e autorização", () => {
    it("recusa operações sem sessão autenticada", async () => {
      state.user = null;
      const client = createFakeSupabaseClient(state);

      await expect(requireBriefingSession(client)).rejects.toMatchObject({
        code: "unauthenticated",
      });
      await expect(
        loadOwnBriefing(client, await requireBriefingSession(client).catch(() => null as never)),
      ).rejects.toBeDefined();
    });

    it("recusa operações administrativas para cliente comum", async () => {
      const client = clientSession(state, CLIENT_A, "client");

      await expect(requireBriefingAdmin(client)).rejects.toMatchObject({ code: "forbidden" });
      await expect(
        listBriefings(client, { userId: CLIENT_A, email: null, role: "client" }, {}),
      ).rejects.toMatchObject({
        code: "forbidden",
      });
    });

    it("deriva o papel exclusivamente do banco de dados", async () => {
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      expect(session.role).toBe("client");

      state.tables["profiles"] = [{ id: CLIENT_A, role: "admin" }];
      const adminClient = clientSession(state, CLIENT_A, "client");
      const adminSession = await requireBriefingSession(adminClient);

      expect(adminSession.role).toBe("admin");
    });
  });

  describe("2. Isolamento entre clientes", () => {
    it("impede que um cliente leia o briefing de outro", async () => {
      const client = clientSession(state, CLIENT_B, "client");
      const session = await requireBriefingSession(client);

      await expect(loadBriefingDetailById(client, session, "briefing-a")).rejects.toMatchObject({
        code: "forbidden",
      });
    });

    it("impede que um cliente grave respostas no briefing de outro", async () => {
      const client = clientSession(state, CLIENT_B, "client");
      const session = await requireBriefingSession(client);

      const result = await saveSection(client, session, {
        sectionKey: "company_identification",
        values: {
          "empresa.razaoSocial": "Empresa do cliente B",
          "empresa.proprietario": "Responsável B",
        },
        pending: {},
      });

      // O serviço resolve o briefing a partir da sessão, nunca do parâmetro enviado.
      const ownerBriefings = state.tables["briefings"].filter(
        (row) => row["owner_user_id"] === CLIENT_B,
      );
      expect(ownerBriefings).toHaveLength(1);
      expect(result.savedAt).toBeTruthy();
      const answers = state.tables["briefing_answers"];
      expect(answers.every((row) => row["briefing_id"] === "briefing-b")).toBe(true);
    });
  });

  describe("3. Revalidação no servidor", () => {
    it("recusa gravar etapa com campo obrigatório vazio", async () => {
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      await expect(
        saveSection(client, session, {
          sectionKey: "company_identification",
          values: { "empresa.razaoSocial": "" },
          pending: {},
        }),
      ).rejects.toMatchObject({ code: "validation" });

      expect(state.tables["briefing_answers"]).toHaveLength(0);
    });

    it("recusa etapa inexistente", async () => {
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      await expect(
        saveSection(client, session, { sectionKey: "etapa_fantasma", values: {}, pending: {} }),
      ).rejects.toMatchObject({ code: "validation" });
    });

    it("aceita campo obrigatório marcado como pendente", async () => {
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      const result = await saveSection(client, session, {
        sectionKey: "company_identification",
        values: { "empresa.razaoSocial": "LCL Chapeação LTDA" },
        pending: { "empresa.proprietario": true },
      });

      expect(result.sectionKey).toBe("company_identification");
      expect(state.tables["briefing_answers"]).toHaveLength(1);
    });
  });

  describe("4. Envio idempotente", () => {
    it("envia uma vez, mantém o mesmo briefing e não duplica atividade", async () => {
      completeAllSections(state, "briefing-a");
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      const first = await submitBriefing(client, session);
      expect(first.status).toBe("submitted");
      expect(first.briefingId).toBe("briefing-a");

      const second = await submitBriefing(client, session);
      expect(second.briefingId).toBe("briefing-a");
      expect(second.status).toBe("submitted");

      expect(state.tables["briefings"]).toHaveLength(2);
      const submittedCalls = state.rpcCalls.filter((call) => call.args["p_action"] === "submitted");
      expect(submittedCalls).toHaveLength(1);
    });

    it("recusa envio com etapa obrigatória incompleta", async () => {
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      await expect(submitBriefing(client, session)).rejects.toMatchObject({ code: "validation" });
      expect(state.tables["briefings"][0]?.["status"]).toBe("draft");
    });

    it("registra a auditoria por função controlada, sem inserção direta do cliente", async () => {
      completeAllSections(state, "briefing-a");
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      await submitBriefing(client, session);

      expect(state.rpcCalls.some((call) => call.name === "log_briefing_activity")).toBe(true);
      expect(state.tables["briefing_activity"]).toHaveLength(0);
    });
  });

  describe("5. Painel administrativo", () => {
    it("lista briefings com busca e filtro de status", async () => {
      const client = clientSession(state, ADMIN, "admin");
      const session = await requireBriefingSession(client);

      const all = await listBriefings(client, session, {});
      expect(all.total).toBe(2);

      const filtered = await listBriefings(client, session, { search: "LCL" });
      expect(filtered.items).toHaveLength(1);
      expect(filtered.items[0]?.companyName).toBe("LCL Chapeação LTDA");

      const byStatus = await listBriefings(client, session, { status: "completed" });
      expect(byStatus.items).toHaveLength(0);
    });

    it("rejeita transição de status inválida", async () => {
      const client = clientSession(state, ADMIN, "admin");
      const session = await requireBriefingSession(client);

      await expect(
        changeBriefingStatus(client, session, { briefingId: "briefing-a", to: "completed" }),
      ).rejects.toThrow(/Transição de status não permitida/);
    });

    it("solicita complementação com mensagem visível ao cliente", async () => {
      const client = clientSession(state, ADMIN, "admin");
      const session = await requireBriefingSession(client);

      const updated = await requestComplement(client, session, {
        briefingId: "briefing-a",
        message: "Faltam as notas fiscais da equipe técnica.",
      });

      expect(updated.status).toBe("awaiting_information");
      expect(updated.clientMessage).toContain("notas fiscais");
    });

    it("registra nota interna sem expô-la ao cliente", async () => {
      const client = clientSession(state, ADMIN, "admin");
      const session = await requireBriefingSession(client);

      await addInternalNote(client, session, {
        briefingId: "briefing-a",
        note: "Conferir documentation antes de responder.",
      });

      const noteCall = state.rpcCalls.find((call) => call.args["p_action"] === "internal_note");
      expect(noteCall).toBeDefined();

      const clientClient = clientSession(state, CLIENT_A, "client");
      const clientSessionResolved = await requireBriefingSession(clientClient);
      const detail = await loadBriefingDetailById(
        clientClient,
        clientSessionResolved,
        "briefing-a",
      );

      expect(detail.activity).toHaveLength(0);
    });
  });

  describe("6. Exportação de evidência em PDF", () => {
    it("recusa a exportação para cliente sem papel de administrador", async () => {
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      await expect(exportBriefingPdf(client, session as never, "briefing-a")).rejects.toMatchObject(
        { code: "forbidden" },
      );
    });

    it("gera o PDF a partir do registro do briefing", async () => {
      completeAllSections(state, "briefing-a");
      const client = clientSession(state, ADMIN, "admin");
      const session = await requireBriefingAdmin(client);

      const exported = await exportBriefingPdf(client, session, "briefing-a");

      expect(exported.fileName).toMatch(/^evidencia-briefing-.+-\d{4}-\d{2}-\d{2}\.pdf$/);
      expect(exported.pageCount).toBeGreaterThan(0);
      expect(exported.sizeBytes).toBeGreaterThan(1000);

      const bytes = Buffer.from(exported.base64, "base64");
      expect(bytes.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    });

    it("recusa a exportação de briefing inexistente", async () => {
      const client = clientSession(state, ADMIN, "admin");
      const session = await requireBriefingAdmin(client);

      await expect(exportBriefingPdf(client, session, "inexistente")).rejects.toMatchObject({
        code: "not_found",
      });
    });
  });

  describe("7. Arquivos privados", () => {
    it("recusa formato não permitido e arquivo acima do limite", async () => {
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      await expect(
        uploadBriefingFile(client, session, {
          briefingId: "briefing-a",
          category: "fachada",
          fileName: "malware.exe",
          mimeType: "application/x-msdownload",
          sizeBytes: 100,
          contentBase64: "AAAA",
        }),
      ).rejects.toMatchObject({ code: "validation" });

      await expect(
        uploadBriefingFile(client, session, {
          briefingId: "briefing-a",
          category: "fachada",
          fileName: "grande.jpg",
          mimeType: "image/jpeg",
          sizeBytes: 20 * 1024 * 1024,
          contentBase64: "AAAA",
        }),
      ).rejects.toMatchObject({ code: "validation" });

      expect(state.storageUploads).toHaveLength(0);
    });

    it("grava o arquivo em caminho controlado pelo usuário autenticado", async () => {
      const client = clientSession(state, CLIENT_A, "client");
      const session = await requireBriefingSession(client);

      const file = await uploadBriefingFile(client, session, {
        briefingId: "briefing-a",
        category: "fachada",
        fileName: "fachada.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 1024,
        contentBase64: "AAAA",
      });

      expect(file.originalName).toBe("fachada.jpg");
      expect(state.storageUploads).toHaveLength(1);
      expect(state.storageUploads[0]?.path.startsWith(`${CLIENT_A}/briefing-a/`)).toBe(true);
      expect(state.tables["briefing_files"]).toHaveLength(1);
    });

    it("nega download de arquivo de outro cliente", async () => {
      const owner = clientSession(state, CLIENT_A, "client");
      const ownerSession = await requireBriefingSession(owner);

      const file = await uploadBriefingFile(owner, ownerSession, {
        briefingId: "briefing-a",
        category: "fachada",
        fileName: "fachada.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 1024,
        contentBase64: "AAAA",
      });

      const other = clientSession(state, CLIENT_B, "client");
      const otherSession = await requireBriefingSession(other);

      await expect(createBriefingFileUrl(other, otherSession, file.id)).rejects.toMatchObject({
        code: "forbidden",
      });
    });

    it("gera URL assinada de curta duração para o dono do arquivo", async () => {
      const owner = clientSession(state, CLIENT_A, "client");
      const ownerSession = await requireBriefingSession(owner);

      const file = await uploadBriefingFile(owner, ownerSession, {
        briefingId: "briefing-a",
        category: "fachada",
        fileName: "fachada.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 1024,
        contentBase64: "AAAA",
      });

      const signed = await createBriefingFileUrl(owner, ownerSession, file.id);

      expect(signed.expiresInSeconds).toBe(300);
      expect(signed.url).toContain("signed.local");
      expect(state.signedUrls[0]?.ttl).toBe(300);
    });

    it("remove o arquivo autorizado e registra a auditoria", async () => {
      const owner = clientSession(state, CLIENT_A, "client");
      const ownerSession = await requireBriefingSession(owner);

      const file = await uploadBriefingFile(owner, ownerSession, {
        briefingId: "briefing-a",
        category: "fachada",
        fileName: "fachada.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 1024,
        contentBase64: "AAAA",
      });

      await deleteBriefingFile(owner, ownerSession, file.id);

      expect(state.storageRemoved).toHaveLength(1);
      expect(state.tables["briefing_files"]).toHaveLength(0);
    });
  });
});
