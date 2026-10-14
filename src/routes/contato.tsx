import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Instagram, MapPin, Phone } from "lucide-react";
import { company } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { PageHero } from "@/components/brs/page-hero";
import { Contact } from "@/components/brs/contact";
import { FAQAccordion } from "@/components/brs/faq-accordion";

export const Route = createFileRoute("/contato")({
  validateSearch: (search: Record<string, unknown>): { audience?: string } => {
    const audience = search["audience"];
    return typeof audience === "string" ? { audience } : {};
  },
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
      <PageHero
        breadcrumbs={[{ name: "Contato e Avaliação" }]}
        codeIndex={isPartner ? "PAR.06 // ATENDIMENTO CORRETORES" : "CON.06 // CONTATO & AVALIAÇÃO"}
        eyebrow={
          isPartner
            ? "Canal Exclusivo para Corretores e Seguradoras"
            : "Atendimento Técnico e Avaliação"
        }
        title={
          isPartner
            ? "Canal Direto para Corretores. Agilidade e Respaldo Técnico."
            : "O primeiro passo é um diagnóstico transparente."
        }
        description={
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            {isPartner
              ? "Atendimento prioritário para corretores de seguros em Toledo e região. Comunicação técnica clara para liberação de sinistros, vistorias complementares e acompanhamento de etapas."
              : "Conte à equipe da BRS o que ocorreu com seu veículo e solicite orientações técnicas sobre o método ideal de recuperação estética ou estrutural."}
          </p>
        }
        telemetryBadges={[
          {
            icon: Phone,
            label: "Central Direta",
            detail: company.phone,
          },
          {
            icon: Instagram,
            label: "Instagram Oficial",
            detail: "@brsreparacoes",
          },
          {
            icon: MapPin,
            label: "Toledo — PR",
            detail: "Atendimento & Leva e Traz",
          },
          {
            icon: Clock,
            label: "Tempo de Resposta",
            detail: "Diagnóstico ágil e fundamentado",
          },
        ]}
        actions={[
          {
            label: "Ir para o formulário de avaliação",
            href: "#contato",
            variant: "primary",
            icon: ArrowUpRight,
          },
          {
            label: company.phone,
            href: company.phoneHref,
            variant: "secondary",
            icon: Phone,
          },
        ]}
      />
      <Contact partner={isPartner} headingAs="h2" />
      <FAQAccordion />
    </div>
  );
}
