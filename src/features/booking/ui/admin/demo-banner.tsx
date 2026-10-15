import { useState } from "react";
import { Sparkles, Copy, Check, Info } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { DEMO_CREDENTIALS } from "../../domain/auth";

export interface DemoBannerProps {
  demo?: boolean;
  onFillDemo: () => void;
}

/**
 * Banner compacto de demonstração para o painel de login.
 * Altura discreta (~40-44px), fundo suave e popover de credenciais para não poluir o DOM.
 */
export function DemoBanner({ demo = true, onFillDemo }: DemoBannerProps) {
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);

  if (!demo) return null;

  const handleCopy = async (field: "email" | "password", text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      }
    } catch {
      // Fallback silencioso
    }
  };

  return (
    <div
      role="region"
      aria-label="Ambiente Demonstrativo"
      className="w-full bg-amber-50/90 border border-amber-200/90 rounded-lg px-3 py-2 flex items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs transition-all"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles size={14} className="text-amber-600 shrink-0" aria-hidden="true" />
        <span className="font-semibold truncate">Ambiente Demonstrativo</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Popover com credenciais e botões de cópia */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="px-2.5 py-1 text-[11px] font-medium text-amber-900 hover:text-amber-950 hover:bg-amber-100/70 rounded border border-amber-300/80 transition-colors flex items-center gap-1 cursor-pointer"
              title="Ver detalhes de credenciais"
            >
              <Info size={12} className="text-amber-700" />
              <span>Credenciais</span>
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="end"
              sideOffset={6}
              className="z-50 w-72 bg-white rounded-lg border border-slate-200 p-3.5 shadow-lg text-slate-900 text-xs space-y-2.5 animate-in fade-in-50 zoom-in-95"
            >
              <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center justify-between">
                <span>Acesso Pré-configurado</span>
                <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  Demo
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div className="truncate">
                    <span className="block text-[10px] text-slate-400 uppercase font-sans">
                      E-mail
                    </span>
                    <span className="font-mono text-slate-800 text-[11px] truncate block">
                      {DEMO_CREDENTIALS.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("email", DEMO_CREDENTIALS.email)}
                    className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                    title="Copiar e-mail"
                    aria-label="Copiar e-mail de teste"
                  >
                    {copiedField === "email" ? (
                      <Check size={13} className="text-emerald-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-sans">
                      Senha
                    </span>
                    <span className="font-mono text-slate-800 text-[11px] block">
                      {DEMO_CREDENTIALS.password}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("password", DEMO_CREDENTIALS.password)}
                    className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                    title="Copiar senha"
                    aria-label="Copiar senha de teste"
                  >
                    {copiedField === "password" ? (
                      <Check size={13} className="text-emerald-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>

              <Popover.Arrow className="fill-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Botão de 1 clique requerido e testado pelos testes automatizados */}
        <button
          type="button"
          onClick={onFillDemo}
          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-amber-700 hover:bg-amber-800 active:scale-[0.98] rounded transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
        >
          <Sparkles size={11} />
          <span>Preencher dados demo em 1 clique</span>
        </button>
      </div>
    </div>
  );
}
