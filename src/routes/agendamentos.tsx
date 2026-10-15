import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo";
import { isAdminAuthenticated } from "@/features/booking/domain/auth";
import { AdminLogin } from "@/features/booking/ui/admin/admin-login";
import { AdminGridView } from "@/features/booking/ui/admin/admin-grid-view";

export const Route = createFileRoute("/agendamentos")({
  component: AgendamentosAdminPage,
  head: () =>
    buildRouteHead({
      title: "Painel de Agendamentos & Pré-OS | BRS",
      description:
        "Plataforma administrativa de gestão de agendamentos e horários dos técnicos da BRS.",
      path: "/agendamentos",
      noindex: true,
    }),
});

function AgendamentosAdminPage() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate({
        to: "/login",
        search: { redirect: "/agendamentos" },
      });
    }
  }, [navigate]);

  if (!authenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setAuthenticated(true);
        }}
      />
    );
  }

  return (
    <AdminGridView
      onLogout={() => {
        setAuthenticated(false);
        navigate({ to: "/login" });
      }}
    />
  );
}
