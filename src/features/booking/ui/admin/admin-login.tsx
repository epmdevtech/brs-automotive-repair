import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/brs";
import { DEMO_CREDENTIALS, loginAdmin, type AdminUser } from "../../domain/auth";

export interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = loginAdmin(email, password);
    if (result.ok) {
      onLoginSuccess(result.value);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#EDEDED] flex flex-col justify-between selection:bg-[#FF5A00]/30 selection:text-white">
      {/* BARRA SUPERIOR */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[#1F1F23] bg-[#121214]/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded bg-[#18181B] text-white flex items-center justify-center font-display font-bold text-sm border border-[#27272A] shadow-inner">
            B
          </div>
          <span className="font-display font-semibold text-sm tracking-tight text-white">
            {company.name}
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 font-semibold border border-white/10">
            CHASSIS OPS
          </span>
        </div>

        <a
          href="/"
          className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Voltar ao site</span>
        </a>
      </header>

      {/* ÁREA CENTRAL / CARD DE LOGIN */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-[460px] bg-[#121214] rounded-xl border border-[#1F1F23] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* AMBIENT GLOW SUAVE */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#FF5A00]/10 blur-3xl pointer-events-none rounded-full"
            aria-hidden="true"
          />

          <div className="text-center space-y-2 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-zinc-300 text-[11px] font-semibold border border-white/10 uppercase font-mono tracking-wider">
              <Shield size={12} className="text-[#FF5A00]" />
              <span>Acesso Administrativo</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Painel da Oficina
            </h1>
            <p className="text-xs text-zinc-400">
              Faça login para gerenciar consultas, bloqueios e equipe.
            </p>
          </div>

          {/* BOX DEMONSTRATIVO INTERATIVO (TERMINAL LOOK) */}
          <div className="p-4 rounded-lg bg-[#18181B] border border-[#27272A] space-y-3 relative">
            <div className="flex items-start gap-2 text-xs">
              <Sparkles size={14} className="text-[#FF5A00] shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200 block text-xs">
                  Ambiente Demonstrativo Interativo
                </strong>
                <span className="text-zinc-400 text-[11px]">
                  Credenciais de teste pré-configuradas para avaliadores e equipe técnica:
                </span>
              </div>
            </div>

            <div className="font-mono text-xs text-zinc-300 bg-[#0B0B0C] p-3 rounded border border-[#27272A] space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 uppercase text-[10px] tracking-wider">E-mail:</span>
                <span className="font-bold text-white tracking-wide">{DEMO_CREDENTIALS.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 uppercase text-[10px] tracking-wider">Senha:</span>
                <span className="font-bold text-[#FF5A00] tracking-wide">
                  {DEMO_CREDENTIALS.password}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2.5 px-3 rounded-lg bg-[#27272A] hover:bg-[#323238] active:scale-[0.99] text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#3F3F46]"
            >
              <Sparkles size={13} className="text-[#FF5A00]" />
              <span>Preencher dados demo em 1 clique</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* FORMULÁRIO DE LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block font-mono uppercase tracking-wider text-[11px]">
                E-mail institucional
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="email"
                  required
                  placeholder="admin@brsreparacoes.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-300 font-mono uppercase tracking-wider text-[11px]">
                  Senha de acesso
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">Demo: demo123</span>
              </div>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 text-xs rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#FF5A00] hover:bg-[#E04F00] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#FF5A00]/20"
            >
              <span>Entrar no Painel</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-[11px] text-zinc-500 text-center leading-relaxed font-mono">
            Sessão temporária mantida apenas no navegador durante o teste demonstrativo. Para
            ambiente de produção, conecte seu provedor OAuth/SSO ou Supabase Auth.
          </p>
        </div>
      </main>

      {/* RODAPÉ */}
      <footer className="w-full py-4 text-center text-[11px] text-zinc-500 border-t border-[#1F1F23] bg-[#121214]/60 font-mono">
        © 2026 {company.name} • EPM Booking Engine
      </footer>
    </div>
  );
}
