import { BriefingDadosCompletos, evaluateWCAGContrast, getContrastRatio } from "@/lib/briefing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldAlert, Sparkles } from "lucide-react";

interface StepIdentidadeProps {
  data: Partial<BriefingDadosCompletos>;
  onChange: (updates: Partial<BriefingDadosCompletos>) => void;
  pendingFlags: Record<string, boolean>;
  onTogglePending: (field: string) => void;
}

export function StepIdentidade({
  data,
  onChange,
  pendingFlags,
  onTogglePending,
}: StepIdentidadeProps) {
  const idv = data.identidade_visual || {
    logo_arquivo_id: "logo.png",
    cor_primaria_hex: "#E01B24",
    cor_secundaria_hex: "#1C1F26",
    cor_fundo_hex: "#0B0D10",
    sites_referencia_positivos: "",
    sites_referencia_negativos: "",
    percepcao_desejada: "",
    tom_de_voz: "",
  };

  const updateIdv = (field: keyof typeof idv, value: string) => {
    onChange({
      identidade_visual: {
        ...idv,
        [field]: value,
      },
    });
  };

  // Cálculo de contraste WCAG entre Cor Primária e Cor de Fundo
  const bgHex = idv.cor_fundo_hex || "#0B0D10";
  const primaryHex = idv.cor_primaria_hex || "#E01B24";
  const contrastRatio = getContrastRatio(primaryHex, bgHex);
  const wcag = evaluateWCAGContrast(contrastRatio);

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-semibold text-white">2. Identidade Visual & Design Tokens</h3>
        <p className="text-xs text-neutral-400 mt-1">
          Definição da paleta cromática, conformidade de contraste WCAG 2.2, tipografia e diretrizes
          de marca.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Cor Primária */}
        <div className="space-y-1.5">
          <Label htmlFor="cor_primaria_hex" className="text-xs text-neutral-300 font-medium">
            Cor Primária (Hexadecimal) *
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={idv.cor_primaria_hex.startsWith("#") ? idv.cor_primaria_hex : "#E01B24"}
              onChange={(e) => updateIdv("cor_primaria_hex", e.target.value.toUpperCase())}
              className="size-10 rounded-lg cursor-pointer bg-neutral-900 border border-white/10 p-0.5"
            />
            <Input
              id="cor_primaria_hex"
              value={idv.cor_primaria_hex}
              onChange={(e) => updateIdv("cor_primaria_hex", e.target.value.toUpperCase())}
              placeholder="#E01B24"
              className="bg-neutral-900/60 border-white/10 text-white text-xs h-10 font-mono"
            />
          </div>
        </div>

        {/* Cor Secundária */}
        <div className="space-y-1.5">
          <Label htmlFor="cor_secundaria_hex" className="text-xs text-neutral-300 font-medium">
            Cor Secundária (Hexadecimal)
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={idv.cor_secundaria_hex?.startsWith("#") ? idv.cor_secundaria_hex : "#1C1F26"}
              onChange={(e) => updateIdv("cor_secundaria_hex", e.target.value.toUpperCase())}
              className="size-10 rounded-lg cursor-pointer bg-neutral-900 border border-white/10 p-0.5"
            />
            <Input
              id="cor_secundaria_hex"
              value={idv.cor_secundaria_hex || ""}
              onChange={(e) => updateIdv("cor_secundaria_hex", e.target.value.toUpperCase())}
              placeholder="#1C1F26"
              className="bg-neutral-900/60 border-white/10 text-white text-xs h-10 font-mono"
            />
          </div>
        </div>

        {/* Cor de Fundo */}
        <div className="space-y-1.5">
          <Label htmlFor="cor_fundo_hex" className="text-xs text-neutral-300 font-medium">
            Cor de Fundo Base (Hexadecimal)
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={idv.cor_fundo_hex?.startsWith("#") ? idv.cor_fundo_hex : "#0B0D10"}
              onChange={(e) => updateIdv("cor_fundo_hex", e.target.value.toUpperCase())}
              className="size-10 rounded-lg cursor-pointer bg-neutral-900 border border-white/10 p-0.5"
            />
            <Input
              id="cor_fundo_hex"
              value={idv.cor_fundo_hex || "#0B0D10"}
              onChange={(e) => updateIdv("cor_fundo_hex", e.target.value.toUpperCase())}
              placeholder="#0B0D10"
              className="bg-neutral-900/60 border-white/10 text-white text-xs h-10 font-mono"
            />
          </div>
        </div>
      </div>

      {/* PAINEL DE AUDITORIA DE CONTRASTE WCAG */}
      <div className="p-4 rounded-xl border border-white/10 bg-neutral-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand-accent" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Auditor de Contraste WCAG 2.2 em Tempo Real
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                wcag.passesNormalAA
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs"
                  : "border-primary/30 text-brand-accent bg-primary/10 text-xs"
              }
            >
              {wcag.passesNormalAA ? (
                <Check className="size-3 mr-1" />
              ) : (
                <ShieldAlert className="size-3 mr-1" />
              )}
              {contrastRatio}:1 {wcag.passesNormalAA ? "Passou (AA)" : "Atenção (Contraste Baixo)"}
            </Badge>
          </div>
        </div>

        {/* Amostra Visual */}
        <div
          className="p-4 rounded-lg flex items-center justify-between border border-white/5 transition-colors"
          style={{ backgroundColor: bgHex }}
        >
          <span style={{ color: primaryHex }} className="font-semibold text-sm">
            Texto Exemplo com Cor Primária ({primaryHex})
          </span>
          <span
            style={{ backgroundColor: primaryHex, color: bgHex }}
            className="text-xs font-bold px-3 py-1.5 rounded-md"
          >
            Botão CTA Amostra
          </span>
        </div>

        <p className="text-[11px] text-neutral-400 mt-2">
          As diretrizes WCAG 2.2 recomendam um índice mínimo de 4.5:1 para texto normal e 3.0:1 para
          elementos de destaque/títulos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Percepção Desejada */}
        <div className="space-y-1.5">
          <Label htmlFor="percepcao_desejada" className="text-xs text-neutral-300 font-medium">
            Percepção Desejada pelo Cliente
          </Label>
          <Input
            id="percepcao_desejada"
            value={idv.percepcao_desejada || ""}
            onChange={(e) => updateIdv("percepcao_desejada", e.target.value)}
            placeholder="Ex: Confiança, sofisticação, precisão técnica"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Tom de Voz */}
        <div className="space-y-1.5">
          <Label htmlFor="tom_de_voz" className="text-xs text-neutral-300 font-medium">
            Tom de Voz Institucional
          </Label>
          <Input
            id="tom_de_voz"
            value={idv.tom_de_voz || ""}
            onChange={(e) => updateIdv("tom_de_voz", e.target.value)}
            placeholder="Ex: Profissional, técnico, acolhedor e transparente"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Referências Positivas */}
        <div className="space-y-1.5">
          <Label
            htmlFor="sites_referencia_positivos"
            className="text-xs text-neutral-300 font-medium"
          >
            Referências Visuais que Agrada
          </Label>
          <Input
            id="sites_referencia_positivos"
            value={idv.sites_referencia_positivos || ""}
            onChange={(e) => updateIdv("sites_referencia_positivos", e.target.value)}
            placeholder="Ex: Estilo Porsche Design, BMW dark minimalism"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Referências Negativas */}
        <div className="space-y-1.5">
          <Label
            htmlFor="sites_referencia_negativos"
            className="text-xs text-neutral-300 font-medium"
          >
            O que Evitar Absolutamente no Visual
          </Label>
          <Input
            id="sites_referencia_negativos"
            value={idv.sites_referencia_negativos || ""}
            onChange={(e) => updateIdv("sites_referencia_negativos", e.target.value)}
            placeholder="Ex: Cores berrantes, poluição visual de oficina genérica"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border border-white/10 bg-neutral-900/40 text-xs text-neutral-300 hover:border-white/20 w-full sm:w-auto">
          <input
            type="checkbox"
            checked={Boolean(pendingFlags["identidade_manual_marca"])}
            onChange={() => onTogglePending("identidade_manual_marca")}
            className="accent-primary size-4"
          />
          <span>Não tenho manual de marca no momento (definir com a EPM DevTech)</span>
        </label>
      </div>
    </div>
  );
}
