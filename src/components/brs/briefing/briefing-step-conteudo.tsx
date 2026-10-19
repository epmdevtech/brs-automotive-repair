import { BriefingDadosCompletos } from "@/lib/briefing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StepConteudoProps {
  data: Partial<BriefingDadosCompletos>;
  onChange: (updates: Partial<BriefingDadosCompletos>) => void;
  pendingFlags: Record<string, boolean>;
  onTogglePending: (field: string) => void;
}

export function StepConteudo({ data, onChange }: StepConteudoProps) {
  const c = data.conteudo || {
    problema_atual: "",
    publico_alvo_jornada: "",
    objetivos_indicadores_sucesso: "",
    texto_sobre: "",
    principais_diferenciais: "",
    cidades_bairros_atendidos: "",
    link_google_meu_negocio: "",
    redes_sociais: "",
  };

  const updateConteudo = (field: keyof typeof c, value: string) => {
    onChange({
      conteudo: {
        ...c,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-semibold text-white">7. Conteúdo Institucional & Narrativa</h3>
        <p className="text-xs text-neutral-400 mt-1">
          Dores resolvidas, proposta de valor, história da marca e diferenciais de atendimento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Principais Diferenciais */}
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs text-neutral-300 font-medium">
            Principais Diferenciais Competitivos (Por que o cliente escolhe a oficina?)
          </Label>
          <Textarea
            value={c.principais_diferenciais || ""}
            onChange={(e) => updateConteudo("principais_diferenciais", e.target.value)}
            placeholder="Ex: Estufa pressurizada de alta tecnologia, colorimetria computadorizada precisa, atendimento Guincho..."
            className="bg-neutral-900/60 border-white/10 text-white text-xs min-h-[70px]"
          />
        </div>

        {/* Problema Atual / Dores do Cliente */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">
            Principal Dor / Problema do Cliente
          </Label>
          <Textarea
            value={c.problema_atual || ""}
            onChange={(e) => updateConteudo("problema_atual", e.target.value)}
            placeholder="Ex: Medo de perder a originalidade da pintura do veículo ou de orçamentos inflacionados após sinistro..."
            className="bg-neutral-900/60 border-white/10 text-white text-xs min-h-[70px]"
          />
        </div>

        {/* História e Sobre Nós */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">
            História da Oficina / Sobre Nós
          </Label>
          <Textarea
            value={c.texto_sobre || ""}
            onChange={(e) => updateConteudo("texto_sobre", e.target.value)}
            placeholder="Trajetória da oficina, experiência prática dos fundadores e compromisso técnico com a comunidade..."
            className="bg-neutral-900/60 border-white/10 text-white text-xs min-h-[70px]"
          />
        </div>

        {/* Cidades e Regiões Atendidas */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">
            Cidades / Regiões Atendidas
          </Label>
          <Input
            value={c.cidades_bairros_atendidos || ""}
            onChange={(e) => updateConteudo("cidades_bairros_atendidos", e.target.value)}
            placeholder="Ex: Toledo-PR e cidades da região Oeste Paranaense"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Redes Sociais */}
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300 font-medium">Redes Sociais Oficiais</Label>
          <Input
            value={c.redes_sociais || ""}
            onChange={(e) => updateConteudo("redes_sociais", e.target.value)}
            placeholder="Ex: Facebook: Master Chapeação e Pinturas"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>
      </div>
    </div>
  );
}
