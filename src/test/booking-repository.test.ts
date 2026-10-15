import { describe, it, expect, beforeEach } from "vitest";
import { LocalBookingRepository } from "../features/booking/data/local/local-repository";
import type { Appointment } from "../features/booking/domain/types";

describe("Data: LocalBookingRepository with Atomic Traps & Idempotency", () => {
  let repo: LocalBookingRepository;
  const storageKey = "test_brs_appointments";

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    repo = new LocalBookingRepository(storageKey, "test-lock", "test-channel");
  });

  const baseAppointment: Appointment = {
    id: "app-test-1",
    protocol: "#BRS-9999",
    serviceId: "avaliacao-funilaria",
    professionalId: "bruno",
    startTime: "2026-10-19T08:00:00.000Z",
    endTime: "2026-10-19T08:45:00.000Z",
    status: "PENDING",
    customer: {
      name: "João Silva",
      phone: "+5545999887766",
      consentLgpd: true,
    },
    intake: {
      vehicle: { make: "Toyota", model: "Corolla", plate: "ABC1D23" },
      affectedAreas: ["para-choque-dianteiro"],
      damageType: "colisao-com-vinco",
    },
    logistics: {
      type: "presencial",
    },
    createdAt: new Date().toISOString(),
    idempotencyKey: "uuid-idempotent-1",
  };

  it("persists appointment successfully", async () => {
    const res = await repo.createAppointment(baseAppointment);
    expect(res.ok).toBe(true);

    const list = await repo.listAppointments();
    expect(list.length).toBe(1);
    expect(list[0].protocol).toBe("#BRS-9999");
  });

  it("returns existing appointment on idempotent retry", async () => {
    await repo.createAppointment(baseAppointment);

    // Segunda chamada com mesmo idempotencyKey
    const res2 = await repo.createAppointment({
      ...baseAppointment,
      id: "another-id",
    });

    expect(res2.ok).toBe(true);
    if (res2.ok) {
      expect(res2.value.id).toBe("app-test-1"); // Retorna o original
    }

    const list = await repo.listAppointments();
    expect(list.length).toBe(1);
  });

  it("rejects colliding slot with SLOT_TAKEN error", async () => {
    await repo.createAppointment(baseAppointment);

    // Tentativa de agendar no mesmo horário para o mesmo profissional
    const colliding: Appointment = {
      ...baseAppointment,
      id: "app-test-2",
      protocol: "#BRS-8888",
      idempotencyKey: "uuid-different",
      startTime: "2026-10-19T08:15:00.000Z",
      endTime: "2026-10-19T09:00:00.000Z",
    };

    const res = await repo.createAppointment(colliding);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toBe("SLOT_TAKEN");
    }
  });

  it("updates status according to domain FSM rules", async () => {
    await repo.createAppointment(baseAppointment);

    const updated = await repo.updateStatus("app-test-1", "CONFIRMED");
    expect(updated.ok).toBe(true);

    const invalid = await repo.updateStatus("app-test-1", "PENDING");
    expect(invalid.ok).toBe(false);
  });
});
