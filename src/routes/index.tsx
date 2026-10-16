import { createFileRoute } from "@tanstack/react-router";
import { HomePageContent } from "@/components/brs/website";
import { buildRouteHead, buildAutoBodyShopSchema } from "@/lib/seo";

import { defaultHeroConfig, getHeroLcpPreload } from "@/lib/hero-config";

export const Route = createFileRoute("/")({
  component: HomePageContent,
  head: () => {
    const baseHead = buildRouteHead({
      title: "BRS Reparações Automotivas | Toledo - PR",
      description:
        "Oficina de funilaria automotiva, pintura em estufa e martelinho de ouro em Toledo-PR. Diagnóstico honesto, precisão técnica e cuidado em cada etapa.",
      path: "/",
      jsonLd: buildAutoBodyShopSchema(),
    });

    return {
      ...baseHead,
      links: [...(baseHead.links ?? []), getHeroLcpPreload(defaultHeroConfig)],
    };
  },
});
