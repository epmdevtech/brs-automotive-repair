import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";

import oficinaFachada01 from "@/assets/cliente/oficina-fachada-01.jpg";
import oficinaFachada02 from "@/assets/cliente/oficina-fachada-02.jpg";
import oficinaFachada03 from "@/assets/cliente/oficina-fachada-03.jpg";
import oficinaFachada04 from "@/assets/cliente/oficina-fachada-04.jpg";
import estufaAcabamento01 from "@/assets/cliente/estufa-acabamento-01.jpg";
import estufaAcabamento02 from "@/assets/cliente/estufa-acabamento-02.jpg";

interface WorkshopPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

const workshopPhotos: WorkshopPhoto[] = [
  {
    src: oficinaFachada01,
    width: 1600,
    height: 935,
    alt: "Fachada da Master Chapeação e Pinturas com caminhão-plataforma branco e placas com a marca",
    caption: "Fachada e caminhão-plataforma da Master",
  },
  {
    src: estufaAcabamento01,
    width: 1280,
    height: 964,
    alt: "Veículo branco na estufa de pintura da Master, com placa da marca",
    caption: "Estufa de pintura com iluminação técnica",
  },
  {
    src: oficinaFachada02,
    width: 1600,
    height: 900,
    alt: "Fachada da Master com caminhão-plataforma Volkswagen e placas com a marca",
    caption: "Fachada com caminhão-plataforma Volkswagen",
  },
  {
    src: oficinaFachada03,
    width: 1600,
    height: 900,
    alt: "Fachada da Master sob céu nublado, com caminhão-plataforma e veículos ao fundo",
    caption: "Fachada sob céu nublado",
  },
  {
    src: oficinaFachada04,
    width: 1280,
    height: 720,
    alt: "Fachada da Master em plano aberto, com veículo na recepção",
    caption: "Recepção e pátio em plano aberto",
  },
  {
    src: estufaAcabamento02,
    width: 1280,
    height: 964,
    alt: "Veículo branco finalizado na estufa de pintura da Master, com placa da marca",
    caption: "Acabamento e conferência na estufa",
  },
];

export function WorkshopGallery({ className }: { className?: string } = {}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex === null ? null : workshopPhotos[activeIndex];

  const close = useCallback(() => setActiveIndex(null), []);
  const previous = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? 0 : (current - 1 + workshopPhotos.length) % workshopPhotos.length,
    );
  }, []);
  const next = useCallback(() => {
    setActiveIndex((current) => (current === null ? 0 : (current + 1) % workshopPhotos.length));
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, next, previous]);

  return (
    <section
      id="oficina"
      aria-labelledby="oficina-title"
      className={`page-width border-t border-border/70 pt-16 ${className || ""}`}
    >
      <ScrollReveal
        direction="up"
        delay={0.04}
        className="flex flex-col md:flex-row gap-6 md:items-end justify-between mb-10"
      >
        <div>
          <p className="eyebrow mb-4">Registros oficiais</p>
          <h2 id="oficina-title" className="section-title">
            A oficina por dentro.
          </h2>
        </div>
        <div className="max-w-[420px]">
          <p className="body-copy">
            Fachada, recepção, cabine de pintura e caminhão-plataforma da Master em Toledo-PR. As
            imagens oficiais mostram a estrutura de atendimento, com as placas de terceiros
            substituídas pela marca.
          </p>
          <p className="text-[10px] text-brand-accent mt-3 flex items-start gap-1.5 font-medium">
            <ShieldCheck size={13} className="shrink-0 mt-0.5" aria-hidden="true" />
            Placas de terceiros substituídas pela marca nas imagens publicadas.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {workshopPhotos.map((photo, index) => (
          <ScrollReveal key={photo.src} direction="up" delay={index * 0.06}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block w-full overflow-hidden rounded-sm border border-white/10 bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`Ampliar fotografia: ${photo.caption}`}
            >
              <div className="relative aspect-16/10 w-full overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-sm border border-white/20 bg-black/55 text-white/80 backdrop-blur-xs transition-colors group-hover:border-primary/60 group-hover:text-brand-accent">
                  <Expand size={14} aria-hidden="true" />
                </span>
                <span className="absolute inset-x-0 bottom-0 px-4 py-3 text-[11px] font-medium leading-snug text-white/85 sm:text-xs">
                  {photo.caption}
                </span>
              </div>
            </button>
          </ScrollReveal>
        ))}
      </div>

      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogContent className="max-w-5xl w-[calc(100%-24px)] border-border bg-card p-4 sm:p-6">
          {activePhoto && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4 pr-8">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
                    Registro oficial · {(activeIndex ?? 0) + 1} de {workshopPhotos.length}
                  </span>
                  <DialogTitle className="mt-1 font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {activePhoto.caption}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {activePhoto.alt}
                  </DialogDescription>
                </div>
              </div>

              <div className="overflow-hidden rounded-md border border-border/70 bg-background">
                <img
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  width={activePhoto.width}
                  height={activePhoto.height}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={previous}
                  className="h-9 gap-2 text-xs"
                  aria-label="Fotografia anterior"
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  Anterior
                </Button>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Use as setas do teclado
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={next}
                  className="h-9 gap-2 text-xs"
                  aria-label="Próxima fotografia"
                >
                  Próxima
                  <ArrowRight size={15} aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
