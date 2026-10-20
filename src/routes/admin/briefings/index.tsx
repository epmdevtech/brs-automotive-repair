import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo";
import { getBriefingSessionInfo } from "@/features/briefing/server/functions";
import { BriefingAdminList } from "@/features/briefing/ui/admin/briefing-admin-list";

export const Route = createFileRoute("/admin/briefings/")({
  loader: async () => {
    const result = await getBriefingSessionInfo();

    if (!result.ok) {
      throw redirect({ to: "/login", search: { redirect: "/admin/briefings" } });
    }

    if (!result.data.authenticated) {
      throw redirect({ to: "/login", search: { redirect: "/admin/briefings" } });
    }

    return { role: result.data.role };
  },
  component: AdminBriefingsPage,
  head: () =>
    buildRouteHead({
      title: "Painel de Briefings | EPM DevTech",
      description:
        "Painel administrativo da EPM DevTech para análise dos briefings operacionais da Master Chapeação e Pinturas.",
      path: "/admin/briefings",
      noindex: true,
    }),
});

function AdminBriefingsPage() {
  const { role } = Route.useLoaderData();

  if (role !== "admin") {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-200 pt-20 sm:pt-28 pb-16 antialiased">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <div role="alert" className="border border-red-400/30 bg-red-400/5 p-5">
            <h1 className="font-display text-xl font-semibold text-white">
              Acesso restrito a administradores
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              Sua conta não possui permissão de administrador. A verificação é feita no servidor a
              cada operação.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 pt-20 sm:pt-28 pb-16 antialiased">
      <BriefingAdminList />
    </main>
  );
}
