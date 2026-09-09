import { useEffect, useRef, useState } from "react";

const BACKGROUNDS = [
  "oklch(0.96 0.035 78)",
  "oklch(0.95 0.045 220)",
  "oklch(0.95 0.04 145)",
  "oklch(0.95 0.04 310)",
] as const;

const FIRST_REVEALS = [
  "Did you expect that?",
  "This time, you did.",
  "Now you’re exploring.",
] as const;

const FINAL_REVEAL_LEAD = "You had to try it to find out.";
const FINAL_REVEAL_EMPHASIS = "Surprise is where discovery begins.";

function getRevealMessage(
  pressCount: number,
  averageIntervalSeconds: number | null,
) {
  if (pressCount === 0) {
    return "";
  }

  if (pressCount <= FIRST_REVEALS.length) {
    return FIRST_REVEALS[pressCount - 1];
  }

  if (pressCount <= 7 && averageIntervalSeconds !== null) {
    const average = averageIntervalSeconds.toFixed(1);

    return `You average ${average} sec between clicks. Did you expect the button to measure that?`;
  }

  return `${FINAL_REVEAL_LEAD} ${FINAL_REVEAL_EMPHASIS}`;
}

export function WatchClip({
  videoId,
  start,
  label = "Watch the clip",
  caption,
}: {
  videoId: string;
  start?: number;
  label?: string;
  caption?: string;
}) {
  const [open, setOpen] = useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0${
    start ? `&start=${start}&autoplay=1` : ""
  }`;

  return (
    <figure className="not-prose my-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-foreground/30 bg-background/60 px-3 py-1 text-sm font-medium leading-none text-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        {open ? "Hide clip" : label}
      </button>
      {open ? (
        <div className="animate-in fade-in duration-500">
          <div className="mt-3 overflow-hidden rounded-lg ring-1 ring-sky-300/40 shadow-[0_0_50px_-12px_rgba(56,189,248,0.55)]">
            <div className="relative aspect-video">
              <iframe
                src={src}
                title="Alan Kay — the pink plane and thoughts as ants"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
          {caption ? (
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {caption}
            </figcaption>
          ) : null}
        </div>
      ) : null}
    </figure>
  );
}

export function PressToDiscover() {
  const [pressCount, setPressCount] = useState(0);
  const [emphasizeFinalPhrase, setEmphasizeFinalPhrase] = useState(false);
  const [averageIntervalSeconds, setAverageIntervalSeconds] = useState<
    number | null
  >(null);
  const lastPressTime = useRef<number | null>(null);
  const totalIntervalMs = useRef(0);
  const intervalCount = useRef(0);
  const colorIndex =
    pressCount === 0 ? -1 : (pressCount - 1) % BACKGROUNDS.length;
  const revealMessage = getRevealMessage(
    pressCount,
    averageIntervalSeconds,
  );
  const isFinalReveal = pressCount >= 8;

  useEffect(() => {
    const { body } = document;
    const previousBackground = body.style.backgroundColor;
    const previousTransition = body.style.transition;

    body.style.transition = "background-color 450ms ease";

    return () => {
      body.style.backgroundColor = previousBackground;
      body.style.transition = previousTransition;
    };
  }, []);

  useEffect(() => {
    if (colorIndex >= 0) {
      document.body.style.backgroundColor = BACKGROUNDS[colorIndex];
    }
  }, [colorIndex]);

  useEffect(() => {
    if (!isFinalReveal) {
      return;
    }

    const highlightTimer = window.setTimeout(() => {
      setEmphasizeFinalPhrase(true);
    }, 1000);

    return () => window.clearTimeout(highlightTimer);
  }, [isFinalReveal]);

  const handlePress = () => {
    const now = performance.now();

    if (lastPressTime.current !== null) {
      totalIntervalMs.current += now - lastPressTime.current;
      intervalCount.current += 1;
      setAverageIntervalSeconds(
        totalIntervalMs.current / intervalCount.current / 1000,
      );
    }

    lastPressTime.current = now;
    setPressCount((count) => count + 1);
  };

  return (
    <span className="inline">
      <button
        type="button"
        onClick={handlePress}
        className="mx-1 inline-flex cursor-pointer rounded-full border border-foreground/30 bg-background/60 px-2.5 py-1 text-sm font-medium leading-none text-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        {pressCount === 0 ? "Press me" : "Again"}
      </button>
      {pressCount === 0 ? null : (
        <span
          key={Math.min(pressCount, 8)}
          aria-live="polite"
          className="animate-in fade-in duration-1000"
        >
          {isFinalReveal ? (
            <>
              {FINAL_REVEAL_LEAD}{" "}
              <span
                className={`box-decoration-clone rounded-sm px-0.5 transition-colors duration-700 ${
                  emphasizeFinalPhrase ? "bg-amber-200/70" : "bg-transparent"
                }`}
              >
                {FINAL_REVEAL_EMPHASIS}
              </span>
            </>
          ) : (
            revealMessage
          )}
        </span>
      )}
    </span>
  );
}
