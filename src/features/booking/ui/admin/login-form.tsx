import { useState, type KeyboardEvent, type FormEvent } from "react";
import { z } from "zod";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  HelpCircle,
  Loader2,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { DEMO_CREDENTIALS, loginAdmin, type AdminUser } from "../../domain/auth";
import { DemoBanner } from "./demo-banner";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail institucional.")
    .email("Informe um endereço de e-mail válido."),
  password: z.string().min(1, "Informe sua senha de acesso."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  onLoginSuccess: (user: AdminUser) => void;
  demo?: boolean;
}

/**
 * Formulário de autenticação administrativa da BRS.
 * Implementa validação com Zod, aviso acessível de Caps Lock,
 * alternância de visibilidade de senha com aria-pressed e alerta de erro com role="alert".
 */
export function LoginForm({ onLoginSuccess, demo = true }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const checkCapsLock = (e: KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setFieldErrors({});
    setAuthError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setFieldErrors({});

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const formatted = validation.error.format();
      setFieldErrors({
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0],
      });
      return;
    }

    setIsLoading(true);
    const result = loginAdmin(email, password);
    setIsLoading(false);

    if (result.ok) {
      onLoginSuccess(result.value);
    } else {
      setAuthError(result.error);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Banner de Demonstração discreto */}
      {demo && <DemoBanner demo={demo} onFillDemo={handleFillDemo} />}

      {/* Cabeçalho do Cartão de Login */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
          <Shield size={12} className="text-slate-600" aria-hidden="true" />
          <span>Acesso Administrativo</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Painel da Oficina</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Faça login para gerenciar consultas, bloqueios e equipe técnica.
        </p>
      </div>

      {/* Alerta de erro de autenticação */}
      {authError && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-3 rounded-lg bg-rose-50 border border-rose-200/90 text-rose-700 text-xs flex items-start gap-2 shadow-2xs animate-in fade-in duration-200"
        >
          <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" aria-hidden="true" />
          <div className="leading-relaxed">
            <span className="font-semibold block">Falha no acesso</span>
            <span>{authError}</span>
          </div>
        </div>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Campo E-mail */}
        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="text-xs font-semibold text-slate-700 block">
            E-mail institucional
          </label>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="admin@brsreparacoes.com.br"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors shadow-2xs ${
                fieldErrors.email
                  ? "border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="text-[11px] text-rose-600 font-medium">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Campo Senha */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="admin-password" className="font-semibold text-slate-700">
              Senha de acesso
            </label>

            {/* Aviso de Caps Lock */}
            {capsLockActive && (
              <span
                role="status"
                aria-live="polite"
                className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 animate-pulse"
              >
                <AlertCircle size={11} aria-hidden="true" />
                <span>Caps Lock ativado</span>
              </span>
            )}

            {/* Link Esqueci minha senha */}
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="text-[11px] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>

          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              onKeyDown={checkCapsLock}
              onKeyUp={checkCapsLock}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              className={`w-full pl-9 pr-10 py-2.5 text-xs rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors shadow-2xs font-mono ${
                fieldErrors.password
                  ? "border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Ocultar senha de acesso" : "Exibir senha de acesso"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff size={15} aria-hidden="true" />
              ) : (
                <Eye size={15} aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" role="alert" className="text-[11px] text-rose-600 font-medium">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Botão de Submissão */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full mt-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-black active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <span>Entrar no Painel</span>
              <ArrowRight size={14} aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      {/* Nota de sessão e ambiente */}
      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        Sessão autenticada no navegador. Em ambiente corporativo, a BRS adota integração via SSO /
        OAuth2.
      </p>

      {/* Dialog Informativo de Recuperação de Senha */}
      <Dialog.Root open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white rounded-xl border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <HelpCircle size={18} />
              </div>
              <Dialog.Title className="text-base font-bold">Recuperação de Acesso</Dialog.Title>
            </div>

            <Dialog.Description className="text-xs text-slate-600 leading-relaxed">
              Por políticas de segurança interna da oficina, a redefinição de senhas administrativas
              deve ser solicitada presencialmente à gerência técnica ou por e-mail ao suporte
              interno da BRS.
            </Dialog.Description>

            <div className="pt-2 flex justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-medium cursor-pointer transition-colors"
                >
                  Entendi
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
