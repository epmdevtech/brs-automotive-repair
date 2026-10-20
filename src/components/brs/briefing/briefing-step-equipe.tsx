import { BriefingDadosCompletos, MembroEquipe } from "@/lib/briefing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, UserCheck, Wrench } from "lucide-react";

interface StepEquipeProps {
  data: Partial<BriefingDadosCompletos>;
  onChange: (updates: Partial<BriefingDadosCompletos>) => void;
  pendingFlags: Record<string, boolean>;
  onTogglePending: (field: string) => void;
}

export function StepEquipe({ data, onChange }: StepEquipeProps) {
  const membros = data.equipe?.membros || [];

  const updateMembro = (index: number, updates: Partial<MembroEquipe>) => {
    const updated = [...membros];
    updated[index] = { ...updated[index], ...updates };
    onChange({
      equipe: {
        membros: updated,
      },
    });
  };

  const addMembro = () => {
    const novoMembro: MembroEquipe = {
      id: `membro-${Date.now()}`,
      nome: "",
      miniBio: "",
      formacao: "",
      camposNicho: {
        especialidade_tecnica: "Especialista em Reparação Automotiva",
        certificacoes_fabricante: "",
      },
      unidadesIds: [],
      diasHorarios: "Segunda a Sexta, 08h às 18h",
      aceitaAgendamentoOnline: true,
      autorizacaoUsoImagem: true,
    };
    onChange({
      equipe: {
        membros: [...membros, novoMembro],
      },
    });
  };

  const removeMembro = (index: number) => {
    if (membros.length <= 1) return;
    const updated = membros.filter((_, i) => i !== index);
    onChange({
      equipe: {
        membros: updated,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">3. Equipe Técnica e Especialistas</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Profissionais responsáveis pelos reparos, especialidades automotivas e regras de
            agendamento.
          </p>
        </div>
        <Button
          type="button"
          onClick={addMembro}
          variant="outline"
          size="sm"
          className="border-primary/40 text-brand-accent hover:bg-primary/10 gap-1.5 text-xs"
        >
          <Plus className="size-3.5" /> Adicionar Profissional
        </Button>
      </div>

      <div className="space-y-4">
        {membros.map((membro, idx) => (
          <div
            key={membro.id || idx}
            className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4 relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 text-brand-accent flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-semibold text-white">
                  {membro.nome || "Novo Profissional"}
                </h4>
              </div>
              {membros.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMembro(idx)}
                  className="text-neutral-400 hover:text-red-400 p-1 rounded-md transition-colors"
                  title="Remover profissional"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">
                  Nome do Profissional *
                </Label>
                <Input
                  value={membro.nome}
                  onChange={(e) => updateMembro(idx, { nome: e.target.value })}
                  placeholder="Ex: Equipe Técnica Master"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Especialidade Automotiva */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                  <Wrench className="size-3 text-brand-accent" /> Especialidade Técnica Automotiva
                </Label>
                <Input
                  value={membro.camposNicho?.especialidade_tecnica || ""}
                  onChange={(e) =>
                    updateMembro(idx, {
                      camposNicho: {
                        ...membro.camposNicho,
                        especialidade_tecnica: e.target.value,
                      },
                    })
                  }
                  placeholder="Ex: Funilaria Estrutural e Pintura em Estufa"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Certificações */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">
                  Certificações Técnicas (SENAI, Montadoras, Bosch)
                </Label>
                <Input
                  value={membro.camposNicho?.certificacoes_fabricante || ""}
                  onChange={(e) =>
                    updateMembro(idx, {
                      camposNicho: {
                        ...membro.camposNicho,
                        certificacoes_fabricante: e.target.value,
                      },
                    })
                  }
                  placeholder="Ex: Certificação em Colorimetria e Alinhamento Técnico"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Dias e Horários */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">
                  Dias e Horários de Atendimento
                </Label>
                <Input
                  value={membro.diasHorarios || ""}
                  onChange={(e) => updateMembro(idx, { diasHorarios: e.target.value })}
                  placeholder="Segunda a Sexta, 08h às 18h"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Mini Bio */}
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-neutral-300 font-medium">
                  Mini Biografia / Resumo Profissional
                </Label>
                <Input
                  value={membro.miniBio || ""}
                  onChange={(e) => updateMembro(idx, { miniBio: e.target.value })}
                  placeholder="Resumo da trajetória e experiência do profissional na oficina..."
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={membro.aceitaAgendamentoOnline}
                  onChange={(e) => updateMembro(idx, { aceitaAgendamentoOnline: e.target.checked })}
                  className="accent-primary size-4"
                />
                <span className="flex items-center gap-1">
                  <UserCheck className="size-3.5 text-brand-accent" /> Habilitado para agendamento
                  online
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={membro.autorizacaoUsoImagem}
                  onChange={(e) => updateMembro(idx, { autorizacaoUsoImagem: e.target.checked })}
                  className="accent-primary size-4"
                />
                <span>Autorização para exibição de foto no website</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
