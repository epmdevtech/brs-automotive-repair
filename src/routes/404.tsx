import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { buildRouteHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/404")({
  component: NotFoundPage,
  head: () =>
    buildRouteHead({
      title: "Página Não Encontrada (404) | Master Chapeação e Pinturas",
      description: "A página solicitada não foi encontrada no site da Master Chapeação e Pinturas.",
      path: "/404",
    }),
});

function NotFoundPage() {
  return (
    <div className="pt-32 pb-24 flex items-center justify-center min-h-[70vh]">
      <div className="page-width max-w-lg text-center">
        <ScrollReveal direction="up" delay={0.05}>
          <p className="eyebrow justify-center mb-3">Erro 404</p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.12}>
          <h1 className="text-6xl sm:text-7xl font-bold font-display text-brand-accent mb-4">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
            Página não encontrada
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-8">
            O endereço que você tentou acessar não existe ou foi movido. Navegue pelas seções
            principais abaixo para encontrar o que procura:
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.28}>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" asChild className="h-10 px-5 text-xs font-semibold">
              <Link to="/">
                Página inicial <ArrowUpRight className="ml-1" size={13} aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="secondary" asChild className="h-10 px-5 text-xs font-medium">
              <Link to="/servicos">Nossos serviços</Link>
            </Button>
            <Button variant="secondary" asChild className="h-10 px-5 text-xs font-medium">
              <Link to="/contato">Fale conosco</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
