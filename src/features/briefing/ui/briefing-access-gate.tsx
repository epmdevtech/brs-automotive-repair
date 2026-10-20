import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authorizeBriefing, BRIEFING_DEMO_ACCESS_CODE } from "../domain/access";

interface BriefingAccessGateProps {
  onAuthorized: () => void;
}

export function BriefingAccessGate({ onAuthorized }: BriefingAccessGateProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputId = "briefing-access-code";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (authorizeBriefing(code)) {
      setError(null);
      onAuthorized();
      return;
    }

    setError("Código de acesso inválido. Confira o código fornecido pela EPM DevTech.");
  }

  return (
    <div className="mx-auto max-w-md border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-8">
      <div
        className="mb-5 grid size-12 place-items-center rounded-full border border-white/10 bg-white/5 text-[var(--brand-text-accent)]"
        aria-hidden="true"
      >
        <LockKeyhole className="size-5" />
      </div>

      <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--brand-text-accent)]">
        Acesso restrito
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-white">
        Briefing operacional Master
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
        Este formulário reúne informações internas da operação, documentação e interesse em
        credenciamento. Nada é publicado automaticamente no site.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-200">
            Código de acesso
          </label>
          <Input
            id={inputId}
            name="briefing-access-code"
            type="password"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              if (error) setError(null);
            }}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "briefing-access-error" : undefined}
            className="border-white/15 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-[var(--brand-primary)]"
            placeholder="Informe o código"
          />
          {error ? (
            <p id="briefing-access-error" role="alert" className="text-sm text-red-300">
              {error}
            </p>
          ) : null}
        </div>

        <Button type="submit" variant="primary" className="w-full justify-center">
          Acessar briefing
        </Button>
      </form>

      {import.meta.env.DEV ? (
        <p className="mt-4 text-xs text-neutral-500">
          Ambiente de demonstração: o código padrão é{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-neutral-300">
            {BRIEFING_DEMO_ACCESS_CODE}
          </code>
          . A proteção real exige autenticação no servidor.
        </p>
      ) : (
        <p className="mt-4 text-xs text-neutral-500">
          A barreira é de demonstração e não substitui autenticação de produção.
        </p>
      )}
    </div>
  );
}
