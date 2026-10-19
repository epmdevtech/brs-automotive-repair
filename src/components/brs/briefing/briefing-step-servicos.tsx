import { BriefingDadosCompletos, ItemServico } from "@/lib/briefing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Clock, DollarSign } from "lucide-react";

interface StepServicosProps {
  data: Partial<BriefingDadosCompletos>;
  onChange: (updates: Partial<BriefingDadosCompletos>) => void;
  pendingFlags: Record<string, boolean>;
  onTogglePending: (field: string) => void;
}

export function StepServicos({ data, onChange }: StepServicosProps) {
  const itens = data.servicos?.itens || [];

  const updateServico = (index: number, updates: Partial<ItemServico>) => {
    const updated = [...itens];
    updated[index] = { ...updated[index], ...updates };
    onChange({
      servicos: {
        ...data.servicos,
        itens: updated,
      },
    });
  };

  const addServico = () => {
    const novoServico: ItemServico = {
      id: `serv-${Date.now()}`,
      nome: "",
      categoria: "Funilaria",
      descricao: "",
      duracaoMinutos: 60,
      profissionaisIds: [],
      exigeAvaliacaoPrevia: true,
      intervaloAposAtendimentoMinutos: 15,
      exibirValorNoSite: "sob_consulta",
      valorTexto: "Sob avaliação prévia",
      camposNicho: {
        modalidade_execucao: "no_box",
      },
    };
    onChange({
      servicos: {
        ...data.servicos,
        itens: [...itens, novoServico],
      },
    });
  };

  const removeServico = (index: number) => {
    if (itens.length <= 1) return;
    const updated = itens.filter((_, i) => i !== index);
    onChange({
      servicos: {
        ...data.servicos,
        itens: updated,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">4. Catálogo de Serviços e Reparações</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Especialidades oferecidas pela oficina, tempos estimados de execução, intervalos e
            exibição de valores.
          </p>
        </div>
        <Button
          type="button"
          onClick={addServico}
          variant="outline"
          size="sm"
          className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5 text-xs"
        >
          <Plus className="size-3.5" /> Adicionar Serviço
        </Button>
      </div>

      <div className="space-y-4">
        {itens.map((servico, idx) => (
          <div
            key={servico.id || idx}
            className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4 relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-semibold text-white">
                  {servico.nome || "Novo Serviço Automotivo"}
                </h4>
              </div>
              {itens.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeServico(idx)}
                  className="text-neutral-400 hover:text-red-400 p-1 rounded-md transition-colors"
                  title="Remover serviço"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Nome */}
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-neutral-300 font-medium">Nome do Serviço *</Label>
                <Input
                  value={servico.nome}
                  onChange={(e) => updateServico(idx, { nome: e.target.value })}
                  placeholder="Ex: Funilaria Estrutural e Alinhamento Técnico"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Categoria */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">Categoria</Label>
                <select
                  value={servico.categoria || "Geral"}
                  onChange={(e) => updateServico(idx, { categoria: e.target.value })}
                  className="w-full bg-neutral-900/80 border border-white/10 text-white text-xs h-9 rounded-md px-3"
                >
                  <option value="Funilaria">Funilaria</option>
                  <option value="Pintura">Pintura em Estufa</option>
                  <option value="Martelinho de Ouro">Martelinho de Ouro</option>
                  <option value="Estética Automotiva">Estética Automotiva</option>
                  <option value="Revisão Mecânica">Revisão Mecânica</option>
                  <option value="Auto Socorro">Auto Socorro / Guincho</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>

              {/* Duração em Minutos */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                  <Clock className="size-3 text-primary" /> Duração Estimada (min) *
                </Label>
                <Input
                  type="number"
                  min={5}
                  value={servico.duracaoMinutos}
                  onChange={(e) =>
                    updateServico(idx, { duracaoMinutos: Number(e.target.value) || 30 })
                  }
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Intervalo Pós-Atendimento */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">
                  Intervalo / Pausa Pós (min)
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={servico.intervaloAposAtendimentoMinutos || 0}
                  onChange={(e) =>
                    updateServico(idx, {
                      intervaloAposAtendimentoMinutos: Number(e.target.value) || 0,
                    })
                  }
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Modalidade de Execução */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">Modalidade</Label>
                <select
                  value={servico.camposNicho?.modalidade_execucao || "no_box"}
                  onChange={(e) =>
                    updateServico(idx, {
                      camposNicho: {
                        ...servico.camposNicho,
                        modalidade_execucao: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-neutral-900/80 border border-white/10 text-white text-xs h-9 rounded-md px-3"
                >
                  <option value="no_box">Presencial no Box</option>
                  <option value="leva_e_traz">Com Serviço de Guincho</option>
                  <option value="socorro_externo">Socorro Externo / No Local</option>
                </select>
              </div>

              {/* Exibição de Preço */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                  <DollarSign className="size-3 text-primary" /> Regra de Preço no Site
                </Label>
                <select
                  value={servico.exibirValorNoSite}
                  onChange={(e) =>
                    updateServico(idx, {
                      exibirValorNoSite: e.target.value as
                        "exibir" | "a_partir_de" | "sob_consulta",
                    })
                  }
                  className="w-full bg-neutral-900/80 border border-white/10 text-white text-xs h-9 rounded-md px-3"
                >
                  <option value="sob_consulta">Sob Consulta / Orçamento Prévia</option>
                  <option value="a_partir_de">A Partir De (Faixa de Preço)</option>
                  <option value="exibir">Preço Fixo Tabelado</option>
                </select>
              </div>

              {/* Texto de Valor */}
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-neutral-300 font-medium">
                  Descrição do Preço / Condição
                </Label>
                <Input
                  value={servico.valorTexto || ""}
                  onChange={(e) => updateServico(idx, { valorTexto: e.target.value })}
                  placeholder="Ex: Sob avaliação técnica prévia após análise da lataria"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Descrição Detalhada */}
              <div className="space-y-1.5 md:col-span-3">
                <Label className="text-xs text-neutral-300 font-medium">
                  Descrição Técnica para o Cliente
                </Label>
                <Input
                  value={servico.descricao || ""}
                  onChange={(e) => updateServico(idx, { descricao: e.target.value })}
                  placeholder="Explicação de como o serviço é realizado, tecnologias utilizadas e garantias..."
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={servico.exigeAvaliacaoPrevia}
                  onChange={(e) => updateServico(idx, { exigeAvaliacaoPrevia: e.target.checked })}
                  className="accent-primary size-4"
                />
                <span>
                  Exige avaliação técnica / triagem de fotos prévia (não fecha valor cego)
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
