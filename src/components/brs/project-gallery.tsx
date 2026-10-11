import { useState } from "react";
import { Expand, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { reveal } from "@/lib/motion";
import { BeforeAfterSlider } from "./before-after-slider";
import bodywork from "@/assets/funilaria.jpg";
import painting from "@/assets/pintura.jpg";
import dent from "@/assets/martelinho.jpg";

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
    beforeImage: bodywork,
    afterImage: bodywork,
    beforeLabel: "Antes (Avaria)",
    afterLabel: "Depois (Alinhado)",
    beforeImageClassName: "filter contrast-125 saturate-50 brightness-90",
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
    beforeImage: painting,
    afterImage: painting,
    beforeLabel: "Antes (Preparação)",
    afterLabel: "Depois (Verniz)",
    beforeImageClassName: "filter blur-[0.6px] saturate-60 brightness-90",
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
    beforeImage: dent,
    afterImage: dent,
    beforeLabel: "Antes (Mossa)",
    afterLabel: "Depois (Liso)",
    beforeImageClassName: "filter contrast-150 saturate-75 brightness-95",
  },
];

export function ProjectGallery() {
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
    <section id="trabalho" className="section-space">
      <div className="page-width">
        <div
          className="flex flex-col md:flex-row gap-5 justify-between md:items-end mb-10"
          {...reveal(0)}
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
            <p className="text-[10px] text-primary mt-3 flex items-center gap-1.5 font-medium">
              <ShieldCheck size={13} aria-hidden="true" />
              Demonstração técnica de reparo (acervo de fotos reais em preparação).
            </p>
          </div>
        </div>

        {/* Grid de 3 Cards Interativos */}
        <div className="grid md:grid-cols-3 gap-6">
          {galleryCases.map((item, i) => (
            <article
              key={item.id}
              className="group rounded-sm border border-border/80 bg-card overflow-hidden flex flex-col transition-all duration-300 hover:border-primary/50 shadow-md"
              {...reveal(i + 1)}
            >
              {/* Slider Antes/Depois Integrado no Card */}
              <div className="relative">
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
                  className="absolute top-3 right-3 z-30 size-8 rounded-sm bg-background/80 backdrop-blur-xs border border-border/60 text-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setActiveModalIndex(i)}
                  aria-label={`Ampliar inspeção em alta resolução de ${item.title}`}
                >
                  <Expand size={14} aria-hidden="true" />
                </Button>
              </div>

              {/* Informações Técnicas do Card */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-primary tracking-wider uppercase mb-2">
                    <span>{item.category}</span>
                    <span className="text-muted-foreground">{item.number} / CASO</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold font-display tracking-tight text-foreground mb-2 text-balance">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 text-pretty">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Arraste o divisor
                  </span>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                    onClick={() => setActiveModalIndex(i)}
                  >
                    Inspecionar ampliado <Expand size={12} aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </article>
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
        <DialogContent className="max-w-5xl w-[calc(100%-32px)] p-6 bg-card border-border sm:rounded-sm">
          {currentCase && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 pr-8 border-b border-border/60 pb-3">
                <div>
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
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
              <div className="my-1 overflow-hidden rounded-sm border border-border/80 shadow-2xl">
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
                    <CheckCircle2 size={14} className="text-primary shrink-0" aria-hidden="true" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Barra de Navegação Inferior */}
              <div className="flex justify-between items-center pt-3 border-t border-border/60">
                <Button
                  variant="automotiveOutline"
                  onClick={handlePrev}
                  aria-label="Visualizar caso técnico anterior"
                  className="gap-2 h-9 text-xs"
                >
                  <ChevronLeft size={16} aria-hidden="true" /> Anterior
                </Button>
                <span className="text-xs text-muted-foreground font-medium">
                  {activeModalIndex !== null ? activeModalIndex + 1 : 1} de {galleryCases.length}
                </span>
                <Button
                  variant="automotiveOutline"
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
