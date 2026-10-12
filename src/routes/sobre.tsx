import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Check,
  MapPin,
  Phone,
  Instagram,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { company } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { Button } from "@/components/ui/button";

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
        <Breadcrumbs items={[{ name: "A BRS" }]} className="mb-6" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">Institucional</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
              Oficina Técnica Especializada em Toledo, Paraná.
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-4">
              A **BRS Reparações Automotivas** nasceu para atender motoristas e corretores de
              seguros que buscam um nível superior de acabamento, respeito aos prazos e honestidade
              no diagnóstico da avaria veicular.
            </p>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
              Nosso trabalho não envolve soluções improvisadas ou excesso de massa plástica. Toda
              intervenção visa devolver à carroceria as folgas, vincos e a integridade de pintura
              concebidos pela montadora.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button variant="automotive" asChild className="h-11 px-6 text-xs font-semibold">
                <a href="/contato">
                  Fale com a equipe da BRS{" "}
                  <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
                </a>
              </Button>
              <Button variant="automotiveOutline" asChild className="h-11 px-6 text-xs font-medium">
                <a href={company.instagram} {...external}>
                  <Instagram size={14} className="mr-2 text-primary" aria-hidden="true" />
                  Instagram @brsreparacoes
                </a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 border-l border-primary pl-8 sm:pl-12 py-8 bg-card/30 rounded-r-sm">
            <p className="font-display text-6xl sm:text-7xl lg:text-8xl font-semibold leading-none tracking-tight text-white">
              BRS<span className="text-primary">.</span>
            </p>
            <p className="text-xs mt-3 text-muted-foreground uppercase tracking-[2px] font-semibold">
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
          </div>
        </div>
      </section>

      {/* Nossos Princípios */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-2">Fundamentos</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Princípios Que Guiam Nossas Oficinas
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-sm border border-border bg-card/40">
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <ShieldCheck size={16} aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold font-display text-white mb-2">
              Diagnóstico Honesto
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Não inventamos avarias inexistentes nem indicamos repintura quando o martelinho de
              ouro é perfeitamente viável. A confiança do cliente é nosso bem mais valioso.
            </p>
          </div>

          <div className="p-6 rounded-sm border border-border bg-card/40">
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <Wrench size={16} aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold font-display text-white mb-2">
              Precisão de Ajuste
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Portas, paralamas e capôs devem fechar com a suavidade e o som característicos de um
              carro novo, respeitando o alinhamento milimétrico de fábrica.
            </p>
          </div>

          <div className="p-6 rounded-sm border border-border bg-card/40">
            <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <Truck size={16} aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold font-display text-white mb-2">
              Respeito à Rotina
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Sabemos o impacto da ausência do carro no dia a dia. Oferecemos o serviço de busca e
              entrega (Leva e Traz) em Toledo para facilitar o andamento do reparo.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="page-width mt-16 pt-12 border-t border-border text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white mb-4">
            Deseja conhecer nosso trabalho de perto?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6">
            Visite a oficina ou entre em contato pelo telefone para conversar com nosso responsável
            técnico.
          </p>
          <Button variant="automotive" asChild className="h-11 px-8 text-xs font-semibold">
            <a href="/contato">Entrar em contato com a BRS</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
