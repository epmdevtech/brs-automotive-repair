import { BriefingDadosCompletos, formatCNPJ, isValidCNPJ } from "@/lib/briefing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface StepContratanteProps {
  data: Partial<BriefingDadosCompletos>;
  onChange: (updates: Partial<BriefingDadosCompletos>) => void;
  pendingFlags: Record<string, boolean>;
  onTogglePending: (field: string) => void;
}

export function StepContratante({
  data,
  onChange,
  pendingFlags,
  onTogglePending,
}: StepContratanteProps) {
  const c = data.contratante || {
    razao_social: "",
    nome_fantasia: "",
    cnpj: "",
    endereco_faturamento: "",
    email_financeiro: "",
    responsavel_legal: "",
    contato_operacional: "",
    aprovador_final: "",
  };

  const updateContratante = (field: keyof typeof c, value: string) => {
    onChange({
      contratante: {
        ...c,
        [field]: value,
      },
    });
  };

  const cnpjClean = (c.cnpj || "").replace(/\D/g, "");
  const cnpjValid = cnpjClean.length === 14 ? isValidCNPJ(cnpjClean) : null;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-semibold text-white">1. Dados Cadastrais e Contratante</h3>
        <p className="text-xs text-neutral-400 mt-1">
          Identificação jurídica oficial da empresa, responsabilidade legal e contatos operacionais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Razão Social */}
        <div className="space-y-1.5">
          <Label htmlFor="razao_social" className="text-xs text-neutral-300 font-medium">
            Razão Social Oficial *
          </Label>
          <Input
            id="razao_social"
            value={c.razao_social}
            onChange={(e) => updateContratante("razao_social", e.target.value)}
            placeholder="Ex: Master Comercio de Pecas Automotivas LTDA"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Nome Fantasia */}
        <div className="space-y-1.5">
          <Label htmlFor="nome_fantasia" className="text-xs text-neutral-300 font-medium">
            Nome Fantasia da Marca
          </Label>
          <Input
            id="nome_fantasia"
            value={c.nome_fantasia || ""}
            onChange={(e) => updateContratante("nome_fantasia", e.target.value)}
            placeholder="Ex: Master Chapeação e Pinturas"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* CNPJ com Validação */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="cnpj" className="text-xs text-neutral-300 font-medium">
              CNPJ *
            </Label>
            {cnpjValid === true && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="size-3.5" /> CNPJ Válido
              </span>
            )}
            {cnpjValid === false && (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                <AlertTriangle className="size-3.5" /> CNPJ Inválido
              </span>
            )}
          </div>
          <Input
            id="cnpj"
            value={c.cnpj}
            onChange={(e) => updateContratante("cnpj", formatCNPJ(e.target.value))}
            placeholder="00.000.000/0000-00"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10 font-mono"
            maxLength={18}
          />
        </div>

        {/* E-mail Financeiro */}
        <div className="space-y-1.5">
          <Label htmlFor="email_financeiro" className="text-xs text-neutral-300 font-medium">
            E-mail Financeiro / Cobrança *
          </Label>
          <Input
            id="email_financeiro"
            type="email"
            value={c.email_financeiro}
            onChange={(e) => updateContratante("email_financeiro", e.target.value)}
            placeholder="financeiro@empresa.com.br"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Endereço de Faturamento */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="endereco_faturamento" className="text-xs text-neutral-300 font-medium">
            Endereço Completo de Faturamento *
          </Label>
          <Input
            id="endereco_faturamento"
            value={c.endereco_faturamento}
            onChange={(e) => updateContratante("endereco_faturamento", e.target.value)}
            placeholder="Rua, Número, Bairro, Cidade - UF, CEP"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Responsável Legal */}
        <div className="space-y-1.5">
          <Label htmlFor="responsavel_legal" className="text-xs text-neutral-300 font-medium">
            Responsável Legal da Empresa *
          </Label>
          <Input
            id="responsavel_legal"
            value={c.responsavel_legal}
            onChange={(e) => updateContratante("responsavel_legal", e.target.value)}
            placeholder="Nome Completo do Sócio ou Administrador"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Contato Operacional */}
        <div className="space-y-1.5">
          <Label htmlFor="contato_operacional" className="text-xs text-neutral-300 font-medium">
            Contato Operacional (Telefone / WhatsApp) *
          </Label>
          <Input
            id="contato_operacional"
            value={c.contato_operacional}
            onChange={(e) => updateContratante("contato_operacional", e.target.value)}
            placeholder="(45) 99954-5442"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Aprovador Final */}
        <div className="space-y-1.5">
          <Label htmlFor="aprovador_final" className="text-xs text-neutral-300 font-medium">
            Nome do Aprovador Final do Projeto *
          </Label>
          <Input
            id="aprovador_final"
            value={c.aprovador_final}
            onChange={(e) => updateContratante("aprovador_final", e.target.value)}
            placeholder="Ex: Maria Silva (Diretora)"
            className="bg-neutral-900/60 border-white/10 text-white text-xs h-10"
          />
        </div>

        {/* Botão de Pendência */}
        <div className="space-y-1.5 flex items-end">
          <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border border-white/10 bg-neutral-900/40 text-xs text-neutral-300 hover:border-white/20 w-full">
            <input
              type="checkbox"
              checked={Boolean(pendingFlags["contratante_dados_fiscais"])}
              onChange={() => onTogglePending("contratante_dados_fiscais")}
              className="accent-primary size-4"
            />
            <span>Marcar dados fiscais com pendência (completar depois)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
