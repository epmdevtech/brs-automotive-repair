import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BRS_BOOKING_CONFIG } from "../../config/booking.config";
import { saveBlockedPeriod } from "../../domain/blocks";
import { parseTimeOnDate } from "../../domain/time";

export interface BlockSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  onSuccess?: () => void;
}

export function BlockSlotDialog({
  open,
  onOpenChange,
  selectedDate = new Date(),
  onSuccess,
}: BlockSlotDialogProps) {
  const [professionalId, setProfessionalId] = useState("ALL");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [reason, setReason] = useState("Manutenção / Treinamento");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseTimeOnDate(selectedDate, startTime);
    const end = parseTimeOnDate(selectedDate, endTime);

    saveBlockedPeriod({
      professionalId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      reason: reason.trim(),
    });

    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white text-slate-900 border-slate-200 p-6 rounded-xl shadow-xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <DialogTitle className="text-lg font-bold text-slate-900">
            Bloquear Período na Agenda
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Bloqueie horários para manutenção de cabine/estufa, treinamento ou indisponibilidade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="font-medium block mb-1 text-slate-700 text-xs">
              Profissional / Baia Afetada
            </label>
            <select
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-900 shadow-2xs"
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
            >
              <option value="ALL">Todos os Profissionais (Oficina Toda)</option>
              {BRS_BOOKING_CONFIG.professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">
                Início do Bloqueio
              </label>
              <input
                type="time"
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 shadow-2xs"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">
                Fim do Bloqueio
              </label>
              <input
                type="time"
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 shadow-2xs"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-medium block mb-1 text-slate-700 text-xs">
              Motivo do Bloqueio
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Limpeza e filtragem da estufa de pintura"
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-900 shadow-2xs"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-2xs"
            >
              Cancelar
            </Button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black active:scale-[0.99] text-white text-xs font-semibold cursor-pointer shadow-xs transition-all"
            >
              Salvar Bloqueio
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
