import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { buildRouteHead } from "@/lib/seo";
import { isAdminAuthenticated } from "@/features/booking/domain/auth";
import { AdminLogin } from "@/features/booking/ui/admin/admin-login";

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch("/agendamentos"),
});

export const Route = createFileRoute("/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: LoginPage,
  head: () =>
    buildRouteHead({
      title: "Painel da Oficina | Acesso Administrativo Master",
      description:
        "Acesso administrativo seguro para gestão de agendamentos e equipe técnica da Master Chapeação e Pinturas.",
      path: "/login",
      noindex: true,
    }),
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const targetRedirect = search.redirect || "/agendamentos";

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate({ to: targetRedirect });
    }
  }, [navigate, targetRedirect]);

  return (
    <AdminLogin
      onLoginSuccess={() => {
        navigate({ to: targetRedirect });
      }}
    />
  );
}
