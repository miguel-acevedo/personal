import { useEffect, useState } from "react";

const BACKGROUNDS = [
  { name: "warm sand", value: "oklch(0.96 0.035 78)" },
  { name: "open sky", value: "oklch(0.95 0.045 220)" },
  { name: "soft moss", value: "oklch(0.95 0.04 145)" },
  { name: "quiet lilac", value: "oklch(0.95 0.04 310)" },
] as const;

export function PressToDiscover() {
  const [colorIndex, setColorIndex] = useState(-1);

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
      document.body.style.backgroundColor = BACKGROUNDS[colorIndex].value;
    }
  }, [colorIndex]);

  const handlePress = () => {
    setColorIndex((current) => (current + 1) % BACKGROUNDS.length);
  };

  return (
    <aside className="my-7 rounded-xl border border-foreground/15 bg-background/70 p-5 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={handlePress}
        className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-95"
      >
        {colorIndex < 0 ? "Press me" : "Again"}
      </button>
      <p
        aria-live="polite"
        className="mt-3 min-h-5 text-sm text-muted-foreground"
      >
        {colorIndex < 0
          ? "What does it do?"
          : `Now you know. You found ${BACKGROUNDS[colorIndex].name}.`}
      </p>
    </aside>
  );
}
