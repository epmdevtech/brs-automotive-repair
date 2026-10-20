import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Expand,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { NumericCounter } from "@/components/ui/numeric-counter";
import { BeforeAfterSlider } from "./before-after-slider";
import funilariaAntes from "@/assets/funilaria-antes.jpg";
import funilariaDepois from "@/assets/funilaria-depois.jpg";
import pinturaAntes from "@/assets/pintura-antes.jpg";
import pinturaDepois from "@/assets/pintura-depois.jpg";
import martelinhoAntes from "@/assets/martelinho-antes.jpg";
import martelinhoDepois from "@/assets/martelinho-depois.jpg";

interface GalleryCase {
  id: string;
  category: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImageClassName?: string;
  afterImageClassName?: string;
}

const galleryCases: GalleryCase[] = [
  {
    id: "funilaria",
    number: "01",
    category: "Funilaria de Precisão",
    title: "Alinhamento Estrutural e Recuperação de Vincos",
    subtitle: "Restauração de painel lateral respeitando tolerâncias de montagem",
    description:
      "Reparação criteriosa de deformação na lataria com recuperação milimétrica dos vincos originais. A geometria de encaixe com portas e para-lamas foi restaurada sem necessidade de enxertos pesados de massa.",
    highlights: [
      "Alinhamento milimétrico de folgas e encaixes",
      "Reconstituição precisa dos vincos de fábrica",
      "Preservação da integridade estrutural da chapa",
    ],
    beforeImage: funilariaAntes,
    afterImage: funilariaDepois,
    beforeLabel: "Antes (Avaria)",
    afterLabel: "Depois (Alinhado)",
  },
  {
    id: "pintura",
    number: "02",
    category: "Pintura em Estufa",
    title: "Equalização de Cor e Verniz Alto Sólidos",
    subtitle: "Acabamento espelhado sem contaminações ou manchas",
    description:
      "Preparação de superfície com fundo primer anti-corrosivo, leitura colorimétrica por amostra e pintura em estufa pressurizada com controle rigoroso de temperatura e umidade, garantindo reflexo límpido.",
    highlights: [
      "Fidelidade de tonalidade sem emendas visíveis",
      "Estufa pressurizada com filtragem absoluta",
      "Camada protetora de verniz de alta durabilidade",
    ],
    beforeImage: pinturaAntes,
    afterImage: pinturaDepois,
    beforeLabel: "Antes (Preparação)",
    afterLabel: "Depois (Verniz)",
  },
  {
    id: "martelinho",
    number: "03",
    category: "Martelinho de Ouro",
    title: "Desamassamento Fino sem Repintura",
    subtitle: "Eliminação de mossas preservando 100% a pintura de fábrica",
    description:
      "Aplicação de técnica artesanal com alavancas milimétricas e iluminação de contraste. Os amassados são massageados por trás do painel até o retorno da curvatura original, mantendo o verniz íntegro.",
    highlights: [
      "Preservação da pintura original de fábrica",
      "Zero desvalorização do veículo na revenda",
      "Reparo ágil e não invasivo para danos leves",
    ],
    beforeImage: martelinhoAntes,
    afterImage: martelinhoDepois,
    beforeLabel: "Antes (Mossa)",
    afterLabel: "Depois (Liso)",
  },
];

export function ProjectGallery({ className }: { className?: string } = {}) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const currentCase = activeModalIndex === null ? null : galleryCases[activeModalIndex];

  const handlePrev = () => {
    setActiveModalIndex((prev) =>
      prev === null ? 0 : (prev - 1 + galleryCases.length) % galleryCases.length,
    );
  };

  const handleNext = () => {
    setActiveModalIndex((prev) => (prev === null ? 0 : (prev + 1) % galleryCases.length));
  };

  return (
    <section id="trabalho" className={`section-space ${className || ""}`}>
      <div className="page-width">
        <ScrollReveal
          direction="up"
          delay={0.05}
          className="flex flex-col md:flex-row gap-5 justify-between md:items-end mb-10"
        >
          <div>
            <p className="eyebrow mb-4">Galeria Antes & Depois</p>
            <h2 className="section-title">
              Foco na forma
              <br />e na textura original.
            </h2>
          </div>
          <div className="max-w-[380px]">
            <p className="body-copy">
              Arraste o divisor interativo para comparar a transição entre o dano e a recuperação
              técnica. Clique em qualquer caso para ampliar a inspeção em alta resolução.
            </p>
            <p className="text-[10px] text-brand-accent mt-3 flex items-center gap-1.5 font-medium">
              <ShieldCheck size={13} aria-hidden="true" />
              Demonstração técnica de reparo (acervo de fotos reais em preparação).
            </p>
          </div>
        </ScrollReveal>

        {/* Matriz Editorial com Bordas Compartilhadas (Anti-Card Slop) */}
        <div className="border-y border-border/80 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80">
          {galleryCases.map((item, i) => (
            <ScrollReveal
              key={item.id}
              as="article"
              direction="up"
              delay={i * 0.12}
              className="flex flex-col justify-between py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 group"
            >
              {/* Slider Antes/Depois Integrado Editorialmente */}
              <div>
                <div className="relative overflow-hidden rounded-xs border border-border/60 mb-6">
                  <BeforeAfterSlider
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                    beforeLabel={item.beforeLabel}
                    afterLabel={item.afterLabel}
                    beforeImageClassName={item.beforeImageClassName}
                    afterImageClassName={item.afterImageClassName}
                    aspectRatioClassName="aspect-16/10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 z-30 size-8 rounded-sm bg-background/80 backdrop-blur-xs border border-border/60 text-foreground hover:text-brand-accent hover:border-primary transition-colors cursor-pointer"
                    onClick={() => setActiveModalIndex(i)}
                    aria-label={`Ampliar inspeção em alta resolução de ${item.title}`}
                  >
                    <Expand size={14} aria-hidden="true" />
                  </Button>
                </div>

                {/* Informações Técnicas e Tipografia */}
                <div className="flex items-center justify-between text-[10px] font-semibold text-brand-accent tracking-wider uppercase mb-2">
                  <span>{item.category}</span>
                  <span className="font-mono text-muted-foreground">
                    <NumericCounter target={parseInt(item.number, 10)} padZero /> / CASO
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold font-display tracking-tight text-foreground mb-2 text-balance">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 text-pretty">
                  {item.description}
                </p>
              </div>

              {/* Ações Técnicas no Rodapé do Item */}
              <div className="pt-4 mt-6 border-t border-border/40 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                  Arraste o divisor
                </span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-brand-accent hover:text-foreground font-medium inline-flex items-center gap-1 cursor-pointer"
                  onClick={() => setActiveModalIndex(i)}
                >
                  Inspecionar ampliado <Expand size={12} aria-hidden="true" />
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox Modal Ampliado (@radix-ui/react-dialog) */}
      <Dialog
        open={activeModalIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveModalIndex(null);
        }}
      >
        <DialogContent className="max-w-5xl w-[calc(100%-32px)] p-6 bg-card border-border sm:rounded-xl">
          {currentCase && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 pr-8 border-b border-border/60 pb-3">
                <div>
                  <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-wider">
                    {currentCase.category} · Caso {currentCase.number} de 03
                  </span>
                  <DialogTitle className="text-xl md:text-2xl font-semibold font-display tracking-tight mt-1 text-foreground text-balance">
                    {currentCase.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5 text-pretty">
                    {currentCase.subtitle}
                  </DialogDescription>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider bg-background px-2.5 py-1 rounded-sm border border-border/60">
                  Fotografia ilustrativa
                </span>
              </div>

              {/* Slider Antes/Depois em Alta Resolução */}
              <div className="my-1 overflow-hidden rounded-xl border border-border/80 shadow-2xl">
                <BeforeAfterSlider
                  beforeImage={currentCase.beforeImage}
                  afterImage={currentCase.afterImage}
                  beforeLabel={currentCase.beforeLabel}
                  afterLabel={currentCase.afterLabel}
                  beforeImageClassName={currentCase.beforeImageClassName}
                  afterImageClassName={currentCase.afterImageClassName}
                  aspectRatioClassName="aspect-16/10 md:aspect-16/9"
                />
              </div>

              {/* Destaques Técnicos do Reparo */}
              <div className="grid md:grid-cols-3 gap-3 pt-2 text-xs">
                {currentCase.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-sm bg-background/60 border border-border/40 text-muted-foreground"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-brand-accent shrink-0"
                      aria-hidden="true"
                    />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Barra de Navegação Inferior & CTA Contextual */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-border/60">
                <Button
                  variant="secondary"
                  onClick={handlePrev}
                  aria-label="Visualizar caso técnico anterior"
                  className="gap-2 h-9 text-xs"
                >
                  <ChevronLeft size={16} aria-hidden="true" /> Anterior
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-medium">
                    {activeModalIndex !== null ? activeModalIndex + 1 : 1} de {galleryCases.length}
                  </span>
                  <Button variant="primary" asChild className="h-9 px-4 text-xs font-semibold">
                    <Link to="/contato">
                      Avaliar reparo semelhante{" "}
                      <ArrowUpRight size={14} className="ml-1" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleNext}
                  aria-label="Visualizar próximo caso técnico"
                  className="gap-2 h-9 text-xs"
                >
                  Próximo <ChevronRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
