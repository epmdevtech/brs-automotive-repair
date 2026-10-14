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
            {/* Tag técnica de indexação estilo Awwwards */}
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-2 px-1">
              <span className="flex items-center gap-1.5 text-primary font-medium">
                <SlidersHorizontal size={12} aria-hidden="true" />
                ESTUDO DE CASO // PRECISÃO 01
              </span>
              <span className="text-white/40">TOLERÂNCIA &lt; 1.0MM</span>
            </div>

            <div className="relative rounded-sm overflow-hidden border border-white/15 hover:border-primary/40 shadow-2xl shadow-black/90 transition-colors duration-500 group">
              {/* Marcas técnicas de alinhamento óptico nos cantos */}
              <div className="absolute top-2 left-2 z-30 text-white/30 font-mono text-[9px] pointer-events-none">
                + ALIGN.X
              </div>
              <div className="absolute top-2 right-2 z-30 text-white/30 font-mono text-[9px] pointer-events-none">
                + ALIGN.Y
              </div>

              <BeforeAfterSlider
                beforeImage={funilariaAntes}
                afterImage={funilariaDepois}
                beforeAlt="Lateral do veículo antes da recuperação estrutural (avaliação técnica da avaria)"
                afterAlt="Lateral do veículo após alinhamento de painéis e repuxamento milimétrico"
                beforeLabel="Antes (Avaria)"
                afterLabel="Depois (Alinhado)"
                aspectRatioClassName="aspect-16/10 sm:aspect-16/9"
                initialPosition={50}
                hint="Arraste o divisor para comparar"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-3 px-1">
              <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                <Sparkles size={13} className="text-primary" aria-hidden="true" />
                Interação tátil e por teclado habilitada
              </span>
              <span className="image-note">Demonstração técnica</span>
            </div>
          </div>

          {/* Coluna Narrativa Editorial e Telemetria (5 colunas no desktop) */}
          <div ref={textColRef} className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-4">
              <p className="eyebrow">Demonstração Técnica Antes & Depois</p>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-display tracking-tight text-white leading-tight">
                Recuperação estrutural com padrão de fábrica.
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-body">
                Compare a precisão técnica no alinhamento de painéis, reconstituição de vincos e
                tolerâncias de montagem executados na BRS em Toledo-PR. O processo prioriza a
                geometria original da chapa, evitando enxertos pesados de massa plástica.
              </p>

              {/* Destaque do caso apresentado com HUD técnico de telemetria */}
              <div className="pt-3 pb-3 border-y border-white/10 my-4 space-y-2.5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                    Caso em exibição
                  </p>
                  <p className="text-sm font-medium text-white">
                    Funilaria de Precisão & Alinhamento Estrutural
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Painel lateral restaurado respeitando gaps de portas e para-lamas.
                  </p>
                </div>

                {/* Especificações técnicas de oficina (Padrão Awwwards) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <CheckCircle2 size={12} className="text-primary shrink-0" aria-hidden="true" />
                    <span>Gaps &lt; 1mm conformes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <CheckCircle2 size={12} className="text-primary shrink-0" aria-hidden="true" />
                    <span>Repuxo a frio milimétrico</span>
                  </div>
                </div>
              </div>

              {/* CTA para a galeria canônica /trabalhos */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button variant="primary" asChild className="h-11 px-6">
                  <Link to="/trabalhos">
                    Ver galeria completa
                    <ArrowUpRight className="ml-1" size={16} aria-hidden="true" />
                  </Link>
                </Button>

                <Button variant="secondary" asChild className="h-11 px-5">
                  <Link to="/contato">Solicitar avaliação</Link>
                </Button>
              </div>

              {/* Nota de transparência fotográfica (regra de conformidade BRS) */}
              <p className="text-[11px] text-neutral-400 flex items-start gap-1.5 pt-2">
                <ShieldCheck
                  size={14}
                  className="text-primary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  O acervo fotográfico real está em documentação em Toledo-PR com autorização de
                  clientes. Imagens ilustrativas demonstrativas dos métodos técnicos.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
