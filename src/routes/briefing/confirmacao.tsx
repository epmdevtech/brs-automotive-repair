import { createFileRoute, redirect } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { buildRouteHead } from "@/lib/seo";
import { loadOwnBriefing } from "@/features/briefing/server/functions";
import { BRIEFING_STATUS_LABELS } from "@/features/briefing/domain/status";

export const Route = createFileRoute("/briefing/confirmacao")({
  loader: async () => {
    const result = await loadOwnBriefing();

    if (!result.ok) {
      throw redirect({ to: "/login", search: { redirect: "/briefing" } });
    }

    const briefing = result.data.briefing;

    if (briefing.status === "draft" || !briefing.submittedAt) {
      throw redirect({ to: "/briefing" });
    }

    return {
      companyName: briefing.companyName,
      status: briefing.status,
      submittedAt: briefing.submittedAt,
      clientMessage: briefing.clientMessage,
    };
  },
  component: BriefingConfirmationPage,
  head: () =>
    buildRouteHead({
      title: "Briefing enviado | EPM DevTech & Master Chapeação",
      description:
        "Confirmação de envio do briefing operacional da Master Chapeação e Pinturas após persistência verificada no servidor.",
      path: "/briefing/confirmacao",
      noindex: true,
    }),
});

function BriefingConfirmationPage() {
  const { companyName, status, submittedAt, clientMessage } = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 pt-20 sm:pt-28 pb-16 antialiased">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="border border-emerald-400/30 bg-emerald-400/5 p-6">
          <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
            <CheckCircle2 className="size-6 text-emerald-300" aria-hidden="true" />
            Briefing registrado no servidor
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            As respostas foram gravadas no banco de dados da EPM DevTech e a equipe responsável pode
            revisar o material. O envio não representa aprovação, regularidade documental,
            certificação nem credenciamento junto a seguradoras, reguladoras, corretores ou frotas.
          </p>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <dt className="text-xs text-neutral-500">Empresa</dt>
            <dd className="mt-1 text-sm text-white">{companyName || "Não informada"}</dd>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <dt className="text-xs text-neutral-500">Situação</dt>
            <dd className="mt-1 text-sm text-white">{BRIEFING_STATUS_LABELS[status]}</dd>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <dt className="text-xs text-neutral-500">Envio confirmado em</dt>
            <dd className="mt-1 text-sm text-white">
              {new Date(submittedAt).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </dd>
          </div>
        </dl>

        {clientMessage ? (
          <div className="mt-5 border border-amber-300/30 bg-amber-300/5 p-4">
            <h2 className="font-display text-base font-semibold text-white">
              Complementação solicitada
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">{clientMessage}</p>
          </div>
        ) : null}

        <p className="mt-6 text-sm text-neutral-400">
          Você pode reabrir o briefing a qualquer momento para revisar as respostas já gravadas.
        </p>
      </div>
    </main>
  );
}
