import { company, canonicalUrl } from "./brs";

export interface RouteSeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function buildRouteHead({
  title,
  description,
  path,
  image = "/assets/brs-hero.jpg",
  type = "website",
  jsonLd,
}: RouteSeoOptions) {
  const url = canonicalUrl(path);
  const imageUrl = image.startsWith("http") ? image : canonicalUrl(image);

  const scripts = [];
  if (jsonLd) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(jsonLd),
    });
  }

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: company.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}

export function buildAutoBodyShopSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    name: company.name,
    url: canonicalUrl("/"),
    telephone: "+55 45 2035-9440",
    sameAs: [company.instagram],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toledo",
      addressRegion: "PR",
      addressCountry: "BR",
    },
    areaServed: {
      "@type": "City",
      name: "Toledo, Paraná, Brasil",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços Especializados de Reparação Automotiva",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Funilaria automotiva",
            url: canonicalUrl("/servicos/funilaria"),
            description:
              "Reparação e alinhamento técnico da lataria com conformação de chapa e preservação de gaps originais.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Pintura automotiva",
            url: canonicalUrl("/servicos/pintura-automotiva"),
            description:
              "Preparação e repintura em cabine com controle térmico, primers anticorrosivos e colorimetria precisa.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Martelinho de ouro",
            url: canonicalUrl("/servicos/martelinho-de-ouro"),
            description:
              "Desamassamento artesanal PDR sem repintura, preservando 100% da tinta original e o valor de revenda.",
          },
        },
      ],
    },
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function buildServiceSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: canonicalUrl(path),
    provider: {
      "@type": "AutoBodyShop",
      name: company.name,
      url: canonicalUrl("/"),
      telephone: "+55 45 2035-9440",
      sameAs: [company.instagram],
    },
    areaServed: {
      "@type": "City",
      name: "Toledo, Paraná, Brasil",
    },
  };
}
