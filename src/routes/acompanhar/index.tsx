import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Shield, ArrowRight, Car } from "lucide-react";
import { buildRouteHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/brs";

export const Route = createFileRoute("/acompanhar/")({
  component: AcompanharIndexPage,
  head: () =>
    buildRouteHead({
      title: "Consulta de Reparação Automotiva | BRS Reparações",
      description: "Consulte o status do reparo do seu veículo através do número de protocolo.",
      path: "/acompanhar",
      noindex: true,
    }),
});

function AcompanharIndexPage() {
  const [protocol, setProtocol] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = protocol.trim().replace("#", "").toLowerCase();
    if (clean) {
      navigate({ to: `/acompanhar/${clean}` });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-20">
      <div className="max-w-lg w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center space-y-6 shadow-2xl">
        <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
          <Car size={28} />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
            Área do Cliente • BRS
          </span>
          <h1 className="text-2xl font-bold font-display text-white mt-3 tracking-tight">
            Acompanhe o Reparo do Seu Veículo
          </h1>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Digite o número do protocolo fornecido no momento do cadastro (ex: #BRS-8412) para
            consultar as etapas concluídas e o status atual.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-500" />
            <input
              type="text"
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              placeholder="Digite seu protocolo (ex: BRS-8412)"
              className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-primary shadow-inner"
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full text-xs font-semibold py-3">
            Consultar Andamento <ArrowRight size={14} className="ml-1" />
          </Button>
        </form>

        <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
          <Shield size={12} className="text-neutral-400" />
          Dados protegidos em conformidade com a LGPD.
        </div>
      </div>
    </div>
  );
}
