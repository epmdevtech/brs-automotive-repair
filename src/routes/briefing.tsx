import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo";
import { BriefingContainer } from "@/components/brs/briefing/briefing-container";

export const Route = createFileRoute("/briefing")({
  component: BriefingPage,
  head: () =>
    buildRouteHead({
      title: "Portal de Briefing do Projeto | EPM DevTech & Master Chapeação",
      description:
        "Portal confidencial para preenchimento, validação e ingestão do briefing técnico de presença digital e agendamento da Master Chapeação e Pinturas.",
      path: "/briefing",
      noindex: true,
    }),
});

function BriefingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 pt-20 sm:pt-28 pb-16 antialiased">
      <BriefingContainer />
    </main>
  );
}
