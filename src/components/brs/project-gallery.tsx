import { useState } from "react";
import { Expand, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { services } from "@/lib/brs";
import bodywork from "@/assets/funilaria.jpg";
import painting from "@/assets/pintura.jpg";
import dent from "@/assets/martelinho.jpg";

const serviceImages = [bodywork, painting, dent];

export function ProjectGallery() {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : services[active];

  return (
    <section id="trabalho" className="section-space">
      <div className="page-width">
        <div className="flex flex-col md:flex-row gap-5 justify-between md:items-end mb-9">
          <div>
            <p className="eyebrow mb-4">Referência de acabamento</p>
            <h2 className="section-title">
              Foco na forma
              <br />e na textura original.
            </h2>
          </div>
          <div className="max-w-[360px]">
            <p className="body-copy">
              Da recuperação estrutural de chapas ao brilho uniforme da pintura, conheça os tipos de
              reparo atendidos pela BRS.
            </p>
            <p className="text-[10px] text-primary mt-3">
              Galeria ilustrativa de referência técnica (acervo de fotos reais em preparação).
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <Button
              key={service.short}
              variant="ghost"
              className="p-0 h-auto rounded-sm overflow-hidden relative group block text-left w-full hover:bg-transparent"
              onClick={() => setActive(i)}
              aria-label={`Ampliar fotografia ilustrativa de ${service.short}`}
            >
              <img
                className="gallery-image"
                src={serviceImages[i]}
                alt={`Detalhe de ${service.short.toLowerCase()} (fotografia ilustrativa)`}
                loading="lazy"
                width={1200}
                height={800}
              />
              <span className="absolute bottom-0 inset-x-0 bg-background/85 backdrop-blur-sm p-4 flex justify-between items-center text-xs border-t border-border/50">
                <span className="font-medium text-foreground">{service.short}</span>
                <Expand size={15} className="text-primary" aria-hidden="true" />
              </span>
            </Button>
          ))}
        </div>
      </div>
      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent className="max-w-4xl w-[calc(100%-32px)] p-6 bg-card border-border">
          <DialogTitle className="text-xl font-display">{current?.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Fotografia ilustrativa de referência técnica de serviço.
          </DialogDescription>
          {active !== null && (
            <div className="my-3 overflow-hidden rounded-sm border border-border">
              <img
                src={serviceImages[active]}
                alt={current?.title ?? "Atividade de reparação"}
                width={1200}
                height={800}
                className="w-full max-h-[65vh] object-contain bg-background"
              />
            </div>
          )}
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="automotiveOutline"
              onClick={() => setActive((value) => ((value ?? 0) + 2) % 3)}
              aria-label="Visualizar imagem anterior"
              className="gap-2"
            >
              <ChevronLeft size={16} aria-hidden="true" /> Anterior
            </Button>
            <span className="text-xs text-muted-foreground">
              {active !== null ? active + 1 : 1} de 3
            </span>
            <Button
              variant="automotiveOutline"
              onClick={() => setActive((value) => ((value ?? 0) + 1) % 3)}
              aria-label="Visualizar próxima imagem"
              className="gap-2"
            >
              Próxima <ChevronRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
