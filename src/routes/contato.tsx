import { createFileRoute } from "@tanstack/react-router";
import { company } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { Contact } from "@/components/brs/contact";

export const Route = createFileRoute("/contato")({
  validateSearch: (search: Record<string, unknown>) => ({
    audience: typeof search.audience === "string" ? search.audience : undefined,
  }),
  component: ContatoPage,
  head: () =>
    buildRouteHead({
      title: "Contato e Avaliação Automotiva | BRS",
      description:
        "Fale com a BRS Reparações Automotivas em Toledo-PR. Solicite uma avaliação, agende seu atendimento e tire dúvidas sobre funilaria, pintura e martelinho.",
      path: "/contato",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Contato", path: "/contato" }]),
          {
            "@type": "ContactPage",
            name: "Contato e Avaliação Automotiva — BRS",
            url: "http://brs.localhost/contato",
            description:
              "Canal oficial para solicitação de avaliação técnica e contato com a BRS Reparações Automotivas.",
          },
        ],
      },
    }),
});

function ContatoPage() {
  const search = Route.useSearch();
  const isPartner = search.audience === "corretor";

  return (
    <div className="pt-28 pb-20">
      <section className="page-width mb-6">
        <Breadcrumbs items={[{ name: "Contato e Avaliação" }]} className="mb-4" />
      </section>
      <Contact partner={isPartner} />
    </div>
  );
}
