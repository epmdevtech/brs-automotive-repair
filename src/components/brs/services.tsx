import { ArrowUpRight, Wrench, Paintbrush, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/brs";
import { reveal } from "@/lib/motion";
import { CardSpotlight } from "./card-spotlight";
import bodywork from "@/assets/funilaria.jpg";
import painting from "@/assets/pintura.jpg";
import dent from "@/assets/martelinho.jpg";

const serviceImages = [bodywork, painting, dent];
const serviceIcons = [Wrench, Paintbrush, Car];

export function Services() {
  return (
    <section id="servicos" className="section-space">
      <div className="page-width">
        <div
          className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12"
          {...reveal(0)}
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
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = serviceIcons[i];
            return (
              <div key={service.title} {...reveal(i + 1)}>
                <CardSpotlight className="flex flex-col h-full bg-card/95 group shadow-lg">
                  {/* Imagem do Serviço com Zoom Sutil */}
                  <div className="overflow-hidden relative aspect-16/10">
                    <img
                      src={serviceImages[i]}
                      alt={`${service.title} (fotografia ilustrativa da atividade)`}
                      width={1200}
                      height={800}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-card/80 to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 right-3 text-[8px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs">
                      Fotografia ilustrativa
                    </span>
                  </div>

                  {/* Conteúdo com Microinterações */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-[10px] font-semibold text-primary tracking-widest uppercase">
                          0{i + 1} / ESPECIALIDADE
                        </span>
                        {Icon && (
                          <div
                            className="size-9 rounded-sm bg-background/90 border border-border/70 flex items-center justify-center text-primary transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:bg-primary/10 shadow-xs"
                            aria-hidden="true"
                          >
                            <Icon size={18} strokeWidth={1.8} />
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl md:text-2xl font-semibold font-display tracking-tight text-foreground mb-3 transition-colors duration-200 group-hover:text-primary leading-snug text-balance">
                        {service.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed min-h-[70px] text-pretty">
                        {service.description}
                      </p>
                    </div>

                    {/* Botão de Ação com Feedback Tátil */}
                    <div className="pt-5 mt-5 border-t border-border/50">
                      <Button
                        variant="automotiveOutline"
                        asChild
                        className="text-xs h-10 w-full justify-between font-semibold active:scale-[0.98] transition-all duration-200 hover:border-primary/60 hover:bg-primary/15 group-hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
                      >
                        <a href="#contato">
                          Solicitar avaliação{" "}
                          <ArrowUpRight
                            size={14}
                            className="ml-1 text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardSpotlight>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
