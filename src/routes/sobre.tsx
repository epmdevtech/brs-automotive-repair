import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Phone, Instagram, ShieldCheck, Truck, Wrench } from "lucide-react";
import { company } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { PageHero } from "@/components/brs/page-hero";
import { ContactCTA } from "@/components/brs/contact-cta";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { NumericCounter } from "@/components/ui/numeric-counter";

const external = { target: "_blank", rel: "noopener noreferrer" };

export const Route = createFileRoute("/sobre")({
  component: SobrePage,
  head: () =>
    buildRouteHead({
      title: "Sobre a BRS Reparações Automotivas | Toledo - PR",
      description:
        "História, princípios e estrutura técnica da BRS Reparações Automotivas em Toledo, Paraná. Especialistas em funilaria, pintura em estufa e martelinho de ouro.",
      path: "/sobre",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Sobre a BRS", path: "/sobre" }]),
          {
            "@type": "AboutPage",
            name: "Sobre a BRS Reparações Automotivas",
            url: "http://brs.localhost/sobre",
            description:
              "Apresentação institucional, princípios e atendimento da BRS Reparações Automotivas em Toledo, Paraná.",
          },
        ],
      },
    }),
});

function SobrePage() {
  return (
    <div className="pt-28 pb-20">
      <PageHero
        codeIndex="INS.04 // INSTITUCIONAL"
        eyebrow="Oficina Técnica Especializada"
        breadcrumbs={[{ name: "A BRS" }]}
        title="Oficina Técnica Especializada em Toledo, Paraná."
        description={
          <>
            A <strong className="text-white">BRS Reparações Automotivas</strong> nasceu para atender
            motoristas e corretores de seguros que buscam um nível superior de acabamento, respeito
            aos prazos e honestidade no diagnóstico da avaria veicular, sem soluções improvisadas.
            Toda intervenção visa devolver à carroceria as folgas, vincos e a integridade de pintura
            concebidos pela montadora.
          </>
        }
        telemetryBadges={[
          {
            label: "Toledo — PR",
            detail: "Atendimento regional",
            icon: MapPin,
          },
          {
            label: "3 Frentes Técnicas",
            detail: "Funilaria · Pintura · Martelinho",
            icon: Wrench,
          },
          {
            label: "Leva & Traz",
            detail: "Sob consulta urbana",
            icon: Truck,
          },
          {
            label: "Padrão de Fábrica",
            detail: "Vincos e folgas originais",
            icon: ShieldCheck,
          },
        ]}
        actions={[
          {
            label: "FALAR COM A BRS",
            to: "/contato",
            variant: "primary",
            icon: ArrowUpRight,
          },
          {
            label: "Instagram @brsreparacoes",
            href: company.instagram,
            variant: "secondary",
            target: "_blank",
            rel: "noopener noreferrer",
            icon: Instagram,
          },
        ]}
        asideContent={
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8 backdrop-blur-sm">
            <div className="border-b border-white/10 pb-4 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-primary font-semibold">
                Oficina em Toledo, Paraná
              </span>
            </div>
            <p className="font-display text-5xl sm:text-6xl font-semibold tracking-tight text-white mb-2">
              BRS<span className="text-primary">.</span>
            </p>
            <p className="font-mono text-xs uppercase tracking-[2px] text-muted-foreground mb-6">
              Reparações automotivas
            </p>
            <div className="space-y-4 border-t border-white/10 pt-5 text-xs text-neutral-300">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-primary shrink-0" aria-hidden="true" />
                <span>Toledo, Paraná — Brasil</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" aria-hidden="true" />
                <a href={company.phoneHref} className="hover:text-primary transition-colors">
                  {company.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-primary shrink-0" aria-hidden="true" />
                <span>Serviço Leva e Traz sob consulta urbana</span>
              </div>
            </div>
          </div>
        }
      />

      {/* Nossos Princípios — Matriz Editorial com Bordas Compartilhadas */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <ScrollReveal direction="up" delay={0.08} className="max-w-2xl mb-10">
          <p className="eyebrow mb-2">Fundamentos</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Princípios Que Guiam Nossas Oficinas
          </h2>
        </ScrollReveal>

        <div className="border-y border-border/80 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/80">
          <ScrollReveal
            direction="up"
            delay={0.0}
            className="py-8 sm:py-10 sm:px-8 first:sm:pl-0 last:sm:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                <NumericCounter target={1} padZero /> / ÉTICA PROFISSIONAL
              </span>
              <h3 className="text-base sm:text-lg font-semibold font-display text-white mb-2">
                Diagnóstico Honesto
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Não inventamos avarias inexistentes nem indicamos repintura quando o martelinho de
                ouro é perfeitamente viável. A confiança do cliente é nosso bem mais valioso.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.12}
            className="py-8 sm:py-10 sm:px-8 first:sm:pl-0 last:sm:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                <NumericCounter target={2} padZero /> / PADRÃO ORIGINAL
              </span>
              <h3 className="text-base sm:text-lg font-semibold font-display text-white mb-2">
                Precisão de Ajuste
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Portas, paralamas e capôs devem fechar com a suavidade e o som característicos de um
                carro novo, respeitando o alinhamento milimétrico de fábrica.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.24}
            className="py-8 sm:py-10 sm:px-8 first:sm:pl-0 last:sm:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                <NumericCounter target={3} padZero /> / ATENDIMENTO
              </span>
              <h3 className="text-base sm:text-lg font-semibold font-display text-white mb-2">
                Respeito à Rotina
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Sabemos o impacto da ausência do carro no dia a dia. Oferecemos o serviço de busca e
                entrega (Leva e Traz) em Toledo para facilitar o andamento do reparo.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Liderança Técnica & Histórico Institucional (SPEC-031) */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <ScrollReveal direction="up" delay={0.08} className="lg:col-span-7">
            <p className="eyebrow mb-2">Liderança & Trajetória</p>
            <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white mb-6">
              Experiência Prática no Segmento Automotivo
            </h2>
            <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
              <p>
                A <strong className="text-white">BRS Reparações Automotivas</strong> é liderada por{" "}
                <strong className="text-white">{company.founder.name}</strong>, profissional com
                anos de experiência prática e conhecimento aprofundado no setor de autopeças,
                funilaria técnica, pintura automotiva e processos de recuperação veicular.
              </p>
              <p>
                Embora a sociedade empresária{" "}
                <strong className="text-white">{company.legalName}</strong> tenha sido formalmente
                fundada em{" "}
                <span className="font-mono text-primary">{company.foundedFormatted}</span> (CNPJ{" "}
                {company.cnpj}), a vivência operacional e os padrões de exigência de Bruno no
                mercado automotivo antecedem sua abertura formal em vários anos.
              </p>
              <p className="text-xs text-neutral-400">
                Essa combinação entre uma estrutura jurídica formalizada e anos de prática nas
                oficinas assegura aos motoristas e corretores de Toledo a tranquilidade de tratar
                com quem realmente entende de chaparia, colorimetria e tolerâncias mecânicas.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.16}
            className="lg:col-span-5 p-6 sm:p-8 rounded-sm border border-border/80 bg-card/40"
          >
            <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-4">
              Dados Cadastrais & Transparência
            </span>
            <dl className="space-y-4 text-xs">
              <div>
                <dt className="text-neutral-400 font-mono text-[10px] uppercase">Razão Social</dt>
                <dd className="text-foreground font-medium mt-0.5">{company.legalName}</dd>
              </div>
              <div>
                <dt className="text-neutral-400 font-mono text-[10px] uppercase">Nome Fantasia</dt>
                <dd className="text-foreground font-medium mt-0.5">{company.tradeName}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-neutral-400 font-mono text-[10px] uppercase">CNPJ</dt>
                  <dd className="text-foreground font-mono font-medium mt-0.5">{company.cnpj}</dd>
                </div>
                <div>
                  <dt className="text-neutral-400 font-mono text-[10px] uppercase">
                    Data de Abertura
                  </dt>
                  <dd className="text-foreground font-mono font-medium mt-0.5">
                    {company.foundedFormatted}
                  </dd>
                </div>
              </div>
              <div>
                <dt className="text-neutral-400 font-mono text-[10px] uppercase">
                  Responsável Técnico
                </dt>
                <dd className="text-foreground font-medium mt-0.5">
                  {company.founder.name} · {company.founder.role}
                </dd>
                <dd className="text-[11px] text-muted-foreground mt-1">
                  {company.founder.experienceYearsText}
                </dd>
              </div>
            </dl>
          </ScrollReveal>
        </div>
      </section>

      <ContactCTA
        title="Deseja conhecer nosso trabalho de perto?"
        description="Visite a oficina ou entre em contato pelo telefone para conversar com nosso responsável técnico."
        label="Entrar em contato com a BRS"
      />
    </div>
  );
}
