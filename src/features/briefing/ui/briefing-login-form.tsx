import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithPassword } from "../server/functions";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail").email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe a senha"),
});

type LoginValues = z.infer<typeof loginSchema>;

export interface BriefingLoginFormProps {
  onAuthenticated: () => void;
}

export function BriefingLoginForm({ onAuthenticated }: BriefingLoginFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setErrorMessage(null);
    setUnavailable(false);

    const result = await signInWithPassword({ data: values });

    if (!result.ok) {
      if (result.error.code === "not_configured") {
        setUnavailable(true);
        setErrorMessage(result.error.message);
        return;
      }
      setErrorMessage(result.error.message);
      return;
    }

    if (!result.data.authenticated) {
      setErrorMessage(result.data.message ?? "Não foi possível autenticar. Tente novamente.");
      return;
    }

    onAuthenticated();
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6 sm:py-24">
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Voltar ao site
      </a>

      <div className="mt-8 border border-white/10 bg-white/[0.02] p-6">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--brand-text-accent)]">
          EPM DevTech · Área restrita
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-white">
          Acesso ao briefing operacional
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
          Entre com as credenciais fornecidas pela EPM DevTech. O acesso protege os dados da Master
          Chapeação e Pinturas e cada ação é registrada.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-1.5">
            <label htmlFor="briefing-login-email" className="text-sm font-medium text-neutral-200">
              E-mail
            </label>
            <Input
              id="briefing-login-email"
              type="email"
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "briefing-login-email-error" : undefined}
              {...register("email")}
              className="border-white/15 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-[var(--brand-primary)]"
            />
            {errors.email ? (
              <p id="briefing-login-email-error" role="alert" className="text-xs text-red-300">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="briefing-login-password"
              className="text-sm font-medium text-neutral-200"
            >
              Senha
            </label>
            <Input
              id="briefing-login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "briefing-login-password-error" : undefined}
              {...register("password")}
              className="border-white/15 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-[var(--brand-primary)]"
            />
            {errors.password ? (
              <p id="briefing-login-password-error" role="alert" className="text-xs text-red-300">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {errorMessage ? (
            <p
              role="alert"
              className="border border-red-400/30 bg-red-400/5 p-3 text-xs leading-relaxed text-red-100"
            >
              {errorMessage}
            </p>
          ) : null}

          {unavailable ? (
            <p className="border border-amber-300/30 bg-amber-300/5 p-3 text-xs leading-relaxed text-amber-100">
              A autenticação depende da configuração do serviço de dados no servidor. Enquanto ela
              não existir, nenhum acesso é liberado.
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={isSubmitting}
          >
            <LogIn aria-hidden="true" />
            {isSubmitting ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-neutral-500">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Não há credenciais padrão neste projeto. O acesso é concedido por convite e cada sessão é
        verificada no servidor.
      </p>
    </div>
  );
}
