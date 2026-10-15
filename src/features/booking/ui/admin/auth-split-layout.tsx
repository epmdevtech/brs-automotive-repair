import type { ReactNode } from "react";
import { ArrowLeft, ShieldCheck, Wrench, Calendar, Sparkles } from "lucide-react";
import { company } from "@/lib/brs";

export interface AuthSplitLayoutProps {
  children: ReactNode;
  imageSrc?: string;
}

/**
 * Layout Split-Screen para telas de autenticação administrativa.
 * Em desktop (>=1024px), divide a tela entre o formulário na coluna esquerda
 * e um painel de marca institucional imersivo na coluna direita.
 * Em mobile e tablet (<1024px), esconde a coluna direita e foca no formulário.
 */
export function AuthSplitLayout({ children, imageSrc }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-slate-900 flex font-sans selection:bg-slate-900 selection:text-white">
      {/* COLUNA ESQUERDA: FORMULÁRIO OPERACIONAL */}
      <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 min-h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10 shadow-xs">
        {/* Header da coluna esquerda */}
        <header className="flex items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-slate-900 leading-none">
                {company.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                SISTEMA OPERACIONAL
              </span>
            </div>
          </div>

          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors group"
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
        <main className="my-auto py-6 w-full max-w-md mx-auto">{children}</main>

        {/* Rodapé da coluna esquerda */}
        <footer className="pt-6 border-t border-slate-100 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>© 2026 {company.name}</span>
          <span className="text-[10px] font-mono text-slate-500">v0.2.0 • EPM BOOKING</span>
        </footer>
      </div>

      {/* COLUNA DIREITA: PAINEL INSTITUCIONAL DA MARCA (Desktop >=1024px) */}
      <aside
        aria-label="Apresentação Institucional BRS"
        className="hidden lg:flex flex-1 relative bg-slate-900 text-white flex-col justify-between p-12 xl:p-16 overflow-hidden select-none"
      >
        {/* Background com imagem opcional ou padrão geométrico sutil */}
        {imageSrc ? (
          <div className="absolute inset-0 z-0">
            <img
              src={imageSrc}
              alt="Instalações BRS"
              className="w-full h-full object-cover opacity-25 filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/70" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Gradiente radial de profundidade e grid técnico */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(51,65,85,0.4),rgba(15,23,42,1))]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute -top-32 -right-32 size-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-slate-700/20 blur-3xl pointer-events-none" />
          </div>
        )}

        {/* Topo do painel direito: badge de certificação e segurança */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-xs font-medium text-slate-300">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Ambiente Operacional Seguro</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">Toledo • PR</span>
          </div>
        </div>

        {/* Conteúdo central do painel direito: proposta de valor da plataforma */}
        <div className="relative z-10 max-w-xl space-y-8 my-auto">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles size={14} />
              <span>Painel de Engenharia & Gestão</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
              Gestão integrada de atendimentos e reparação automotiva.
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-normal">
              Agenda técnica, controle de bloqueios de baia e fluxo de reparação em um só lugar.
              Acompanhamento de ponta a ponta com rigor e fidelidade ao padrão original de fábrica.
            </p>
          </div>

          {/* Cards de pilares operacionais */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 backdrop-blur-xs space-y-2">
              <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Calendar size={16} />
              </div>
              <h3 className="text-sm font-semibold text-white">Sincronização em Tempo Real</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Multi-aba reativa via Web Locks e BroadcastChannel com zero perda de agendamento.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 backdrop-blur-xs space-y-2">
              <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Wrench size={16} />
              </div>
              <h3 className="text-sm font-semibold text-white">Fluxo de Oficina 5 Etapas</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Do check-in à entrega técnica final, com esteira visual e comunicação ao cliente.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé do painel direito */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{company.legalName}</span>
          <span className="font-mono">CNPJ: {company.cnpj}</span>
        </div>
      </aside>
    </div>
  );
}
