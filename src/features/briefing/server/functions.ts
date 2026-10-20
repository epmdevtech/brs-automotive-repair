import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BRIEFING_STATUSES } from "../domain/status";
import type { BriefingErrorCode } from "./errors";
import { normalizeBriefingError } from "./errors";

export type BriefingServerResult<T> =
  { ok: true; data: T } | { ok: false; error: { code: BriefingErrorCode; message: string } };

async function runBriefingOperation<T>(
  operation: () => Promise<T>,
): Promise<BriefingServerResult<T>> {
  try {
    const data = await operation();
    return { ok: true, data };
  } catch (error) {
    const normalized = normalizeBriefingError(error);
    return { ok: false, error: { code: normalized.code, message: normalized.message } };
  }
}

const valuesSchema = z.record(z.string(), z.union([z.string().max(20000), z.boolean()]));
const pendingSchema = z.record(z.string(), z.boolean());

export const getBriefingSessionInfo = createServerFn({ method: "POST" }).handler(async () =>
  runBriefingOperation(async () => {
    const { createBriefingServerClient } = await import("./supabase-server");
    const { getBriefingSession } = await import("./auth-service");

    const client = await createBriefingServerClient();
    const session = await getBriefingSession(client);

    return {
      authenticated: session !== null,
      email: session?.email ?? null,
      role: session?.role ?? null,
    };
  }),
);

export const signInWithPassword = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().trim().email("Informe um e-mail válido"),
      password: z.string().min(1, "Informe a senha"),
    }),
  )
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");

      const client = await createBriefingServerClient();
      const { error } = await client.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        const normalized = normalizeBriefingError(error);
        return {
          authenticated: false,
          email: null,
          role: null,
          message:
            normalized.code === "unauthenticated"
              ? "E-mail ou senha inválidos."
              : "Não foi possível autenticar no momento.",
        };
      }

      const { getBriefingSession } = await import("./auth-service");
      const session = await getBriefingSession(client);

      return {
        authenticated: session !== null,
        email: session?.email ?? null,
        role: session?.role ?? null,
        message: null,
      };
    }),
  );

export const signOutBriefing = createServerFn({ method: "POST" }).handler(async () =>
  runBriefingOperation(async () => {
    const { createBriefingServerClient } = await import("./supabase-server");

    const client = await createBriefingServerClient();
    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }

    return { signedOut: true };
  }),
);

export const loadOwnBriefing = createServerFn({ method: "POST" }).handler(async () =>
  runBriefingOperation(async () => {
    const { createBriefingServerClient } = await import("./supabase-server");
    const { requireBriefingSession } = await import("./auth-service");
    const { loadOwnBriefing: load } = await import("./briefing-service");

    const client = await createBriefingServerClient();
    const session = await requireBriefingSession(client);
    return load(client, session);
  }),
);

export const saveBriefingSection = createServerFn({ method: "POST" })
  .validator(
    z.object({
      sectionKey: z.string().min(1).max(80),
      values: valuesSchema,
      pending: pendingSchema.optional(),
    }),
  )
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingSession } = await import("./auth-service");
      const { saveSection } = await import("./briefing-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingSession(client);
      return saveSection(client, session, {
        sectionKey: data.sectionKey,
        values: data.values,
        pending: data.pending ?? {},
      });
    }),
  );

export const submitBriefing = createServerFn({ method: "POST" }).handler(async () =>
  runBriefingOperation(async () => {
    const { createBriefingServerClient } = await import("./supabase-server");
    const { requireBriefingSession } = await import("./auth-service");
    const { submitBriefing: submit } = await import("./briefing-service");

    const client = await createBriefingServerClient();
    const session = await requireBriefingSession(client);
    return submit(client, session);
  }),
);

export const listAdminBriefings = createServerFn({ method: "POST" })
  .validator(
    z.object({
      search: z.string().max(120).optional(),
      status: z.enum(BRIEFING_STATUSES).optional(),
      from: z.string().max(40).optional(),
      to: z.string().max(40).optional(),
      page: z.number().int().min(1).max(1000).optional(),
      pageSize: z.number().int().min(1).max(100).optional(),
    }),
  )
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingAdmin } = await import("./auth-service");
      const { listBriefings } = await import("./briefing-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingAdmin(client);
      return listBriefings(client, session, data);
    }),
  );

export const loadAdminBriefing = createServerFn({ method: "POST" })
  .validator(z.object({ briefingId: z.string().uuid("Identificador inválido") }))
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingAdmin } = await import("./auth-service");
      const { loadBriefingDetailById } = await import("./briefing-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingAdmin(client);
      return loadBriefingDetailById(client, session, data.briefingId);
    }),
  );

export const changeAdminBriefingStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      briefingId: z.string().uuid("Identificador inválido"),
      to: z.enum(BRIEFING_STATUSES),
      clientMessage: z.string().max(2000).nullable().optional(),
    }),
  )
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingAdmin } = await import("./auth-service");
      const { changeBriefingStatus } = await import("./briefing-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingAdmin(client);
      return changeBriefingStatus(client, session, {
        briefingId: data.briefingId,
        to: data.to,
        clientMessage: data.clientMessage ?? null,
      });
    }),
  );

export const requestBriefingComplement = createServerFn({ method: "POST" })
  .validator(
    z.object({
      briefingId: z.string().uuid("Identificador inválido"),
      message: z.string().trim().min(3, "Descreva a informação solicitada").max(2000),
    }),
  )
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingAdmin } = await import("./auth-service");
      const { requestComplement } = await import("./briefing-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingAdmin(client);
      return requestComplement(client, session, data);
    }),
  );

export const addBriefingInternalNote = createServerFn({ method: "POST" })
  .validator(
    z.object({
      briefingId: z.string().uuid("Identificador inválido"),
      note: z.string().trim().min(3, "Escreva a nota interna").max(2000),
    }),
  )
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingAdmin } = await import("./auth-service");
      const { addInternalNote } = await import("./briefing-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingAdmin(client);
      await addInternalNote(client, session, data);
      return { saved: true };
    }),
  );

export const exportBriefingPdf = createServerFn({ method: "POST" })
  .validator(z.object({ briefingId: z.string().uuid("Identificador inválido") }))
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingAdmin } = await import("./auth-service");
      const { exportBriefingPdf: exportPdf } = await import("./pdf-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingAdmin(client);
      return exportPdf(client, session, data.briefingId);
    }),
  );

export const uploadBriefingFile = createServerFn({ method: "POST" })
  .validator(
    z.object({
      briefingId: z.string().uuid("Identificador inválido"),
      category: z.string().trim().min(1).max(40),
      fileName: z.string().trim().min(1).max(255),
      mimeType: z.string().trim().min(1).max(120),
      sizeBytes: z
        .number()
        .int()
        .positive()
        .max(20 * 1024 * 1024),
      contentBase64: z
        .string()
        .min(1)
        .max(20 * 1024 * 1024),
    }),
  )
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingSession } = await import("./auth-service");
      const { uploadBriefingFile: upload } = await import("./file-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingSession(client);
      return upload(client, session, data);
    }),
  );

export const createBriefingFileUrl = createServerFn({ method: "POST" })
  .validator(z.object({ fileId: z.string().uuid("Identificador inválido") }))
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingSession } = await import("./auth-service");
      const { createBriefingFileUrl: createUrl } = await import("./file-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingSession(client);
      return createUrl(client, session, data.fileId);
    }),
  );

export const deleteBriefingFile = createServerFn({ method: "POST" })
  .validator(z.object({ fileId: z.string().uuid("Identificador inválido") }))
  .handler(async ({ data }) =>
    runBriefingOperation(async () => {
      const { createBriefingServerClient } = await import("./supabase-server");
      const { requireBriefingSession } = await import("./auth-service");
      const { deleteBriefingFile: remove } = await import("./file-service");

      const client = await createBriefingServerClient();
      const session = await requireBriefingSession(client);
      await remove(client, session, data.fileId);
      return { removed: true };
    }),
  );
