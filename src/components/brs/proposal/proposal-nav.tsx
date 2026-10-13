import { useState, useEffect } from "react";
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
  { id: "diagnostico", label: "Cenário & Oportunidade" },
  { id: "modulos", label: "Módulos de Software" },
  { id: "comparativo", label: "Matriz Comparativa" },
  { id: "pacotes", label: "Pacotes Sugeridos" },
  { id: "custos-recorrentes", label: "Custos & Infra" },
  { id: "cronograma", label: "Etapas do Projeto" },
  { id: "faq", label: "Dúvidas Frequentes" },
  { id: "aceite", label: "Resumo & Briefing" },
];

interface ProposalNavProps {
  isModular?: boolean;
}

export function ProposalNav({ isModular = false }: ProposalNavProps) {
  const sections = isModular ? MODULAR_SECTIONS : STANDARD_SECTIONS;
  const [activeSection, setActiveSection] = useState("visao-geral");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const elem = document.getElementById(sections[i].id);
        if (elem && elem.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <nav
      aria-label="Navegação da proposta comercial"
      className="sticky top-[60px] sm:top-[70px] z-40 bg-neutral-950/85 backdrop-blur-md border-b border-white/10 px-4 py-2.5 transition-all overflow-x-auto scrollbar-none"
    >
      <div className="page-width flex items-center gap-1 sm:gap-2 min-w-max">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5",
              )}
            >
              {sec.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
