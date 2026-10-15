import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  generateDemoAppointments,
  generateDemoBlockedPeriods,
  ensureSeedData,
} from "../features/booking/domain/seed";
import { localBookingRepository } from "../features/booking/data/local/local-repository";
import { getBlockedPeriods } from "../features/booking/domain/blocks";
import { AdminGridView } from "../features/booking/ui/admin/admin-grid-view";

describe("Domain: Seed Data Generator (SPEC-048)", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("generates realistic demo appointments matching BRS business model", () => {
    const list = generateDemoAppointments();

    expect(list.length).toBeGreaterThanOrEqual(6);

    const corolla = list.find((a) => a.intake.vehicle.model.includes("Corolla"));
    expect(corolla).toBeDefined();
    expect(corolla?.customer.name).toBe("Roberto Albuquerque");
    expect(corolla?.intake.vehicle.plate).toBe("RHZ-9B21");
    expect(corolla?.serviceId).toBe("avaliacao-funilaria");
    expect(corolla?.status).toBe("CONFIRMED");

    const compass = list.find((a) => a.intake.vehicle.model.includes("Compass"));
    expect(compass).toBeDefined();
    expect(compass?.logistics.type).toBe("leva-e-traz");
    expect(compass?.logistics.city).toBe("Toledo");
    expect(compass?.logistics.address).toContain("Santos Dumont");

    const civic = list.find((a) => a.intake.vehicle.model.includes("Civic"));
    expect(civic).toBeDefined();
    expect(civic?.intake.damageType).toBe("granizo");
    expect(civic?.professionalId).toBe("tecnico-martelinho");

    const tracker = list.find((a) => a.intake.vehicle.model.includes("Tracker"));
    expect(tracker).toBeDefined();
    expect(tracker?.professionalId).toBe("tecnico-pintura");
  });

  it("generates demo blocked periods for the paint booth", () => {
    const blocks = generateDemoBlockedPeriods();
    expect(blocks.length).toBeGreaterThanOrEqual(1);

    const estufaBlock = blocks.find((b) => b.professionalId === "tecnico-pintura");
    expect(estufaBlock).toBeDefined();
    expect(estufaBlock?.reason).toContain("Estufa");
  });

  it("populates storage on ensureSeedData() when empty", () => {
    expect(getBlockedPeriods().length).toBe(0);

    const result = ensureSeedData(false);
    expect(result.appointments).toBeGreaterThanOrEqual(6);
    expect(result.blocks).toBeGreaterThanOrEqual(1);

    expect(getBlockedPeriods().length).toBeGreaterThanOrEqual(1);
  });

  it("does not overwrite existing appointments on ensureSeedData(false) if storage is populated", () => {
    ensureSeedData(false);

    // Call again with false
    const secondCall = ensureSeedData(false);
    expect(secondCall.appointments).toBe(0);
    expect(secondCall.blocks).toBe(0);
  });

  it("forces re-seed when ensureSeedData(true) is invoked", () => {
    ensureSeedData(false);

    const forceCall = ensureSeedData(true);
    expect(forceCall.appointments).toBeGreaterThanOrEqual(6);
    expect(forceCall.blocks).toBeGreaterThanOrEqual(1);
  });
});

describe("UI: AdminGridView with Seed Data (SPEC-048)", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("renders the 'Restaurar Dados Fictícios' button and populates appointments automatically", () => {
    render(<AdminGridView onLogout={vi.fn()} />);

    expect(screen.getByRole("button", { name: /Restaurar Dados Fictícios/i })).toBeInTheDocument();

    // The automatic seed runs on mount, so appointments are displayed
    expect(screen.getByText("Roberto Albuquerque")).toBeInTheDocument();
    expect(screen.getByText("Carlos Eduardo Mendes")).toBeInTheDocument();
  });

  it("displays success notification banner when clicking 'Restaurar Dados Fictícios'", () => {
    render(<AdminGridView onLogout={vi.fn()} />);

    const resetBtn = screen.getByRole("button", { name: /Restaurar Dados Fictícios/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText(/Dados fictícios carregados/i)).toBeInTheDocument();
  });
});
