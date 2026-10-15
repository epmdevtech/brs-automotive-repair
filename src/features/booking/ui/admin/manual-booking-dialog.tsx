import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Appointment, DamageType, FinishType } from "../../domain/types";
import { BRS_BOOKING_CONFIG } from "../../config/booking.config";
import { generateProtocol, DAMAGE_AREAS_LIST, DAMAGE_TYPES_LIST } from "../../domain/intake";
import { normalizePhoneE164 } from "../../domain/phone";
import { parseTimeOnDate, formatDate } from "../../domain/time";
import { localBookingRepository } from "../../data/local/local-repository";

export interface ManualBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
  initialTime?: string; // "08:00"
  initialProfessionalId?: string;
  onSuccess?: () => void;
}

export function ManualBookingDialog({
  open,
  onOpenChange,
  initialDate = new Date(),
  initialTime = "09:00",
  initialProfessionalId,
  onSuccess,
}: ManualBookingDialogProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [serviceId, setServiceId] = useState(BRS_BOOKING_CONFIG.services[0].id);
  const [professionalId, setProfessionalId] = useState(
    initialProfessionalId ?? BRS_BOOKING_CONFIG.professionals[0].id,
  );
  const [time, setTime] = useState(initialTime);
  const [damageType, setDamageType] = useState<DamageType>("colisao-com-vinco");
  const [isLevaETraz, setIsLevaETraz] = useState(false);
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    const phoneRes = normalizePhoneE164(customerPhone);
    if (!phoneRes.ok) {
      setError(phoneRes.error);
      return;
    }

    if (!vehicleMake.trim() || !vehicleModel.trim()) {
      setError("Informe a marca e modelo do veículo.");
      return;
    }

    const svc = BRS_BOOKING_CONFIG.services.find((s) => s.id === serviceId);
    const duration = svc?.durationMinutes ?? 45;

    const startDate = parseTimeOnDate(initialDate, time);
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

    setSubmitting(true);
    const appointment: Appointment = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      protocol: generateProtocol(),
      serviceId,
      professionalId,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      status: "CONFIRMED",
      customer: {
        name: customerName.trim(),
        phone: phoneRes.value,
        rawPhone: customerPhone,
        consentLgpd: true,
      },
      intake: {
        vehicle: {
          make: vehicleMake.trim(),
          model: vehicleModel.trim(),
          plate: vehiclePlate.trim().toUpperCase() || undefined,
        },
        affectedAreas: ["para-choque-dianteiro"],
        damageType,
      },
      logistics: {
        type: isLevaETraz ? "leva-e-traz" : "presencial",
        address: isLevaETraz ? address.trim() : undefined,
        neighborhood: isLevaETraz ? neighborhood.trim() : undefined,
        city: "Toledo",
        vehicleDrivable: true,
      },
      createdAt: new Date().toISOString(),
      idempotencyKey:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `idemp-${Date.now()}`,
    };

    const res = await localBookingRepository.createAppointment(appointment);
    setSubmitting(false);

    if (res.ok) {
      onOpenChange(false);
      onSuccess?.();
    } else {
      setError(
        res.error === "SLOT_TAKEN"
          ? "Este horário já está ocupado por outro atendimento."
          : "Erro ao salvar agendamento.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[#121214] text-[#EDEDED] border-[#1F1F23] p-6 rounded-xl shadow-2xl">
        <DialogHeader className="border-b border-[#1F1F23] pb-3">
          <DialogTitle className="text-lg font-display font-bold text-white">
            Novo Agendamento na Baia Técnica
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Cadastre um atendimento presencial ou coleta Leva e Traz para {formatDate(initialDate)}.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-2.5 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Nome do Cliente *
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5A00]"
                placeholder="Ex: João da Silva"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Telefone (DDD + Celular) *
              </label>
              <input
                type="tel"
                required
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5A00]"
                placeholder="(45) 99999-8888"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Marca *
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5A00]"
                placeholder="Ex: Toyota"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Modelo *
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5A00]"
                placeholder="Ex: Corolla"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Placa
              </label>
              <input
                type="text"
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5A00] uppercase font-mono"
                placeholder="ABC1D23"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Especialidade / Serviço
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white focus:outline-none focus:border-[#FF5A00]"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                {BRS_BOOKING_CONFIG.services.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#18181B] text-white">
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Profissional / Baia
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white focus:outline-none focus:border-[#FF5A00]"
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
              >
                {BRS_BOOKING_CONFIG.professionals.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#18181B] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Horário de Início
              </label>
              <input
                type="time"
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white font-mono focus:outline-none focus:border-[#FF5A00]"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                Tipo de Avaria
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white focus:outline-none focus:border-[#FF5A00]"
                value={damageType}
                onChange={(e) => setDamageType(e.target.value as DamageType)}
              >
                {DAMAGE_TYPES_LIST.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#18181B] text-white">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isLevaETraz}
              onChange={(e) => setIsLevaETraz(e.target.checked)}
              className="accent-[#FF5A00] size-4 cursor-pointer"
            />
            <span className="font-medium text-zinc-200">
              Serviço Leva e Traz (Coleta em Toledo-PR)
            </span>
          </label>

          {isLevaETraz && (
            <div className="p-3 rounded-lg border border-[#27272A] bg-[#18181B] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Rua e número"
                  className="p-2 rounded border border-[#27272A] bg-[#121214] text-white placeholder:text-zinc-500 text-xs focus:outline-none focus:border-[#FF5A00]"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Bairro em Toledo"
                  className="p-2 rounded border border-[#27272A] bg-[#121214] text-white placeholder:text-zinc-500 text-xs focus:outline-none focus:border-[#FF5A00]"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
              </div>
            </div>
          )}

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
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[#FF5A00] hover:bg-[#E04F00] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-[#FF5A00]/20 disabled:opacity-50 transition-all"
            >
              {submitting ? "Gravando..." : "Confirmar Agendamento"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
