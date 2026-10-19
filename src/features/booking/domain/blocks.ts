import { intervalsOverlap } from "./time";

export interface BlockedPeriod {
  id: string;
  professionalId: string; // or "ALL"
  startTime: string; // ISO
  endTime: string; // ISO
  reason: string;
  createdAt: string;
}

const BLOCKS_STORAGE_KEY = "master_blocked_periods";

export function getBlockedPeriods(): BlockedPeriod[] {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(BLOCKS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BlockedPeriod[];
  } catch {
    return [];
  }
}

export function saveBlockedPeriod(period: Omit<BlockedPeriod, "id" | "createdAt">): BlockedPeriod {
  const current = getBlockedPeriods();
  const newBlock: BlockedPeriod = {
    ...period,
    id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [...current, newBlock];
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(updated));
  }
  return newBlock;
}

export const addBlockedPeriod = saveBlockedPeriod;

export function removeBlockedPeriod(id: string): void {
  const current = getBlockedPeriods();
  const updated = current.filter((b) => b.id !== id);
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(updated));
  }
}

export function seedBlockedPeriods(blocks: BlockedPeriod[]): void {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(blocks));
  }
}

export function clearBlockedPeriods(): void {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    localStorage.removeItem(BLOCKS_STORAGE_KEY);
  }
}

export function isPeriodBlocked(
  start: Date,
  end: Date,
  professionalId: string,
  blocks: BlockedPeriod[] = getBlockedPeriods(),
): boolean {
  return blocks.some((b) => {
    if (b.professionalId !== "ALL" && b.professionalId !== professionalId) {
      return false;
    }
    const bStart = new Date(b.startTime);
    const bEnd = new Date(b.endTime);
    return intervalsOverlap(start, end, bStart, bEnd);
  });
}
