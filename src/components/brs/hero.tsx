import {
  ArrowUpRight,
  ArrowDown,
  MapPin,
  ShieldCheck,
  Wrench,
  Handshake,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/brs";
import hero from "@/assets/brs-hero.jpg";
import { AnimatedHero } from "./animated-hero";
import { Brand } from "./brand";

export function Hero() {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior:
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
    });
  };

  return (
    <>
      <AnimatedHero
        id="inicio"
        backgroundImageUrl={hero}
        logo={<Brand />}
        navLinks={navigation.map(([label, href]) => ({ label, href }))}
        topRightAction={
          <Button
            variant="automotive"
            asChild
            className="hidden sm:inline-flex h-10 text-[11px] px-5"
          >
            <a href="#contato" onClick={() => handleScrollTo("contato")}>
              Solicitar avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </a>
          </Button>
        }
        eyebrow={<p className="eyebrow">Precisão no reparo · Cuidado no atendimento</p>}
        title={
          <>
            BRS Reparações <span className="text-primary">Automotivas.</span>
          </>
        }
        description={
          <div className="space-y-3">
            <p className="text-base md:text-lg font-medium text-foreground">
              Seu veículo com recuperação estética e estrutural de fábrica.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Funilaria automotiva, pintura em estufa e martelinho de ouro em Toledo, Paraná.
              Atenção aos detalhes, diagnóstico honesto e acabamento técnico de alto padrão.
            </p>
          </div>
        }
        ctaButton={{
          text: "Solicitar avaliação",
          href: "#contato",
          onClick: () => handleScrollTo("contato"),
        }}
        secondaryCta={{
          text: "Conhecer os serviços",
          href: "#servicos",
          onClick: () => handleScrollTo("servicos"),
        }}
        bottomContent={
          <div className="page-width flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/10">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin size={13} className="text-primary" aria-hidden="true" /> Toledo, Paraná
            </span>
            <a
              href="#servicos"
              onClick={() => handleScrollTo("servicos")}
              aria-label="Rolar para a seção de serviços"
              className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[2px] hover:text-foreground transition-colors"
            >
              Conheça a BRS <ArrowDown size={14} aria-hidden="true" />
            </a>
            <span className="image-note">Fotografia ilustrativa</span>
          </div>
        }
      />

      <div className="trust-strip">
        <div className="page-width grid grid-cols-2 md:grid-cols-4 gap-y-5">
          {[
            [ShieldCheck, "Cuidado em cada detalhe"],
            [Wrench, "Reparação especializada"],
            [Handshake, "Atendimento direto e transparente"],
            [Truck, "Serviço de leva e traz em Toledo"],
          ].map(([Icon, text], i) => {
            const ItemIcon = Icon as typeof ShieldCheck;
            return (
              <div className="trust-item" key={i}>
                <ItemIcon strokeWidth={1.5} size={18} aria-hidden="true" />
                <span>{text as string}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
