import type { AppointmentStatus } from "../../domain/types";
import { getStatusDotClass } from "../../domain/status";

export type StatusFilter = "ALL" | AppointmentStatus;

export interface DayStats {
  total: number;
  inProgress: number;
  completed: number;
  open: number;
  closed: number;
  cancelled: number;
  levaETraz: number;
}

export interface StatusTabsProps {
  currentFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  stats: DayStats;
}

interface TabItem {
  id: StatusFilter;
  label: string;
  count: number;
  dotClass: string;
  activeClass: string;
  tooltip: string;
}

/**
 * Barra unificada de abas com contadores integrados (StatusTabs).
 * Substitui os antigos 6 cards de KPI e a barra de pílulas redundante,
 * mantendo altura máxima de 56px para garantir que a agenda apareça na 1ª dobra em 1080p.
 */
export function StatusTabs({ currentFilter, onFilterChange, stats }: StatusTabsProps) {
  const tabs: TabItem[] = [
    {
      id: "ALL",
      label: "Todos",
      count: stats.total,
      dotClass: "bg-slate-400",
      activeClass: "bg-slate-900 text-white shadow-xs font-semibold",
      tooltip: "Todos os agendamentos registrados para a data selecionada",
    },
    {
      id: "CONFIRMED",
      label: "Em Andamento",
      count: stats.inProgress,
      dotClass: getStatusDotClass("CONFIRMED"),
      activeClass: "bg-amber-600 text-white shadow-xs font-semibold",
      tooltip: "Veículo na baia ou em execução técnica de reparo",
    },
    {
      id: "COMPLETED",
      label: "Concluídos",
      count: stats.completed,
      dotClass: getStatusDotClass("COMPLETED"),
      activeClass: "bg-emerald-600 text-white shadow-xs font-semibold",
      tooltip: "Serviço executado, aguardando fechamento",
    },
    {
      id: "PENDING",
      label: "Abertos",
      count: stats.open,
      dotClass: getStatusDotClass("PENDING"),
      activeClass: "bg-sky-600 text-white shadow-xs font-semibold",
      tooltip: "Aguardando check-in ou início do reparo",
    },
    {
      id: "NO_SHOW",
      label: "Fechados",
      count: stats.closed,
      dotClass: getStatusDotClass("NO_SHOW"),
      activeClass: "bg-neutral-800 text-white shadow-xs font-semibold",
      tooltip: "OS finalizada e paga",
    },
    {
      id: "CANCELLED",
      label: "Cancelados",
      count: stats.cancelled,
      dotClass: getStatusDotClass("CANCELLED"),
      activeClass: "bg-rose-600 text-white shadow-xs font-semibold",
      tooltip: "Agendamento cancelado pelo cliente ou oficina",
    },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto min-h-[52px] max-h-[56px] shadow-2xs">
      {/* Tablist Acessível */}
      <div
        role="tablist"
        aria-label="Filtro de situações dos agendamentos"
        className="flex items-center gap-1.5 shrink-0"
      >
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          const isEmpty = tab.count === 0;

          return (
            <button
              key={tab.id}
              type="button"
              aria-selected={isActive}
              aria-controls="appointments-view"
              title={tab.tooltip}
              onClick={() => onFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? tab.activeClass
                  : `bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 ${
                      isEmpty ? "opacity-60 hover:opacity-100" : ""
                    }`
              }`}
            >
              <span
                className={`size-2 rounded-full shrink-0 ${tab.dotClass} ${
                  isActive ? "ring-2 ring-white/50" : ""
                }`}
                aria-hidden="true"
              />
              <span>
                {tab.label} ({tab.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Resumo do Total do Dia para visualização rápida e compatibilidade de testes */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0 pl-3 border-l border-slate-200">
        <span>Total do Dia:</span>
        <span className="font-bold text-slate-900 font-mono text-sm">{stats.total}</span>
      </div>
    </div>
  );
}
