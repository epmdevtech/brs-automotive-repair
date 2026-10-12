import { createFileRoute } from "@tanstack/react-router";
import { HomePageContent } from "@/components/brs/website";
import { buildRouteHead, buildAutoBodyShopSchema } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: HomePageContent,
  head: () =>
    buildRouteHead({
      title: "BRS Reparações Automotivas | Toledo - PR",
      description:
        "Oficina de funilaria automotiva, pintura em estufa e martelinho de ouro em Toledo-PR. Diagnóstico honesto, precisão técnica e cuidado em cada etapa.",
      path: "/",
      jsonLd: buildAutoBodyShopSchema(),
    }),
});
