import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const STANDARD_SECTIONS = [
  { id: "visao-geral", label: "Visão Geral" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "solucao", label: "Solução" },
  { id: "escopo", label: "Escopo & Entregáveis" },
  { id: "investimento", label: "Investimento" },
  { id: "condicoes", label: "Condições" },
  { id: "cronograma", label: "Cronograma" },
  { id: "responsabilidades", label: "Responsabilidades" },
  { id: "faq", label: "Dúvidas" },
  { id: "manifestar-interesse", label: "Aceite & Avanço" },
];

const MODULAR_SECTIONS = [
  { id: "visao-geral", label: "Visão Geral" },
  { id: "diagnostico", label: "Cenário" },
  { id: "modulos", label: "Módulos" },
  { id: "comparativo", label: "Comparativo" },
  { id: "pacotes", label: "Combinações" },
  { id: "custos-recorrentes", label: "Custos & Infra" },
  { id: "condicoes", label: "Condições" },
  { id: "cronograma", label: "Etapas" },
  { id: "faq", label: "Dúvidas" },
  { id: "aceite", label: "CTA" },
];

interface ProposalNavProps {
  isModular?: boolean;
}

export function ProposalNav({ isModular = false }: ProposalNavProps) {
  const sections = isModular ? MODULAR_SECTIONS : STANDARD_SECTIONS;
  const [activeSection, setActiveSection] = useState("visao-geral");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Detecta seção ativa via scroll da página e centraliza o item na nav
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      let current = sections[0].id;
      for (let i = sections.length - 1; i >= 0; i--) {
        const elem = document.getElementById(sections[i].id);
        if (elem && elem.offsetTop <= scrollPos) {
          current = sections[i].id;
          break;
        }
      }
      setActiveSection(current);

      // Scroll do item ativo para o centro da nav
      if (scrollRef.current) {
        const activeLink = scrollRef.current.querySelector(
          `[data-section-id="${current}"]`,
        ) as HTMLElement | null;
        if (activeLink) {
          activeLink.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <nav
      aria-label="Navegação da proposta comercial"
      className="sticky top-[60px] sm:top-[70px] z-40 bg-neutral-950/85 backdrop-blur-md border-b border-white/10 transition-all"
    >
      {/* Wrapper relativo para os fades laterais */}
      <div className="relative page-width">
        {/* Fade esquerdo — indica conteúdo scrollável */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-neutral-950/90 to-transparent z-10"
        />
        {/* Fade direito */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-neutral-950/90 to-transparent z-10"
        />

        {/* Container scrollável interno — sem min-w-max no wrapper */}
        <div ref={scrollRef} className="overflow-x-auto scrollbar-none scroll-smooth py-2.5 px-4">
          <div className="flex items-center gap-1 sm:gap-1.5 w-max">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  data-section-id={sec.id}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-neutral-400 hover:text-white hover:bg-white/5",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  {sec.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
