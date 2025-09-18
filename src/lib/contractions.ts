export type ContractionState = "idle" | "contracting";

export type ContractionLogEntry = {
  id: string;
  start: number;
  end: number;
  createdAt: number;
};

export type Session = {
  id: string;
  entries: ContractionLogEntry[];
};

export type StoredData = {
  currentSessionId: string;
  sessions: Record<string, Session>;
};

export type DisplayEntry = ContractionLogEntry & {
  index: number;
  durationSec: number;
  intervalSec: number | null;
};

export type StatsSummary = {
  totalToday: number;
  averageDurationSec: number;
  averageIntervalSec: number;
  hasIntervalData: boolean;
};

export const MIN_DURATION_SEC = 5;
export const MAX_DURATION_SEC = 180;
export const MAX_RECENT_ENTRIES = 10;
export const STORAGE_KEY = "labor-counter.session-store.v1";
export const STORAGE_WARNING_RATIO = 0.8;
export const EDIT_ADJUST_OPTIONS = [-60, -10, 10, 60];

export const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

export const timeWithSecondsFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const dateLabelFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const mm = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = (safeSeconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export function formatSignedDuration(seconds: number): string {
  if (seconds === 0) {
    return "+00:00";
  }
  const sign = seconds > 0 ? "+" : "−";
  return `${sign}${formatDuration(Math.abs(seconds))}`;
}

export function getTodaySessionId(date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `entry-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function sortEntriesChronologically(
  entries: ContractionLogEntry[]
): ContractionLogEntry[] {
  return [...entries].sort((a, b) => a.start - b.start);
}

export function buildSession(
  id: string,
  entries: ContractionLogEntry[] = []
): Session {
  return {
    id,
    entries: sortEntriesChronologically(entries),
  };
}

export function deriveDisplayEntries(entries: ContractionLogEntry[]): DisplayEntry[] {
  const sorted = sortEntriesChronologically(entries);
  return sorted.map((entry, index) => {
    const previous = sorted[index - 1];
    const durationSec = Math.max(0, Math.floor((entry.end - entry.start) / 1000));
    const intervalSec = previous
      ? Math.max(0, Math.floor((entry.start - previous.end) / 1000))
      : null;

    return {
      ...entry,
      index: index + 1,
      durationSec,
      intervalSec,
    };
  });
}

export function formatSessionLabel(id: string): string {
  const [year, month, day] = id.split("-").map((value) => Number.parseInt(value, 10));
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return id;
  }
  const candidate = new Date(year, month - 1, day);
  return dateLabelFormatter.format(candidate);
}

export function calculateStats(entries: DisplayEntry[]): StatsSummary {
  const totalToday = entries.length;
  const averageDurationSec = totalToday
    ? Math.round(entries.reduce((sum, entry) => sum + entry.durationSec, 0) / totalToday)
    : 0;
  const intervalEntries = entries.filter((entry) => entry.intervalSec != null);
  const averageIntervalSec = intervalEntries.length
    ? Math.round(
        intervalEntries.reduce((sum, entry) => sum + (entry.intervalSec ?? 0), 0) /
          intervalEntries.length
      )
    : 0;

  return {
    totalToday,
    averageDurationSec,
    averageIntervalSec,
    hasIntervalData: intervalEntries.length > 0,
  };
}
