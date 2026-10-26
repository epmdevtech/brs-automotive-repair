import { createFileRoute } from "@tanstack/react-router";
import { masterChapeacaoProposal } from "@/lib/proposta";
import { buildRouteHead } from "@/lib/seo";
import { ProposalView } from "@/components/brs/proposal/proposal-view";

export const Route = createFileRoute("/proposta/masterchapeacao")({
  component: MasterChapeacaoProposalPage,
  head: () =>
    buildRouteHead({
      title: `Proposta Comercial: ${masterChapeacaoProposal.projectTitle} | EPM DevTech`,
      description:
        masterChapeacaoProposal.projectSubtitle ||
        "Apresentação comercial personalizada da EPM DevTech para a Master Chapeação e Pinturas.",
      path: "/proposta/masterchapeacao",
      noindex: true,
    }),
});

function MasterChapeacaoProposalPage() {
  return <ProposalView proposal={masterChapeacaoProposal} />;
}
