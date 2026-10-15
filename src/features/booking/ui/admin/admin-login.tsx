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
    <div className="min-h-screen bg-[#f3efe9] text-[#2c2724] flex flex-col justify-between selection:bg-amber-200">
      {/* BARRA SUPERIOR */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[#e5dfd5] bg-[#fbf9f6]">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded bg-[#201d1b] text-white flex items-center justify-center font-display font-bold text-sm shadow-sm">
            B
          </div>
          <span className="font-display font-semibold text-sm tracking-tight text-[#201d1b]">
            {company.name}
          </span>
        </div>

        <a
          href="/"
          className="text-xs text-[#716860] hover:text-[#201d1b] font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Voltar ao site</span>
        </a>
      </header>

      {/* ÁREA CENTRAL / CARD DE LOGIN */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-[460px] bg-[#fbf9f6] rounded-2xl border border-[#e5dfd5] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eee7de] text-[#554e47] text-[11px] font-semibold border border-[#dfd7cc]">
              <Shield size={12} className="text-[#84776b]" />
              <span>Acesso Administrativo</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#201d1b] tracking-tight">
              Painel da Oficina
            </h1>
            <p className="text-xs text-[#716860]">
              Faça login para gerenciar consultas, bloqueios e equipe.
            </p>
          </div>

          {/* BOX DEMONSTRATIVO INTERATIVO */}
          <div className="p-4 rounded-xl bg-[#ede7de] border border-[#dfd7cc] space-y-3">
            <div className="flex items-start gap-2 text-xs">
              <Sparkles size={14} className="text-[#84776b] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#201d1b] block text-xs">
                  Ambiente Demonstrativo Interativo
                </strong>
                <span className="text-[#716860] text-[11px]">
                  Credenciais de teste pré-configuradas para avaliadores e equipe técnica:
                </span>
              </div>
            </div>

            <div className="font-mono text-xs text-[#443e39] bg-[#fbf9f6]/70 p-2.5 rounded-lg border border-[#dfd7cc]/70 space-y-1">
              <div className="flex justify-between">
                <span className="text-[#84776b]">E-mail:</span>
                <span className="font-bold text-[#201d1b]">{DEMO_CREDENTIALS.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#84776b]">Senha:</span>
                <span className="font-bold text-[#201d1b]">{DEMO_CREDENTIALS.password}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2 px-3 rounded-lg bg-[#ded5c7] hover:bg-[#d4c9b9] text-[#201d1b] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#cebfae]"
            >
              <Sparkles size={13} />
              <span>Preencher dados demo em 1 clique</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-100/80 border border-red-200 text-red-800 text-xs">
              {error}
            </div>
          )}

          {/* FORMULÁRIO DE LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#3b3530] block">
                E-mail institucional
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#84776b]"
                />
                <input
                  type="email"
                  required
                  placeholder="admin@brsreparacoes.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-[#d8d0c4] bg-[#fbf9f6] text-[#201d1b] placeholder:text-[#9c9186] focus:outline-none focus:ring-2 focus:ring-[#84776b]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#3b3530]">Senha de acesso</label>
                <span className="text-[10px] text-[#84776b]">Demo: demo123</span>
              </div>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#84776b]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 text-xs rounded-lg border border-[#d8d0c4] bg-[#fbf9f6] text-[#201d1b] placeholder:text-[#9c9186] focus:outline-none focus:ring-2 focus:ring-[#84776b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#84776b] hover:text-[#201d1b] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#201d1b] hover:bg-[#34302d] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>Entrar no Painel</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-[11px] text-[#84776b] text-center leading-relaxed">
            Sessão temporária mantida apenas no navegador durante o teste demonstrativo. Para
            ambiente de produção, conecte seu provedor OAuth/SSO ou Supabase Auth.
          </p>
        </div>
      </main>

      {/* RODAPÉ */}
      <footer className="w-full py-4 text-center text-[11px] text-[#84776b] border-t border-[#e5dfd5] bg-[#fbf9f6]">
        © 2026 {company.name} • EPM Booking Demo
      </footer>
    </div>
  );
}
