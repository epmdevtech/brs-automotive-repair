import { useState, useEffect, useMemo, useCallback } from "react";
import type { Appointment, DamageArea, DamageType, FinishType, TimeSlot } from "../domain/types";
import { computeAvailableSlots, computeAvailableDays } from "../domain/availability";
import { generateProtocol } from "../domain/intake";
import { normalizePhoneE164 } from "../domain/phone";
import { MASTER_BOOKING_CONFIG } from "../config/booking.config";
import { localBookingRepository } from "../data/local/local-repository";

export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface UseBookingReturn {
  step: BookingStep;
  setStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Step 1: Veículo e Avarias
  vehicleMake: string;
  setVehicleMake: (v: string) => void;
  vehicleModel: string;
  setVehicleModel: (v: string) => void;
  vehicleYear: string;
  setVehicleYear: (v: string) => void;
  vehiclePlate: string;
  setVehiclePlate: (v: string) => void;
  vehicleColor: string;
  setVehicleColor: (v: string) => void;
  finishType: FinishType;
  setFinishType: (v: FinishType) => void;
  affectedAreas: DamageArea[];
  toggleAffectedArea: (area: DamageArea) => void;
  damageType: DamageType;
  setDamageType: (v: DamageType) => void;
  damageDescription: string;
  setDamageDescription: (v: string) => void;
  isInsurance: boolean;
  setIsInsurance: (v: boolean) => void;

  // Step 2: Serviço
  serviceId: string;
  setServiceId: (v: string) => void;

  // Step 3: Logística
  logisticsType: "presencial" | "leva-e-traz";
  setLogisticsType: (v: "presencial" | "leva-e-traz") => void;
  address: string;
  setAddress: (v: string) => void;
  neighborhood: string;
  setNeighborhood: (v: string) => void;
  vehicleDrivable: boolean;
  setVehicleDrivable: (v: boolean) => void;

  // Step 4: Data e Slot
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  selectedSlot: TimeSlot | null;
  setSelectedSlot: (s: TimeSlot | null) => void;
  availableSlots: TimeSlot[];
  availableDays: string[];

  // Step 5: Cliente
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  consentLgpd: boolean;
  setConsentLgpd: (v: boolean) => void;

  // Step 6 / Submissão
  isSubmitting: boolean;
  submissionError: string | null;
  createdAppointment: Appointment | null;
  submitBooking: () => Promise<boolean>;
  resetBooking: () => void;
}

export function useBooking(): UseBookingReturn {
  const [step, setStep] = useState<BookingStep>(1);

  // Idempotency Key única por sessão
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `key-${Date.now()}-${Math.random()}`,
  );

  // Step 1: Veículo e Avarias
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [finishType, setFinishType] = useState<FinishType>("nao-informada");
  const [affectedAreas, setAffectedAreas] = useState<DamageArea[]>([]);
  const [damageType, setDamageType] = useState<DamageType>("colisao-com-vinco");
  const [damageDescription, setDamageDescription] = useState("");
  const [isInsurance, setIsInsurance] = useState(false);

  // Step 2: Serviço
  const [serviceId, setServiceId] = useState<string>(MASTER_BOOKING_CONFIG.services[0].id);

  // Step 3: Logística
  const [logisticsType, setLogisticsType] = useState<"presencial" | "leva-e-traz">("presencial");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [vehicleDrivable, setVehicleDrivable] = useState(true);

  // Step 4: Data e Horário
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Amanhã por padrão
    return d;
  });
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Step 5: Cliente
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [consentLgpd, setConsentLgpd] = useState(false);

  // Submissão
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Repositório e Sincronização Reativa Multi-Aba
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const unsubscribe = localBookingRepository.subscribe((list) => {
      setAppointments(list);
    });
    return () => unsubscribe();
  }, []);

  const activeService = useMemo(() => {
    return (
      MASTER_BOOKING_CONFIG.services.find((s) => s.id === serviceId) ??
      MASTER_BOOKING_CONFIG.services[0]
    );
  }, [serviceId]);

  const toggleAffectedArea = useCallback((area: DamageArea) => {
    setAffectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }, []);

  // Slots livres calculados pelo motor de disponibilidade
  const availableSlots = useMemo(() => {
    return computeAvailableSlots({
      date: selectedDate,
      service: activeService,
      workingHours: MASTER_BOOKING_CONFIG.workingHours,
      existingAppointments: appointments,
      professionals: MASTER_BOOKING_CONFIG.professionals,
      isLevaETraz: logisticsType === "leva-e-traz",
      levaETrazBufferMinutes: MASTER_BOOKING_CONFIG.levaETraz.additionalBufferMinutes,
      slotIntervalMinutes: MASTER_BOOKING_CONFIG.slotIntervalMinutes,
      minNoticeMinutes: MASTER_BOOKING_CONFIG.minNoticeMinutes,
      timezone: MASTER_BOOKING_CONFIG.timezone,
    });
  }, [selectedDate, activeService, appointments, logisticsType]);

  // Dias livres no calendário do mês
  const availableDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const yearMonth = `${year}-${month}`;

    return computeAvailableDays({
      yearMonth,
      service: activeService,
      workingHours: MASTER_BOOKING_CONFIG.workingHours,
      existingAppointments: appointments,
      professionals: MASTER_BOOKING_CONFIG.professionals,
      isLevaETraz: logisticsType === "leva-e-traz",
      levaETrazBufferMinutes: MASTER_BOOKING_CONFIG.levaETraz.additionalBufferMinutes,
      slotIntervalMinutes: MASTER_BOOKING_CONFIG.slotIntervalMinutes,
      minNoticeMinutes: MASTER_BOOKING_CONFIG.minNoticeMinutes,
      maxAdvanceDays: MASTER_BOOKING_CONFIG.maxAdvanceDays,
      timezone: MASTER_BOOKING_CONFIG.timezone,
    });
  }, [selectedDate, activeService, appointments, logisticsType]);

  const nextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, 6) as BookingStep);
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1) as BookingStep);
  }, []);

  const submitBooking = useCallback(async (): Promise<boolean> => {
    if (!selectedSlot) {
      setSubmissionError("Selecione um horário disponível para continuar.");
      return false;
    }

    const phoneResult = normalizePhoneE164(customerPhone);
    if (!phoneResult.ok) {
      setSubmissionError(phoneResult.error);
      return false;
    }

    if (!customerName.trim()) {
      setSubmissionError("Informe seu nome completo.");
      return false;
    }

    if (!consentLgpd) {
      setSubmissionError("É necessário aceitar os termos de contato para prosseguir.");
      return false;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const protocol = generateProtocol();
    const newAppointment: Appointment = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      protocol,
      serviceId,
      professionalId: selectedSlot.professionalId ?? MASTER_BOOKING_CONFIG.professionals[0].id,
      startTime: selectedSlot.start.toISOString(),
      endTime: selectedSlot.end.toISOString(),
      status: "CONFIRMED",
      customer: {
        name: customerName.trim(),
        phone: phoneResult.value,
        rawPhone: customerPhone,
        consentLgpd,
      },
      intake: {
        vehicle: {
          make: vehicleMake.trim(),
          model: vehicleModel.trim(),
          year: vehicleYear.trim() || undefined,
          plate: vehiclePlate.trim() || undefined,
          color: vehicleColor.trim() || undefined,
          finishType,
        },
        affectedAreas,
        damageType,
        description: damageDescription.trim() || undefined,
        isInsurance,
      },
      logistics: {
        type: logisticsType,
        address: address.trim() || undefined,
        neighborhood: neighborhood.trim() || undefined,
        city: "Toledo",
        vehicleDrivable,
      },
      createdAt: new Date().toISOString(),
      idempotencyKey,
    };

    const result = await localBookingRepository.createAppointment(newAppointment);
    setIsSubmitting(false);

    if (result.ok) {
      setCreatedAppointment(result.value);
      setStep(6);
      return true;
    } else {
      if (result.error === "SLOT_TAKEN") {
        setSubmissionError(
          "O horário selecionado acabou de ser reservado. Por favor, escolha outro slot livre.",
        );
      } else {
        setSubmissionError("Não foi possível confirmar o agendamento. Tente novamente.");
      }
      return false;
    }
  }, [
    selectedSlot,
    customerPhone,
    customerName,
    consentLgpd,
    serviceId,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehiclePlate,
    vehicleColor,
    finishType,
    affectedAreas,
    damageType,
    damageDescription,
    isInsurance,
    logisticsType,
    address,
    neighborhood,
    vehicleDrivable,
    idempotencyKey,
  ]);

  const resetBooking = useCallback(() => {
    setStep(1);
    setVehicleMake("");
    setVehicleModel("");
    setVehicleYear("");
    setVehiclePlate("");
    setVehicleColor("");
    setAffectedAreas([]);
    setDamageDescription("");
    setSelectedSlot(null);
    setCustomerName("");
    setCustomerPhone("");
    setConsentLgpd(false);
    setCreatedAppointment(null);
    setSubmissionError(null);
    setIdempotencyKey(
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `key-${Date.now()}-${Math.random()}`,
    );
  }, []);

  return {
    step,
    setStep,
    nextStep,
    prevStep,
    vehicleMake,
    setVehicleMake,
    vehicleModel,
    setVehicleModel,
    vehicleYear,
    setVehicleYear,
    vehiclePlate,
    setVehiclePlate,
    vehicleColor,
    setVehicleColor,
    finishType,
    setFinishType,
    affectedAreas,
    toggleAffectedArea,
    damageType,
    setDamageType,
    damageDescription,
    setDamageDescription,
    isInsurance,
    setIsInsurance,
    serviceId,
    setServiceId,
    logisticsType,
    setLogisticsType,
    address,
    setAddress,
    neighborhood,
    setNeighborhood,
    vehicleDrivable,
    setVehicleDrivable,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    availableSlots,
    availableDays,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    consentLgpd,
    setConsentLgpd,
    isSubmitting,
    submissionError,
    createdAppointment,
    submitBooking,
    resetBooking,
  };
}
