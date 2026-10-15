import { describe, it, expect } from "vitest";
import { intervalsOverlap, parseTimeOnDate, createTZDate } from "../features/booking/domain/time";
import { normalizePhoneE164, isValidDDD } from "../features/booking/domain/phone";
import { canTransition, transitionStatus } from "../features/booking/domain/status";
import {
  computeAvailableSlots,
  computeAvailableDays,
} from "../features/booking/domain/availability";
import type {
  Appointment,
  Professional,
  ServiceDefinition,
  WorkingHours,
} from "../features/booking/domain/types";

describe("Domain: Time & Collision Math", () => {
  it("detects interval overlap correctly in semi-open intervals [start, end)", () => {
    const base = new Date("2026-10-19T08:00:00Z");
    const t = (min: number) => new Date(base.getTime() + min * 60 * 1000);

    // [0, 30) e [30, 60) NÃO colidem
    expect(intervalsOverlap(t(0), t(30), t(30), t(60))).toBe(false);

    // [0, 31) e [30, 60) colidem
    expect(intervalsOverlap(t(0), t(31), t(30), t(60))).toBe(true);

    // [10, 20) contido em [0, 30) colide
    expect(intervalsOverlap(t(0), t(30), t(10), t(20))).toBe(true);
  });
});

describe("Domain: Phone Normalizer (E.164 & 67 DDDs)", () => {
  it("validates legitimate Brazilian DDDs", () => {
    expect(isValidDDD("45")).toBe(true); // Toledo-PR
    expect(isValidDDD("11")).toBe(true); // SP
    expect(isValidDDD("21")).toBe(true); // RJ
    expect(isValidDDD("99")).toBe(true); // MA
    expect(isValidDDD("20")).toBe(false); // Inexistente
    expect(isValidDDD("36")).toBe(false); // Inexistente
  });

  it("normalizes phone numbers to standard E.164", () => {
    const res1 = normalizePhoneE164("(45) 99933-4455");
    expect(res1.ok).toBe(true);
    if (res1.ok) expect(res1.value).toBe("+5545999334455");

    const res2 = normalizePhoneE164("45999334455");
    expect(res2.ok).toBe(true);
    if (res2.ok) expect(res2.value).toBe("+5545999334455");

    const res3 = normalizePhoneE164("+55 45 99933-4455");
    expect(res3.ok).toBe(true);
    if (res3.ok) expect(res3.value).toBe("+5545999334455");
  });

  it("rejects numbers with invalid DDD or wrong length", () => {
    const invalidDdd = normalizePhoneE164("20999998888");
    expect(invalidDdd.ok).toBe(false);

    const tooShort = normalizePhoneE164("459999");
    expect(tooShort.ok).toBe(false);
  });
});

describe("Domain: FSM Status Transitions", () => {
  it("allows valid transitions", () => {
    expect(canTransition("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransition("CONFIRMED", "COMPLETED")).toBe(true);
    expect(canTransition("CONFIRMED", "CANCELLED")).toBe(true);
  });

  it("blocks invalid transitions", () => {
    expect(canTransition("COMPLETED", "CONFIRMED")).toBe(false);
    expect(canTransition("CANCELLED", "CONFIRMED")).toBe(false);
    const trans = transitionStatus("COMPLETED", "PENDING");
    expect(trans.ok).toBe(false);
  });
});

describe("Domain: Availability Engine", () => {
  const service: ServiceDefinition = {
    id: "avaliacao-funilaria",
    title: "Avaliação Técnica de Funilaria",
    short: "Funilaria",
    durationMinutes: 45,
    bufferMinutes: 15, // Ocupação = 60 min
    category: "Reparação",
    requiresVehicleData: true,
    allowsLevaETraz: true,
  };

  const professionals: Professional[] = [
    { id: "bruno", name: "Bruno", role: "Especialista", sortOrder: 1 },
    { id: "equipe", name: "Equipe BRS", role: "Técnico", sortOrder: 2 },
  ];

  const workingHours: WorkingHours = {
    weekdays: [
      { start: "08:00", end: "12:00" },
      { start: "13:30", end: "18:00" },
    ],
    saturdays: [{ start: "08:00", end: "12:00" }],
    sundays: [],
  };

  // Segunda-feira (19/10/2026)
  const monday = new Date("2026-10-19T12:00:00-03:00");
  const pastNow = new Date("2026-10-19T06:00:00-03:00");

  it("computes free slots within shifts respecting lunch break", () => {
    const slots = computeAvailableSlots({
      date: monday,
      service,
      workingHours,
      existingAppointments: [],
      professionals,
      minNoticeMinutes: 30,
      now: pastNow,
      slotIntervalMinutes: 60,
    });

    expect(slots.length).toBeGreaterThan(0);

    // Nenhum slot pode iniciar ou terminar durante o intervalo de almoço (12:00 às 13:30)
    for (const slot of slots) {
      const startHour = slot.start.getHours();
      const startMin = slot.start.getMinutes();
      const timeDecimal = startHour + startMin / 60;
      expect(timeDecimal >= 12 && timeDecimal < 13.5).toBe(false);
    }
  });

  it("prevents double-booking when an appointment exists", () => {
    const appStart = parseTimeOnDate(monday, "08:00");
    const appEnd = parseTimeOnDate(monday, "08:45");

    const existing: Appointment = {
      id: "app-1",
      protocol: "#BRS-0001",
      serviceId: service.id,
      professionalId: "bruno",
      startTime: appStart.toISOString(),
      endTime: appEnd.toISOString(),
      status: "CONFIRMED",
      customer: { name: "Carlos", phone: "+5545999990000", consentLgpd: true },
      intake: {
        vehicle: { make: "VW", model: "Gol" },
        affectedAreas: ["capo"],
        damageType: "colisao-com-vinco",
      },
      logistics: { type: "presencial" },
      createdAt: new Date().toISOString(),
      idempotencyKey: "uuid-1",
    };

    // Avaliando apenas Bruno: o slot das 08:00 deve sumir
    const slotsBruno = computeAvailableSlots({
      date: monday,
      service,
      workingHours,
      existingAppointments: [existing],
      professionals,
      selectedProfessionalId: "bruno",
      minNoticeMinutes: 30,
      now: pastNow,
      slotIntervalMinutes: 60,
    });

    const hasSlot08 = slotsBruno.some(
      (s) => s.start.getHours() === 8 && s.start.getMinutes() === 0,
    );
    expect(hasSlot08).toBe(false);

    // Se avaliar "Qualquer Profissional", o slot das 08:00 deve ser atribuído à 'equipe'
    const slotsAny = computeAvailableSlots({
      date: monday,
      service,
      workingHours,
      existingAppointments: [existing],
      professionals,
      minNoticeMinutes: 30,
      now: pastNow,
      slotIntervalMinutes: 60,
    });

    const slot08 = slotsAny.find((s) => s.start.getHours() === 8 && s.start.getMinutes() === 0);
    expect(slot08).toBeDefined();
    expect(slot08?.professionalId).toBe("equipe");
  });

  it("applies extra logistics buffer for Leva e Traz", () => {
    // Turno termina às 12:00.
    // Duração: 45 min. Buffer normal: 15 min. Ocupação normal: 60 min.
    // Slot das 11:00 cabe no turno (11:00 + 60 min = 12:00).
    // Com Leva e Traz (+30 min buffer): ocupação = 45 + 15 + 30 = 90 min.
    // Slot das 11:00 ocuparia até 12:30 (ultrapassa 12:00 do turno), então NÃO deve ser ofertado!
    const slotsPresencial = computeAvailableSlots({
      date: monday,
      service,
      workingHours,
      existingAppointments: [],
      professionals,
      isLevaETraz: false,
      slotIntervalMinutes: 60,
      minNoticeMinutes: 0,
      now: pastNow,
    });

    const has11Presencial = slotsPresencial.some((s) => s.start.getHours() === 11);
    expect(has11Presencial).toBe(true);

    const slotsLevaETraz = computeAvailableSlots({
      date: monday,
      service,
      workingHours,
      existingAppointments: [],
      professionals,
      isLevaETraz: true,
      levaETrazBufferMinutes: 30,
      slotIntervalMinutes: 60,
      minNoticeMinutes: 0,
      now: pastNow,
    });

    const has11LevaETraz = slotsLevaETraz.some((s) => s.start.getHours() === 11);
    expect(has11LevaETraz).toBe(false);
  });
});
