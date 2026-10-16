import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";

import appCss from "../styles.css?url";
import { reportAppError } from "../lib/error-reporting";
import { SiteLayout } from "../components/brs/site-layout";
import { Button } from "../components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-24">
      <div className="max-w-md text-center">
        <p className="eyebrow justify-center mb-3">Erro 404</p>
        <h1 className="text-7xl font-bold font-display text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-neutral-400">
          O endereço que você tentou acessar não existe ou foi alterado. Utilize os atalhos abaixo
          para navegar pelo conteúdo oficial da BRS.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="primary" asChild>
            <Link to="/">Página inicial</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/servicos">Nossos serviços</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/contato">Fale conosco</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground font-display text-2xl">
          Instabilidade ao carregar
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Ocorreu um erro inesperado ao carregar este conteúdo. Tente novamente ou retorne à página
          inicial.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Tentar novamente
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/">Página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0b0d10" },
      { property: "og:site_name", content: "BRS Reparações Automotivas" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Sora:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="overflow-x-clip max-w-full">
      <head>
        <HeadContent />
      </head>
      <body className="overflow-x-clip max-w-full w-full">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <SiteLayout>
          <Outlet />
        </SiteLayout>
      </MotionConfig>
    </QueryClientProvider>
  );
}
