"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ContractionState = "idle" | "contracting";

type ContractionEntry = {
  start: number;
  end: number;
  durationSec: number;
  intervalSec: number | null;
};

const MIN_DURATION_SEC = 5;
const MAX_DURATION_SEC = 180;
const TAP_DEBOUNCE_MS = 1000;
const MAX_RECENT_ENTRIES = 10;

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const mm = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = (safeSeconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function Home() {
  const [state, setState] = useState<ContractionState>("idle");
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [entries, setEntries] = useState<ContractionEntry[]>([]);

  const lastTapRef = useRef<number>(0);

  const handleStart = useCallback(() => {
    if (state === "contracting") {
      return;
    }

    setStartTimestamp(Date.now());
    setElapsedSec(0);
    setState("contracting");
    void navigator.vibrate?.(40);
  }, [state]);

  const stopContraction = useCallback(
    (options: { auto?: boolean } = {}) => {
      if (state !== "contracting" || startTimestamp == null) {
        return;
      }

      const now = Date.now();
      const rawElapsedSec = Math.floor((now - startTimestamp) / 1000);
      if (!options.auto && rawElapsedSec < MIN_DURATION_SEC) {
        return;
      }

      const durationSec = Math.min(rawElapsedSec, MAX_DURATION_SEC);
      const end = startTimestamp + durationSec * 1000;

      setEntries((prev) => {
        const previousEnd = prev[0]?.end ?? null;
        const intervalSec =
          previousEnd != null
            ? Math.max(0, Math.floor((startTimestamp - previousEnd) / 1000))
            : null;

        const nextEntries: ContractionEntry[] = [
          {
            start: startTimestamp,
            end,
            durationSec,
            intervalSec,
          },
          ...prev,
        ];

        return nextEntries.slice(0, MAX_RECENT_ENTRIES);
      });

      setState("idle");
      setStartTimestamp(null);
      setElapsedSec(0);
      void navigator.vibrate?.(20);
    },
    [startTimestamp, state]
  );

  const handleToggle = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < TAP_DEBOUNCE_MS) {
      return;
    }
    lastTapRef.current = now;

    if (state === "idle") {
      handleStart();
      return;
    }

    stopContraction();
  }, [handleStart, state, stopContraction]);

  useEffect(() => {
    if (state !== "contracting" || startTimestamp == null) {
      return undefined;
    }

    const tick = () => {
      const now = Date.now();
      const nextElapsed = Math.floor((now - startTimestamp) / 1000);

      if (nextElapsed >= MAX_DURATION_SEC) {
        stopContraction({ auto: true });
        return;
      }

      setElapsedSec(nextElapsed);
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [startTimestamp, state, stopContraction]);

  const displayElapsed = useMemo(() => {
    if (state !== "contracting") {
      return "00:00";
    }
    return formatDuration(elapsedSec);
  }, [elapsedSec, state]);

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900">
      <main className="mx-auto flex max-w-md flex-col gap-12 px-6 py-16">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">
            Labor Counter
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Gentle support for tracking contractions
          </h1>
          <p className="text-sm text-slate-600">
            Tap once to begin timing and again to log each contraction.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`flex h-48 w-full flex-col items-center justify-center gap-4 rounded-[32px] border-2 text-xl font-semibold transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 ${
            state === "contracting"
              ? "border-rose-200 bg-rose-100 text-rose-700 shadow-[0_25px_50px_-12px_rgba(244,114,182,0.35)]"
              : "border-sky-200 bg-white text-sky-700 shadow-[0_20px_45px_-15px_rgba(14,165,233,0.35)]"
          } active:scale-[0.99]`}
        >
          <span className="text-5xl font-mono tabular-nums tracking-tight">
            {displayElapsed}
          </span>
          <span>
            {state === "contracting" ? "Stop contraction" : "Start contraction"}
          </span>
          {state === "contracting" ? (
            <span className="text-xs uppercase tracking-[0.35em] text-rose-500">
              Contracting
            </span>
          ) : (
            <span className="text-xs uppercase tracking-[0.35em] text-sky-500">
              Ready
            </span>
          )}
        </button>

        <section className="space-y-4">
          <header className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
            <span>Recent</span>
            <span>Last {Math.min(entries.length, MAX_RECENT_ENTRIES)}</span>
          </header>
          <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {entries.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-slate-500">
                Contractions will appear here with their durations and intervals.
              </p>
            ) : (
              entries.map((entry, index) => {
                const displayIndex = entries.length - index;
                const durationLabel = formatDuration(entry.durationSec);
                const intervalLabel =
                  entry.intervalSec != null
                    ? `+${formatDuration(entry.intervalSec)}`
                    : "—";

                return (
                  <article
                    key={entry.start}
                    className="grid grid-cols-[auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-sm text-slate-700"
                  >
                    <span className="font-semibold text-slate-400">#{displayIndex}</span>
                    <span className="font-mono text-base tabular-nums text-slate-800">
                      {timeFormatter.format(entry.start)}
                    </span>
                    <span className="font-mono tabular-nums text-slate-900">
                      {durationLabel}
                    </span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {intervalLabel}
                    </span>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
