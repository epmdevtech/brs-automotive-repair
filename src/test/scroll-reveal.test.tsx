import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { HomePageContent, SiteLayout } from "@/components/brs/website";
import { FAQAccordion } from "@/components/brs/faq-accordion";
import { Contact } from "@/components/brs/contact";
import { Philosophy } from "@/components/brs/philosophy";
import { HomePathways } from "@/components/brs/home-pathways";
import { Hero } from "@/components/brs/hero";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SPEC-010 — Scroll Reveal Premium", () => {
  describe("Audit & Coverage: Reveal presence in sections", () => {
    it("renders FAQAccordion with data-reveal elements and staggered indexes", () => {
      const { container } = render(<FAQAccordion />);
      const reveals = container.querySelectorAll<HTMLElement>("[data-reveal]");
      expect(reveals.length).toBeGreaterThanOrEqual(2);
      expect(reveals[0]).toHaveAttribute("data-reveal");
      expect(reveals[0].style.getPropertyValue("--i")).toBe("0");
      expect(reveals[1].style.getPropertyValue("--i")).toBe("1");
    });

    it("renders Contact section with data-reveal on contact details and form", () => {
      const { container } = render(<Contact partner={false} />);
      const reveals = container.querySelectorAll<HTMLElement>("[data-reveal]");
      expect(reveals.length).toBeGreaterThanOrEqual(2);
      expect(reveals[0].style.getPropertyValue("--i")).toBe("0");
      expect(reveals[1].style.getPropertyValue("--i")).toBe("1");
    });

    it("renders Philosophy section with data-reveal on header and pillars", () => {
      const { container } = render(<Philosophy />);
      const reveals = container.querySelectorAll<HTMLElement>("[data-reveal]");
      expect(reveals.length).toBeGreaterThanOrEqual(2);
      expect(reveals[0].style.getPropertyValue("--i")).toBe("0");
      expect(reveals[1].style.getPropertyValue("--i")).toBe("1");
    });

    it("renders HomePathways section with data-reveal on header and cards", () => {
      const { container } = render(<HomePathways />);
      const reveals = container.querySelectorAll<HTMLElement>("[data-reveal]");
      expect(reveals.length).toBeGreaterThanOrEqual(2);
      expect(reveals[0].style.getPropertyValue("--i")).toBe("0");
    });

    it("ensures Hero section DOES NOT apply scroll reveal to prevent conflict with Framer Motion", () => {
      const { container } = render(<Hero />);
      // O Hero possui animação própria de entrada via Framer Motion no mount;
      // não deve possuir atributo [data-reveal] no container raiz.
      const heroSection = container.querySelector("#inicio");
      expect(heroSection).not.toBeNull();
      expect(heroSection?.hasAttribute("data-reveal")).toBe(false);
    });
  });

  describe("Progressive Enhancement & Motion Safety", () => {
    it("keeps all elements visible without data-reveal='hidden' during initial SSR/mount", () => {
      const { container } = render(
        <SiteLayout>
          <HomePageContent />
        </SiteLayout>,
      );
      // Em ambientes sem observer simulando scroll inicial, nada deve estar escondido com 'hidden'
      const hiddenElements = container.querySelectorAll('[data-reveal="hidden"]');
      expect(hiddenElements.length).toBe(0);
    });

    it("observes elements below the fold, reveals them on intersection, and unobserves them immediately (single execution)", () => {
      let observerCallback: (entries: IntersectionObserverEntry[]) => void = () => {};
      const unobserveMock = vi.fn();
      const observeMock = vi.fn();
      const disconnectMock = vi.fn();

      class MockIntersectionObserver {
        constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
          observerCallback = callback;
        }
        observe = observeMock;
        unobserve = unobserveMock;
        disconnect = disconnectMock;
      }

      vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

      const targetEl = document.createElement("div");
      targetEl.setAttribute("data-reveal", "");
      targetEl.getBoundingClientRect = () =>
        ({ top: 1200, bottom: 1300, left: 0, right: 100, width: 100, height: 100 }) as DOMRect;
      document.body.appendChild(targetEl);

      const TestComponent = () => {
        useScrollReveal();
        return null;
      };

      render(<TestComponent />);

      expect(targetEl.getAttribute("data-reveal")).toBe("hidden");
      expect(observeMock).toHaveBeenCalledWith(targetEl);

      observerCallback([
        {
          target: targetEl,
          isIntersecting: true,
        } as unknown as IntersectionObserverEntry,
      ]);

      expect(targetEl.getAttribute("data-reveal")).toBe("shown");
      expect(unobserveMock).toHaveBeenCalledWith(targetEl);

      document.body.removeChild(targetEl);
    });

    it("disables reveal hiding when prefers-reduced-motion is active", () => {
      vi.stubGlobal("matchMedia", (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { container } = render(
        <SiteLayout>
          <HomePageContent />
        </SiteLayout>,
      );
      const hiddenElements = container.querySelectorAll('[data-reveal="hidden"]');
      expect(hiddenElements.length).toBe(0);
    });
  });

  describe("CSS Tokens & Motion Specification (SPEC-010)", () => {
    const cssPath = path.resolve(process.cwd(), "src/styles.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    it("defines canonical motion tokens adhering to SPEC-010 limits", () => {
      // Duração calibrada entre 450 e 650ms (adotado 520ms)
      expect(cssContent).toMatch(/--dur-reveal:\s*520ms;/);
      // Deslocamento sutil entre 12 e 20px (adotado 16px)
      expect(cssContent).toMatch(/--distance:\s*16px;/);
      // Stagger ordenado entre 70 e 120ms (adotado 80ms)
      expect(cssContent).toMatch(/--stagger:\s*80ms;/);
      // Easing suave sem overshoot
      expect(cssContent).toMatch(/--ease-out:\s*cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\);/);
    });

    it("defines hidden and shown reveal state rules", () => {
      expect(cssContent).toContain('[data-reveal="hidden"]');
      expect(cssContent).toContain('[data-reveal="shown"]');
      expect(cssContent).toContain("will-change: opacity, transform;");
      expect(cssContent).toContain("transition-delay: calc(var(--stagger) * var(--i, 0));");
    });

    it("enforces immediate visibility under prefers-reduced-motion in stylesheet", () => {
      expect(cssContent).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
      expect(cssContent).toContain("opacity: 1 !important;");
      expect(cssContent).toContain("transform: none !important;");
    });
  });
});
