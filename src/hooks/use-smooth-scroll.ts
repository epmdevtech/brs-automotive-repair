import { createContext, useContext } from "react";
import type Lenis from "lenis";

export interface SmoothScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      lock?: boolean;
    },
  ) => void;
}

export const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
