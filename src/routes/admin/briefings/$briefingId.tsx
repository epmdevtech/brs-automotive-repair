import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo";
import { getBriefingSessionInfo } from "@/features/briefing/server/functions";
import { BriefingAdminDetail } from "@/features/briefing/ui/admin/briefing-admin-detail";

export const Route = createFileRoute("/admin/briefings/$briefingId")({
  loader: async ({ params }) => {
    const result = await getBriefingSessionInfo();

    if (!result.ok || !result.data.authenticated) {
      throw redirect({ to: "/login", search: { redirect: "/admin/briefings" } });
    }

    return { role: result.data.role, briefingId: params.briefingId };
  },
  component: AdminBriefingDetailPage,
  head: () =>
    buildRouteHead({
      title: "Detalhe do Briefing | EPM DevTech",
      description:
        "Detalhe do briefing operacional com respostas, pendências, arquivos e histórico de auditoria.",
      path: "/admin/briefings/$briefingId",
      noindex: true,
    }),
});

function AdminBriefingDetailPage() {
  const { role, briefingId } = Route.useLoaderData();

  if (role !== "admin") {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-200 pt-20 sm:pt-28 pb-16 antialiased">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <div role="alert" className="border border-red-400/30 bg-red-400/5 p-5">
            <h1 className="font-display text-xl font-semibold text-white">
              Acesso restrito a administradores
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              A verificação de permissão é executada no servidor antes de qualquer leitura.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 pt-20 sm:pt-28 pb-16 antialiased">
      <BriefingAdminDetail briefingId={briefingId} />
    </main>
  );
}
