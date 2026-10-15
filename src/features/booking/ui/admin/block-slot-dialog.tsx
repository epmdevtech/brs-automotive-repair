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
      <DialogContent className="max-w-md bg-[#fbf9f6] text-[#201d1b] border-[#e5dfd5] p-6 rounded-xl">
        <DialogHeader className="border-b border-[#e5dfd5] pb-3">
          <DialogTitle className="text-lg font-display font-bold text-[#201d1b]">
            Bloquear Período na Agenda
          </DialogTitle>
          <DialogDescription className="text-xs text-[#716860]">
            Bloqueie horários para manutenção de cabine/estufa, treinamento ou indisponibilidade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="font-semibold block mb-1">Profissional / Baia Afetada</label>
            <select
              className="w-full p-2 rounded border border-[#d8d0c4] bg-white text-xs"
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
              <label className="font-semibold block mb-1">Início do Bloqueio</label>
              <input
                type="time"
                className="w-full p-2 rounded border border-[#d8d0c4] bg-white text-xs"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Fim do Bloqueio</label>
              <input
                type="time"
                className="w-full p-2 rounded border border-[#d8d0c4] bg-white text-xs"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Motivo do Bloqueio</label>
            <input
              type="text"
              required
              placeholder="Ex: Limpeza e filtragem da estufa de pintura"
              className="w-full p-2 rounded border border-[#d8d0c4] bg-white text-xs"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5dfd5]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#201d1b] hover:bg-[#34302d] text-white text-xs font-semibold cursor-pointer shadow-sm"
            >
              Salvar Bloqueio
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
