import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Check,
  FileText,
  Handshake,
  Phone,
  ShieldCheck,
  Clock,
  Users,
} from "lucide-react";
import { company } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { Button } from "@/components/ui/button";
import bodywork from "@/assets/funilaria.jpg";

export const Route = createFileRoute("/para-corretores")({
  component: ParaCorretoresPage,
  head: () =>
    buildRouteHead({
      title: "Atendimento para Corretores de Seguros | BRS",
      description:
        "Canal exclusivo para corretores de seguros em Toledo-PR. Comunicação ágil no sinistro, suporte em vistorias, laudos técnicos e livre escolha de oficina.",
      path: "/para-corretores",
      image: "/assets/funilaria.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Para corretores", path: "/para-corretores" }]),
          {
            "@type": "WebPage",
            name: "Atendimento a Corretores de Seguros — BRS Reparações Automotivas",
            url: "http://brs.localhost/para-corretores",
            description:
              "Diretrizes de cooperação profissional entre corretores de seguros e a oficina mecânica em Toledo-PR.",
          },
        ],
      },
    }),
});

function ParaCorretoresPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="page-width mb-12">
        <Breadcrumbs items={[{ name: "Para corretores" }]} className="mb-6" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">Parceria Profissional</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
              Tranquilidade para o Corretor.
              <br />
              <span className="text-primary">Cuidado Rigoroso com o Segurado.</span>
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
              A indicação de uma oficina em momento de sinistro coloca em jogo a reputação que o
              corretor construiu com seu cliente. Na BRS Reparações Automotivas, tratamos o segurado
              com total transparência, cumprimento estrito de prazos e atualização contínua do
              andamento dos reparos.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button variant="automotive" asChild className="h-11 px-6 text-xs font-semibold">
                <a href="/contato">
                  Iniciar conversa sobre parceria{" "}
                  <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
                </a>
              </Button>
              <Button variant="automotiveOutline" asChild className="h-11 px-6 text-xs font-medium">
                <a href={company.phoneHref}>
                  <Phone size={14} className="mr-2 text-primary" aria-hidden="true" />
                  {company.phone}
                </a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative overflow-hidden rounded-sm border border-border aspect-4/3">
            <img
              src={bodywork}
              alt="Atendimento a segurados em oficina (fotografia ilustrativa)"
              width={1200}
              height={800}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-3 right-3 text-[9px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs">
              Fotografia ilustrativa
            </span>
            <div className="absolute top-4 left-4 bg-background/90 px-3.5 py-2 flex items-center gap-2 text-xs font-medium border border-border/70 rounded-xs">
              <Handshake className="text-primary" size={16} aria-hidden="true" />
              <span>Toledo e Região</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares da Parceria */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-2">Compromissos</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Como a BRS Facilita a Rotina do Corretor
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-sm border border-border bg-card/40">
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <Clock size={16} aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold font-display text-white mb-2">
              Comunicação e Prazos
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Informamos você e seu segurado em cada marco da recuperação: desmontagem, funilaria,
              estufa e montagem final, sem ruídos na comunicação.
            </p>
          </div>

          <div className="p-6 rounded-sm border border-border bg-card/40">
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <FileText size={16} aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold font-display text-white mb-2">
              Orçamentos e Laudos
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Elaboramos orçamentos técnicos detalhados e registro fotográfico das avarias para
              facilitar vistorias prévias e complementares de sinistro.
            </p>
          </div>

          <div className="p-6 rounded-sm border border-border bg-card/40">
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <ShieldCheck size={16} aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold font-display text-white mb-2">
              Livre Escolha de Oficina
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              O segurado tem direito legal garantido à livre escolha da oficina de sua confiança.
              Atendemos clientes de qualquer seguradora com total respaldo técnico.
            </p>
          </div>
        </div>

        {/* Nota de Esclarecimento sobre Convênios */}
        <div className="mt-10 p-5 rounded-sm border border-border/80 bg-secondary/30 text-xs text-neutral-300">
          <span className="font-semibold text-white block mb-1">Princípio de Integridade:</span>
          Não divulgamos credenciamentos falsos ou convênios artificiais com seguradoras. Nosso
          relacionamento baseia-se no direito do consumidor à livre escolha de oficina e na
          qualidade inquestionável do serviço entregue ao segurado.
        </div>
      </section>

      {/* CTA de Contato */}
      <section className="page-width mt-16 pt-12 border-t border-border text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white mb-4">
            Vamos conversar sobre uma parceria em Toledo?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6">
            Agende uma visita ou envie uma mensagem direta para nossa equipe técnica.
          </p>
          <Button variant="automotive" asChild className="h-11 px-8 text-xs font-semibold">
            <a href="/contato">Abrir canal de atendimento ao corretor</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
