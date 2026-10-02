import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { duration, stateAt, type State } from "./engine";
import type { Spec } from "./types";
import { Claude, Dock, Finder, MenuBar, Preview } from "./Apps";
import s from "./walkthroughs.module.css";

const W = 1280;
const H = 800;

type Rect = { x: number; y: number; w: number; h: number };

export default function Walkthrough({ spec }: { spec: Spec }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [run, setRun] = useState(0);
  const state = useMemo(() => stateAt(spec, step), [spec, step]);
  const last = spec.steps.length - 1;

  useEffect(() => {
    if (!playing || step >= last) return;
    const t = setTimeout(() => setStep(step + 1), duration(spec.steps[step]));
    return () => clearTimeout(t);
  }, [playing, step, last, spec, run]);

  const replay = () => {
    setStep(0);
    setPlaying(true);
    setRun((r) => r + 1);
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.eyebrow}>Claude walkthrough · prototype</div>
        <h1 className={s.h1}>{spec.title}</h1>
        <p className={s.learner}>
          <span>Built for</span> {spec.learner}
        </p>
      </header>

      <Stage key={run} state={state} spec={spec} onReplay={replay} />

      <p className={s.mobileCaption}>{state.caption?.text ?? state.tryIt?.text}</p>

      <div className={s.controls}>
        <button
          className={s.button}
          onClick={() => setPlaying((p) => !p)}
          disabled={step >= last}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing && step < last ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button className={s.button} onClick={replay} aria-label="Replay">
          <RotateCcw size={16} />
        </button>
        <div className={s.progress}>
          <div style={{ width: `${(step / last) * 100}%` }} />
        </div>
        <span className={s.stepCount}>
          {step + 1} / {last + 1}
        </span>
      </div>

      <p className={s.footnote}>
        An unofficial prototype by{" "}
        <a href="https://mhacevedo.com">Miguel Acevedo</a>. Each walkthrough plays from a
        JSON spec of steps; the engine handles timing, the cursor and focus.
      </p>
    </div>
  );
}

function Stage({ state, spec, onReplay }: { state: State; spec: Spec; onReplay: () => void }) {
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
        style={{ width: W, height: H, left: `calc(50% - ${(W * scale) / 2}px)`, transform: `scale(${scale})` }}
      >
        <MenuBar />
        <Finder state={state} folder={spec.desktop.folder} />
        <Claude state={state} />
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

        <div className={s.cursor} style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}>
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
              <button className={s.tryButton} onClick={onReplay}>
                <RotateCcw size={14} /> Watch again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
