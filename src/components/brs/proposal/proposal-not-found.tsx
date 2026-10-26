import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProposalNotFoundProps {
  slug?: string;
}

export function ProposalNotFound({ slug }: ProposalNotFoundProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-24 px-4 bg-background">
      <div className="max-w-lg w-full text-center p-8 rounded-xl border border-white/10 bg-card/40">
        <div className="size-12 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="size-6" aria-hidden="true" />
        </div>

        <p className="eyebrow justify-center mb-2">Proposta Comercial</p>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white">
          Proposta não localizada
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed">
          {slug ? (
            <>
              Não localizamos nenhuma proposta ativa associada ao identificador{" "}
              <code className="text-brand-accent font-mono bg-white/5 px-1.5 py-0.5 rounded">
                {slug}
              </code>
              . O link pode ter expirado ou sido digitado incorretamente.
            </>
          ) : (
            <>Nenhum identificador de proposta foi especificado na requisição.</>
          )}
        </p>

        <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
          Para solicitar uma nova via da proposta ou confirmar seu acesso, entre em contato com a
          equipe comercial da EPM DevTech.
        </p>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-3">
          <Button variant="primary" asChild size="sm">
            <Link to="/">
              <ArrowLeft className="size-3.5 mr-1.5" aria-hidden="true" />
              <span>Página inicial Master</span>
            </Link>
          </Button>

          <Button variant="secondary" asChild size="sm">
            <a href="mailto:elessandro@epmdevtech.com.br">
              <Mail className="size-3.5 mr-1.5" aria-hidden="true" />
              <span>Falar com a EPM DevTech</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
