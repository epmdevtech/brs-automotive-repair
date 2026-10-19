import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/brs/hero";
import { FinalCTA } from "@/components/brs/final-cta";
import { Route as SobreRoute } from "@/routes/sobre";
import { Route as ServicosRoute } from "@/routes/servicos/index";

const SobrePage = SobreRoute.options.component!;
const ServicosIndex = ServicosRoute.options.component!;

describe("SPEC-038 — Remoção de Artefatos Genéricos de IA (OFICINA ATIVA, Badges LED e Botões All-Caps)", () => {
  it("AC-038-01: Garante ausência total do badge 'OFICINA ATIVA' e do ponto verde pulsante na rota /sobre", () => {
    const { container } = render(<SobrePage />);

    // Não deve existir o texto 'OFICINA ATIVA'
    expect(screen.queryByText(/OFICINA ATIVA/i)).toBeNull();

    // Não deve existir o identificador tech 'Master.HQ // TOLEDO-PR'
    expect(screen.queryByText(/Master\.HQ \/\/ TOLEDO-PR/i)).toBeNull();

    // Não deve haver nenhum ponto pulsante verde no card
    const greenPulse = container.querySelector(".bg-emerald-400.animate-pulse");
    expect(greenPulse).toBeNull();

    // Deve exibir identificador institucional limpo
    expect(screen.getByText(/Oficina em Toledo, Paraná/i)).toBeInTheDocument();
  });

  it("AC-038-02: Hero não renderiza caixa pill com borda nem ponto de LED pulsante no eyebrow", () => {
    const { container } = render(<Hero />);

    // Não deve existir a classe de pulsação artificial de LED
    const ledPulse = container.querySelector(".led-status-pulse");
    expect(ledPulse).toBeNull();

    // O eyebrow deve existir como texto tipográfico elegante e limpo
    const eyebrow = container.querySelector(".eyebrow");
    expect(eyebrow).not.toBeNull();
    expect(eyebrow?.textContent).toContain("Oficina Técnica Especializada • Toledo, PR");

    // Não deve conter a caixa escura pill com backdrop-blur
    expect(container.querySelector(".bg-black\\/45")).toBeNull();
  });

  it("AC-038-03: FinalCTA e página de Serviços não contêm botões em caixa alta forçada 'SOLICITAR AVALIAÇÃO'", () => {
    const { container: ctaContainer } = render(<FinalCTA />);
    const { container: servicosContainer } = render(<ServicosIndex />);

    // Nenhum dos botões deve ter texto todo em maiúsculas
    expect(ctaContainer.textContent).not.toContain("SOLICITAR AVALIAÇÃO");
    expect(servicosContainer.textContent).not.toContain("SOLICITAR AVALIAÇÃO");

    // Devem conter o texto em formatação natural (sentence-case)
    expect(screen.getAllByRole("link", { name: /solicitar avaliação/i }).length).toBeGreaterThan(0);
  });
});
