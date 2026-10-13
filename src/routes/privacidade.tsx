import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";
import { company } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/privacidade")({
  component: PrivacidadePage,
  head: () =>
    buildRouteHead({
      title: "Política de Privacidade | BRS Reparações Automotivas",
      description:
        "Compromisso de privacidade e conformidade com a LGPD da BRS em Toledo-PR. Ausência de cookies invasivos e processamento estritamente local de mensagens.",
      path: "/privacidade",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Privacidade", path: "/privacidade" }]),
          {
            "@type": "WebPage",
            name: "Política de Privacidade — BRS Reparações Automotivas",
            url: "http://brs.localhost/privacidade",
            description:
              "Diretrizes de transparência no tratamento de dados e privacidade da BRS Reparações Automotivas.",
          },
        ],
      },
    }),
});

function PrivacidadePage() {
  return (
    <div className="pt-28 pb-20">
      <section className="page-width mb-12">
        <ScrollReveal direction="up" delay={0.05}>
          <Breadcrumbs items={[{ name: "Política de Privacidade" }]} className="mb-6" />
        </ScrollReveal>

        <div className="max-w-3xl">
          <ScrollReveal direction="up" delay={0.1}>
            <p className="eyebrow mb-3">Privacidade e Proteção de Dados</p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
              Transparência e Respeito à sua Privacidade.
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
              A <strong className="text-white">{company.legalName}</strong> (nome fantasia{" "}
              <em>{company.tradeName}</em>, operando sob a marca comercial{" "}
              <strong className="text-white">{company.name}</strong>, inscrita no CNPJ sob o nº{" "}
              <span className="font-mono text-primary">{company.cnpj}</span>), sediada em Toledo,
              Paraná, preza pela transparência e pela proteção da privacidade dos seus visitantes e
              clientes, em total consonância com a Lei Geral de Proteção de Dados (LGPD — Lei
              Federal nº 13.709/2018).
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="page-width">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl">
          <ScrollReveal
            direction="up"
            delay={0.0}
            className="p-6 sm:p-8 rounded-xl border border-border bg-card/40"
          >
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <EyeOff size={16} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold font-display text-white mb-3">
              1. Ausência de Rastreamento Invasivo
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Este site institucional não utiliza cookies de rastreamento publicitário, pixels de
              redes sociais para perfilamento de comportamento ou ferramentas de terceiros para
              venda de dados.
            </p>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.12}
            className="p-6 sm:p-8 rounded-xl border border-border bg-card/40"
          >
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <Lock size={16} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold font-display text-white mb-3">
              2. Formulário Client-Side Seguro
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              O formulário de avaliação disponível neste site processa os dados exclusivamente na
              memória do seu navegador. Nenhuma informação (nome, telefone ou dados do veículo) é
              armazenada em servidores ou bancos de dados do site.
            </p>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.24}
            className="p-6 sm:p-8 rounded-xl border border-border bg-card/40"
          >
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <FileText size={16} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold font-display text-white mb-3">
              3. Envio Voluntário nos Canais Oficiais
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              O compartilhamento de dados ocorre somente quando você, por livre e espontânea
              vontade, copia a mensagem formatada para enviar pelo Instagram oficial
              (@brsreparacoes) ou liga diretamente para nossa central telefônica.
            </p>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.36}
            className="p-6 sm:p-8 rounded-xl border border-border bg-card/40"
          >
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <ShieldCheck size={16} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold font-display text-white mb-3">
              4. Direitos do Titular e Contato
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Você tem direito de solicitar esclarecimentos sobre o tratamento de seus dados a
              qualquer momento através da nossa central telefônica {company.phone} ou pessoalmente
              em Toledo, Paraná.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal
          direction="up"
          delay={0.4}
          className="mt-12 text-xs text-neutral-500 max-w-4xl border-t border-border pt-6"
        >
          Última atualização: Outubro de 2026 · {company.legalName} · CNPJ: {company.cnpj} ·
          Toledo/PR.
        </ScrollReveal>
      </section>
    </div>
  );
}
