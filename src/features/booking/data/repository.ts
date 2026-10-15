import type {
  Appointment,
  AppointmentEvent,
  AppointmentEventType,
  AppointmentStatus,
  Result,
} from "../domain/types";

export type CreateAppointmentError = "SLOT_TAKEN" | "IDEMPOTENT_DUPLICATE" | "STORAGE_ERROR";

export interface BookingRepository {
  listAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: string): Promise<Appointment | null>;
  getAppointmentByProtocol(protocol: string): Promise<Appointment | null>;
  createAppointment(appointment: Appointment): Promise<Result<Appointment, CreateAppointmentError>>;
  updateStatus(
    id: string,
    status: AppointmentStatus,
    options?: {
      actorId?: string;
      actorName?: string;
      note?: string;
      eventType?: AppointmentEventType;
      visibleToCustomer?: boolean;
      metadata?: Record<string, unknown>;
    },
  ): Promise<Result<Appointment, string>>;
  subscribe(callback: (appointments: Appointment[]) => void): () => void;
}
