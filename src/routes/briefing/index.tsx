import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo";
import { getBriefingSessionInfo } from "@/features/briefing/server/functions";
import { BriefingOperacionalContainer } from "@/features/briefing/ui/briefing-operacional-container";

export const Route = createFileRoute("/briefing/")({
  loader: async () => {
    const result = await getBriefingSessionInfo();

    if (!result.ok) {
      return {
        state: "unavailable" as const,
        message: result.error.message,
        email: null,
        role: null,
      };
    }

    if (!result.data.authenticated) {
      throw redirect({ to: "/login", search: { redirect: "/briefing" } });
    }

    return {
      state: "ready" as const,
      message: null,
      email: result.data.email,
      role: result.data.role,
    };
  },
  component: BriefingPage,
  head: () =>
    buildRouteHead({
      title: "Briefing Operacional e Credenciamento | EPM DevTech & Master Chapeação",
      description:
        "Rota confidencial para o briefing operacional, comercial e documental da Master Chapeação e Pinturas, com persistência segura, retomada de preenchimento e revisão pela EPM DevTech.",
      path: "/briefing",
      noindex: true,
    }),
});

function BriefingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 pt-20 sm:pt-28 pb-16 antialiased">
      <BriefingOperacionalContainer />
    </main>
  );
}
