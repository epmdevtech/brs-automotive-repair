import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { services } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema, buildServiceSchema } from "@/lib/seo";
import { ServicePageLayout } from "@/components/brs/service-page-layout";
import martelinhoServico from "@/assets/martelinho-servico.jpg";

const service = services.find((s) => s.slug === "martelinho-de-ouro")!;

export const Route = createFileRoute("/servicos/martelinho-de-ouro")({
  component: MartelinhoPage,
  head: () =>
    buildRouteHead({
      title: "Martelinho de Ouro em Toledo | Master",
      description:
        "Martelinho de ouro artesanal (PDR) em Toledo-PR. Desamasse seu veículo sem repintar, preservando 100% da originalidade de fábrica e o valor de revenda.",
      path: "/servicos/martelinho-de-ouro",
      image: "/assets/martelinho.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([
            { name: "Serviços", path: "/servicos" },
            { name: "Martelinho de ouro", path: "/servicos/martelinho-de-ouro" },
          ]),
          buildServiceSchema({
            name: "Martelinho de ouro",
            description: service.description,
            path: "/servicos/martelinho-de-ouro",
          }),
        ],
      },
    }),
});

function MartelinhoPage() {
  return (
    <ServicePageLayout
      service={service}
      eyebrow="Especialidade Artesanal"
      title="Martelinho de Ouro (PDR) em Toledo."
      intro="O martelinho de ouro é a técnica que permite desamassar painéis e lataria sem recorrer a lixamentos, massas ou repintura. Na Master, atuamos com alavancas anatômicas e ventosas térmicas para recuperar a superfície preservando intacta a pintura de fábrica, garantindo que o veículo não sofra desvalorização comercial."
      heroCtaLabel="Avaliar viabilidade de PDR"
      image={martelinhoServico}
      imageAlt="Especialista em martelinho de ouro PDR nivelando painel com régua de luz na Master (fotografia ilustrativa)"
      applicationsIcon={Sparkles}
      applicationsTitle="Casos Ideais para o Martelinho"
      limitationsTitle="Quando o PDR Não é Indicado"
      limitationNote="Caso o martelinho não seja viável devido ao rompimento do verniz, apresentamos as alternativas combinadas de funilaria e pintura sem cobrança de procedimentos incompatíveis."
      processEyebrow="Processo Artesanal"
      processTitle="Como Funciona o Desamassamento sem Repintura"
      ctaTitle="Tem um amassado sem dano na pintura?"
      ctaText="Mantenha a originalidade de fábrica do seu carro. Faça uma triagem rápida na Master em Toledo-PR."
      ctaLabel="Agendar avaliação de martelinho de ouro"
    />
  );
}
