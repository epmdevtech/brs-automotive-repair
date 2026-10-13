import { createFileRoute } from "@tanstack/react-router";
import { getProposalBySlug } from "@/lib/proposta";
import { buildRouteHead } from "@/lib/seo";
import { ProposalView } from "@/components/brs/proposal/proposal-view";
import { ProposalNotFound } from "@/components/brs/proposal/proposal-not-found";

export const Route = createFileRoute("/proposta/$slug")({
  component: ProposalSlugPage,
  head: ({ params }) => {
    const proposal = getProposalBySlug(params.slug);
    return buildRouteHead({
      title: proposal
        ? `Proposta Comercial: ${proposal.projectTitle} | EPM DevTech`
        : "Proposta Comercial Não Localizada | EPM DevTech",
      description:
        proposal?.projectSubtitle ||
        "Apresentação de proposta comercial personalizada elaborada pela EPM DevTech.",
      path: `/proposta/${params.slug}`,
      noindex: true,
    });
  },
});

function ProposalSlugPage() {
  const { slug } = Route.useParams();
  const proposal = getProposalBySlug(slug);

  if (!proposal) {
    return <ProposalNotFound slug={slug} />;
  }

  return <ProposalView proposal={proposal} />;
}
