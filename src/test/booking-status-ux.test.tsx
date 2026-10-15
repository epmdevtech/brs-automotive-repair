import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  getStatusLabel,
  getStatusBadgeClass,
  getStatusBorderClass,
  getStatusDotClass,
} from "../features/booking/domain/status";
import { StatusBadge } from "../features/booking/ui/status-badge";
import { AdminGridView } from "../features/booking/ui/admin/admin-grid-view";
import { CustomerProcessDialog } from "../features/booking/ui/admin/customer-process-dialog";
import { localBookingRepository } from "../features/booking/data/local/local-repository";
import type { Appointment } from "../features/booking/domain/types";

describe("Domain: Status Semantics & Styling (SPEC-051)", () => {
  it("assigns strict semantic labels to each appointment state (AC-051-01)", () => {
    expect(getStatusLabel("PENDING")).toBe("Aberto");
    expect(getStatusLabel("CONFIRMED")).toBe("Em Andamento");
    expect(getStatusLabel("COMPLETED")).toBe("Concluído");
    expect(getStatusLabel("CANCELLED")).toBe("Cancelado");
    expect(getStatusLabel("NO_SHOW")).toBe("Fechado");
  });

  it("reserves emerald/green exclusively for COMPLETED status (AC-051-01)", () => {
    // Only COMPLETED may contain emerald
    expect(getStatusBadgeClass("COMPLETED")).toContain("emerald");
    expect(getStatusBorderClass("COMPLETED")).toContain("emerald");
    expect(getStatusDotClass("COMPLETED")).toContain("emerald");

    // CONFIRMED (in-progress) must be amber
    expect(getStatusBadgeClass("CONFIRMED")).toContain("amber");
    expect(getStatusBadgeClass("CONFIRMED")).not.toContain("emerald");
    expect(getStatusBorderClass("CONFIRMED")).toContain("amber");

    // PENDING (open) must be sky/blue
    expect(getStatusBadgeClass("PENDING")).toContain("sky");
    expect(getStatusBadgeClass("PENDING")).not.toContain("emerald");
    expect(getStatusBorderClass("PENDING")).toContain("sky");

    // CANCELLED must be red
    expect(getStatusBadgeClass("CANCELLED")).toContain("red");
    expect(getStatusBadgeClass("CANCELLED")).not.toContain("emerald");
    expect(getStatusBorderClass("CANCELLED")).toContain("red");

    // NO_SHOW must be neutral/gray
    expect(getStatusBadgeClass("NO_SHOW")).toContain("neutral");
    expect(getStatusBadgeClass("NO_SHOW")).not.toContain("emerald");
    expect(getStatusBorderClass("NO_SHOW")).toContain("neutral");
  });
});

describe("UI: StatusBadge Component (RF-051-01)", () => {
  it("renders with appropriate status label and icon", () => {
    const { rerender } = render(<StatusBadge status="PENDING" />);
    expect(screen.getByText("Aberto")).toBeInTheDocument();

    rerender(<StatusBadge status="CONFIRMED" />);
    expect(screen.getByText("Em Andamento")).toBeInTheDocument();

    rerender(<StatusBadge status="COMPLETED" />);
    expect(screen.getByText("Concluído")).toBeInTheDocument();

    rerender(<StatusBadge status="CANCELLED" />);
    expect(screen.getByText("Cancelado")).toBeInTheDocument();

    rerender(<StatusBadge status="NO_SHOW" />);
    expect(screen.getByText("Fechado")).toBeInTheDocument();
  });

  it("supports size variants without breaking layout", () => {
    const { container } = render(<StatusBadge status="CONFIRMED" size="md" />);
    expect(container.firstChild).toHaveClass("text-xs");
  });
});

describe("UI: CustomerProcessDialog Disambiguation (RF-051-06)", () => {
  const mockAppointment: Appointment = {
    id: "app-test-999",
    protocol: "BRS-9999",
    trackingToken: "token-999",
    professionalId: "bruno-funilaria",
    serviceId: "funilaria-express",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: {
      name: "Carlos Teste",
      phone: "45999990000",
    },
    intake: {
      vehicle: {
        make: "Toyota",
        model: "Corolla",
        plate: "BRA2E19",
      },
      affectedAreas: ["capo"],
      damageType: "colisao-com-vinco",
      description: "Teste de status",
    },
    logistics: {
      type: "presencial",
    },
  };

  it("renders disambiguated 'Fechar Janela' button rather than ambiguous 'Fechar'", () => {
    const handleClose = vi.fn();
    render(
      <CustomerProcessDialog
        appointment={mockAppointment}
        open={true}
        onOpenChange={handleClose}
        onStatusChange={vi.fn()}
      />,
    );

    // Protocol badge is neutral
    expect(screen.getByText("BRS-9999")).toBeInTheDocument();
    // Modal close button is specifically "Fechar Janela"
    expect(screen.getByRole("button", { name: /Fechar Janela/i })).toBeInTheDocument();
    // Action buttons are explicit
    expect(screen.getByRole("button", { name: /Concluir Atendimento/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Cancelar$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Fechar \/ Ausente/i })).toBeInTheDocument();
  });

  it("triggers status transition on Concluir Atendimento click", async () => {
    const handleStatus = vi.fn().mockResolvedValue(true);
    render(
      <CustomerProcessDialog
        appointment={mockAppointment}
        open={true}
        onOpenChange={vi.fn()}
        onStatusChange={handleStatus}
      />,
    );

    const concludeBtn = screen.getByRole("button", { name: /Concluir Atendimento/i });
    fireEvent.click(concludeBtn);

    await waitFor(() => {
      expect(handleStatus).toHaveBeenCalledWith(
        mockAppointment.id,
        "COMPLETED",
        expect.objectContaining({ note: expect.stringContaining("concluído") }),
      );
    });
  });

  it("triggers status transition to NO_SHOW on Fechar / Ausente click", async () => {
    const handleStatus = vi.fn().mockResolvedValue(true);
    render(
      <CustomerProcessDialog
        appointment={mockAppointment}
        open={true}
        onOpenChange={vi.fn()}
        onStatusChange={handleStatus}
      />,
    );

    const noShowBtn = screen.getByRole("button", { name: /Fechar \/ Ausente/i });
    fireEvent.click(noShowBtn);

    await waitFor(() => {
      expect(handleStatus).toHaveBeenCalledWith(
        mockAppointment.id,
        "NO_SHOW",
        expect.objectContaining({ note: expect.stringContaining("encerrado administrativamente") }),
      );
    });
  });
});

describe("UI: AdminGridView KPIs & Operational Filter Bar (RF-051-04, RF-051-05)", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("renders semantic KPI counters for the day", () => {
    render(<AdminGridView onLogout={vi.fn()} />);

    expect(screen.getByText(/Total do Dia/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Em Andamento/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Concluídos/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Abertos/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Cancelados/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders the operational status filter bar and filters appointments in list view", async () => {
    render(<AdminGridView onLogout={vi.fn()} />);

    // Switch to list view
    const listTab = screen.getByRole("button", { name: /Lista/i });
    fireEvent.click(listTab);

    expect(screen.getByText(/Listagem Cronológica de Atendimentos/i)).toBeInTheDocument();

    // Find filter buttons
    const filterAll = screen.getByRole("button", { name: /Todos \(/i });
    const filterConcluidos = screen.getByRole("button", { name: /Concluídos \(/i });

    expect(filterAll).toBeInTheDocument();
    expect(filterConcluidos).toBeInTheDocument();

    // Click on Concluídos filter
    fireEvent.click(filterConcluidos);

    // Verify filter is active
    expect(filterConcluidos).toHaveClass("bg-emerald-600");
  });
});
