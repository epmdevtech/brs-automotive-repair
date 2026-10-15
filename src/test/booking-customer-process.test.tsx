import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { CustomerProcessDialog } from "../features/booking/ui/admin/customer-process-dialog";
import { AdminGridView } from "../features/booking/ui/admin/admin-grid-view";
import { generateDemoAppointments, ensureSeedData } from "../features/booking/domain/seed";
import type { Appointment } from "../features/booking/domain/types";

describe("UI: CustomerProcessDialog (SPEC-049)", () => {
  const mockAppointment: Appointment = {
    id: "test-app-1",
    protocol: "#BRS-9999",
    serviceId: "avaliacao-funilaria",
    professionalId: "bruno-tecnico",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    status: "CONFIRMED",
    customer: {
      name: "Marcelo Silveira",
      phone: "+5545999887766",
      rawPhone: "(45) 99988-7766",
      notes: "Avaliação técnica urgente para envio à seguradora.",
      consentLgpd: true,
    },
    intake: {
      vehicle: {
        make: "Toyota",
        model: "Corolla Cross",
        year: "2023",
        plate: "BRS-2026",
        color: "Prata Névoa",
        finishType: "metalica",
      },
      affectedAreas: ["para-choque-dianteiro", "capo"],
      damageType: "colisao-com-vinco",
      description: "Colisão leve frontal em semáforo com amassado no bico do capô.",
      isInsurance: true,
    },
    logistics: {
      type: "leva-e-traz",
      address: "Rua Almirante Barroso, 500",
      neighborhood: "Vila Becker",
      city: "Toledo",
      referencePoint: "Próximo à PUC Toledo",
      vehicleDrivable: true,
      contactPerson: "Marcelo",
    },
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // Cadastrado há 2 horas
    idempotencyKey: "test-idem-9999",
  };

  it("renders customer process details, registration timestamp (quando cadastrou) and vehicle data", () => {
    render(
      <CustomerProcessDialog appointment={mockAppointment} open={true} onOpenChange={vi.fn()} />,
    );

    // Protocolo e Nome
    expect(screen.getByText("#BRS-9999")).toBeInTheDocument();
    expect(
      screen.getByText(/Processo Completo do Cliente • Marcelo Silveira/i),
    ).toBeInTheDocument();

    // Destaque "Quando Cadastrou"
    expect(screen.getByText(/Registro de Cadastro do Cliente/i)).toBeInTheDocument();
    expect(screen.getByText(/Cadastrado em/i)).toBeInTheDocument();
    expect(screen.getByText(/Portal Web BRS/i)).toBeInTheDocument();

    // Ficha do Veículo e Placa
    expect(screen.getAllByText(/Toyota Corolla Cross/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("BRS-2026")).toBeInTheDocument();
    expect(screen.getByText(/Prata Névoa/i)).toBeInTheDocument();

    // Timeline de etapas automotivas reais (SPEC-057)
    expect(screen.getAllByText(/Cadastro e agendamento confirmado/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Veículo recebido na oficina/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Vistoria técnica e diagnóstico/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Aprovação do orçamento/i)[0]).toBeInTheDocument();

    // Logística Leva e Traz em Toledo
    expect(screen.getByText(/Rua Almirante Barroso, 500/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Vila Becker/i).length).toBeGreaterThanOrEqual(1);

    // Anamnese
    expect(screen.getByText(/Colisão leve frontal em semáforo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Seguradora \/ Sinistro/i).length).toBeGreaterThanOrEqual(1);
  });

  it("allows completing the appointment directly from the process modal", async () => {
    const handleStatusChange = vi.fn().mockResolvedValue(true);
    const handleOpenChange = vi.fn();

    render(
      <CustomerProcessDialog
        appointment={mockAppointment}
        open={true}
        onOpenChange={handleOpenChange}
        onStatusChange={handleStatusChange}
      />,
    );

    const completeBtn = screen.getByRole("button", { name: /Concluir Atendimento/i });
    fireEvent.click(completeBtn);

    expect(handleStatusChange).toHaveBeenCalledWith(
      "test-app-1",
      "COMPLETED",
      expect.objectContaining({
        note: expect.any(String),
      }),
    );
  });
});

describe("Integration: AdminGridView opening CustomerProcessDialog (SPEC-049)", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("opens customer process dialog when clicking on an appointment card in the grid", () => {
    render(<AdminGridView onLogout={vi.fn()} />);

    // Seed runs automatically on mount
    const cardTitle = screen.getByText("Roberto Albuquerque");
    expect(cardTitle).toBeInTheDocument();

    // Clica no card para expandir
    fireEvent.click(cardTitle);

    // O modal abre com o processo completo e dados de quando cadastrou
    expect(
      screen.getByText(/Processo Completo do Cliente • Roberto Albuquerque/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Registro de Cadastro do Cliente/i)).toBeInTheDocument();
    expect(screen.getAllByText(/RHZ-9B21/i).length).toBeGreaterThanOrEqual(2);
  });

  it("opens customer process dialog from the list view", () => {
    render(<AdminGridView onLogout={vi.fn()} />);

    // Muda para aba lista
    const listTab = screen.getByRole("button", { name: /Lista/i });
    fireEvent.click(listTab);

    // Botões "Ver Processo"
    const viewButtons = screen.getAllByRole("button", { name: /Ver Processo/i });
    expect(viewButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(viewButtons[0]);

    // O modal deve estar visível
    expect(screen.getByText(/Registro de Cadastro do Cliente/i)).toBeInTheDocument();
  });
});
