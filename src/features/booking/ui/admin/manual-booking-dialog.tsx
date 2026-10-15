import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Appointment, DamageType } from "../../domain/types";
import { BRS_BOOKING_CONFIG } from "../../config/booking.config";
import { generateProtocol, DAMAGE_TYPES_LIST } from "../../domain/intake";
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
      <DialogContent className="max-w-lg bg-white text-slate-900 border-slate-200 p-6 rounded-xl shadow-xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <DialogTitle className="text-lg font-bold text-slate-900">
            Novo Agendamento na Baia Técnica
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Cadastre um atendimento presencial ou coleta Leva e Traz para {formatDate(initialDate)}.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">
                Nome do Cliente *
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                placeholder="Ex: João da Silva"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">
                Telefone (DDD + Celular) *
              </label>
              <input
                type="tel"
                required
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                placeholder="(45) 99999-8888"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">Marca *</label>
              <input
                type="text"
                required
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                placeholder="Ex: Toyota"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">Modelo *</label>
              <input
                type="text"
                required
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                placeholder="Ex: Corolla"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">Placa</label>
              <input
                type="text"
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 uppercase font-mono shadow-2xs"
                placeholder="ABC1D23"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">
                Especialidade / Serviço
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                {BRS_BOOKING_CONFIG.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">
                Profissional / Baia
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
              >
                {BRS_BOOKING_CONFIG.professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">
                Horário de Início
              </label>
              <input
                type="time"
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono focus:outline-none focus:border-slate-900 shadow-2xs"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div>
              <label className="font-medium block mb-1 text-slate-700 text-xs">
                Tipo de Avaria
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                value={damageType}
                onChange={(e) => setDamageType(e.target.value as DamageType)}
              >
                {DAMAGE_TYPES_LIST.map((t) => (
                  <option key={t.id} value={t.id}>
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
              className="accent-slate-900 size-4 cursor-pointer"
            />
            <span className="font-medium text-slate-800">
              Serviço Leva e Traz (Coleta em Toledo-PR)
            </span>
          </label>

          {isLevaETraz && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Rua e número"
                  className="p-2 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-900 shadow-2xs"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Bairro em Toledo"
                  className="p-2 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-900 shadow-2xs"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
              </div>
            </div>
          )}

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
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black active:scale-[0.99] text-white text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50 transition-all"
            >
              {submitting ? "Gravando..." : "Confirmar Agendamento"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
