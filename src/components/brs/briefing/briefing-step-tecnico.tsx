import { BriefingDadosCompletos } from "@/lib/briefing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Calendar } from "lucide-react";

interface StepTecnicoProps {
  data: Partial<BriefingDadosCompletos>;
  onChange: (updates: Partial<BriefingDadosCompletos>) => void;
  pendingFlags: Record<string, boolean>;
  onTogglePending: (field: string) => void;
}

export function StepTecnico({ data, onChange }: StepTecnicoProps) {
  const tec = data.tecnico || {
    dominio_personalizado: "",
    onde_dominio_registrado: "",
    sistema_gestao_atual: "",
  };

  const prazos = data.prazos || {
    data_desejada_lancamento: "",
  };

  const updateTecnico = (field: keyof typeof tec, value: string) => {
    onChange({
      tecnico: {
        ...tec,
        [field]: value,
      },
    });
  };

  const updatePrazos = (field: keyof typeof prazos, value: string) => {
    onChange({
      prazos: {
        ...prazos,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-semibold text-white">8. Infraestrutura Técnica e Cronograma</h3>
        <p className="text-xs text-neutral-400 mt-1">
          Domínio web, provedor de registro, sistema atual de gestão e data planejada para
          implantação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Domínio Personalizado */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
            <Globe className="size-3 text-primary" /> Domínio Próprio Pretendido
          </Label>
          <Input
            value={tec.dominio_personalizado || ""}
            onChange={(e) => updateTecnico("dominio_personalizado", e.target.value)}
            placeholder="Ex: brsreparacoes.com.br"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10 font-mono"
          />
        </div>

        {/* Onde o Domínio Está Registrado */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">
            Onde o Domínio foi Registrado?
          </Label>
          <Input
            value={tec.onde_dominio_registrado || ""}
            onChange={(e) => updateTecnico("onde_dominio_registrado", e.target.value)}
            placeholder="Ex: Registro.br / GoDaddy / Hostgator / Não registrado ainda"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Sistema de Gestão Atual */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">
            Sistema Atual de Gestão / ERP
          </Label>
          <Input
            value={tec.sistema_gestao_atual || ""}
            onChange={(e) => updateTecnico("sistema_gestao_atual", e.target.value)}
            placeholder="Ex: Ultracar, Oficina Web, Planilhas Excel ou WhatsApp"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Data Desejada de Lançamento */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
            <Calendar className="size-3 text-primary" /> Previsão Desejada de Publicação
          </Label>
          <Input
            value={prazos.data_desejada_lancamento || ""}
            onChange={(e) => updatePrazos("data_desejada_lancamento", e.target.value)}
            placeholder="Ex: Imediato / Até final do mês"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>
      </div>
    </div>
  );
}
