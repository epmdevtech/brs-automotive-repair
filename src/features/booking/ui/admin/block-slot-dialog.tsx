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
      <DialogContent className="max-w-md bg-[#121214] text-[#EDEDED] border-[#1F1F23] p-6 rounded-xl shadow-2xl">
        <DialogHeader className="border-b border-[#1F1F23] pb-3">
          <DialogTitle className="text-lg font-display font-bold text-white">
            Bloquear Período na Agenda
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Bloqueie horários para manutenção de cabine/estufa, treinamento ou indisponibilidade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
              Profissional / Baia Afetada
            </label>
            <select
              className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white text-xs focus:outline-none focus:border-[#FF5A00]"
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
            >
              <option value="ALL" className="bg-[#18181B] text-white">
                Todos os Profissionais (Oficina Toda)
              </option>
              {BRS_BOOKING_CONFIG.professionals.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#18181B] text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Início do Bloqueio
              </label>
              <input
                type="time"
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white text-xs font-mono focus:outline-none focus:border-[#FF5A00]"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Fim do Bloqueio
              </label>
              <input
                type="time"
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white text-xs font-mono focus:outline-none focus:border-[#FF5A00]"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
              Motivo do Bloqueio
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Limpeza e filtragem da estufa de pintura"
              className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-zinc-500 text-xs focus:outline-none focus:border-[#FF5A00]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F1F23]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs border-[#27272A] bg-[#18181B] text-zinc-300 hover:bg-[#27272A] hover:text-white cursor-pointer"
            >
              Cancelar
            </Button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#FF5A00] hover:bg-[#E04F00] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-[#FF5A00]/20 transition-all"
            >
              Salvar Bloqueio
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
