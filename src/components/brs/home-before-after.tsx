import { useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "./before-after-slider";
import { isReducedMotionPreferred } from "@/lib/motion-system";
import funilariaAntes from "@/assets/funilaria-antes.jpg";
import funilariaDepois from "@/assets/funilaria-depois.jpg";

/**
 * Seção de Demonstração Interativa Antes e Depois na Página Inicial (SPEC-025, SPEC-026, SPEC-032).
 * Padrão Awwwards Site of the Day: Composição editorial técnica de 12 colunas,
 * telemetria de tolerâncias milimétricas, moldura automotiva chanfrada e coreografia GSAP ScrollTrigger.
 */
export function HomeBeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualColRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotionPreferred()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      tl.from(visualColRef.current, {
        opacity: 0,
        y: 32,
        scale: 0.98,
        duration: 0.85,
        ease: "power3.out",
      }).from(
        textColRef.current,
        {
          opacity: 0,
          y: 28,
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.55",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="demonstracao"
      aria-label="Demonstração interativa de reparação antes e depois"
      className="py-16 sm:py-24 border-y border-white/10 bg-neutral-950/80 relative overflow-hidden"
    >
      {/* Halo de luz ambiente especular automotiva */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 size-[550px] rounded-full bg-primary/6 blur-[130px]"
      />

      <div className="page-width relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-center">
          {/* Coluna Visual: Comparador Interativo de Imagens (7 colunas no desktop) */}
          <div ref={visualColRef} className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-2 px-1">
              <span className="flex items-center gap-1.5 text-brand-accent font-medium">
                <SlidersHorizontal size={12} aria-hidden="true" />
                Comparativo Ilustrativo de Método
              </span>
              <span className="text-white/40">Fotografia ilustrativa</span>
            </div>

            <div className="relative rounded-sm overflow-hidden border border-white/15 hover:border-primary/40 shadow-2xl shadow-black/90 transition-colors duration-500 group">
              <BeforeAfterSlider
                beforeImage={funilariaAntes}
                afterImage={funilariaDepois}
                beforeAlt="Lateral do veículo antes da recuperação estrutural (fotografia ilustrativa)"
                afterAlt="Lateral do veículo após alinhamento de painéis (fotografia ilustrativa)"
                beforeLabel="Antes (Avaria)"
                afterLabel="Depois (Alinhado)"
                aspectRatioClassName="aspect-16/10 sm:aspect-16/9"
                initialPosition={50}
                hint="Arraste o divisor para comparar"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-3 px-1">
              <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                <Sparkles size={13} className="text-brand-accent" aria-hidden="true" />
                Interação tátil e por teclado habilitada
              </span>
              <span className="image-note">Fotografia ilustrativa</span>
            </div>
          </div>

          {/* Coluna Narrativa Editorial (5 colunas no desktop) */}
          <div ref={textColRef} className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-4">
              <p className="eyebrow">Demonstração Técnica Antes & Depois</p>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-display tracking-tight text-white leading-tight">
                Recuperação estrutural e alinhamento de painéis.
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-body">
                Veja como funciona o processo de alinhamento de painéis e reconstituição de vincos
                em reparos de funilaria. O trabalho prioriza a geometria original da chapa, evitando
                enxertos pesados de massa plástica.
              </p>

              <div className="pt-3 pb-3 border-y border-white/10 my-4 space-y-2.5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-brand-accent font-semibold mb-1">
                    Método demonstrado
                  </p>
                  <p className="text-sm font-medium text-white">
                    Funilaria & Alinhamento de Painéis
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Restauração de painel lateral respeitando folgas de portas e para-lamas.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <CheckCircle2
                      size={12}
                      className="text-brand-accent shrink-0"
                      aria-hidden="true"
                    />
                    <span>Alinhamento de folgas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <CheckCircle2
                      size={12}
                      className="text-brand-accent shrink-0"
                      aria-hidden="true"
                    />
                    <span>Repuxo técnico da chapa</span>
                  </div>
                </div>
              </div>

              {/* CTA direto para a galeria canônica /trabalhos */}
              <div className="pt-2">
                <Button variant="primary" asChild className="h-11 px-6">
                  <Link to="/trabalhos">
                    Ver galeria completa
                    <ArrowUpRight className="ml-1" size={16} aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              {/* Nota de transparência fotográfica (regra de conformidade Master) */}
              <p className="text-[11px] text-neutral-400 flex items-start gap-1.5 pt-2">
                <ShieldCheck
                  size={14}
                  className="text-brand-accent shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  Demonstração ilustrativa do método. Os registros oficiais da oficina estão na
                  página Trabalhos, com as placas de terceiros substituídas pela marca.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
