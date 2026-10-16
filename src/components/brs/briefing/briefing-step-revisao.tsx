import { useState } from "react";
import {
  BriefingCompletoSchema,
  BriefingDadosCompletos,
  buildBookingConfig,
  generateBriefingSummaryMessage,
} from "@/lib/briefing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Send,
  FileCode,
  Sparkles,
} from "lucide-react";

interface StepRevisaoProps {
  data: Partial<BriefingDadosCompletos>;
  pendingFlags: Record<string, boolean>;
}

export function StepRevisao({ data, pendingFlags }: StepRevisaoProps) {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Validação Zod completa
  const validationResult = BriefingCompletoSchema.safeParse(data);
  const isValid = validationResult.success;
  const errors = !validationResult.success ? validationResult.error.format() : null;

  const pendenciasCount = Object.values(pendingFlags).filter(Boolean).length;
  const bookingConfig = buildBookingConfig(data, data.contratante?.razao_social);

  // Download do briefing-completo.json
  const handleDownloadBriefingJson = () => {
    const payload = {
      ...data,
      pendencias: pendingFlags,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `briefing-completo-${(data.contratante?.razao_social || "cliente")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download do booking-config.json
  const handleDownloadBookingConfig = () => {
    const blob = new Blob([JSON.stringify(bookingConfig, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-config-${(data.contratante?.razao_social || "cliente")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copiar JSON
  const handleCopyJson = async () => {
    const payload = {
      ...data,
      pendencias: pendingFlags,
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  // Copiar Resumo Formatado
  const handleCopySummary = async () => {
    const message = generateBriefingSummaryMessage(data, pendenciasCount);
    await navigator.clipboard.writeText(message);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-semibold text-white">9. Validação, Revisão & Exportação</h3>
        <p className="text-xs text-neutral-400 mt-1">
          Auditoria final de integridade de dados, conferência de pendências e geração dos artefatos
          estruturados.
        </p>
      </div>

      {/* PAINEL DE STATUS DA AUDITORIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Conformidade Estrutural (Zod)
            </span>
            {isValid ? (
              <Badge className="bg-emerald-500/10 border-emerald-500/40 text-emerald-400 text-xs">
                <CheckCircle2 className="size-3.5 mr-1" /> 100% Válido
              </Badge>
            ) : (
              <Badge className="bg-amber-500/10 border-amber-500/40 text-amber-400 text-xs">
                <AlertTriangle className="size-3.5 mr-1" /> Campos Incompletos
              </Badge>
            )}
          </div>
          <p className="text-xs text-neutral-400">
            {isValid
              ? "Todos os esquemas obrigatórios foram preenchidos corretamente e estão prontos para ingestão determinística."
              : "Existem campos recomendados ou obrigatórios pendentes de preenchimento antes da homologação final."}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Registro de Pendências
            </span>
            <Badge
              className={
                pendenciasCount === 0
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 text-xs"
                  : "bg-blue-500/10 border-blue-500/40 text-blue-400 text-xs"
              }
            >
              {pendenciasCount === 0 ? "Zero Pendências" : `${pendenciasCount} Pendência(s)`}
            </Badge>
          </div>
          <p className="text-xs text-neutral-400">
            {pendenciasCount === 0
              ? "Nenhum campo foi marcado como 'Tenho pendência'. O projeto tem dados completos para publicação."
              : "Campos com pendência serão tratados na interface com fallback elegante sem interromper a publicação."}
          </p>
        </div>
      </div>

      {/* RESUMO DOS DADOS INGESTADOS */}
      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/40 space-y-4">
        <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="size-4 text-primary" /> Resumo do Pacote de Briefing
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-neutral-950/60 border border-white/5">
            <span className="text-neutral-400 block text-[11px]">Empresa</span>
            <span className="font-semibold text-white truncate block mt-0.5">
              {data.contratante?.razao_social || "Não informada"}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/60 border border-white/5">
            <span className="text-neutral-400 block text-[11px]">CNPJ</span>
            <span className="font-semibold text-white truncate block mt-0.5 font-mono">
              {data.contratante?.cnpj || "Pendente"}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/60 border border-white/5">
            <span className="text-neutral-400 block text-[11px]">Serviços</span>
            <span className="font-semibold text-white block mt-0.5">
              {data.servicos?.itens?.length || 0} cadastrados
            </span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/60 border border-white/5">
            <span className="text-neutral-400 block text-[11px]">Equipe</span>
            <span className="font-semibold text-white block mt-0.5">
              {data.equipe?.membros?.length || 0} profissionais
            </span>
          </div>
        </div>
      </div>

      {/* AÇÕES DE EXPORTAÇÃO DETERMINÍSTICA */}
      <div className="p-5 rounded-xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileCode className="size-4 text-primary" /> Exportar Artefatos Canônicos EPM DEVTECH
          </h4>
          <p className="text-xs text-neutral-300 mt-1">
            Gere os arquivos estruturados em conformidade com o motor de briefings e agendamento da
            EPM DEVTECH.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Download briefing-completo.json */}
          <Button
            type="button"
            onClick={handleDownloadBriefingJson}
            variant="primary"
            size="sm"
            className="text-xs gap-1.5 font-semibold"
          >
            <Download className="size-3.5" /> Baixar briefing-completo.json
          </Button>

          {/* Download booking-config.json */}
          <Button
            type="button"
            onClick={handleDownloadBookingConfig}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 text-xs gap-1.5"
          >
            <Download className="size-3.5" /> Baixar booking-config.json
          </Button>

          {/* Copiar JSON */}
          <Button
            type="button"
            onClick={handleCopyJson}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 text-xs gap-1.5"
          >
            {copiedJson ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copiedJson ? "JSON Copiado!" : "Copiar JSON Completo"}
          </Button>

          {/* Copiar Resumo para Atendimento */}
          <Button
            type="button"
            onClick={handleCopySummary}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 text-xs gap-1.5"
          >
            {copiedSummary ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Send className="size-3.5 text-primary" />
            )}
            {copiedSummary ? "Resumo Copiado!" : "Copiar Resumo para WhatsApp"}
          </Button>
        </div>
      </div>
    </div>
  );
}
