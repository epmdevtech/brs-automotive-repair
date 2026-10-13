import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { BackToTop } from "@/components/ui/back-to-top";
import { PageTransition } from "@/components/ui/page-transition";
import { Footer } from "./footer";
import { Header } from "./header";

/**
 * Estrutura única compartilhada por todas as rotas: skip link, navbar, conteúdo com transição de
 * página refinada, rodapé e botão voltar ao topo (SPEC-024).
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-primary text-primary-foreground p-3 font-medium text-xs rounded-sm"
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="conteudo-principal" className="flex-1">
        <PageTransition pathname={pathname}>{children}</PageTransition>
      </main>

      <Footer />

      <BackToTop />
    </div>
  );
}
