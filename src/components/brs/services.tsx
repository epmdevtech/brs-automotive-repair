import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/brs";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import funilariaImg from "@/assets/funilaria.jpg";
import pinturaImg from "@/assets/master/pintura.jpg";
import martelinhoImg from "@/assets/martelinho.jpg";
import estruturaImg from "@/assets/master/estrutura.jpg";

const serviceImages = [
  {
    src: estruturaImg,
    alt: "Fachada da Master Chapeação e Pinturas com veículo em atendimento na oficina",
    illustrative: false,
  },
  {
    src: pinturaImg,
    alt: "Veículo branco finalizado sob as luzes da estufa de pintura da Master",
    illustrative: false,
  },
  {
    src: martelinhoImg,
    alt: "Técnica de martelinho de ouro em painel automotivo (fotografia ilustrativa)",
    illustrative: true,
  },
];

/**
 * Seção de Especialidades — Arquitetura Enxuta e Orientada à Conversão (SPEC-064)
 * 3 cards com título, 1–2 frases diretas, fotografia leve identificada como ilustrativa
 * e um único link por card com rótulo consistente. Linha compacta para estética automotiva.
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
              Recuperar a forma original e preservar o valor do veículo.
            </h2>
          </div>
          <p className="body-copy max-w-[360px]">
            Avaliamos o dano presencialmente na oficina para indicar o procedimento adequado para o
            seu veículo.
          </p>
        </ScrollReveal>

        {/* Matriz Editorial com Bordas Compartilhadas e 1 link único por card */}
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
                <div className="relative aspect-16/10 mb-6 overflow-hidden rounded-xs border border-white/10 group-hover:border-primary/40 transition-colors duration-500">
                  <ParallaxImage
                    src={serviceImages[i].src}
                    alt={serviceImages[i].alt}
                    width={1200}
                    height={800}
                    speed={6}
                    aspectRatioClassName="aspect-16/10"
                    imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                  >
                    {serviceImages[i].illustrative && (
                      <span className="absolute bottom-3 right-3 text-[8px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs pointer-events-none z-10">
                        Fotografia ilustrativa
                      </span>
                    )}
                  </ParallaxImage>
                </div>

                <h3 className="text-xl md:text-2xl font-semibold font-display tracking-tight text-foreground mb-3 leading-snug text-balance">
                  {service.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                  {service.description}
                </p>
              </div>

              {/* Link único por card com rótulo consistente */}
              <div className="pt-6 mt-6 border-t border-border/40">
                <Link
                  to={service.path}
                  className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs py-0.5"
                >
                  <span>Ver detalhes do serviço</span>
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

        {/* Linha Compacta de Estética Automotiva & Proteção (SPEC-064) */}
        <ScrollReveal
          direction="up"
          delay={0.12}
          className="mt-10 pt-8 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Estética e proteção:</span> Também
            fazemos espelhamento de pintura, vitrificação cerâmica e polimento técnico de
            para-brisa.
          </p>
          <Link
            to="/servicos"
            hash="estetica-automotiva"
            className="group/all inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-foreground transition-colors shrink-0"
          >
            <span>Ver estética e proteção</span>
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5 text-primary"
              aria-hidden="true"
            />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
