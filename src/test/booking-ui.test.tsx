import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookingDialog } from "../features/booking/ui/booking-dialog";
import { AdminBookingDashboard } from "../features/booking/ui/admin/admin-dashboard";

describe("UI: BookingDialog (Intake Pré-OS & Guincho)", () => {
  it("renders the dialog with Step 1 Vehicle & Damage Intake when open", () => {
    render(<BookingDialog open={true} onOpenChange={() => {}} />);

    expect(screen.getByText(/Identificação do Veículo & Triagem de Avarias/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex: Volkswagen, Toyota, Fiat/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex: Corolla Cross, Polo Track/i)).toBeInTheDocument();
  });

  it("advances through the wizard steps when valid data is entered", async () => {
    render(<BookingDialog open={true} onOpenChange={() => {}} />);

    // Step 1: Preencher Veículo
    const makeInput = screen.getByPlaceholderText(/Ex: Volkswagen, Toyota, Fiat/i);
    const modelInput = screen.getByPlaceholderText(/Ex: Corolla Cross, Polo Track/i);

    fireEvent.change(makeInput, { target: { value: "Toyota" } });
    fireEvent.change(modelInput, { target: { value: "Corolla" } });

    // Selecionar ao menos uma peça
    const bumperButton = screen.getByText("Para-choque Dianteiro");
    fireEvent.click(bumperButton);

    // Clicar em Avançar para Step 2
    const nextBtn = screen.getByRole("button", { name: /Avançar/i });
    fireEvent.click(nextBtn);

    // Deve estar no Step 2: Especialidade Técnica Desejada
    expect(await screen.findByText(/Especialidade Técnica Desejada/i)).toBeInTheDocument();

    // Avançar para Step 3: Modalidade
    fireEvent.click(screen.getByRole("button", { name: /Avançar/i }));

    expect(await screen.findByText(/Modalidade de Atendimento & Guincho/i)).toBeInTheDocument();
    expect(screen.getByText(/Serviço de Guincho \(Toledo-PR\)/i)).toBeInTheDocument();
  });
});

describe("UI: AdminBookingDashboard", () => {
  it("renders the admin dashboard header, metrics and search input", () => {
    render(<AdminBookingDashboard />);

    expect(screen.getByText(/Painel de Agendamentos Master/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirmados \(Agenda\)/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Buscar por cliente, telefone, protocolo/i),
    ).toBeInTheDocument();
  });
});
