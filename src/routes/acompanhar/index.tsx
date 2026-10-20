import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Shield, ArrowRight, Car, Phone } from "lucide-react";
import { buildRouteHead } from "@/lib/seo";
import { CONTATO_OFICINA } from "@/features/booking/domain/tracking-public";

export const Route = createFileRoute("/acompanhar/")({
  component: AcompanharIndexPage,
  head: () => {
    const baseHead = buildRouteHead({
      title: "Consulta de Reparação Automotiva | Master Chapeação",
      description:
        "Consulte o status do reparo do seu veículo através do número de protocolo na Master Chapeação e Pinturas.",
      path: "/acompanhar",
      noindex: true,
    });

    return {
      ...baseHead,
      meta: [...(baseHead.meta || []), { name: "referrer", content: "no-referrer" }],
    };
  },
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
    <div className="min-h-screen bg-background text-neutral-200 flex flex-col justify-between antialiased">
      {/* CABEÇALHO ENXUTO DEDICADO */}
      <header className="w-full h-14 sm:h-16 border-b border-neutral-800/80 px-4 sm:px-6 bg-background/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg p-1"
          >
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary-active flex items-center justify-center font-bold text-white text-sm">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-white text-sm group-hover:text-brand-accent transition-colors">
                Master Chapeação
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">Canal do cliente</span>
            </div>
          </Link>

          <a
            href={CONTATO_OFICINA.telefoneHref}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <Phone size={13} className="text-brand-accent" />
            <span>{CONTATO_OFICINA.telefoneFormatado}</span>
          </a>
        </div>
      </header>

      {/* ÁREA CENTRAL DE BUSCA */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#13161B] border border-neutral-800 p-6 sm:p-8 rounded-2xl text-center space-y-6 shadow-2xl">
          <div className="size-14 rounded-2xl bg-primary/10 text-brand-accent flex items-center justify-center mx-auto border border-primary/20">
            <Car size={28} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
              Área do cliente • Master
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white mt-3 tracking-tight">
              Acompanhe o reparo do seu veículo
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed pt-1">
              Digite o número do protocolo informado no momento da entrega do veículo (ex:{" "}
              <strong className="text-neutral-300 font-mono">#Master-7391</strong>) para verificar o
              andamento técnico em tempo real.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-500" />
              <input
                type="text"
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                placeholder="Digite seu protocolo (ex: Master-7391)"
                className="w-full text-xs bg-background border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-primary shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <span>Consultar andamento</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
            <Shield size={13} className="text-neutral-400" />
            <span>Dados protegidos em conformidade com a LGPD.</span>
          </div>
        </div>
      </main>

      {/* RODAPÉ DISCRETO */}
      <footer className="py-4 border-t border-neutral-900 text-center text-[10px] text-neutral-400">
        © 2026 Master Chapeação e Pinturas • Toledo - PR
      </footer>
    </div>
  );
}
