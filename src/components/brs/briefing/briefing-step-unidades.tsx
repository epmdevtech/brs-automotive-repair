import { BriefingDadosCompletos, UnidadeAtendimento } from "@/lib/briefing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MapPin, Accessibility } from "lucide-react";

interface StepUnidadesProps {
  data: Partial<BriefingDadosCompletos>;
  onChange: (updates: Partial<BriefingDadosCompletos>) => void;
  pendingFlags: Record<string, boolean>;
  onTogglePending: (field: string) => void;
}

export function StepUnidades({ data, onChange }: StepUnidadesProps) {
  const locais = data.unidades?.locais || [];

  const updateUnidade = (index: number, updates: Partial<UnidadeAtendimento>) => {
    const updated = [...locais];
    updated[index] = { ...updated[index], ...updates };
    onChange({
      unidades: {
        ...data.unidades,
        locais: updated,
      },
    });
  };

  const addUnidade = () => {
    const novaUnidade: UnidadeAtendimento = {
      id: `unidade-${Date.now()}`,
      nomeIdentificador: "Nova Unidade / Filial",
      enderecoCompleto: "",
      telefone: "",
      whatsapp: "",
      linkMapa: "",
      estacionamento: "Pátio seguro para veículos",
      acessibilidadePcd: true,
      fotosArquivosIds: [],
      camposNicho: {},
    };
    onChange({
      unidades: {
        ...data.unidades,
        locais: [...locais, novaUnidade],
      },
    });
  };

  const removeUnidade = (index: number) => {
    if (locais.length <= 1) return;
    const updated = locais.filter((_, i) => i !== index);
    onChange({
      unidades: {
        ...data.unidades,
        locais: updated,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">6. Unidades Físicas e Instalações</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Bases operacionais da oficina, endereço para recebimento de veículos, estacionamento e
            acessibilidade.
          </p>
        </div>
        <Button
          type="button"
          onClick={addUnidade}
          variant="outline"
          size="sm"
          className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5 text-xs"
        >
          <Plus className="size-3.5" /> Adicionar Unidade
        </Button>
      </div>

      <div className="space-y-4">
        {locais.map((unidade, idx) => (
          <div
            key={unidade.id || idx}
            className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4 relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-semibold text-white">
                  {unidade.nomeIdentificador || "Unidade Operacional"}
                </h4>
              </div>
              {locais.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUnidade(idx)}
                  className="text-neutral-400 hover:text-red-400 p-1 rounded-md transition-colors"
                  title="Remover unidade"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Identificação */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">
                  Nome Identificador da Unidade *
                </Label>
                <Input
                  value={unidade.nomeIdentificador}
                  onChange={(e) => updateUnidade(idx, { nomeIdentificador: e.target.value })}
                  placeholder="Ex: Master Toledo - Centro"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">Telefone da Unidade</Label>
                <Input
                  value={unidade.telefone || ""}
                  onChange={(e) => updateUnidade(idx, { telefone: e.target.value })}
                  placeholder="(45) 99954-5442"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Endereço Completo */}
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                  <MapPin className="size-3 text-primary" /> Endereço Completo de Atendimento *
                </Label>
                <Input
                  value={unidade.enderecoCompleto}
                  onChange={(e) => updateUnidade(idx, { enderecoCompleto: e.target.value })}
                  placeholder="Av. Maripá, 4138 - Centro, Toledo - PR, 85901-000"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Estacionamento */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">
                  Estacionamento e Segurança
                </Label>
                <Input
                  value={unidade.estacionamento || ""}
                  onChange={(e) => updateUnidade(idx, { estacionamento: e.target.value })}
                  placeholder="Ex: Pátio fechado monitorado para veículos de clientes"
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>

              {/* Link Google Maps */}
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300 font-medium">Link do Google Maps</Label>
                <Input
                  value={unidade.linkMapa || ""}
                  onChange={(e) => updateUnidade(idx, { linkMapa: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="bg-neutral-900/80 border-white/10 text-white text-xs h-9"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={unidade.acessibilidadePcd}
                  onChange={(e) => updateUnidade(idx, { acessibilidadePcd: e.target.checked })}
                  className="accent-primary size-4"
                />
                <span className="flex items-center gap-1">
                  <Accessibility className="size-3.5 text-primary" /> Possui acessibilidade para
                  pessoas com deficiência (PCD)
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
