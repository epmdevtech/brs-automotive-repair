import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnimatedHero } from "@/components/brs/animated-hero";

describe("AnimatedHero component", () => {
  const dummyProps = {
    backgroundImageUrl: "/test-bg.jpg",
    title: "BRS Reparações Automotivas",
    description: "Recuperação estética e estrutural de alta precisão em Toledo.",
    ctaButton: {
      text: "Avaliação Gratuita",
      href: "#contato",
      onClick: vi.fn(),
    },
    secondaryCta: {
      text: "Conhecer Serviços",
      href: "#servicos",
      onClick: vi.fn(),
    },
  };

  it("renders the hero headline, description and viewport footer", () => {
    render(<AnimatedHero {...dummyProps} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "BRS Reparações Automotivas",
    );
    expect(
      screen.getByText("Recuperação estética e estrutural de alta precisão em Toledo."),
    ).toBeInTheDocument();
    expect(screen.getByText("Toledo, Paraná")).toBeInTheDocument();
    expect(screen.getByText("Fotografia ilustrativa")).toBeInTheDocument();
  });

  it("triggers ctaButton onClick and preserves anchor href destinations", () => {
    render(<AnimatedHero {...dummyProps} />);

    const primaryCta = screen.getByRole("link", { name: "Avaliação Gratuita" });
    expect(primaryCta).toHaveAttribute("href", "#contato");
    fireEvent.click(primaryCta);
    expect(dummyProps.ctaButton.onClick).toHaveBeenCalledTimes(1);

    const secondaryCta = screen.getByRole("link", { name: "Conhecer Serviços" });
    expect(secondaryCta).toHaveAttribute("href", "#servicos");
    fireEvent.click(secondaryCta);
    expect(dummyProps.secondaryCta.onClick).toHaveBeenCalledTimes(1);
  });

  it("renders buttons with onClick when href is not provided", () => {
    const onButtonClick = vi.fn();
    render(
      <AnimatedHero
        {...dummyProps}
        ctaButton={{
          text: "Clique Aqui",
          onClick: onButtonClick,
        }}
        secondaryCta={undefined}
      />,
    );

    const button = screen.getByRole("button", { name: "Clique Aqui" });
    fireEvent.click(button);
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });
});
