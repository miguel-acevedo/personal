import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { duration, stateAt, withHint, type State } from "./engine";
import type { Spec } from "./types";
import { Browser, Claude, Dock, Finder, LAYOUT, MenuBar, Preview } from "./Apps";
import SpecPanel from "./SpecPanel";
import s from "./walkthroughs.module.css";

const W = 1280;
const H = 800;

type Rect = { x: number; y: number; w: number; h: number };
type Mode = "watch" | "try";

export type Example = {
  id: string;
  label: string;
  who: string;
} & Record<Mode, { spec: Spec; file: string }>;

export default function Walkthroughs({ examples }: { examples: Example[] }) {
  const [mode, setMode] = useState<Mode>("watch");
  const [exampleId, setExampleId] = useState(examples[0].id);
  const example = examples.find((e) => e.id === exampleId) ?? examples[0];
  const other: Mode = mode === "watch" ? "try" : "watch";

  const picker = (
    <div className={s.picker}>
      <div className={s.ioLabel}>Learner</div>
      <div className={s.pickerOptions}>
        {examples.map((e) => (
          <button
            key={e.id}
            className={e.id === example.id ? s.pickerOn : ""}
            onClick={() => {
              setExampleId(e.id);
              setMode("watch");
            }}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={s.page}>
      <div className={s.layout}>
        <header className={s.header}>
          <div className={s.eyebrow}>Claude walkthrough · prototype</div>
          <h1 className={s.h1}>Watch it once, then do it yourself</h1>
          <p className={s.learner}>
            A walkthrough and an exercise for {example.who}, both played by one small engine from
            a JSON spec.
          </p>
          <nav className={s.tabs}>
            <button className={mode === "watch" ? s.tabOn : ""} onClick={() => setMode("watch")}>
              Watch
            </button>
            <button className={mode === "try" ? s.tabOn : ""} onClick={() => setMode("try")}>
              Try it
            </button>
            <a className={s.specLink} href="#spec">
              Spec ↓
            </a>
          </nav>
        </header>

        <Player
          key={`${example.id}-${mode}`}
          {...example[mode]}
          picker={picker}
          next={{
            label: mode === "watch" ? "Try it yourself" : "Watch the walkthrough",
            go: () => setMode(other),
          }}
        />

        <p className={s.footnote}>
          An unofficial prototype by <a href="https://mhacevedo.com">Miguel Acevedo</a>. The spec
          format is small enough for a model to write from a learner&apos;s description.
        </p>
      </div>
    </div>
  );
}

function Player({
  spec,
  file,
  picker,
  next,
}: {
  spec: Spec;
  file: string;
  picker: ReactNode;
  next: { label: string; go: () => void };
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [run, setRun] = useState(0);
  const [flash, setFlash] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const last = spec.steps.length - 1;

  const base = useMemo(() => stateAt(spec, step), [spec, step]);
  const state = hint ? withHint(base, hint) : base;

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

  // Playback is step-based, so a point on the bar maps to the nearest step.
  const scrub = (e: PointerEvent<HTMLElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const f = Math.min(Math.max((e.clientX - b.left) / b.width, 0), 1);
    const i = Math.round(f * last);
    if (i !== step) jump(i);
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
    else setHint(name);
  };

  const waiting = !!base.waiting;

  // Clicking the stage pauses and resumes, like a video. Not while the learner is
  // answering or the end card is up, since those clicks belong to the desktop.
  const toggle = () => {
    setPlaying((p) => !p);
    setFlash((n) => n + 1);
  };

  return (
    <>
      <div className={s.main}>
        <Stage
          key={run}
          state={state}
          spec={spec}
          onPick={waiting ? pick : undefined}
          onToggle={!waiting && step < last ? toggle : undefined}
          flash={flash ? { n: flash, playing } : null}
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
          <div
            className={s.progress}
            role="slider"
            tabIndex={0}
            aria-label="Step"
            aria-valuemin={1}
            aria-valuemax={last + 1}
            aria-valuenow={step + 1}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              scrub(e);
            }}
            onPointerMove={(e) => e.buttons && scrub(e)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") jump(Math.max(step - 1, 0));
              if (e.key === "ArrowRight") jump(Math.min(step + 1, last));
            }}
          >
            <div className={s.track}>
              <div style={{ width: `${(step / last) * 100}%` }} />
            </div>
          </div>
          <span className={s.stepCount}>
            {waiting ? "Your move · " : ""}
            {step + 1} / {last + 1}
          </span>
        </div>
      </div>

      <aside className={s.side}>
        <SpecPanel spec={spec} file={file} step={step} onJump={jump} picker={picker} />
      </aside>
    </>
  );
}

function Stage({
  state,
  spec,
  onPick,
  onToggle,
  flash,
  onReplay,
  next,
}: {
  state: State;
  spec: Spec;
  onPick?: (name: string) => void;
  onToggle?: () => void;
  flash: { n: number; playing: boolean } | null;
  onReplay: () => void;
  next: { label: string; go: () => void };
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [cursor, setCursor] = useState({ x: W / 2, y: H / 2 });
  const [focus, setFocus] = useState<Rect | null>(null);
  const hasFinder = spec.desktop.apps.includes("finder");
  const connectors = spec.desktop.connectors ?? [];
  const signIn = connectors.find((c) => c.name === state.browser?.connector && c.auth);

  useEffect(() => {
    const el = wrap.current!;
    const fit = () => setScale(Math.min(el.clientWidth / W, (window.innerHeight - 220) / H, 1));
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
    <div
      ref={wrap}
      className={`${s.stageWrap} ${onToggle ? s.stageToggle : ""}`}
      style={{ height: H * scale }}
      onClick={onToggle}
    >
      {flash && (
        <div key={flash.n} className={s.flash}>
          {flash.playing ? <Play size={28} /> : <Pause size={28} />}
        </div>
      )}
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
        <MenuBar app={state.app} />
        {hasFinder && <Finder state={state} folder={spec.desktop.folder ?? ""} onPick={onPick} />}
        <Claude
          state={state}
          connectors={connectors}
          box={hasFinder ? LAYOUT.claude : LAYOUT.claudeSolo}
          showFolder={hasFinder}
          onPick={onPick}
        />
        {state.preview && <Preview {...state.preview} />}
        {signIn && <Browser connector={signIn} screen={state.browser!.screen} />}
        <Dock previewOpen={!!state.preview} browserOpen={!!signIn} />

        <div
          className={s.focus}
          style={
            focus
              ? {
                  left: focus.x - 8,
                  top: focus.y - 8,
                  width: focus.w + 16,
                  height: focus.h + 16,
                }
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
