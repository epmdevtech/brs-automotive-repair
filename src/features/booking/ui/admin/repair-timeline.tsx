import type { Appointment, AppointmentEvent } from "../../domain/types";
import { TimelineOperacional } from "./timeline-operacional";

export interface RepairTimelineProps {
  appointment: Appointment;
  events?: AppointmentEvent[];
  className?: string;
  showAuditLog?: boolean;
}

/**
 * Adaptador de compatibilidade para a Linha do Tempo Operacional (SPEC-057).
 * Integra o modelo de dados append-only com RBAC e stepper responsivo.
 */
export function RepairTimeline({ appointment, className = "" }: RepairTimelineProps) {
  return (
    <TimelineOperacional
      agendamentoId={appointment.id}
      clienteNome={appointment.customer?.name}
      agendamentoCreatedAt={appointment.createdAt}
      isCancelado={appointment.status === "CANCELLED"}
      className={className}
    />
  );
}

export { TimelineOperacional };
