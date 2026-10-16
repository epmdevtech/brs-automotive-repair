import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import { localBookingRepository } from "@/features/booking/data/local/local-repository";
import {
  concluirEtapa,
  reverterEtapa,
  writeAllEtapaEvents,
  ensureInitialEtapaEvents,
  type EventoEtapa,
} from "@/features/booking/domain/etapas";
import { ProcessStepper } from "@/features/booking/ui/admin/process-stepper";
import { StatusBadge } from "@/features/booking/ui/status-badge";
import type { Appointment } from "@/features/booking/domain/types";

describe("SPEC-065 — Sincronização da Linha do Tempo Operacional e Hidratação SSR em /agendamentos", () => {
  const sampleAppointment: Appointment = {
    id: "seed-app-1",
    protocol: "#BRS-8412",
    serviceId: "avaliacao-funilaria",
    professionalId: "bruno-tecnico",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: "COMPLETED",
    customer: {
      name: "Roberto Albuquerque",
      phone: "+5545998214320",
      rawPhone: "(45) 99821-4320",
      consentLgpd: true,
    },
    intake: {
      vehicle: {
        make: "Toyota",
        model: "Corolla Altis",
        year: "2022",
        plate: "RHZ-9B21",
      },
      affectedAreas: ["para-choque-dianteiro"],
      damageType: "colisao-com-vinco",
    },
    logistics: {
      type: "presencial",
    },
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    idempotencyKey: "seed-idem-1",
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("AC-065-03: reconcilia automaticamente agendamentos com status COMPLETED mas linha do tempo em andamento (Etapa 5 de 6 · 4 concluídas)", async () => {
    // Simula o cenário reportado: agendamento salvo como COMPLETED, mas com 4 etapas concluídas (Etapa 5 em execução)
    localStorage.setItem("brs_appointments_v1", JSON.stringify([sampleAppointment]));

    const fourCompletedEvents: EventoEtapa[] = [
      {
        id: "ev1",
        agendamentoId: sampleAppointment.id,
        etapa: "agendamento_confirmado",
        tipo: "concluida",
        porNome: "Sistema",
        papel: "sistema",
        em: new Date(Date.now() - 3000_000).toISOString(),
      },
      {
        id: "ev2",
        agendamentoId: sampleAppointment.id,
        etapa: "veiculo_recebido",
        tipo: "concluida",
        porNome: "Bruno",
        papel: "admin",
        em: new Date(Date.now() - 2400_000).toISOString(),
      },
      {
        id: "ev3",
        agendamentoId: sampleAppointment.id,
        etapa: "vistoria_diagnostico",
        tipo: "concluida",
        porNome: "Bruno",
        papel: "admin",
        em: new Date(Date.now() - 1800_000).toISOString(),
      },
      {
        id: "ev4",
        agendamentoId: sampleAppointment.id,
        etapa: "aprovacao_orcamento",
        tipo: "concluida",
        porNome: "Bruno",
        papel: "admin",
        em: new Date(Date.now() - 600_000).toISOString(),
      },
    ];
    writeAllEtapaEvents(fourCompletedEvents);

    const list = await localBookingRepository.listAppointments();
    expect(list[0].status).toBe("CONFIRMED");

    render(
      <div>
        <StatusBadge status={list[0].status} />
        <ProcessStepper status={list[0].status} appointmentId={list[0].id} />
      </div>,
    );

    expect(screen.getByText("Em Andamento")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Etapa atual da reparação: Execução (5 de 6)"),
    ).toBeInTheDocument();
  });

  it("AC-065-01 & AC-065-02: atualiza status e ProcessStepper na mesma aba ao avançar para a conclusão e ao reverter etapa", async () => {
    const activeApp: Appointment = { ...sampleAppointment, status: "PENDING" };
    localBookingRepository.clearAndSeed([activeApp]);
    ensureInitialEtapaEvents(activeApp.id, activeApp.customer.name, activeApp.createdAt);

    let latestAppointments: Appointment[] = [];
    const unsubscribe = localBookingRepository.subscribe((apps) => {
      latestAppointments = apps;
    });

    const { rerender } = render(
      <ProcessStepper status={activeApp.status} appointmentId={activeApp.id} />,
    );

    expect(
      screen.getByLabelText("Etapa atual da reparação: Recebimento (2 de 6)"),
    ).toBeInTheDocument();

    // Concluir etapa 2 -> Status deve mudar de PENDING ("Aberto") para CONFIRMED ("Em Andamento")
    act(() => {
      concluirEtapa({
        agendamentoId: activeApp.id,
        etapa: "veiculo_recebido",
        etapaEsperada: "veiculo_recebido",
        autorNome: "Admin",
        papel: "admin",
      });
    });

    expect(latestAppointments[0].status).toBe("CONFIRMED");
    expect(
      screen.getByLabelText("Etapa atual da reparação: Vistoria (3 de 6)"),
    ).toBeInTheDocument();

    // Concluir etapas 3, 4, 5 e 6 (6a + 6b)
    act(() => {
      concluirEtapa({
        agendamentoId: activeApp.id,
        etapa: "vistoria_diagnostico",
        etapaEsperada: "vistoria_diagnostico",
        autorNome: "Admin",
        papel: "admin",
      });
      concluirEtapa({
        agendamentoId: activeApp.id,
        etapa: "aprovacao_orcamento",
        etapaEsperada: "aprovacao_orcamento",
        autorNome: "Admin",
        papel: "admin",
      });
      concluirEtapa({
        agendamentoId: activeApp.id,
        etapa: "execucao_pdr",
        etapaEsperada: "execucao_pdr",
        autorNome: "Admin",
        papel: "admin",
      });
      concluirEtapa({
        agendamentoId: activeApp.id,
        etapa: "qualidade_entrega",
        acao: "aprovar_qualidade",
        etapaEsperada: "qualidade_entrega",
        autorNome: "Admin",
        papel: "admin",
      });
      concluirEtapa({
        agendamentoId: activeApp.id,
        etapa: "qualidade_entrega",
        acao: "registrar_entrega",
        etapaEsperada: "qualidade_entrega",
        autorNome: "Admin",
        papel: "admin",
      });
    });

    expect(latestAppointments[0].status).toBe("COMPLETED");
    rerender(<ProcessStepper status={latestAppointments[0].status} appointmentId={activeApp.id} />);
    expect(screen.getByText("Entrega Técnica Concluída")).toBeInTheDocument();

    // Reverter etapa 6 -> Status deve voltar automaticamente de COMPLETED para CONFIRMED ("Em Andamento")
    act(() => {
      const rev = reverterEtapa({
        agendamentoId: activeApp.id,
        etapa: "qualidade_entrega",
        justificativa: "Ajuste complementar de controle de qualidade antes da entrega",
        autorNome: "Admin",
        papel: "admin",
      });
      expect(rev.sucesso).toBe(true);
    });

    expect(latestAppointments[0].status).toBe("CONFIRMED");
    rerender(<ProcessStepper status={latestAppointments[0].status} appointmentId={activeApp.id} />);
    expect(screen.queryByText("Entrega Técnica Concluída")).toBeNull();
    expect(screen.getByText("Qualidade e entrega")).toBeInTheDocument();

    unsubscribe();
  });

  it("AC-065-04: rota /agendamentos inicializa estado de autenticação de forma determinística para evitar erro de hidratação SSR", () => {
    const routeSource = fs.readFileSync(
      path.resolve(process.cwd(), "src/routes/agendamentos.tsx"),
      "utf-8",
    );
    expect(routeSource).not.toContain("useState(() => isAdminAuthenticated())");
    expect(routeSource).toContain("useState(false)");
  });
});
