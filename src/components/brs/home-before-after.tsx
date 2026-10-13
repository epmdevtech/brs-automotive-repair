import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BeforeAfterSlider } from "./before-after-slider";
import funilariaAntes from "@/assets/funilaria-antes.jpg";
import funilariaDepois from "@/assets/funilaria-depois.jpg";

/**
 * Seção de Demonstração Interativa Antes e Depois na Página Inicial (SPEC-025, SPEC-026).
 * Composição editorial assimétrica de 12 colunas no desktop, destacando a
 * precisão técnica do alinhamento e conduzindo o usuário à galeria completa (/trabalhos).
 */
export function HomeBeforeAfter() {
  return (
    <section
      id="demonstracao"
      aria-label="Demonstração interativa de reparação antes e depois"
      className="py-16 sm:py-20 border-y border-white/10 bg-neutral-950/60 relative overflow-hidden"
    >
      <div className="page-width">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* Coluna Visual: Comparador Interativo de Imagens (7 colunas no desktop) */}
          <ScrollReveal
            direction="up"
            delay={0.08}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="relative rounded-sm overflow-hidden border border-white/15 shadow-2xl shadow-black/80">
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
          </ScrollReveal>

          {/* Coluna Narrativa Editorial e Conversão (5 colunas no desktop) */}
          <ScrollReveal
            direction="up"
            delay={0.16}
            className="lg:col-span-5 flex flex-col justify-center"
          >
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

              {/* Destaque do caso apresentado */}
              <div className="pt-2 pb-1 border-y border-white/10 my-4">
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
