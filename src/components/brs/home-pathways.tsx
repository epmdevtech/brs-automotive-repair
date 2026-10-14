import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { NumericCounter } from "@/components/ui/numeric-counter";

const pathways = [
  {
    to: "/sobre",
    number: "01",
    eyebrow: "A BRS",
    title: "Oficina técnica especializada.",
    text: "Funilaria, pintura automotiva e martelinho de ouro em Toledo, Paraná, com domínio técnico, equipamentos adequados e atendimento responsável.",
    label: "Conhecer a BRS",
  },
  {
    to: "/trabalhos",
    number: "02",
    eyebrow: "Nosso trabalho",
    title: "Procedimentos em detalhe.",
    text: "Galeria técnica com comparativos antes e depois. As imagens atuais são ilustrativas, até a documentação do acervo real da oficina.",
    label: "Ver trabalhos",
  },
  {
    to: "/para-corretores",
    number: "03",
    eyebrow: "Para corretores de seguros",
    title: "Tranquilidade para o corretor.",
    text: "Comunicação transparente e compromisso com o prazo acordado, cuidando da experiência do segurado durante o sinistro.",
    label: "Atendimento para corretores",
  },
] as const;

/**
 * Resumo editorial das páginas institucionais (SPEC-023, SPEC-036).
 * Estrutura de matriz contínua com hairlines compartilhados e microinterações táteis.
 */
export function HomePathways() {
  return (
    <section className="section-space bg-background border-b border-border">
      <div className="page-width">
        <ScrollReveal
          data-reveal=""
          style={{ "--i": 0 } as React.CSSProperties}
          direction="up"
          className="mb-12 max-w-2xl"
        >
          <p className="eyebrow mb-4">Conheça mais</p>
          <h2 className="section-title">Escolha por onde continuar.</h2>
        </ScrollReveal>

        {/* Matriz com Bordas Compartilhadas e Hairlines */}
        <div className="border-t border-border/80 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80">
          {pathways.map((item, i) => (
            <ScrollReveal
              data-reveal=""
              style={{ "--i": i + 1 } as React.CSSProperties}
              key={item.to}
              direction="up"
              delay={i * 0.12}
              as="article"
              className="flex h-full flex-col justify-between py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 group transition-colors duration-500 hover:bg-white/[0.015]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="eyebrow">{item.eyebrow}</span>
                  <span className="font-mono text-[11px] font-semibold text-primary">
                    <NumericCounter target={parseInt(item.number, 10)} padZero />
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold font-display tracking-tight text-foreground mb-3 text-balance group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                  {item.text}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/40">
                <Link
                  to={item.to}
                  className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs py-0.5"
                >
                  <span>{item.label}</span>
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
      </div>
    </section>
  );
}
