import * as React from "react";
import { ArrowUpRight, Instagram, MapPin, Phone } from "lucide-react";
import { company, navigation, services } from "@/lib/brs";
import { Brand } from "@/components/brs/brand";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/brs/reveal";
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
      <Reveal yOffset={12} className="page-width py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Coluna 1: Marca & Posicionamento Institucional */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Brand />
            <p className="body-copy text-xs text-neutral-400 mt-5 max-w-sm leading-relaxed text-pretty">
              Funilaria, pintura automotiva e martelinho de ouro com atenção aos detalhes e cuidado
              em cada etapa.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400">
              <MapPin size={14} className="text-primary shrink-0" aria-hidden="true" />
              <span>Toledo, Paraná · Atendimento presencial e leva e traz</span>
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
                  <a
                    href={href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
                  >
                    {label}
                  </a>
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
                  <a
                    href={service.path}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
                  >
                    {service.short}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/sobre"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
                >
                  Serviço Leva e Traz
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Canais Oficiais & CTA */}
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

              <div className="pt-2">
                <Button
                  variant="automotive"
                  asChild
                  className="w-full sm:w-auto h-9 text-xs px-4 font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all"
                >
                  <a href="/contato">
                    Solicitar avaliação{" "}
                    <ArrowUpRight className="ml-1 size-3.5" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Faixa inferior: Copyright, Privacidade & Transparência Editorial */}
      <div className="border-t border-border/60 bg-secondary/20">
        <div className="page-width py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-muted-foreground leading-relaxed">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {currentYear} BRS Reparações Automotivas. Todos os direitos reservados.</span>
            <a
              href="/privacidade"
              className="hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Privacidade
            </a>
          </div>
          <span className="text-neutral-500">
            Demonstração institucional oficial · Fotografias ilustrativas temporárias.
          </span>
        </div>
      </div>
    </footer>
  );
}
