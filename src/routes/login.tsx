import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { buildRouteHead } from "@/lib/seo";
import { sanitizeRedirectTarget } from "@/lib/redirect";
import { BriefingLoginForm } from "@/features/briefing/ui/briefing-login-form";

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: LoginPage,
  head: () =>
    buildRouteHead({
      title: "Acesso restrito | EPM DevTech & Master Chapeação",
      description:
        "Autenticação segura para o briefing operacional e o painel administrativo da EPM DevTech.",
      path: "/login",
      noindex: true,
    }),
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const targetRedirect = sanitizeRedirectTarget(search.redirect);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 antialiased">
      <BriefingLoginForm
        onAuthenticated={() => {
          void navigate({ to: targetRedirect });
        }}
      />
    </main>
  );
}
