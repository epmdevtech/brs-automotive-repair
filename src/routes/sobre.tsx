import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Phone, Instagram, ShieldCheck, Truck, Wrench } from "lucide-react";
import { company } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ContactCTA } from "@/components/brs/contact-cta";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
      <section className="page-width mb-12">
        <ScrollReveal direction="up" delay={0.05}>
          <Breadcrumbs items={[{ name: "A BRS" }]} className="mb-6" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={0.1}>
              <p className="eyebrow mb-3">Institucional</p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
                Oficina Técnica Especializada em Toledo, Paraná.
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-4">
                A <strong className="text-white">BRS Reparações Automotivas</strong> nasceu para
                atender motoristas e corretores de seguros que buscam um nível superior de
                acabamento, respeito aos prazos e honestidade no diagnóstico da avaria veicular.
              </p>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                Nosso trabalho não envolve soluções improvisadas ou excesso de massa plástica. Toda
                intervenção visa devolver à carroceria as folgas, vincos e a integridade de pintura
                concebidos pela montadora.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.38}>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button variant="primary" asChild className="h-11 px-6 text-xs font-semibold">
                  <Link to="/contato">
                    FALAR COM A BRS <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="secondary" asChild className="h-11 px-6 text-xs font-medium">
                  <a href={company.instagram} {...external}>
                    <Instagram size={14} className="mr-2 text-primary" aria-hidden="true" />
                    Instagram @brsreparacoes
                  </a>
                </Button>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal
            direction="up"
            delay={0.2}
            className="lg:col-span-5 border-l border-primary/60 pl-8 sm:pl-12 py-6"
          >
            <p className="font-display text-6xl sm:text-7xl lg:text-8xl font-semibold leading-none tracking-tight text-white">
              BRS<span className="text-primary">.</span>
            </p>
            <p className="text-xs mt-3 text-muted-foreground uppercase tracking-[2px] font-semibold font-mono">
              Reparações automotivas
            </p>
            <div className="mt-8 space-y-4 text-xs sm:text-sm text-neutral-300">
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
          </ScrollReveal>
        </div>
      </section>

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
                01 / ÉTICA PROFISSIONAL
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
                02 / PADRÃO ORIGINAL
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
                03 / ATENDIMENTO
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
