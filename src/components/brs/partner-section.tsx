import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import bodywork from "@/assets/funilaria.jpg";

export function PartnerSection({ onPartner }: { onPartner?: () => void }) {
  const containerRef = React.useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax sutil (24px de deslocamento total) ativo estritamente em desktop
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    isDesktop && !shouldReduceMotion ? [-12, 12] : [0, 0],
  );

  return (
    <section ref={containerRef} id="corretores" className="section-space">
      <div className="page-width grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <Reveal className="relative overflow-hidden rounded-sm border border-border">
          <motion.img
            src={bodywork}
            alt="Atenção técnica na recuperação de um veículo (fotografia ilustrativa)"
            loading="lazy"
            width={1200}
            height={800}
            style={{ y: parallaxY, willChange: "transform" }}
            className="w-full aspect-[4/4] object-cover scale-105"
          />
          <span className="absolute bottom-4 right-4 image-note bg-background/85 px-2.5 py-1 rounded-sm border border-border/50">
            Fotografia ilustrativa
          </span>
          <span className="absolute top-5 left-5 bg-background/90 px-4 py-2.5 flex items-center gap-2.5 text-[11px] font-medium border border-border/60">
            <Handshake className="text-primary" size={17} aria-hidden="true" /> Parceria técnica
            confiável
          </span>
        </Reveal>
        <div>
          <Reveal>
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
          </Reveal>
          <ul className="grid gap-3.5 my-7">
            {[
              "Comunicação direta e ágil sobre o andamento do reparo",
              "Atenção prioritária à qualidade percebida pelo segurado",
              "Relacionamento profissional e responsável de longo prazo",
            ].map((item, i) => (
              <Reveal as="li" key={item} staggerIndex={i} delay={0.1}>
                <div className="text-xs sm:text-[13px] flex gap-3 items-center text-foreground/90">
                  <Check className="text-primary shrink-0" size={15} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.2} className="flex flex-wrap gap-3.5">
            <Button variant="automotive" asChild className="h-11 px-5 text-xs font-semibold">
              <a href="/para-corretores">
                Conhecer atendimento para corretores{" "}
                <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
              </a>
            </Button>
            {onPartner && (
              <Button
                variant="automotiveOutline"
                className="h-11 px-5 text-xs font-semibold"
                onClick={onPartner}
              >
                Iniciar contato direto
              </Button>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
