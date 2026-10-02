import { useEffect, useRef, type ReactNode } from "react";
import type { Spec } from "./types";
import s from "./walkthroughs.module.css";

// Inline JSON with spaces, so each step fits on one (wrapping) line.
function fmt(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(fmt).join(", ")}]`;
  if (v && typeof v === "object")
    return `{ ${Object.entries(v)
      .map(([k, x]) => `${JSON.stringify(k)}: ${fmt(x)}`)
      .join(", ")} }`;
  return JSON.stringify(v);
}

// Lists of files or connectors collapse to a count, so the steps stay in view.
function summarize(desktop: Spec["desktop"]) {
  return Object.fromEntries(
    Object.entries(desktop).map(([k, v]) =>
      Array.isArray(v) && typeof v[0] === "object" ? [k, `[${v.length} items]`] : [k, v],
    ),
  );
}

function highlight(json: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|\b(true|false|null)\b/g;
  let last = 0;
  for (const m of json.matchAll(re)) {
    out.push(json.slice(last, m.index));
    const cls = m[2] ? s.jsonKey : m[1] ? s.jsonString : s.jsonNumber;
    out.push(
      <span key={m.index} className={cls}>
        {m[1] ?? m[0]}
      </span>,
      m[2] ?? "",
    );
    last = m.index + m[0].length;
  }
  out.push(json.slice(last));
  return out;
}

export default function SpecPanel({
  spec,
  file,
  step,
  onJump,
  picker,
}: {
  spec: Spec;
  file: string;
  step: number;
  onJump: (i: number) => void;
  picker?: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);

  // Keep the active step in view without scrolling the page.
  useEffect(() => {
    const el = box.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (box.current && el)
      box.current.scrollTo({ top: el.offsetTop - box.current.clientHeight / 3, behavior: "smooth" });
  }, [step]);

  const { steps, desktop, ...meta } = spec;

  return (
    <section id="spec" className={s.spec}>
      <div className={s.specHeader}>
        {picker}
        <div className={s.ioLabel}>Input · learner description</div>
        <p className={s.ioInput}>{spec.learner}</p>
        <div className={s.ioArrow}>↓ Drafted by Claude from this description</div>
        <div className={s.ioLabel}>
          Output · <span className={s.specFile}>{file}</span>
        </div>
        <p className={s.ioNote}>The spec the player runs. Click a step to jump to it.</p>
      </div>
      <div ref={box} className={s.specBody}>
        <div className={s.specLine}>{"{"}</div>
        {Object.entries(meta).map(([k, v]) => (
          <div key={k} className={s.specLine}>
            {"  "}
            {highlight(`${JSON.stringify(k)}: ${fmt(v)},`)}
          </div>
        ))}
        <div className={s.specLine}>
          {"  "}
          {highlight(`"desktop": ${fmt(summarize(desktop)).replace(/"(\[\d+ items\])"/g, "$1")},`)}
        </div>
        <div className={s.specLine}>{'  "steps": ['}</div>
        {steps.map((st, i) => (
          <button
            key={i}
            data-step={i}
            className={`${s.specLine} ${s.specStep} ${i === step ? s.specActive : ""} ${i > step ? s.specFuture : ""}`}
            onClick={() => onJump(i)}
          >
            <span className={s.specIndex}>{i + 1}</span>
            {highlight(fmt(st))}
            {i < steps.length - 1 ? "," : ""}
          </button>
        ))}
        <div className={s.specLine}>{"  ]"}</div>
        <div className={s.specLine}>{"}"}</div>
      </div>
    </section>
  );
}
