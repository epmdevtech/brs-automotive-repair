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
    <section id="servicos" className="section-space">
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

                {/* Identificador & Tipografia */}
                <span className="font-mono text-[11px] font-semibold text-primary tracking-wider uppercase block mb-3">
                  0{i + 1} / ESPECIALIDADE
                </span>

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

        {/* Linha de Estética Automotiva & Proteção (SPEC-030) */}
        <div className="mt-16 pt-12 border-t border-border/80">
          <ScrollReveal
            direction="up"
            delay={0.08}
            className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-wider mb-3">
                <Sparkles size={13} aria-hidden="true" />
                <span>Estética & Proteção de Superfícies</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-foreground">
                Acabamento refinado e proteção duradoura.
              </h3>
            </div>
            <Link
              to="/servicos"
              hash="estetica-automotiva"
              className="group/all inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary hover:text-foreground transition-colors"
            >
              <span>Ver todas as especificações e limitações</span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aestheticServices.map((aesthetic, idx) => {
              const Icon = aestheticIcons[idx];
              return (
                <ScrollReveal
                  key={aesthetic.slug}
                  direction="up"
                  delay={0.12 + idx * 0.1}
                  className="p-6 rounded-sm border border-border/70 bg-card/40 flex flex-col justify-between hover:border-primary/50 hover:bg-card/70 hover:shadow-[0_4px_24px_rgba(200,169,106,0.06)] transition-all duration-300 group/card"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xs bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover/card:scale-105 group-hover/card:border-primary/50 transition-all duration-300">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <h4 className="text-base font-semibold font-display text-foreground mb-1.5 group-hover/card:text-white transition-colors">
                      {aesthetic.title}
                    </h4>
                    <p className="text-xs text-primary font-mono mb-3">{aesthetic.tagline}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {aesthetic.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-6 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {aesthetic.benefits[0]}
                    </span>
                    <Link
                      to="/contato"
                      className="text-xs font-medium text-primary hover:text-foreground transition-colors inline-flex items-center gap-1 group/btn"
                    >
                      <span>Avaliar</span>
                      <ArrowUpRight
                        size={13}
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
