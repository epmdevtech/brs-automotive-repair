import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BackToTop } from "@/components/ui/back-to-top";

describe("BackToTop component (SPEC-024)", () => {
  it("renders with proper accessibility labels and starts invisible when scrollY <= 400", () => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    render(<BackToTop />);

    const button = screen.getByRole("button", { name: "Voltar ao topo da página" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Voltar ao topo");
    expect(button).toHaveAttribute("tabindex", "-1");
    expect(button).toHaveClass("invisible");
    expect(button).toHaveClass("opacity-0");
  });

  it("becomes visible and focusable when window.scrollY > 400", () => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    render(<BackToTop />);

    const button = screen.getByRole("button", { name: "Voltar ao topo da página" });
    expect(button).toHaveClass("invisible");

    // Simula scroll para além do limiar de 400px
    Object.defineProperty(window, "scrollY", { value: 650, writable: true });
    fireEvent.scroll(window);

    expect(button).toHaveClass("visible");
    expect(button).toHaveClass("opacity-100");
    expect(button).toHaveAttribute("tabindex", "0");
  });

  it("calls window.scrollTo with top: 0 and smooth behavior on click", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    render(<BackToTop />);

    const button = screen.getByRole("button", { name: "Voltar ao topo da página" });
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({
        top: 0,
      }),
    );
  });
});
