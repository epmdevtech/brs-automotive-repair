import { BriefingDadosCompletos } from "@/lib/briefing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Clock, ShieldCheck, Truck } from "lucide-react";

interface StepAgendaProps {
  data: Partial<BriefingDadosCompletos>;
  onChange: (updates: Partial<BriefingDadosCompletos>) => void;
  pendingFlags: Record<string, boolean>;
  onTogglePending: (field: string) => void;
}

export function StepAgenda({ data, onChange }: StepAgendaProps) {
  const reg = data.regras_agenda || {
    antecedencia_minima_horas: 4,
    antecedencia_maxima_dias: 30,
    prazo_cancelamento_horas: 12,
    tipo_confirmacao: "manual",
    limite_agendamentos_simultaneos: 3,
    canais_aviso_novo_agendamento: ["whatsapp", "email"],
    camposNicho: {
      solicita_placa_modelo_reserva: true,
      atende_emergencia_guincho: false,
      oferece_leva_e_traz: true,
    },
  };

  const updateRegra = (field: string, value: unknown) => {
    onChange({
      regras_agenda: {
        ...reg,
        [field]: value,
      },
    });
  };

  const updateNicho = (field: string, value: unknown) => {
    onChange({
      regras_agenda: {
        ...reg,
        camposNicho: {
          ...reg.camposNicho,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-semibold text-white">
          5. Regras de Agendamento e Capacidade de Box
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          Configuração de janelas operacionais, antecedência de reservas e exigências de
          identificação veicular.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Antecedência Mínima */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
            <Clock className="size-3 text-primary" /> Antecedência Mínima (horas) *
          </Label>
          <Input
            type="number"
            min={0}
            value={reg.antecedencia_minima_horas}
            onChange={(e) => updateRegra("antecedencia_minima_horas", Number(e.target.value) || 0)}
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
          <span className="text-[11px] text-neutral-400">
            Tempo mínimo entre agendamento e chegada
          </span>
        </div>

        {/* Antecedência Máxima */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">
            Antecedência Máxima (dias) *
          </Label>
          <Input
            type="number"
            min={1}
            value={reg.antecedencia_maxima_dias}
            onChange={(e) => updateRegra("antecedencia_maxima_dias", Number(e.target.value) || 30)}
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
          <span className="text-[11px] text-neutral-400">
            Quantos dias à frente a agenda fica aberta
          </span>
        </div>

        {/* Prazo Cancelamento */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">
            Prazo Cancelamento sem Ônus (horas)
          </Label>
          <Input
            type="number"
            min={0}
            value={reg.prazo_cancelamento_horas}
            onChange={(e) => updateRegra("prazo_cancelamento_horas", Number(e.target.value) || 0)}
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
          <span className="text-[11px] text-neutral-400">
            Limite para cancelamento ou remarcação
          </span>
        </div>

        {/* Tipo de Confirmação */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">Fluxo de Confirmação</Label>
          <select
            value={reg.tipo_confirmacao}
            onChange={(e) => updateRegra("tipo_confirmacao", e.target.value)}
            className="w-full bg-neutral-900/60 border border-white/10 text-white text-xs h-10 rounded-md px-3"
          >
            <option value="manual">Manual (Oficina valida antes de confirmar)</option>
            <option value="automatica">Automática (Horário confirmado instantaneamente)</option>
          </select>
        </div>

        {/* Limite de Simultâneos */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">
            Capacidade de Boxes Simultâneos
          </Label>
          <Input
            type="number"
            min={1}
            value={reg.limite_agendamentos_simultaneos}
            onChange={(e) =>
              updateRegra("limite_agendamentos_simultaneos", Number(e.target.value) || 1)
            }
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
          <span className="text-[11px] text-neutral-400">
            Máximo de veículos atendidos no mesmo horário
          </span>
        </div>
      </div>

      {/* BLOCO DE REGRAS EXCLUSIVAS DO NICHO AUTOMOTIVO */}
      <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
          <Car className="size-4" />
          <span>Regras Específicas do Setor Automotivo (EPM Booking Auto)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-white/10 bg-neutral-900/50 cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={Boolean(reg.camposNicho?.solicita_placa_modelo_reserva)}
              onChange={(e) => updateNicho("solicita_placa_modelo_reserva", e.target.checked)}
              className="accent-primary size-4 mt-0.5"
            />
            <div>
              <span className="text-xs font-medium text-white block">
                Exigir Veículo na Reserva
              </span>
              <span className="text-[11px] text-neutral-400 leading-tight block mt-0.5">
                Obriga o cliente a informar Marca, Modelo, Ano/Placa e Sintoma antes de agendar.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-white/10 bg-neutral-900/50 cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={Boolean(reg.camposNicho?.oferece_leva_e_traz)}
              onChange={(e) => updateNicho("oferece_leva_e_traz", e.target.checked)}
              className="accent-primary size-4 mt-0.5"
            />
            <div>
              <span className="text-xs font-medium text-white block flex items-center gap-1.5">
                <Truck className="size-3.5 text-primary" /> Serviço de Guincho
              </span>
              <span className="text-[11px] text-neutral-400 leading-tight block mt-0.5">
                Habilita opção para retirada e entrega do veículo na residência/empresa em Toledo.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-white/10 bg-neutral-900/50 cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={Boolean(reg.camposNicho?.atende_emergencia_guincho)}
              onChange={(e) => updateNicho("atende_emergencia_guincho", e.target.checked)}
              className="accent-primary size-4 mt-0.5"
            />
            <div>
              <span className="text-xs font-medium text-white block flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" /> Auto Socorro / Guincho
              </span>
              <span className="text-[11px] text-neutral-400 leading-tight block mt-0.5">
                Habilita botão de emergência rápida para panes ou socorro imediato na via.
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
