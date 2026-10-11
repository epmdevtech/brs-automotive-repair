import { ArrowUpRight, Check, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reveal } from "@/lib/motion";
import bodywork from "@/assets/funilaria.jpg";

export function PartnerSection({ onPartner }: { onPartner: () => void }) {
  return (
    <section id="corretores" className="section-space">
      <div className="page-width grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="relative overflow-hidden rounded-sm border border-border" {...reveal(0)}>
          <img
            src={bodywork}
            alt="Atenção técnica na recuperação de um veículo (fotografia ilustrativa)"
            loading="lazy"
            width={1200}
            height={800}
            className="w-full aspect-[4/4] object-cover"
          />
          <span className="absolute bottom-4 right-4 image-note bg-background/85 px-2.5 py-1 rounded-sm border border-border/50">
            Fotografia ilustrativa
          </span>
          <span className="absolute top-5 left-5 bg-background/90 px-4 py-2.5 flex items-center gap-2.5 text-[11px] font-medium border border-border/60">
            <Handshake className="text-primary" size={17} aria-hidden="true" /> Parceria técnica
            confiável
          </span>
        </div>
        <div {...reveal(1)}>
          <p className="eyebrow mb-5">Para corretores de seguros</p>
          <h2 className="section-title">
            Tranquilidade para o corretor.
            <br />
            <span className="text-primary">Cuidado rigoroso com o segurado.</span>
          </h2>
          <p className="body-copy mt-5 text-pretty">
            Indicar uma oficina envolve diretamente a reputação do corretor e a experiência do
            segurado durante o sinistro. A BRS valoriza parcerias sérias, com comunicação
            transparente e compromisso com o prazo acordado.
          </p>
          <ul className="grid gap-3.5 my-7">
            {[
              "Comunicação direta e ágil sobre o andamento do reparo",
              "Atenção prioritária à qualidade percebida pelo segurado",
              "Relacionamento profissional e responsável de longo prazo",
            ].map((item) => (
              <li
                key={item}
                className="text-xs sm:text-[13px] flex gap-3 items-center text-foreground/90"
              >
                <Check className="text-primary shrink-0" size={15} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="automotive"
            className="h-12 px-6 text-xs font-semibold"
            onClick={onPartner}
          >
            Conversar sobre parceria <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
