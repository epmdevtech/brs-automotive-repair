import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Website } from "@/components/brs/website";
import {
  clamp01,
  indexStyle,
  pointerOffset,
  progressFromRect,
  reveal,
  shouldSimplifyMotion,
  trackPointer,
} from "@/lib/motion";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Motion utilities", () => {
  it("limits scroll progress between 0 and 1", () => {
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(9)).toBe(1);
  });

  it("maps element position to a deterministic progress", () => {
    const viewport = 1000;
    expect(progressFromRect(950, viewport)).toBe(0);
    expect(progressFromRect(200, viewport)).toBe(1);
    expect(progressFromRect(575, viewport)).toBeCloseTo(0.5, 5);
    expect(progressFromRect(5000, viewport)).toBe(0);
    expect(progressFromRect(-5000, viewport)).toBe(1);
  });

  it("returns the final state for invalid viewports", () => {
    expect(progressFromRect(100, 0)).toBe(1);
  });

  it("builds sequence and reveal props without hiding content by default", () => {
    expect(indexStyle(3)).toEqual({ "--i": 3 });
    expect(reveal(2)["data-reveal"]).toBe("");
    expect(reveal(99).style).toEqual({ "--i": 5 });
  });

  it("computes the pointer offset inside a card", () => {
    expect(pointerOffset({ left: 100, top: 50 }, 160, 90)).toEqual({ x: 60, y: 40 });
  });

  it("tracks the spotlight only for mouse pointers", () => {
    const card = document.createElement("article");
    card.getBoundingClientRect = () => ({ left: 10, top: 20 }) as DOMRect;

    trackPointer({ pointerType: "touch", clientX: 50, clientY: 60, currentTarget: card });
    expect(card.style.getPropertyValue("--mx")).toBe("");

    trackPointer({ pointerType: "mouse", clientX: 50, clientY: 60, currentTarget: card });
    expect(card.style.getPropertyValue("--mx")).toBe("40px");
    expect(card.style.getPropertyValue("--my")).toBe("40px");
  });

  it("simplifies motion for reduced motion, data saver and low memory devices", () => {
    expect(shouldSimplifyMotion()).toBe(false);

    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    expect(shouldSimplifyMotion()).toBe(true);
    vi.unstubAllGlobals();

    vi.stubGlobal("navigator", { connection: { saveData: true } });
    expect(shouldSimplifyMotion()).toBe(true);
    vi.unstubAllGlobals();

    vi.stubGlobal("navigator", { deviceMemory: 1 });
    expect(shouldSimplifyMotion()).toBe(true);
  });
});

describe("Website motion layer", () => {
  it("keeps the headline readable and the CTA destinations unchanged", () => {
    render(<Website />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "BRS Reparações Automotivas.",
    );

    const evaluation = screen.getAllByRole("link", { name: /Solicitar avaliação/ });
    expect(evaluation.length).toBeGreaterThan(1);
    evaluation.forEach((link) => expect(link).toHaveAttribute("href", "/contato"));

    expect(screen.getByRole("link", { name: /Conhecer os serviços/ })).toHaveAttribute(
      "href",
      "/servicos",
    );
  });

  it("keeps all content visible when scroll observers are unavailable", () => {
    const { container } = render(<Website />);

    expect(container.querySelectorAll('[data-reveal="hidden"]')).toHaveLength(0);

    const expand = screen.getByRole("region", { name: "Acabamento em pintura automotiva" });
    expect(expand.style.getPropertyValue("--p")).toBe("1");
  });

  it("labels illustrative media in the cinematic transition", () => {
    render(<Website />);
    const expand = screen.getByRole("region", { name: "Acabamento em pintura automotiva" });
    expect(expand).toHaveTextContent("Fotografia ilustrativa");
  });
});
