import { useState } from "react";
import { type CommercialProposal, validateProposalCompleteness } from "@/lib/proposta";
import { ProposalHero } from "./proposal-hero";
import { ProposalNav } from "./proposal-nav";
import { ProposalOpportunity } from "./proposal-opportunity";
import { ProposalSolution } from "./proposal-solution";
import { ProposalScope } from "./proposal-scope";
import { ProposalInvestmentSection } from "./proposal-investment";
import { ProposalConditions } from "./proposal-conditions";
import { ProposalTimeline } from "./proposal-timeline";
import { ProposalResponsibilities } from "./proposal-responsibilities";
import { ProposalFaq } from "./proposal-faq";
import { ProposalAcceptance } from "./proposal-acceptance";

// Componentes Modulares EPM DevTech (SPEC-028)
import { ProposalModulesCatalog } from "./proposal-modules-catalog";
import { ProposalComparisonMatrix } from "./proposal-comparison-matrix";
import { ProposalBundles } from "./proposal-bundles";
import { ProposalRecurringCosts } from "./proposal-recurring-costs";
import { ProposalExecutionSteps } from "./proposal-execution-steps";
import { ProposalModularAcceptance } from "./proposal-modular-acceptance";

import { AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface ProposalViewProps {
  proposal: CommercialProposal;
}

export function ProposalView({ proposal }: ProposalViewProps) {
  const validation = validateProposalCompleteness(proposal);

  // Estado interativo de módulos selecionados para propostas modulares
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(() => {
    if (proposal.modulesCatalog) {
      const recommended = proposal.modulesCatalog.filter((m) => m.recommended).map((m) => m.id);
      if (recommended.length > 0) return recommended;
      return proposal.modulesCatalog.slice(0, 2).map((m) => m.id);
    }
    return [];
  });

  const handleToggleModule = (moduleId: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId],
    );
  };

  const handleSelectBundle = (moduleIds: string[]) => {
    setSelectedModuleIds(moduleIds);
  };

  // Se a proposta for rascunho com pendências comerciais, bloqueia exibição para o cliente final
  if (!validation.isValid && proposal.status === "draft") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-24 px-4 bg-background">
        <div className="max-w-lg w-full text-center p-8 rounded-xl border border-primary/30 bg-primary/5">
          <div className="size-12 rounded-full bg-primary/10 text-brand-accent flex items-center justify-center mx-auto mb-4">
            <Clock className="size-6" aria-hidden="true" />
          </div>

          <p className="eyebrow justify-center mb-2">Ambiente de Elaboração</p>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white">
            Proposta em Configuração Comercial
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Esta proposta comercial para <strong>{proposal.companyName || "o cliente"}</strong> está
            em fase de estruturação pela equipe da EPM DevTech e contém pendências de preenchimento
            comercial obrigatórias antes da disponibilização pública.
          </p>

          <div className="mt-6 p-4 rounded-lg bg-neutral-950 border border-white/10 text-left text-xs font-mono text-neutral-400 max-h-40 overflow-y-auto">
            <p className="text-brand-accent font-semibold mb-2">Campos / Validações pendentes:</p>
            <ul className="list-disc list-inside space-y-1">
              {validation.missingFields.map((f, i) => (
                <li key={`m-${i}`}>Campo obrigatório: {f}</li>
              ))}
              {validation.errors.map((e, i) => (
                <li key={`e-${i}`} className="text-red-400">
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-center">
            <Button variant="secondary" asChild size="sm">
              <Link to="/">Retornar à página inicial</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Se a proposta expirou
  if (proposal.status === "expired") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-24 px-4 bg-background">
        <div className="max-w-md w-full text-center p-8 rounded-xl border border-white/10 bg-card/40">
          <div className="size-12 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </div>

          <h1 className="text-xl font-display font-semibold text-white">
            Proposta Comercial Expirada
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            O período de validade desta proposta expirou em {proposal.validUntil}. Entre em contato
            com a EPM DevTech para obter uma proposta atualizada.
          </p>

          <div className="mt-6">
            <Button variant="primary" asChild size="sm">
              <a href="mailto:elessandro@epmdevtech.com.br">Solicitar Renovação da Proposta</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // PROPOSTA MODULAR (SPEC-028)
  if (proposal.isModularPortfolio) {
    return (
      <div className="proposal-experience">
        <ProposalHero proposal={proposal} />
        <ProposalNav isModular={true} />

        {/* Cenário & Oportunidade */}
        <ProposalOpportunity proposal={proposal} />

        {/* Seção C: Catálogo de Módulos com Seletor Interativo */}
        <ProposalModulesCatalog
          modules={proposal.modulesCatalog || []}
          selectedModuleIds={selectedModuleIds}
          onToggleModule={handleToggleModule}
          companyName={proposal.companyName}
        />

        {/* Seção D: Matriz Comparativa de Módulos */}
        <ProposalComparisonMatrix modules={proposal.modulesCatalog || []} />

        {/* Seção E: 5 Combinações / Pacotes Recomendados */}
        <ProposalBundles
          bundles={proposal.bundles || []}
          modules={proposal.modulesCatalog || []}
          selectedModuleIds={selectedModuleIds}
          onSelectBundle={handleSelectBundle}
        />

        {/* Seção F: Custos Recorrentes & Serviços de Terceiros */}
        <ProposalRecurringCosts recurringCosts={proposal.recurringCosts || []} />

        {/* Seção G: Condições Comerciais & Responsabilidades */}
        <ProposalConditions proposal={proposal} />
        <ProposalResponsibilities proposal={proposal} />

        {/* Seção H: Ciclo de Execução em 9 Etapas */}
        <ProposalExecutionSteps steps={proposal.executionSteps || []} />

        {/* Seção I: Perguntas Frequentes */}
        <ProposalFaq proposal={proposal} />

        {/* Seção J: Resumo Dinâmico & Manifestação de Interesse */}
        <ProposalModularAcceptance
          proposal={proposal}
          selectedModuleIds={selectedModuleIds}
          onToggleModule={handleToggleModule}
          onSelectBundle={handleSelectBundle}
        />

        {/* Rodapé Comercial Discreto da Proposta */}
        <footer className="py-8 border-t border-white/10 bg-neutral-950 text-center text-xs text-neutral-500">
          <div className="page-width flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>
              © {new Date().getFullYear()} EPM DevTech · Documento Comercial Exclusivo para{" "}
              {proposal.companyName}
            </span>
            <span className="font-mono text-[11px] text-neutral-600">
              Confidencialidade Comercial · Ref: {proposal.slug}
            </span>
          </div>
        </footer>
      </div>
    );
  }

  // PROPOSTA CLÁSSICA (legado/retrocompatível)
  const enabled = proposal.enabledSections || {};

  return (
    <div className="proposal-experience">
      <ProposalHero proposal={proposal} />
      <ProposalNav isModular={false} />

      {enabled.diagnosis !== false && <ProposalOpportunity proposal={proposal} />}
      {enabled.solution !== false && <ProposalSolution proposal={proposal} />}
      {enabled.scope !== false && <ProposalScope proposal={proposal} />}
      {enabled.investment !== false && <ProposalInvestmentSection proposal={proposal} />}
      {enabled.conditions !== false && <ProposalConditions proposal={proposal} />}
      {enabled.timeline !== false && <ProposalTimeline proposal={proposal} />}
      {enabled.responsibilities !== false && <ProposalResponsibilities proposal={proposal} />}
      {enabled.faq !== false && <ProposalFaq proposal={proposal} />}
      {enabled.cta !== false && <ProposalAcceptance proposal={proposal} />}

      {/* Rodapé Comercial Discreto da Proposta */}
      <footer className="py-8 border-t border-white/10 bg-neutral-950 text-center text-xs text-neutral-500">
        <div className="page-width flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()} EPM DevTech · Documento Comercial Exclusivo para{" "}
            {proposal.companyName}
          </span>
          <span className="font-mono text-[11px] text-neutral-600">
            Confidencialidade Comercial · Ref: {proposal.slug}
          </span>
        </div>
      </footer>
    </div>
  );
}
