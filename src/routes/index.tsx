import { createFileRoute } from "@tanstack/react-router";
import { Website } from "@/components/brs/website";
import { company } from "@/lib/brs";

const title = "BRS Reparações Automotivas | Funilaria e Pintura em Toledo-PR";
const description =
  "Conheça a BRS Reparações Automotivas em Toledo-PR. Funilaria, pintura automotiva e martelinho de ouro. Entre em contato para solicitar uma avaliação.";
export const Route = createFileRoute("/")({
  component: Website,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/assets/brs-hero.jpg" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "/assets/brs-hero.jpg" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoBodyShop",
          name: company.name,
          telephone: "+55 45 2035-9440",
          areaServed: { "@type": "City", name: "Toledo, Paraná, Brasil" },
          sameAs: [company.instagram],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Reparação automotiva",
            itemListElement: [
              "Funilaria automotiva",
              "Pintura automotiva",
              "Martelinho de ouro",
            ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
          },
        }),
      },
    ],
  }),
});
