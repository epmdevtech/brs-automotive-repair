import { company, canonicalUrl } from "./brs";

export interface RouteSeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
}

export function buildRouteHead({
  title,
  description,
  path,
  image = "/master/og-master.jpg",
  type = "website",
  jsonLd,
  noindex = false,
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

  const meta: Array<Record<string, string>> = [
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
  ];

  if (noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}

export function buildAutoBodyShopSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    name: company.name,
    legalName: company.legalName,
    alternateName: [company.tradeName, company.name],
    taxID: company.cnpjRaw,
    foundingDate: company.foundedDate,
    founder: {
      "@type": "Organization",
      name: company.name,
    },
    url: canonicalUrl("/"),
    telephone: "+55 45 99954-5442",
    sameAs: company.socials.map((social) => social.url),
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.state,
      postalCode: company.address.postalCode,
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
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
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Espelhamento de pintura automotiva",
            url: canonicalUrl("/servicos#espelhamento"),
            description:
              "Polimento técnico em múltiplos estágios para nivelamento do verniz e remoção de micro-riscos e hologramas.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Vitrificação cerâmica de pintura",
            url: canonicalUrl("/servicos#vitrificacao"),
            description:
              "Aplicação de revestimento cerâmico de alta densidade com barreira hidrofóbica e proteção UV duradoura.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Polimento de para-brisa",
            url: canonicalUrl("/servicos#polimento-de-parabrisa"),
            description:
              "Tratamento óptico em óxido de cério para remoção de marcas de palheta e recuperação da transparência cristalina.",
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
      legalName: company.legalName,
      url: canonicalUrl("/"),
      telephone: "+55 45 99954-5442",
      sameAs: company.socials.map((social) => social.url),
    },
    areaServed: {
      "@type": "City",
      name: "Toledo, Paraná, Brasil",
    },
  };
}
