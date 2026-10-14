import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles, ShieldCheck, Eye } from "lucide-react";
import { services, aestheticServices } from "@/lib/brs";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import funilariaServico from "@/assets/funilaria-servico.jpg";
import pinturaServico from "@/assets/pintura-servico.jpg";
import martelinhoServico from "@/assets/martelinho-servico.jpg";

const serviceImages = [funilariaServico, pinturaServico, martelinhoServico];

const aestheticIcons = [Sparkles, ShieldCheck, Eye];

/**
 * Seção de Especialidades — Arquitetura Editorial Premium (SPEC-023, SPEC-030, SPEC-036)
 * Matriz aberta contínua com divisores estruturais, tipografia expressiva,
 * parallax fotográfico sutil e microinterações de alta precisão.
 */
export function Services() {
  return (
    <section id="servicos" className="section-space py-16 md:py-24 relative">
      <div
        id="especialidades"
        className="scroll-mt-24 absolute -top-12 left-0"
        aria-hidden="true"
      />
      <div className="page-width">
        <ScrollReveal
          direction="up"
          delay={0.05}
          className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12"
        >
          <div>
            <p className="eyebrow mb-4">Especialidades</p>
            <h2 className="section-title">
              Recuperar a forma original.
              <br />
              <span className="text-muted-foreground">Preservar o valor do veículo.</span>
            </h2>
          </div>
          <p className="body-copy max-w-[340px]">
            Soluções técnicas adequadas para diferentes níveis de avaria. Diagnóstico criterioso
            para cada caso com tecnologia automotiva de ponta.
          </p>
        </ScrollReveal>

        {/* Matriz Editorial com Bordas Compartilhadas (Anti-Card Slop) */}
        <div className="border-y border-border/80 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80">
          {services.map((service, i) => (
            <ScrollReveal
              key={service.title}
              as="article"
              direction="up"
              delay={0.1 + i * 0.12}
              className="flex flex-col justify-between py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 group transition-colors duration-500 hover:bg-white/[0.015]"
            >
              <div>
                {/* Fotografia Automotiva com Parallax Sutil e Enquadramento Editorial */}
                <div className="relative aspect-16/10 mb-6 overflow-hidden rounded-xs border border-white/10 group-hover:border-primary/40 transition-colors duration-500">
                  <ParallaxImage
                    src={serviceImages[i]}
                    alt={`${service.title} (fotografia ilustrativa da atividade)`}
                    width={1200}
                    height={800}
                    speed={6}
                    aspectRatioClassName="aspect-16/10"
                    imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                  >
                    <span className="absolute bottom-3 right-3 text-[8px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs pointer-events-none z-10">
                      Fotografia ilustrativa
                    </span>
                  </ParallaxImage>
                </div>

                <h3 className="text-xl md:text-2xl font-semibold font-display tracking-tight text-foreground mb-3 leading-snug text-balance">
                  <Link
                    to={service.path}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {service.title}
                  </Link>
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                  {service.description}
                </p>
              </div>

              {/* Link de Navegação Contextual com Microinteração Refinada */}
              <div className="pt-6 mt-6 border-t border-border/40">
                <Link
                  to={service.path}
                  className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs py-0.5"
                >
                  <span>
                    {i === 0
                      ? "Conhecer funilaria"
                      : i === 1
                        ? "Conhecer a pintura"
                        : "Entender o martelinho"}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Linha de Estética Automotiva & Proteção — Apresentação Editorial Compacta (SPEC-030, SPEC-037) */}
        <div className="mt-14 pt-10 border-t border-border/80">
          <ScrollReveal
            direction="up"
            delay={0.08}
            className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8"
          >
            <div>
              <p className="eyebrow mb-2">Estética & Proteção</p>
              <h3 className="text-xl md:text-2xl font-display font-semibold tracking-tight text-foreground">
                Acabamento refinado e conservação de superfícies.
              </h3>
            </div>
            <Link
              to="/servicos"
              hash="estetica-automotiva"
              className="group/all inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary hover:text-foreground transition-colors"
            >
              <span>Ver especificações e limitações</span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </ScrollReveal>

          {/* Lista Editorial Compacta com divisores sutis */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 border-y border-border/60">
            {aestheticServices.map((aesthetic, idx) => {
              const Icon = aestheticIcons[idx];
              return (
                <ScrollReveal
                  key={aesthetic.slug}
                  direction="up"
                  delay={0.1 + idx * 0.08}
                  className="py-6 md:py-8 md:px-6 first:md:pl-0 last:md:pr-0 flex flex-col justify-between group transition-colors duration-300 hover:bg-white/[0.015]"
                >
                  <div>
                    <div className="flex items-center gap-2.5 text-primary mb-2.5">
                      <Icon size={16} aria-hidden="true" className="shrink-0" />
                      <h4 className="text-sm font-semibold font-display text-foreground group-hover:text-primary transition-colors">
                        {aesthetic.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {aesthetic.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span className="text-primary/90">{aesthetic.benefits[0]}</span>
                    <Link
                      to="/contato"
                      className="text-primary hover:text-foreground transition-colors inline-flex items-center gap-1 group/btn font-medium"
                    >
                      <span>Avaliar</span>
                      <ArrowUpRight
                        size={12}
                        className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
