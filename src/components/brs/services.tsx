import { ArrowUpRight, Wrench, Paintbrush, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/brs";
import { trackPointer } from "@/lib/motion";
import bodywork from "@/assets/funilaria.jpg";
import painting from "@/assets/pintura.jpg";
import dent from "@/assets/martelinho.jpg";

const serviceImages = [bodywork, painting, dent];
const serviceIcons = [Wrench, Paintbrush, Car];

export function Services() {
  return (
    <section id="servicos" className="section-space">
      <div className="page-width">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10">
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
            para cada caso.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = serviceIcons[i];
            return (
              <article key={service.title} className="service-card" onPointerMove={trackPointer}>
                <div className="overflow-hidden relative">
                  <img
                    src={serviceImages[i]}
                    alt={`${service.title} (fotografia ilustrativa da atividade)`}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="service-image"
                  />
                  <span className="absolute bottom-3 right-3 text-[8px] px-2 py-1 bg-background/85 text-muted-foreground border border-border/50">
                    Fotografia ilustrativa
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-semibold text-primary tracking-wider">
                      0{i + 1} / SERVIÇO
                    </span>
                    {Icon && (
                      <Icon
                        size={18}
                        strokeWidth={1.5}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <h3 className="text-[26px] mb-3">{service.title}</h3>
                  <p className="body-copy text-xs min-h-[85px]">{service.description}</p>
                  <Button
                    variant="editorial"
                    asChild
                    className="text-[11px] h-8 mt-4 w-full justify-between border-t border-border pt-5 pb-2"
                  >
                    <a href="#contato">
                      Solicitar avaliação{" "}
                      <ArrowUpRight size={13} className="ml-1" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
