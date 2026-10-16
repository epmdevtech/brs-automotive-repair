import type {
  Appointment,
  AppointmentEventType,
  AppointmentStatus,
  Result,
  SyncMessage,
} from "../../domain/types";
import { intervalsOverlap } from "../../domain/time";
import { transitionStatus } from "../../domain/status";
import { recordAppointmentEvent } from "../../domain/events";
import {
  ETAPA_SYNC_DOM_EVENT,
  reconciliarStatusAgendamentosComEtapas,
  garantirTodasEtapasConcluidas,
} from "../../domain/etapas";
import { BRS_BOOKING_CONFIG } from "../../config/booking.config";
import type { BookingRepository, CreateAppointmentError } from "../repository";

export class LocalBookingRepository implements BookingRepository {
  private storageKey: string;
  private lockName: string;
  private channel: BroadcastChannel | null = null;
  private subscribers: Set<(appointments: Appointment[]) => void> = new Set();
  private instanceId: string;
  private processedMessageIds = new Set<string>();
  private handleEtapaSync = () => {
    this.notifySubscribers();
  };

  constructor(
    storageKey: string = BRS_BOOKING_CONFIG.storageKey,
    lockName: string = BRS_BOOKING_CONFIG.lockName,
    syncChannelName: string = BRS_BOOKING_CONFIG.syncChannelName,
  ) {
    this.storageKey = storageKey;
    this.lockName = lockName;
    this.instanceId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `tab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      window.addEventListener(ETAPA_SYNC_DOM_EVENT, this.handleEtapaSync);
    }

    if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
      try {
        this.channel = new BroadcastChannel(syncChannelName);
        this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
          const data = event.data;
          if (!data || typeof data !== "object") {
            this.notifySubscribers();
            return;
          }

          // 1. Ignorar mensagens geradas pela própria instância
          if (data.originId === this.instanceId) {
            return;
          }

          // 2. Prevenir processamento duplicado de mensagens
          if (data.messageId && this.processedMessageIds.has(data.messageId)) {
            return;
          }

          if (data.messageId) {
            this.processedMessageIds.add(data.messageId);
            if (this.processedMessageIds.size > 200) {
              const firstKey = this.processedMessageIds.values().next().value;
              if (firstKey) this.processedMessageIds.delete(firstKey);
            }
          }

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
      const parsed = JSON.parse(raw) as Appointment[];
      if (this.storageKey === BRS_BOOKING_CONFIG.storageKey && Array.isArray(parsed)) {
        const { list, changed } = reconciliarStatusAgendamentosComEtapas(parsed);
        if (changed) {
          localStorage.setItem(this.storageKey, JSON.stringify(list));
        }
        return list;
      }
      return parsed;
    } catch {
      return [];
    }
  }

  private writeStorage(
    appointments: Appointment[],
    syncInfo?: { type: SyncMessage["type"]; recordId?: string },
  ): boolean {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return false;
    }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(appointments));

      const message: SyncMessage = {
        originId: this.instanceId,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        type: syncInfo?.type ?? "MUTATION",
        recordId: syncInfo?.recordId,
        timestamp: Date.now(),
      };

      this.channel?.postMessage(message);
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
    return this.writeStorage(appointments, { type: "SEED_RESET" });
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
      const success = this.writeStorage(updatedList, {
        type: "APPOINTMENT_CREATED",
        recordId: appointment.id,
      });

      if (!success) {
        return { ok: false, error: "STORAGE_ERROR" };
      }

      // Registra evento de criação
      recordAppointmentEvent({
        appointmentId: appointment.id,
        type: "CREATED",
        fromStatus: undefined,
        toStatus: appointment.status,
        createdAt: appointment.createdAt,
        actorId: "customer",
        actorName: appointment.customer.name,
        note: "Agendamento registrado no portal BRS",
        visibleToCustomer: true,
      });

      return { ok: true, value: appointment };
    });
  }

  async updateStatus(
    id: string,
    targetStatus: AppointmentStatus,
    options?: {
      actorId?: string;
      actorName?: string;
      note?: string;
      eventType?: AppointmentEventType;
      visibleToCustomer?: boolean;
      metadata?: Record<string, unknown>;
    },
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

      if (targetStatus === "COMPLETED" && this.storageKey === BRS_BOOKING_CONFIG.storageKey) {
        garantirTodasEtapasConcluidas(
          id,
          options?.actorName ?? "Administrador BRS",
          existing.createdAt,
        );
      }

      const saved = this.writeStorage(currentList, {
        type: "APPOINTMENT_UPDATED",
        recordId: id,
      });

      if (!saved) {
        return { ok: false, error: "Falha ao persistir status no armazenamento local." };
      }

      // 4. Registra no histórico append-only de eventos
      const defaultEventType: AppointmentEventType =
        targetStatus === "COMPLETED"
          ? "COMPLETED"
          : targetStatus === "CANCELLED"
            ? "CANCELLED"
            : targetStatus === "CONFIRMED"
              ? "CONFIRMED"
              : "CONFIRMED";

      recordAppointmentEvent({
        appointmentId: id,
        type: options?.eventType ?? defaultEventType,
        fromStatus: existing.status,
        toStatus: targetStatus,
        actorId: options?.actorId ?? "admin",
        actorName: options?.actorName ?? "Administrador BRS",
        note: options?.note,
        visibleToCustomer: options?.visibleToCustomer ?? true,
        metadata: options?.metadata,
      });

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

  close(): void {
    this.subscribers.clear();
    if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
      window.removeEventListener(ETAPA_SYNC_DOM_EVENT, this.handleEtapaSync);
    }
    if (this.channel) {
      this.channel.onmessage = null;
      this.channel.close();
      this.channel = null;
    }
  }
}

export const localBookingRepository = new LocalBookingRepository();

/**
 * Função de domínio centralizada para transição de status com registro de histórico append-only.
 */
export async function transitionAppointmentStatus(
  id: string,
  targetStatus: AppointmentStatus,
  options?: {
    actorId?: string;
    actorName?: string;
    note?: string;
    eventType?: AppointmentEventType;
    visibleToCustomer?: boolean;
    metadata?: Record<string, unknown>;
  },
): Promise<Result<Appointment, string>> {
  return localBookingRepository.updateStatus(id, targetStatus, options);
}
