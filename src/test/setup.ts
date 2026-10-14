import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

class MockIntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect = vi.fn();
  observe = vi.fn((target: Element) => {
    // Simula elemento visível por padrão nos testes de render
  });
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
Object.defineProperty(global, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});
Object.defineProperty(global, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = vi.fn(
    () =>
      ({
        clearRect: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        scale: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
      }) as unknown as RenderingContext,
  ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

// Os testes renderizam componentes isolados, sem RouterProvider. O `Link` e o `useRouterState`
// reais exigem um roteador montado; aqui são substituídos por equivalentes mínimos, mantendo
// intactos `createRouter`, `rootRouteId` etc. para os testes de roteamento reais.
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  const React = await import("react");

  const Link = React.forwardRef<HTMLAnchorElement, Record<string, unknown>>(
    function MockLink(props, ref) {
      const {
        to,
        hash,
        search,
        params,
        preload,
        activeOptions,
        activeProps,
        inactiveProps,
        resetScroll,
        children,
        ...rest
      } = props as Record<string, unknown> & { children?: React.ReactNode };
      void params;
      void preload;
      void activeOptions;
      void activeProps;
      void inactiveProps;
      void resetScroll;
      const query = search
        ? `?${new URLSearchParams(
            Object.entries(search as Record<string, string>).filter(([, v]) => v != null),
          ).toString()}`
        : "";
      const href = `${String(to)}${query}${hash ? `#${String(hash)}` : ""}`;
      return React.createElement("a", { ref, href, ...rest }, children as React.ReactNode);
    },
  );

  return {
    ...actual,
    Link,
    useRouterState: (options?: { select?: (state: unknown) => unknown }) => {
      const state = { location: { pathname: window.location.pathname, hash: "" } };
      return options?.select ? options.select(state) : state;
    },
  };
});
