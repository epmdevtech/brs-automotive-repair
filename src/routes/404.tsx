import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { buildRouteHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/404")({
  component: NotFoundPage,
  head: () =>
    buildRouteHead({
      title: "Página Não Encontrada (404) | BRS Reparações Automotivas",
      description: "A página solicitada não foi encontrada no site da BRS Reparações Automotivas.",
      path: "/404",
    }),
});

function NotFoundPage() {
  return (
    <div className="pt-32 pb-24 flex items-center justify-center min-h-[70vh]">
      <div className="page-width max-w-lg text-center">
        <p className="eyebrow justify-center mb-3">Erro 404</p>
        <h1 className="text-6xl sm:text-7xl font-bold font-display text-primary mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">Página não encontrada</h2>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-8">
          O endereço que você tentou acessar não existe ou foi movido. Navegue pelas seções
          principais abaixo para encontrar o que procura:
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="automotive" asChild className="h-10 px-5 text-xs font-semibold">
            <a href="/">
              Página inicial <ArrowUpRight className="ml-1" size={13} aria-hidden="true" />
            </a>
          </Button>
          <Button variant="automotiveOutline" asChild className="h-10 px-5 text-xs font-medium">
            <a href="/servicos">Nossos serviços</a>
          </Button>
          <Button variant="automotiveOutline" asChild className="h-10 px-5 text-xs font-medium">
            <a href="/contato">Fale conosco</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
