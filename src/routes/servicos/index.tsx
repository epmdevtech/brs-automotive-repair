import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowDown,
  Check,
  Truck,
  Sparkles,
  ShieldCheck,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { services, aestheticServices, canonicalUrl } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { PageHero } from "@/components/brs/page-hero";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ImageReveal } from "@/components/ui/image-reveal";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import funilariaServico from "@/assets/funilaria-servico.jpg";
import pinturaServico from "@/assets/pintura-servico.jpg";
import martelinhoServico from "@/assets/martelinho-servico.jpg";

const serviceImages: Record<string, string> = {
  funilaria: funilariaServico,
  "pintura-automotiva": pinturaServico,
  "martelinho-de-ouro": martelinhoServico,
};

const serviceAnchorIds: Record<string, string> = {
  funilaria: "funilaria-estrutural",
  "pintura-automotiva": "pintura-estufa",
  "martelinho-de-ouro": "martelinho-pdr",
};

export const Route = createFileRoute("/servicos/")({
  component: ServicesPage,
  head: () =>
    buildRouteHead({
      title: "Serviços e Estética Automotiva | Master Chapeação e Pinturas",
      description:
        "Especialidades da Master em Toledo-PR: funilaria, pintura em estufa, martelinho de ouro, espelhamento, vitrificação cerâmica e polimento de para-brisa.",
      path: "/servicos",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Serviços", path: "/servicos" }]),
          {
            "@type": "ItemList",
            name: "Especialidades Técnicas da Master Chapeação e Pinturas",
            itemListElement: services.map((s, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: s.title,
              url: canonicalUrl(s.path),
            })),
          },
        ],
      },
    }),
});

function ServicesPage() {
  const { scrollTo } = useSmoothScroll();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    scrollTo(target);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", target);
    }
  };

  return (
    <div className="pt-28 pb-20">
      {/* Banner / Header da Página (SPEC-034 Awwwards Standard) */}
      <PageHero
        breadcrumbs={[{ name: "Serviços" }]}
        codeIndex="CAT.02 // SERVIÇOS"
        eyebrow="Especialidades Técnicas da Oficina"
        title="Recuperação técnica de precisão. Preservação do padrão de fábrica."
        description={
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            A Master Chapeação e Pinturas concentra sua atuação em três frentes complementares de
            reparação veicular em Toledo, Paraná. Cada serviço é conduzido mediante diagnóstico
            individualizado da deformação metálica e da integridade da camada de verniz.
          </p>
        }
        actions={[
          {
            label: "Ver trabalhos concluídos",
            to: "/trabalhos",
            variant: "secondary",
            icon: ArrowUpRight,
          },
        ]}
        className="mb-0 border-b-0 pb-8 sm:pb-12"
      />

      {/* Grid Detalhado dos 3 Serviços */}
      {/* Faixas Editoriais dos 3 Serviços com Linhas Amplas */}
      <section id="lista-servicos" className="page-width border-t border-border/70 py-16 lg:py-20">
        {services.map((service, index) => {
          const image = serviceImages[service.slug] || funilariaServico;
          const isReverse = index % 2 === 1;
          const sectionId = serviceAnchorIds[service.slug] || service.slug;

          return (
            <ScrollReveal
              key={service.slug}
              as="article"
              id={sectionId}
              direction="up"
              delay={index * 0.12}
              className={`grid md:grid-cols-12 gap-8 lg:gap-16 items-center py-12 lg:py-16 first:pt-0 border-b border-border/70 last:border-b-0 scroll-mt-28 ${
                isReverse ? "md:grid-flow-dense" : ""
              }`}
            >
              <div className={`md:col-span-6 relative ${isReverse ? "md:col-start-7" : ""}`}>
                <ImageReveal
                  delay={0.1}
                  className="rounded-xs border border-border/60 aspect-16/10 relative overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${service.title} em Toledo-PR (fotografia ilustrativa)`}
                    width={1200}
                    height={800}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute bottom-3 right-3 text-[9px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs pointer-events-none">
                    Fotografia ilustrativa
                  </span>
                </ImageReveal>
              </div>

              <div
                className={`md:col-span-6 flex flex-col justify-between ${isReverse ? "md:col-start-1" : ""}`}
              >
                <div>
                  <span className="font-mono text-xs font-semibold text-primary uppercase tracking-widest block mb-3">
                    0{index + 1} / ESPECIALIDADE TÉCNICA
                  </span>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-display tracking-tight text-white mb-3">
                    <Link to={service.path} className="hover:text-primary transition-colors">
                      {service.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                    {service.fullDescription}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">
                      Indicações comuns:
                    </h3>
                    <ul className="space-y-2">
                      {service.applications.slice(0, 3).map((app, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex items-start gap-2.5">
                          <Check
                            size={14}
                            className="text-primary shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/60">
                  <Link
                    to="/trabalhos"
                    search={{ filtro: service.slug }}
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-primary hover:text-white transition-colors group cursor-pointer"
                  >
                    <span>Ver casos deste serviço no portfólio</span>
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </section>

      {/* Guia Comparativo de Diagnóstico — Matriz Editorial com Bordas Compartilhadas */}
      <section className="page-width mt-20 pt-16 border-t border-border">
        <ScrollReveal direction="up" delay={0.08} className="max-w-2xl mb-10">
          <p className="eyebrow mb-2.5">Guia de Triagem</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Qual é a técnica indicada para a sua avaria?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
            A escolha do método correto preserva o valor de revenda do veículo e evita intervenções
            invasivas ou custos desnecessários.
          </p>
        </ScrollReveal>

        <div className="border-y border-border/80 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80">
          <ScrollReveal
            direction="up"
            delay={0.0}
            className="py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-2">
                01 / PEQUENOS AMASSADOS
              </span>
              <h3 className="text-lg md:text-xl font-semibold font-display text-white mb-3">
                Martelinho de Ouro
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Indicado quando a pintura original está intacta (sem trincas ou riscos fundos) e a
                chapa metálica não sofreu estiramento severo.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/40">
              <a
                href="#martelinho-pdr"
                onClick={(e) => handleSmoothScroll(e, "#martelinho-pdr")}
                className="text-xs font-semibold text-primary hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ver método Martelinho PDR</span>
                <ArrowDown size={13} aria-hidden="true" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.12}
            className="py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-2">
                02 / AVARIAS ESTRUTURAIS
              </span>
              <h3 className="text-lg md:text-xl font-semibold font-display text-white mb-3">
                Funilaria Automotiva
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Necessária quando há vincos profundos, desalinhamento de portas ou peças que
                precisam ser repuxadas e alinhadas geometricamente.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/40">
              <a
                href="#funilaria-estrutural"
                onClick={(e) => handleSmoothScroll(e, "#funilaria-estrutural")}
                className="text-xs font-semibold text-primary hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ver processo de Funilaria</span>
                <ArrowDown size={13} aria-hidden="true" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.24}
            className="py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-2">
                03 / DANOS AO ACABAMENTO
              </span>
              <h3 className="text-lg md:text-xl font-semibold font-display text-white mb-3">
                Pintura em Estufa
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Exigida quando o verniz ou a base foram rompidos, em peças substituídas ou quando é
                necessário recuperar a uniformidade visual completa.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/40">
              <a
                href="#pintura-estufa"
                onClick={(e) => handleSmoothScroll(e, "#pintura-estufa")}
                className="text-xs font-semibold text-primary hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ver Pintura em Estufa</span>
                <ArrowDown size={13} aria-hidden="true" />
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Seção Editorial de Estética Automotiva, Vitrificação e Polimento de Para-brisa (SPEC-030) */}
        <section id="estetica-automotiva" className="mt-20 pt-16 border-t border-border/80">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs font-semibold text-primary uppercase tracking-widest block mb-3">
              ESTÉTICA & PROTEÇÃO
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-display tracking-tight text-white mb-4">
              Estética Automotiva, Vitrificação & Cuidados com Superfícies
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Além da funilaria e pintura em estufa, a Master Chapeação e Pinturas realiza serviços
              especializados de acabamento de precisão, proteção cerâmica de verniz e recuperação
              óptica de vidros para valorizar e proteger o padrão estético do seu veículo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {aestheticServices.map((aes, idx) => {
              const icon =
                aes.slug === "espelhamento" ? (
                  <Sparkles className="size-5 text-primary" aria-hidden="true" />
                ) : aes.slug === "vitrificacao" ? (
                  <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
                ) : (
                  <Eye className="size-5 text-primary" aria-hidden="true" />
                );

              return (
                <ScrollReveal
                  key={aes.slug}
                  direction="up"
                  delay={0.1 + idx * 0.1}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-card/40 p-6 sm:p-7 transition-colors hover:border-white/20"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {icon}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/30 font-semibold">
                        Estética Técnica
                      </span>
                    </div>

                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                      {aes.tagline}
                    </span>
                    <h3 className="text-lg sm:text-xl font-display font-semibold text-white mb-3">
                      {aes.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                      {aes.description}
                    </p>

                    <div className="mb-6 pt-4 border-t border-white/10">
                      <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                        Benefícios Técnicos:
                      </h4>
                      <ul className="space-y-2">
                        {aes.benefits.map((b, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed"
                          >
                            <CheckCircle2
                              className="size-3.5 text-primary shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                        Limitações e Critérios:
                      </h4>
                      <ul className="space-y-1.5">
                        {aes.limitations.map((lim, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-neutral-400 leading-relaxed list-disc list-inside"
                          >
                            {lim}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Banner Final de Conversão com Guincho (Único Ponto Focal da Rota) */}
        <ScrollReveal
          direction="up"
          delay={0.15}
          id="leva-e-traz"
          className="mt-20 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.07] via-background to-background p-8 sm:p-12 relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -bottom-20 size-72 rounded-full bg-primary/10 blur-3xl -z-10"
          />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-primary mb-3">
                <Truck size={16} className="text-primary shrink-0" aria-hidden="true" />
                <span>Comodidade Urbana em Toledo-PR</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-white mb-3">
                Diagnóstico técnico preciso com comodidade do guincho em Toledo-PR
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Envie as fotos da avaria pelo canal oficial ou agende a retirada do veículo no seu
                endereço. Realizamos triagem técnica honesta indicando apenas a intervenção
                necessária.
              </p>
            </div>

            <Button
              variant="primary"
              asChild
              className="h-12 min-h-[44px] px-8 text-xs font-semibold shrink-0 cursor-pointer shadow-lg shadow-primary/15"
            >
              <Link to="/contato">
                <span>Solicitar avaliação</span>
                <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
