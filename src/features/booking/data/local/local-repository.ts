import type { Appointment, AppointmentStatus, Result } from "../../domain/types";
import { intervalsOverlap } from "../../domain/time";
import { transitionStatus } from "../../domain/status";
import { BRS_BOOKING_CONFIG } from "../../config/booking.config";
import type { BookingRepository, CreateAppointmentError } from "../repository";

export class LocalBookingRepository implements BookingRepository {
  private storageKey: string;
  private lockName: string;
  private channel: BroadcastChannel | null = null;
  private subscribers: Set<(appointments: Appointment[]) => void> = new Set();

  constructor(
    storageKey: string = BRS_BOOKING_CONFIG.storageKey,
    lockName: string = BRS_BOOKING_CONFIG.lockName,
    syncChannelName: string = BRS_BOOKING_CONFIG.syncChannelName,
  ) {
    this.storageKey = storageKey;
    this.lockName = lockName;

    if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
      try {
        this.channel = new BroadcastChannel(syncChannelName);
        this.channel.onmessage = () => {
          this.notifySubscribers();
        };
      } catch {
        this.channel = null;
      }
    }
  }

  private readStorage(): Appointment[] {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return [];
    }
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      return JSON.parse(raw) as Appointment[];
    } catch {
      return [];
    }
  }

  private writeStorage(appointments: Appointment[]): boolean {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return false;
    }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(appointments));
      this.channel?.postMessage({ type: "MUTATION" });
      this.notifySubscribers();
      return true;
    } catch {
      return false;
    }
  }

  private notifySubscribers() {
    const list = this.readStorage();
    this.subscribers.forEach((cb) => {
      try {
        cb(list);
      } catch {
        // Ignora erros de subscrições individuais
      }
    });
  }

  private async withLock<T>(fn: () => Promise<T>): Promise<T> {
    if (
      typeof navigator !== "undefined" &&
      navigator.locks &&
      typeof navigator.locks.request === "function"
    ) {
      return navigator.locks.request(this.lockName, fn);
    }
    return fn();
  }

  async listAppointments(): Promise<Appointment[]> {
    return this.readStorage();
  }

  clearAndSeed(appointments: Appointment[]): boolean {
    return this.writeStorage(appointments);
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    const list = this.readStorage();
    return list.find((a) => a.id === id) ?? null;
  }

  async getAppointmentByProtocol(protocol: string): Promise<Appointment | null> {
    const list = this.readStorage();
    return list.find((a) => a.protocol === protocol) ?? null;
  }

  async createAppointment(
    appointment: Appointment,
  ): Promise<Result<Appointment, CreateAppointmentError>> {
    return this.withLock(async () => {
      const currentList = this.readStorage();

      // 1. Verificação de Idempotência
      const existingByIdempotency = currentList.find(
        (a) => a.idempotencyKey === appointment.idempotencyKey,
      );
      if (existingByIdempotency) {
        return { ok: true, value: existingByIdempotency };
      }

      // 2. Revalidação Imediata (Double-Check) contra Colisão
      const targetStart = new Date(appointment.startTime);
      const targetEnd = new Date(appointment.endTime);

      const hasCollision = currentList.some((existing) => {
        if (existing.status === "CANCELLED") return false;
        if (existing.professionalId !== appointment.professionalId) return false;

        const existingStart = new Date(existing.startTime);
        const existingEnd = new Date(existing.endTime);

        return intervalsOverlap(targetStart, targetEnd, existingStart, existingEnd);
      });

      if (hasCollision) {
        return { ok: false, error: "SLOT_TAKEN" };
      }

      // 3. Persistência Atômica
      const updatedList = [...currentList, appointment];
      const success = this.writeStorage(updatedList);

      if (!success) {
        return { ok: false, error: "STORAGE_ERROR" };
      }

      return { ok: true, value: appointment };
    });
  }

  async updateStatus(
    id: string,
    targetStatus: AppointmentStatus,
  ): Promise<Result<Appointment, string>> {
    return this.withLock(async () => {
      const currentList = this.readStorage();
      const index = currentList.findIndex((a) => a.id === id);

      if (index === -1) {
        return { ok: false, error: "Agendamento não encontrado." };
      }

      const existing = currentList[index];
      const transitionResult = transitionStatus(existing.status, targetStatus);
      if (!transitionResult.ok) {
        return { ok: false, error: transitionResult.error };
      }

      const updated: Appointment = {
        ...existing,
        status: targetStatus,
      };

      currentList[index] = updated;
      this.writeStorage(currentList);

      return { ok: true, value: updated };
    });
  }

  subscribe(callback: (appointments: Appointment[]) => void): () => void {
    this.subscribers.add(callback);
    callback(this.readStorage());

    return () => {
      this.subscribers.delete(callback);
    };
  }
}

export const localBookingRepository = new LocalBookingRepository();
