import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/brs/hero";
import { AnimatedHero } from "@/components/brs/animated-hero";
import { HomeBeforeAfter } from "@/components/brs/home-before-after";
import { Services } from "@/components/brs/services";
import { Philosophy } from "@/components/brs/philosophy";
import { ProcessTimeline } from "@/components/brs/process-timeline";
import { HomePathways } from "@/components/brs/home-pathways";
import { FinalCTA } from "@/components/brs/final-cta";

describe("SPEC-037 — Refinamento UX/UI, Consolidação Visual e Otimização da Hierarquia Editorial", () => {
  it("AC-037-01: Hero possui CTA primário para avaliação, CTA secundário e sem marcas HUD artificiais", () => {
    const { container } = render(<Hero />);

    // CTA Primário para contato
    const primaryCta = screen.getByRole("link", { name: /solicitar avaliação/i });
    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveAttribute("href", "/contato");

    // CTA Secundário para especialidades
    const secondaryCta = screen.getByRole("link", { name: /ver especialidades/i });
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveAttribute("href", "#especialidades");

    // Eliminação de marcas HUD artificiais
    expect(screen.queryByText(/\+ BRS\.24/i)).toBeNull();
    expect(screen.queryByText(/COORD: 24°43'S/i)).toBeNull();

    // Faixa trust-strip removida do Hero (SPEC-039)
    expect(container.querySelector(".trust-strip")).toBeNull();

    // 3 Diferenciais técnicos incorporados com sucesso em Philosophy
    const { container: philContainer } = render(<Philosophy />);
    expect(philContainer.textContent).toContain("Reparação e pintura técnica de precisão");
    expect(philContainer.textContent).toContain("Diagnóstico honesto e transparente");
    expect(philContainer.textContent).toContain("Serviço de leva e traz em Toledo-PR");
  });

  it("AC-037-02: HomeBeforeAfter prioriza o slider e remove sobreposições HUD no frame", () => {
    const { container } = render(<HomeBeforeAfter />);

    // Slider interativo presente
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();

    // Ausência de sobreposições nos cantos do frame (+ ALIGN.X / + ALIGN.Y)
    expect(screen.queryByText(/\+ ALIGN\.X/i)).toBeNull();
    expect(screen.queryByText(/\+ ALIGN\.Y/i)).toBeNull();

    // CTA unificado direto para a galeria
    const galleryLink = screen.getByRole("link", { name: /ver galeria completa/i });
    expect(galleryLink).toBeInTheDocument();
    expect(galleryLink).toHaveAttribute("href", "/trabalhos");
  });

  it("AC-037-03: Services elimina tags decorativas redundantes e preserva as 3 especialidades", () => {
    render(<Services />);

    // Não contém rótulos decorativos '01 / ESPECIALIDADE'
    expect(screen.queryByText(/01 \/ ESPECIALIDADE/i)).toBeNull();
    expect(screen.queryByText(/02 \/ ESPECIALIDADE/i)).toBeNull();
    expect(screen.queryByText(/03 \/ ESPECIALIDADE/i)).toBeNull();

    // Especialidades presentes com links contextuais
    expect(screen.getByRole("link", { name: /conhecer funilaria/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /conhecer a pintura/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /entender o martelinho/i })).toBeInTheDocument();
  });

  it("AC-037-04: Services renderiza linha de estética automotiva em apresentação editorial compacta", () => {
    render(<Services />);

    expect(screen.getByText("Estética & Proteção")).toBeInTheDocument();
    expect(
      screen.getByText("Acabamento refinado e conservação de superfícies."),
    ).toBeInTheDocument();

    // Os 3 serviços complementares estão presentes
    expect(screen.getByText("Espelhamento de pintura automotiva")).toBeInTheDocument();
    expect(screen.getByText("Vitrificação cerâmica de pintura")).toBeInTheDocument();
    expect(screen.getByText("Polimento técnico de para-brisa")).toBeInTheDocument();
  });

  it("AC-037-05: Philosophy e ProcessTimeline compartilham fundo sutil unificado sem sobreposição de caixas cinzas pesadas", () => {
    const { container: philContainer } = render(<Philosophy />);
    const { container: procContainer } = render(<ProcessTimeline />);

    const philSection = philContainer.querySelector("section");
    const procSection = procContainer.querySelector("section");

    expect(philSection).not.toBeNull();
    expect(procSection).not.toBeNull();

    // Compartilham tom bg-secondary/20
    expect(philSection?.className).toContain("bg-secondary/20");
    expect(procSection?.className).toContain("bg-secondary/20");

    // ProcessTimeline mantém os 4 passos essenciais
    expect(screen.getByText("Primeiro contato")).toBeInTheDocument();
    expect(screen.getByText("Avaliação técnica")).toBeInTheDocument();
    expect(screen.getByText("Orçamento e alinhamento")).toBeInTheDocument();
    expect(screen.getByText("Reparação e conferência")).toBeInTheDocument();
  });

  it("AC-037-06: HomePathways utiliza fundo limpo para alternância visual de seções", () => {
    const { container } = render(<HomePathways />);
    const section = container.querySelector("section");

    expect(section).not.toBeNull();
    expect(section?.className).toContain("bg-background");
    expect(section?.className).not.toContain("bg-secondary");
  });

  it("AC-037-07: FinalCTA conduz diretamente ao agendamento de avaliação em Toledo-PR e canal oficial", () => {
    render(<FinalCTA />);

    const ctaButton = screen.getByRole("link", { name: /solicitar avaliação/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", "/contato");

    const instagramButton = screen.getByRole("link", { name: /conhecer o instagram/i });
    expect(instagramButton).toBeInTheDocument();
    expect(instagramButton).toHaveAttribute("href", "https://www.instagram.com/brsreparacoes/");

    expect(screen.getByText(/Toledo-PR/i)).toBeInTheDocument();
  });
});
