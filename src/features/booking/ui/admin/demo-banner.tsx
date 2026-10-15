import { useState } from "react";
import { Sparkles, Copy, Check, Info } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { DEMO_CREDENTIALS } from "../../domain/auth";

export interface DemoBannerProps {
  demo?: boolean;
  onFillDemo: () => void;
}

/**
 * Bloco secundário/outline para preenchimento de demonstração no login (SPEC-056).
 * Posicionado abaixo do botão principal de submissão após um divisor sutil "ou".
 * Cores neutras, sem amarelo berrante, com botão de 44px (h-11) e popover de credenciais.
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
    <div className="w-full space-y-3 pt-2">
      {/* Divisor sutil "ou" */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-slate-600">
          ou
        </span>
      </div>

      {/* Botão de Demonstração (Outline, Neutro, 44px) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onFillDemo}
          aria-label="Preencher dados demo em 1 clique"
          className="flex-1 h-11 px-4 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100/90 active:bg-slate-200/70 text-slate-700 hover:text-slate-900 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <Sparkles size={14} className="text-slate-500 shrink-0" aria-hidden="true" />
          <span>Preencher com dados de demonstração</span>
        </button>

        {/* Popover Neutro com credenciais */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="h-11 px-3 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              title="Ver detalhes de credenciais"
              aria-label="Ver credenciais de demonstração"
            >
              <Info size={14} className="text-slate-500 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Credenciais</span>
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="end"
              sideOffset={8}
              className="z-50 w-72 rounded-xl bg-white border border-slate-200 p-4 shadow-lg text-slate-900 text-xs space-y-3 animate-in fade-in-50 zoom-in-95"
            >
              <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Acesso pré-configurado</span>
                <span className="text-[10px] text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  Demo
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="truncate">
                    <span className="block text-[10px] text-slate-600 uppercase font-sans">
                      E-mail
                    </span>
                    <span className="font-mono text-slate-800 text-xs truncate block font-medium">
                      {DEMO_CREDENTIALS.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("email", DEMO_CREDENTIALS.email)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    title="Copiar e-mail"
                    aria-label="Copiar e-mail de teste"
                  >
                    {copiedField === "email" ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="block text-[10px] text-slate-600 uppercase font-sans">
                      Senha
                    </span>
                    <span className="font-mono text-slate-800 text-xs block font-medium">
                      {DEMO_CREDENTIALS.password}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("password", DEMO_CREDENTIALS.password)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    title="Copiar senha"
                    aria-label="Copiar senha de teste"
                  >
                    {copiedField === "password" ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              <Popover.Arrow className="fill-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Texto de apoio discreto */}
      <p className="text-[12px] text-slate-600 text-center leading-relaxed">
        Use para testar a agenda com dados pré-configurados.
      </p>
    </div>
  );
}
