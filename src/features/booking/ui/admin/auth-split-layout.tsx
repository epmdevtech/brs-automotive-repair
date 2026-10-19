import type { ReactNode } from "react";
import { ArrowLeft, ShieldCheck, Wrench, Calendar, Sparkles } from "lucide-react";
import { company } from "@/lib/brs";

export interface AuthSplitLayoutProps {
  children: ReactNode;
  imageSrc?: string;
}

/**
 * Layout Split-Screen balanceado e acessível para autenticação administrativa (SPEC-056).
 * Em desktop (>=1024px), divide a tela na proporção de minmax(440px, 42%) : 1fr.
 * Em monitores padrão (>=1366x768), bloqueia overflow vertical indesejado.
 * Em mobile e tablet (<1024px), esconde a coluna direita e foca no formulário.
 */
export function AuthSplitLayout({ children, imageSrc }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-dvh lg:h-dvh w-full bg-white text-slate-900 grid grid-cols-1 lg:grid-cols-[minmax(440px,42%)_1fr] font-sans selection:bg-slate-900 selection:text-white lg:overflow-hidden">
      {/* COLUNA ESQUERDA: FORMULÁRIO OPERACIONAL */}
      <div className="w-full h-full bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 sm:p-8 lg:px-12 lg:py-8 z-10 overflow-y-auto">
        {/* Header da coluna esquerda */}
        <header className="flex items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-slate-900 leading-none">
                {company.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5">
                SISTEMA OPERACIONAL
              </span>
            </div>
          </div>

          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors group p-1 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <ArrowLeft
              size={13}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <span>Voltar ao site</span>
          </a>
        </header>

        {/* Conteúdo central: formulário */}
        <main className="my-auto py-4 w-full max-w-[400px] mx-auto">{children}</main>

        {/* Rodapé da coluna esquerda */}
        <footer className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>© 2026 {company.name} · v0.2.0</span>
          <span className="font-mono text-[11px] text-slate-400">EPM BOOKING</span>
        </footer>
      </div>

      {/* COLUNA DIREITA: PAINEL INSTITUCIONAL DA MARCA (Desktop >=1024px) */}
      <aside
        aria-label="Apresentação Institucional Master"
        className="hidden lg:flex flex-1 relative bg-[#0b1329] text-white flex-col justify-between p-10 xl:p-14 2xl:p-16 h-full overflow-y-auto select-none"
      >
        {/* Background com imagem opcional ou gradiente institucional dourado sutil (~8%) */}
        {imageSrc ? (
          <div className="absolute inset-0 z-0">
            <img
              src={imageSrc}
              alt="Instalações Master"
              className="w-full h-full object-cover opacity-25 filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b18] via-[#0b1329]/90 to-[#0b1329]/70" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            {/* Gradiente radial de profundidade dourado sutil (~8%) e grid suave */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(217,119,6,0.08),transparent)]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>
        )}

        {/* Topo do painel direito: badge de certificação e segurança */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-xs font-medium text-slate-300">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Ambiente operacional seguro</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">Toledo • PR</span>
          </div>
        </div>

        {/* Conteúdo central do painel direito: proposta de valor da plataforma */}
        <div className="relative z-10 max-w-[560px] mx-auto w-full space-y-6 my-auto">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles size={14} />
              <span>Agenda e Atendimento</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
              Gestão integrada de atendimentos e reparação automotiva.
            </h2>

            <p className="text-sm xl:text-base text-slate-300 leading-relaxed font-normal">
              Agenda técnica, controle de bloqueios de baia e fluxo de reparação em um só lugar.
              Acompanhamento de ponta a ponta com rigor e fidelidade ao padrão original de fábrica.
            </p>
          </div>

          {/* Cards de pilares operacionais (sem jargões técnicos) */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 backdrop-blur-xs space-y-2">
              <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Calendar size={16} />
              </div>
              <h3 className="text-sm font-semibold text-white">Agenda sempre atualizada</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Sincronização multi-aba instantânea com garantia de vaga exclusiva para cada
                veículo.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 backdrop-blur-xs space-y-2">
              <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Wrench size={16} />
              </div>
              <h3 className="text-sm font-semibold text-white">Fluxo de oficina em 5 etapas</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Do check-in à entrega técnica final, com esteira visual clara para a equipe.
              </p>
            </div>
          </div>

          {/* Mini-card estático de prévia da agenda da oficina (>=1280px) */}
          <div
            aria-hidden="true"
            className="hidden xl:block p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-xs space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-slate-200">Check-in de hoje · 08:30</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Baia 1 · Toyota Corolla XEi
              </span>
            </div>

            {/* Mini-stepper horizontal de 5 etapas */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pb-1.5">
                <span className="text-emerald-400">1. Check-in</span>
                <span className="text-emerald-400">2. Desmontagem</span>
                <span className="text-amber-300 font-semibold">3. Pintura</span>
                <span>4. Montagem</span>
                <span>5. Entrega</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                <div className="h-1.5 rounded-full bg-emerald-500" />
                <div className="h-1.5 rounded-full bg-emerald-500" />
                <div className="h-1.5 rounded-full bg-amber-400" />
                <div className="h-1.5 rounded-full bg-slate-700" />
                <div className="h-1.5 rounded-full bg-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do painel direito */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{company.legalName}</span>
          <span className="font-mono">CNPJ: {company.cnpj}</span>
        </div>
      </aside>
    </div>
  );
}
