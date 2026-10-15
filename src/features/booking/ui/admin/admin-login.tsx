import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Shield, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col justify-between font-sans selection:bg-slate-900 selection:text-white">
      {/* BARRA SUPERIOR */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            B
          </div>
          <span className="font-semibold text-sm tracking-tight text-slate-900">
            {company.name}
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
            PAINEL OPERACIONAL
          </span>
        </div>

        <a
          href="/"
          className="text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Voltar ao site</span>
        </a>
      </header>

      {/* ÁREA CENTRAL / CARD DE LOGIN */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-[440px] bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
              <Shield size={12} className="text-slate-600" />
              <span>Acesso Administrativo</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Painel da Oficina</h1>
            <p className="text-xs text-slate-500">
              Faça login para gerenciar consultas, bloqueios e equipe técnica.
            </p>
          </div>

          {/* BOX DEMONSTRATIVO DE CREDENCIAIS */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-start gap-2 text-xs">
              <Sparkles size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs font-semibold">
                  Ambiente Demonstrativo Interativo
                </strong>
                <span className="text-slate-500 text-[11px]">
                  Credenciais de teste pré-configuradas para avaliação operacional:
                </span>
              </div>
            </div>

            <div className="font-mono text-xs text-slate-800 bg-white p-3 rounded-md border border-slate-200 space-y-1.5 shadow-2xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[10px] uppercase font-sans tracking-wider">
                  E-mail:
                </span>
                <span className="font-medium text-slate-900">{DEMO_CREDENTIALS.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[10px] uppercase font-sans tracking-wider">
                  Senha:
                </span>
                <span className="font-semibold text-slate-900 font-mono">
                  {DEMO_CREDENTIALS.password}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-300 shadow-2xs"
            >
              <Sparkles size={13} className="text-amber-600" />
              <span>Preencher dados demo em 1 clique</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* FORMULÁRIO DE LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">
                E-mail institucional
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  placeholder="admin@brsreparacoes.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-xs font-medium text-slate-700">Senha de acesso</label>
                <span className="text-[11px] text-slate-500 font-mono">Demo: demo123</span>
              </div>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-black active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <span>Entrar no Painel</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Sessão temporária mantida apenas no navegador durante o teste demonstrativo. Para
            ambiente de produção, conecte seu provedor OAuth/SSO ou Supabase Auth.
          </p>
        </div>
      </main>

      {/* RODAPÉ */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-500 border-t border-slate-200 bg-white">
        © 2026 {company.name} • Sistema Operacional BRS
      </footer>
    </div>
  );
}
