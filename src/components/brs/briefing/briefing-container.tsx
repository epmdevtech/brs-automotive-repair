import { useEffect, useState, useRef } from "react";
import {
  BriefingDadosCompletos,
  masterDefaultBriefing,
  loadBriefingDraft,
  saveBriefingDraft,
  clearBriefingDraft,
} from "@/lib/briefing";
import { BriefingStepper, StepInfo } from "./briefing-stepper";
import { StepContratante } from "./briefing-step-contratante";
import { StepIdentidade } from "./briefing-step-identidade";
import { StepEquipe } from "./briefing-step-equipe";
import { StepServicos } from "./briefing-step-servicos";
import { StepAgenda } from "./briefing-step-agenda";
import { StepUnidades } from "./briefing-step-unidades";
import { StepConteudo } from "./briefing-step-conteudo";
import { StepTecnico } from "./briefing-step-tecnico";
import { StepRevisao } from "./briefing-step-revisao";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Upload,
  FileCheck2,
  Trash2,
  CheckCircle,
} from "lucide-react";

const STEPS: StepInfo[] = [
  { number: 1, label: "Contratante e Dados Fiscais", shortLabel: "Contratante" },
  { number: 2, label: "Identidade Visual & Contraste", shortLabel: "Identidade" },
  { number: 3, label: "Equipe e Especialistas", shortLabel: "Equipe" },
  { number: 4, label: "Catálogo de Serviços", shortLabel: "Serviços" },
  { number: 5, label: "Regras de Agendamento de Box", shortLabel: "Agenda" },
  { number: 6, label: "Unidades e Oficinas Físicas", shortLabel: "Unidades" },
  { number: 7, label: "Conteúdo e Diferenciais", shortLabel: "Conteúdo" },
  { number: 8, label: "Infraestrutura Técnica e Prazos", shortLabel: "Técnico" },
  { number: 9, label: "Revisão e Exportação de Artefatos", shortLabel: "Revisão" },
];

export function BriefingContainer() {
  const [data, setData] = useState<Partial<BriefingDadosCompletos>>(() => loadBriefingDraft());
  const [activeStep, setActiveStep] = useState(1);
  const [pendingFlags, setPendingFlags] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Autosave no LocalStorage
  useEffect(() => {
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      saveBriefingDraft(data);
      setSaveStatus("saved");
    }, 400);
    return () => clearTimeout(timer);
  }, [data]);

  const handleChange = (updates: Partial<BriefingDadosCompletos>) => {
    setData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleTogglePending = (field: string) => {
    setPendingFlags((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Restaurar dados canônicos da Master
  const handleRestoreMasterData = () => {
    if (
      window.confirm("Deseja restaurar os dados padrão oficiais da Master Chapeação e Pinturas?")
    ) {
      setData(masterDefaultBriefing);
      setPendingFlags({});
      setActiveStep(1);
    }
  };

  // Limpar rascunho
  const handleClearDraft = () => {
    if (
      window.confirm("Deseja limpar todos os dados do rascunho e iniciar um briefing em branco?")
    ) {
      clearBriefingDraft();
      setData({
        nicho: "oficina_automotiva",
        versao: "1.0",
        contratante: {
          razao_social: "",
          cnpj: "",
          endereco_faturamento: "",
          email_financeiro: "",
          responsavel_legal: "",
          contato_operacional: "",
          aprovador_final: "",
        },
        identidade_visual: {
          logo_arquivo_id: "logo.png",
          cor_primaria_hex: "#D4AF37",
          cor_secundaria_hex: "#1C1F26",
          cor_fundo_hex: "#0B0D10",
        },
        equipe: { membros: [] },
        servicos: { itens: [] },
        regras_agenda: {
          antecedencia_minima_horas: 4,
          antecedencia_maxima_dias: 30,
          prazo_cancelamento_horas: 12,
          tipo_confirmacao: "manual",
          limite_agendamentos_simultaneos: 3,
          canais_aviso_novo_agendamento: ["whatsapp", "email"],
        },
        unidades: { locais: [] },
        conteudo: {},
        tecnico: {},
        prazos: {},
        pendencias: {},
      });
      setActiveStep(1);
    }
  };

  // Importar JSON externo
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.contratante || parsed.business_name) {
          setData(parsed);
          alert("Briefing importado com sucesso!");
        } else {
          alert("Arquivo JSON inválido. Estrutura de briefing não reconhecida.");
        }
      } catch {
        alert("Erro ao ler o arquivo JSON.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Calcular passos concluídos
  const completedSteps: number[] = [];
  if (data.contratante?.razao_social && data.contratante?.cnpj) completedSteps.push(1);
  if (data.identidade_visual?.cor_primaria_hex) completedSteps.push(2);
  if ((data.equipe?.membros?.length || 0) > 0) completedSteps.push(3);
  if ((data.servicos?.itens?.length || 0) > 0) completedSteps.push(4);
  if (data.regras_agenda?.antecedencia_minima_horas !== undefined) completedSteps.push(5);
  if ((data.unidades?.locais?.length || 0) > 0) completedSteps.push(6);
  if (data.conteudo?.principais_diferenciais) completedSteps.push(7);
  if (data.tecnico?.dominio_personalizado || data.prazos?.data_desejada_lancamento)
    completedSteps.push(8);
  if (completedSteps.length >= 6) completedSteps.push(9);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* CABEÇALHO DO PORTAL DE BRIEFING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <FileCheck2 className="size-4" />
            <span>Portal de Engenharia de Briefings EPM DEVTECH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
            Execução de Briefing Técnico
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Preenchimento guiado dos 9 módulos estruturais para implantação de presença digital e
            agendamento automotivo.
          </p>
        </div>

        {/* AÇÕES DE CABEÇALHO */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status do Autosave */}
          <span className="text-[11px] text-neutral-400 flex items-center gap-1.5 mr-2 font-mono">
            {saveStatus === "saved" ? (
              <>
                <CheckCircle className="size-3 text-emerald-400" /> Rascunho salvo
              </>
            ) : (
              "Salvando..."
            )}
          </span>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJson}
            accept=".json"
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800 gap-1"
            title="Importar briefing.json existente"
          >
            <Upload className="size-3.5" /> Importar JSON
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRestoreMasterData}
            className="text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1"
            title="Carregar dados canônicos da Master Chapeação"
          >
            <RotateCcw className="size-3.5" /> Restaurar Master
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearDraft}
            className="text-xs border-white/10 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 p-2"
            title="Limpar rascunho"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* STEPPER DINÂMICO */}
      <BriefingStepper
        steps={STEPS}
        activeStep={activeStep}
        onSelectStep={setActiveStep}
        completedSteps={completedSteps}
      />

      {/* CONTEÚDO DA ETAPA ATIVA */}
      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
        {activeStep === 1 && (
          <StepContratante
            data={data}
            onChange={handleChange}
            pendingFlags={pendingFlags}
            onTogglePending={handleTogglePending}
          />
        )}

        {activeStep === 2 && (
          <StepIdentidade
            data={data}
            onChange={handleChange}
            pendingFlags={pendingFlags}
            onTogglePending={handleTogglePending}
          />
        )}

        {activeStep === 3 && (
          <StepEquipe
            data={data}
            onChange={handleChange}
            pendingFlags={pendingFlags}
            onTogglePending={handleTogglePending}
          />
        )}

        {activeStep === 4 && (
          <StepServicos
            data={data}
            onChange={handleChange}
            pendingFlags={pendingFlags}
            onTogglePending={handleTogglePending}
          />
        )}

        {activeStep === 5 && (
          <StepAgenda
            data={data}
            onChange={handleChange}
            pendingFlags={pendingFlags}
            onTogglePending={handleTogglePending}
          />
        )}

        {activeStep === 6 && (
          <StepUnidades
            data={data}
            onChange={handleChange}
            pendingFlags={pendingFlags}
            onTogglePending={handleTogglePending}
          />
        )}

        {activeStep === 7 && (
          <StepConteudo
            data={data}
            onChange={handleChange}
            pendingFlags={pendingFlags}
            onTogglePending={handleTogglePending}
          />
        )}

        {activeStep === 8 && (
          <StepTecnico
            data={data}
            onChange={handleChange}
            pendingFlags={pendingFlags}
            onTogglePending={handleTogglePending}
          />
        )}

        {activeStep === 9 && <StepRevisao data={data} pendingFlags={pendingFlags} />}
      </div>

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
          disabled={activeStep === 1}
          className="border-white/10 text-white hover:bg-white/10 text-xs gap-1.5"
        >
          <ArrowLeft className="size-3.5" /> Voltar
        </Button>

        <div className="flex items-center gap-2">
          {activeStep < STEPS.length ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setActiveStep((prev) => Math.min(STEPS.length, prev + 1))}
              className="text-xs gap-1.5 font-semibold"
            >
              Avançar para Etapa {activeStep + 1} <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={() => setActiveStep(1)}
              className="text-xs gap-1.5 font-semibold"
            >
              Revisar do Início <RotateCcw className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
