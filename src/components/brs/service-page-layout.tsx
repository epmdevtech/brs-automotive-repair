import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Phone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ImageReveal } from "@/components/ui/image-reveal";
import { company, services, type ServiceDetail } from "@/lib/brs";
import { Breadcrumbs } from "./breadcrumbs";
import { ContactCTA } from "./contact-cta";

export interface ServicePageContent {
  service: ServiceDetail;
  eyebrow: string;
  /** Título (`h1`) específico da página. */
  title: string;
  intro: string;
  heroCtaLabel: string;
  image: string;
  imageAlt: string;
  applicationsIcon: ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" | "false" }>;
  applicationsTitle: string;
  limitationsTitle: string;
  limitationNote: string;
  processEyebrow: string;
  processTitle: string;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
}

/**
 * Estrutura comum das páginas de serviço com refinamento de motion design boutique.
 * Combina ScrollReveal com deslocamento suave e ImageReveal com zoom reverso cinematográfico.
 */
export function ServicePageLayout({
  service,
  eyebrow,
  title,
  intro,
  heroCtaLabel,
  image,
  imageAlt,
  applicationsIcon: ApplicationsIcon,
  applicationsTitle,
  limitationsTitle,
  limitationNote,
  processEyebrow,
  processTitle,
  ctaTitle,
  ctaText,
  ctaLabel,
}: ServicePageContent) {
  const otherServices = services.filter((item) => item.slug !== service.slug);

  return (
    <div className="pt-28 pb-20">
      <section className="page-width mb-12">
        <Breadcrumbs
          items={[{ name: "Serviços", path: "/servicos" }, { name: service.title }]}
          className="mb-6"
        />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={0.05}>
              <p className="eyebrow mb-3">{eyebrow}</p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.15}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
                {title}
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25}>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">{intro}</p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.35}>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button variant="primary" asChild className="h-11 px-6 text-xs font-semibold">
                  <Link to="/contato">
                    {heroCtaLabel} <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="secondary" asChild className="h-11 px-6 text-xs font-medium">
                  <a href={company.phoneHref}>
                    <Phone size={14} className="mr-2 text-primary" aria-hidden="true" />
                    Ligar {company.phone}
                  </a>
                </Button>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5">
            <ImageReveal className="relative rounded-xl border border-border aspect-4/3 shadow-2xl">
              <img
                src={image}
                alt={imageAlt}
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute bottom-3 right-3 text-[9px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs">
                Fotografia ilustrativa
              </span>
            </ImageReveal>
          </div>
        </div>
      </section>

      {/* Aplicações e limitações — Estrutura Editorial em Duas Colunas com Hairline */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 divide-y md:divide-y-0 md:divide-x divide-border/80">
          <ScrollReveal direction="up" delay={0.1} className="h-full md:pr-10 lg:pr-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <ApplicationsIcon size={18} className="text-primary shrink-0" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-semibold font-display text-white">
                  {applicationsTitle}
                </h2>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-neutral-300">
                {service.applications.map((app) => (
                  <li key={app} className="flex items-start gap-3">
                    <Check size={15} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed">{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.22}
            className="h-full pt-10 md:pt-0 md:pl-10 lg:pl-12"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert size={18} className="text-amber-500 shrink-0" aria-hidden="true" />
                <h2 className="text-xl sm:text-2xl font-semibold font-display text-white">
                  {limitationsTitle}
                </h2>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-neutral-300">
                {service.limitations.map((limit) => (
                  <li key={limit} className="flex items-start gap-3">
                    <span className="size-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                    <span className="leading-relaxed">{limit}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs text-neutral-400 border-l border-amber-500/40 pl-4 py-1 leading-relaxed">
                * {limitationNote}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Processo — Matriz Editorial com Bordas Compartilhadas */}
      <section className="page-width mt-20 pt-16 border-t border-border">
        <ScrollReveal direction="up" className="max-w-2xl mb-10">
          <p className="eyebrow mb-2">{processEyebrow}</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            {processTitle}
          </h2>
        </ScrollReveal>

        <div className="border-y border-border/80 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/80">
          {service.processSteps.map((step, idx) => (
            <ScrollReveal
              key={step.title}
              direction="up"
              delay={idx * 0.12}
              className="py-8 sm:py-10 sm:px-8 first:sm:pl-0 last:sm:pr-0 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                  Fase 0{idx + 1}
                </span>
                <h3 className="text-base sm:text-lg font-semibold font-display text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed text-pretty">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Navegação contextual entre serviços — Ledger Editorial */}
      <nav aria-label="Outros serviços" className="page-width mt-20 pt-16 border-t border-border">
        <ScrollReveal direction="up">
          <p className="eyebrow mb-4">Outros serviços</p>
        </ScrollReveal>
        <ul className="border-y border-border/80 divide-y divide-border/80">
          {otherServices.map((item, idx) => (
            <ScrollReveal as="li" key={item.slug} direction="up" delay={idx * 0.12}>
              <Link
                to={item.path}
                className="group py-6 flex items-center justify-between gap-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs px-2 -mx-2"
              >
                <div>
                  <span className="block text-base font-semibold font-display text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                  <span className="block text-xs text-neutral-400 leading-relaxed mt-1 max-w-xl">
                    {item.description}
                  </span>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-primary shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </Link>
            </ScrollReveal>
          ))}
        </ul>
      </nav>

      <ContactCTA title={ctaTitle} description={ctaText} label={ctaLabel} className="mt-20" />
    </div>
  );
}
