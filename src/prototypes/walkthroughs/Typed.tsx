import { useEffect, useState } from "react";
import s from "./walkthroughs.module.css";

// Reveals text at a fixed rate, so the engine can predict how long it takes.
export default function Typed({ text, cps, caret }: { text: string; cps: number; caret?: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const k = Math.min(text.length, Math.floor(((performance.now() - start) / 1000) * cps));
      setN(k);
      if (k < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, cps]);

  return (
    <>
      {text.slice(0, n)}
      {caret && <span className={s.caret} />}
    </>
  );
}
