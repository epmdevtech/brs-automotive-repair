import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { services } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema, buildServiceSchema } from "@/lib/seo";
import { ServicePageLayout } from "@/components/brs/service-page-layout";
import funilariaServico from "@/assets/funilaria-servico.jpg";

const service = services.find((s) => s.slug === "funilaria")!;

export const Route = createFileRoute("/servicos/funilaria")({
  component: FunilariaPage,
  head: () =>
    buildRouteHead({
      title: "Funilaria Automotiva em Toledo | BRS",
      description:
        "Funilaria técnica especializada em Toledo-PR. Recuperação de lataria, alinhamento de painéis e preservação de gaps originais com diagnóstico honesto.",
      path: "/servicos/funilaria",
      image: "/assets/funilaria.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([
            { name: "Serviços", path: "/servicos" },
            { name: "Funilaria automotiva", path: "/servicos/funilaria" },
          ]),
          buildServiceSchema({
            name: "Funilaria automotiva",
            description: service.description,
            path: "/servicos/funilaria",
          }),
        ],
      },
    }),
});

function FunilariaPage() {
  return (
    <ServicePageLayout
      service={service}
      eyebrow="Especialidade Técnica"
      title="Funilaria Automotiva de Precisão em Toledo."
      intro="A funilaria técnica da BRS é fundamentada na restauração geométrica das peças metálicas do veículo após colisões ou impactos. O objetivo primordial é recuperar as linhas, vincos e encaixes originais, minimizando a necessidade de massas e garantindo perfeita continuidade visual com a carroceria."
      heroCtaLabel="Solicitar avaliação técnica"
      image={funilariaServico}
      imageAlt="Serviço de alinhamento e funilaria de precisão na BRS (fotografia ilustrativa)"
      applicationsIcon={Wrench}
      applicationsTitle="Quando a Funilaria é Aplicada"
      limitationsTitle="Limitações e Critérios Éticos"
      limitationNote="Na BRS, se a recuperação colocar em risco a segurança ou o resultado estético do veículo, orientamos de forma transparente a troca da peça."
      processEyebrow="Metodologia"
      processTitle="Etapas da Recuperação em Funilaria"
      ctaTitle="Precisa avaliar a lataria do seu veículo?"
      ctaText="Agende uma avaliação na BRS em Toledo-PR para receber um parecer honesto sobre a viabilidade de recuperação da sua peça."
      ctaLabel="Solicitar avaliação de funilaria"
    />
  );
}
