import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type FlowStep = {
  label: string;
  caption: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function FlowStepper({ steps }: { steps: FlowStep[] }) {
  const [active, setActive] = useState(0);
  const last = steps.length - 1;
  const go = (index: number) => setActive(Math.min(Math.max(index, 0), last));

  return (
    <figure
      className="not-prose my-6 space-y-4 outline-none"
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Onboarding flow"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(active + 1);
        if (event.key === "ArrowLeft") go(active - 1);
      }}
    >
      <ol className="flex items-start">
        {steps.map((step, index) => {
          const done = index < active;
          const current = index === active;

          return (
            <li key={step.label} className="flex flex-1 items-start last:flex-none">
              <button
                type="button"
                onClick={() => go(index)}
                aria-current={current ? "step" : undefined}
                className="group flex cursor-pointer flex-col items-center gap-1.5"
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors ${
                    current || done
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/30 text-muted-foreground group-hover:border-foreground/60"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`max-w-24 text-center text-xs leading-tight transition-colors ${
                    current ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {index < last && (
                <div className="mx-2 mt-3.5 h-px flex-1 bg-foreground/15">
                  <div
                    className="h-full bg-foreground transition-all duration-300"
                    style={{ width: done ? "100%" : "0%" }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="relative lg:-mx-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#16191d]">
          {steps.map((step, index) => (
            <Image
              key={step.src}
              src={step.src}
              alt={step.alt}
              width={step.width}
              height={step.height}
              aria-hidden={index !== active}
              className={`absolute inset-0 size-full object-contain transition-opacity duration-300 ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <StepArrow
          direction="previous"
          disabled={active === 0}
          onClick={() => go(active - 1)}
          className="absolute top-1/2 -left-14 hidden -translate-y-1/2 lg:flex"
        />
        <StepArrow
          direction="next"
          disabled={active === last}
          onClick={() => go(active + 1)}
          className="absolute top-1/2 -right-14 hidden -translate-y-1/2 lg:flex"
        />
      </div>

      <div className="flex items-center gap-3">
        <StepArrow
          direction="previous"
          disabled={active === 0}
          onClick={() => go(active - 1)}
          className="flex lg:hidden"
        />
        <p className="flex-1 text-center text-sm text-muted-foreground" aria-live="polite">
          {steps[active].caption}
        </p>
        <StepArrow
          direction="next"
          disabled={active === last}
          onClick={() => go(active + 1)}
          className="flex lg:hidden"
        />
      </div>
    </figure>
  );
}

function StepArrow({
  direction,
  disabled,
  onClick,
  className,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
  className: string;
}) {
  const Icon = direction === "previous" ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "previous" ? "Previous step" : "Next step"}
      className={`size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-foreground/30 bg-background transition-colors hover:bg-foreground hover:text-background disabled:cursor-default disabled:opacity-30 disabled:hover:bg-background disabled:hover:text-foreground ${className}`}
    >
      <Icon className="size-4" />
    </button>
  );
}
