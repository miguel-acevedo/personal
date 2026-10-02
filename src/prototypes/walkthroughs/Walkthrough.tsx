import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { duration, stateAt, type State } from "./engine";
import type { Spec } from "./types";
import { Claude, Dock, Finder, MenuBar, Preview } from "./Apps";
import SpecPanel from "./SpecPanel";
import s from "./walkthroughs.module.css";

const W = 1280;
const H = 800;

type Rect = { x: number; y: number; w: number; h: number };
type Mode = "watch" | "try";

export default function Walkthroughs({
  specs,
}: {
  specs: Record<Mode, { spec: Spec; file: string }>;
}) {
  const [mode, setMode] = useState<Mode>("watch");
  const other: Mode = mode === "watch" ? "try" : "watch";

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.eyebrow}>Claude walkthrough · prototype</div>
        <h1 className={s.h1}>Watch it once, then do it yourself</h1>
        <p className={s.learner}>
          A walkthrough and an exercise for a high school biology teacher, both played by one
          small engine from a JSON spec.
        </p>
        <nav className={s.tabs}>
          <button className={mode === "watch" ? s.tabOn : ""} onClick={() => setMode("watch")}>
            Watch
          </button>
          <button className={mode === "try" ? s.tabOn : ""} onClick={() => setMode("try")}>
            Try it
          </button>
          <a href="#spec">Spec ↓</a>
        </nav>
      </header>

      <Player
        key={mode}
        {...specs[mode]}
        next={{
          label: mode === "watch" ? "Try it yourself" : "Watch the walkthrough",
          go: () => setMode(other),
        }}
      />

      <p className={s.footnote}>
        An unofficial prototype by <a href="https://mhacevedo.com">Miguel Acevedo</a>. The
        spec format is small enough for a model to write from a learner&apos;s description;
        these two were written by hand.
      </p>
    </div>
  );
}

function Player({
  spec,
  file,
  next,
}: {
  spec: Spec;
  file: string;
  next: { label: string; go: () => void };
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [run, setRun] = useState(0);
  const [hint, setHint] = useState<{ folder: string; text: string } | null>(null);
  const last = spec.steps.length - 1;

  const base = useMemo(() => stateAt(spec, step), [spec, step]);
  // A wrong answer shows the dropped folder and Claude's hint on top of the spec state.
  const state: State = hint
    ? {
        ...base,
        attached: hint.folder,
        messages: [...base.messages, { kind: "reply", text: hint.text }],
      }
    : base;

  useEffect(() => {
    const d = duration(spec.steps[step]);
    if (!playing || step >= last || d === Infinity) return;
    const t = setTimeout(() => setStep(step + 1), d);
    return () => clearTimeout(t);
  }, [playing, step, last, spec, run]);

  const jump = (i: number) => {
    setHint(null);
    setStep(i);
  };

  const replay = () => {
    jump(0);
    setPlaying(true);
    setRun((r) => r + 1);
  };

  const pick = (name: string) => {
    const w = base.waiting;
    if (!w || !name) return;
    if (name === w.answer) jump(step + 1);
    else setHint({ folder: name, text: w.hints[name] ?? w.fallback });
  };

  const waiting = !!base.waiting;

  return (
    <>
      <Stage
        key={run}
        state={state}
        spec={spec}
        onPick={waiting ? pick : undefined}
        onReplay={replay}
        next={next}
      />

      <p className={s.mobileCaption}>{state.caption?.text ?? state.tryIt?.text}</p>

      <div className={s.controls}>
        <button
          className={s.button}
          onClick={() => setPlaying((p) => !p)}
          disabled={step >= last || waiting}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing && step < last && !waiting ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button className={s.button} onClick={replay} aria-label="Replay">
          <RotateCcw size={16} />
        </button>
        <div className={s.progress}>
          <div style={{ width: `${(step / last) * 100}%` }} />
        </div>
        <span className={s.stepCount}>
          {waiting ? "Your move · " : ""}
          {step + 1} / {last + 1}
        </span>
      </div>

      <SpecPanel spec={spec} file={file} step={step} onJump={jump} />
    </>
  );
}

function Stage({
  state,
  spec,
  onPick,
  onReplay,
  next,
}: {
  state: State;
  spec: Spec;
  onPick?: (name: string) => void;
  onReplay: () => void;
  next: { label: string; go: () => void };
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [cursor, setCursor] = useState({ x: W / 2, y: H / 2 });
  const [focus, setFocus] = useState<Rect | null>(null);

  useEffect(() => {
    const el = wrap.current!;
    const fit = () =>
      setScale(Math.min(el.clientWidth / W, (window.innerHeight - 220) / H, 1));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  // Find a target by its data-wt id and measure it in unscaled stage coordinates.
  const measure = (id: string): Rect | null => {
    const root = stage.current;
    const el = root?.querySelector<HTMLElement>(`[data-wt="${CSS.escape(id)}"]`);
    if (!root || !el) return null;
    const a = root.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    return {
      x: (b.left - a.left) / scale,
      y: (b.top - a.top) / scale,
      w: b.width / scale,
      h: b.height / scale,
    };
  };

  useLayoutEffect(() => {
    const update = () => {
      const c = state.cursor.to ? measure(state.cursor.to) : null;
      if (c) setCursor({ x: c.x + c.w / 2, y: c.y + c.h / 2 });
      setFocus(state.caption?.focus ? measure(state.caption.focus) : null);
    };
    update();
    // Re-measure once windows finish their open animation.
    const t = setTimeout(update, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, scale]);

  return (
    <div ref={wrap} className={s.stageWrap} style={{ height: H * scale }}>
      <div
        ref={stage}
        className={s.desktop}
        style={{
          width: W,
          height: H,
          left: `calc(50% - ${(W * scale) / 2}px)`,
          transform: `scale(${scale})`,
        }}
      >
        <MenuBar />
        <Finder state={state} folder={spec.desktop.folder} onPick={onPick} />
        <Claude state={state} onDrop={onPick} />
        {state.preview && <Preview {...state.preview} />}
        <Dock previewOpen={!!state.preview} />

        <div
          className={s.focus}
          style={
            focus
              ? { left: focus.x - 8, top: focus.y - 8, width: focus.w + 16, height: focus.h + 16 }
              : { opacity: 0 }
          }
        />

        <div
          className={s.cursor}
          style={{
            transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            opacity: state.cursor.to ? 1 : 0,
          }}
        >
          {state.cursor.clickAt !== undefined && (
            <span key={state.cursor.clickAt} className={s.click} />
          )}
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path
              d="M4 2l15 11.5-6.6.9 3.9 7.4-3 1.5-3.8-7.5L4 20z"
              fill="#111"
              stroke="#fff"
              strokeWidth="1.5"
            />
          </svg>
          {state.cursor.carry && <span className={s.carry}>{state.cursor.carry}</span>}
        </div>

        {state.caption && (
          <div key={state.caption.text} className={s.caption}>
            {state.caption.text}
          </div>
        )}

        {state.tryIt && (
          <div className={s.tryScrim}>
            <div className={s.tryCard}>
              <div className={s.tryTitle}>{state.tryIt.title}</div>
              <p>{state.tryIt.text}</p>
              <div className={s.tryPrompt}>{state.tryIt.prompt}</div>
              <div className={s.tryActions}>
                <button className={s.tryButton} onClick={next.go}>
                  {next.label}
                </button>
                <button className={s.tryGhost} onClick={onReplay}>
                  <RotateCcw size={14} /> Start over
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
