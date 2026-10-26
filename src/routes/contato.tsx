import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { company, canonicalUrl } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { PageHero } from "@/components/brs/page-hero";
import { Contact } from "@/components/brs/contact";
import { FAQAccordion } from "@/components/brs/faq-accordion";
import oficinaFachada01 from "@/assets/cliente/oficina-fachada-01.jpg";

export const Route = createFileRoute("/contato")({
  validateSearch: (search: Record<string, unknown>): { audience?: string } => {
    const audience = search["audience"];
    return typeof audience === "string" ? { audience } : {};
  },
  component: ContatoPage,
  head: () =>
    buildRouteHead({
      title: "Contato e Avaliação Automotiva | Master",
      description:
        "Fale com a Master Chapeação e Pinturas em Toledo-PR. Solicite uma avaliação, agende seu atendimento e tire dúvidas sobre funilaria, pintura e martelinho.",
      path: "/contato",
      image: oficinaFachada01,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Contato", path: "/contato" }]),
          {
            "@type": "ContactPage",
            name: "Contato e Avaliação Automotiva — Master",
            url: canonicalUrl("/contato"),
            description:
              "Canal oficial para solicitação de avaliação técnica e contato com a Master Chapeação e Pinturas.",
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
              : "Conte à equipe da Master o que ocorreu com seu veículo e solicite orientações técnicas sobre o método ideal de recuperação estética ou estrutural."}
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
            detail: company.instagram.handle,
          },
          {
            icon: Facebook,
            label: "Facebook Oficial",
            detail: "Master Chapeação e Pinturas",
          },
          {
            icon: MapPin,
            label: "Endereço em Toledo-PR",
            detail: `${company.address.street} - ${company.address.neighborhood}`,
          },
          {
            icon: Clock,
            label: "Horário de Atendimento",
            detail: company.openingHours,
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
