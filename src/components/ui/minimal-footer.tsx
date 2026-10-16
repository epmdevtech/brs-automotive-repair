import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Instagram, MapPin, Phone } from "lucide-react";
import { company, navigation, services } from "@/lib/brs";
import { Brand } from "@/components/brs/brand";
import { cn } from "@/lib/utils";

const external = { target: "_blank", rel: "noopener noreferrer" };

export interface MinimalFooterProps {
  className?: string;
}

export function MinimalFooter({ className }: MinimalFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-border bg-background text-foreground transition-colors",
        className,
      )}
    >
      <div className="page-width py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Coluna 1: Marca, Endereço e Horário Oficial */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Brand />
            <p className="body-copy text-xs text-neutral-400 mt-5 max-w-sm leading-relaxed text-pretty">
              Funilaria automotiva, pintura em estufa e martelinho de ouro em Toledo, Paraná.
              Atendimento a proprietários de veículos e segurados.
            </p>
            <div className="mt-5 space-y-2 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>{company.address.full}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary shrink-0" aria-hidden="true" />
                <span>{company.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Coluna 2: Navegação da Página */}
          <nav aria-label="Navegação do rodapé" className="lg:col-span-2">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {navigation.map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Coluna 3: Especialidades Técnicas */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Especialidades
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {services.map((service) => (
                <li key={service.title}>
                  <Link
                    to={service.path}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
                  >
                    {service.short}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/servicos"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
                >
                  Serviço Leva e Traz
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Canais Oficiais */}
          <div className="lg:col-span-3 flex flex-col items-start">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Atendimento
            </h3>
            <div className="space-y-3 text-xs text-neutral-400 w-full">
              <a
                href={company.phoneHref}
                className="flex items-center gap-2.5 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs py-0.5"
                aria-label={`Ligar para o telefone ${company.phone}`}
              >
                <Phone size={14} className="text-primary shrink-0" aria-hidden="true" />
                <span className="font-medium text-foreground">{company.phone}</span>
              </a>

              <a
                href={company.instagram}
                {...external}
                className="flex items-center gap-2.5 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs py-0.5"
                aria-label="Abrir Instagram oficial da BRS em nova aba"
              >
                <Instagram size={14} className="text-primary shrink-0" aria-hidden="true" />
                <span>@brsreparacoes</span>
                <ArrowUpRight size={12} className="text-neutral-500" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Faixa inferior: Copyright, Razão Social, CNPJ e Privacidade (sem frase de demonstração temporária) */}
      <div className="border-t border-border/60 bg-secondary/20">
        <div className="page-width py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-[10px] text-muted-foreground leading-relaxed">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {currentYear} BRS Reparações Automotivas. Todos os direitos reservados.</span>
            <span className="text-neutral-500 font-mono text-[9px]">
              {company.legalName} · CNPJ: {company.cnpj}
            </span>
            <Link
              to="/privacidade"
              className="hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
