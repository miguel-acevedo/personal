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
