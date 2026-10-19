import { createFileRoute } from "@tanstack/react-router";
import { Paintbrush } from "lucide-react";
import { services } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema, buildServiceSchema } from "@/lib/seo";
import { ServicePageLayout } from "@/components/brs/service-page-layout";
import pinturaServico from "@/assets/pintura-servico.jpg";

const service = services.find((s) => s.slug === "pintura-automotiva")!;

export const Route = createFileRoute("/servicos/pintura-automotiva")({
  component: PinturaPage,
  head: () =>
    buildRouteHead({
      title: "Pintura Automotiva em Toledo | Master",
      description:
        "Pintura automotiva em estufa com controle de temperatura em Toledo-PR. Colorimetria precisa, primers anticorrosivos e cura térmica de alta resistência.",
      path: "/servicos/pintura-automotiva",
      image: "/assets/pintura.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([
            { name: "Serviços", path: "/servicos" },
            { name: "Pintura automotiva", path: "/servicos/pintura-automotiva" },
          ]),
          buildServiceSchema({
            name: "Pintura automotiva",
            description: service.description,
            path: "/servicos/pintura-automotiva",
          }),
        ],
      },
    }),
});

function PinturaPage() {
  return (
    <ServicePageLayout
      service={service}
      eyebrow="Especialidade Técnica"
      title="Pintura Automotiva em Estufa em Toledo."
      intro="O acabamento de pintura da Master alia rigor em preparação de superfície com aplicação em cabine com controle térmico e fluxo de ar filtrado. Cada reparo passa por análise colorimétrica minuciosa para garantir a correspondência de tonalidade e textura com as peças originais do veículo."
      heroCtaLabel="Solicitar avaliação de pintura"
      image={pinturaServico}
      imageAlt="Técnico aplicando pintura automotiva e verniz em estufa pressurizada na Master (fotografia ilustrativa)"
      applicationsIcon={Paintbrush}
      applicationsTitle="Aplicações da Pintura"
      limitationsTitle="Requisitos de Cura e Limitações"
      limitationNote="A cura total do verniz ocorre progressivamente. Orientamos detalhadamente cada cliente sobre a rotina de cuidados recomendada nas semanas seguintes à entrega."
      processEyebrow="Processo Técnico"
      processTitle="Ciclo de Preparação e Pintura em Cabine"
      ctaTitle="Precisa repintar ou retocar uma peça do veículo?"
      ctaText="Traga seu carro para uma conferência de tonalidade e orçamento sem surpresas na Master em Toledo-PR."
      ctaLabel="Agendar avaliação de pintura"
    />
  );
}
