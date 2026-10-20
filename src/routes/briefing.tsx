import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo";
import { BriefingOperacionalContainer } from "@/features/briefing/ui/briefing-operacional-container";

export const Route = createFileRoute("/briefing")({
  component: BriefingPage,
  head: () =>
    buildRouteHead({
      title: "Briefing Operacional e Credenciamento | EPM DevTech & Master Chapeação",
      description:
        "Rota confidencial para o briefing operacional, comercial e documental da Master Chapeação e Pinturas, com pendências explícitas, rascunho local e exportação manual.",
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
