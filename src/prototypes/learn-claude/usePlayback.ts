import { useCallback, useEffect, useRef, useState } from "react";

export function usePlayback(duration: number) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [navigationVersion, setNavigationVersion] = useState(0);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!playing) return;
    let frame: number;
    let previous: number | undefined;
    function tick(now: number) {
      if (previous !== undefined) {
        // Cap long background-tab gaps so returning does not skip the lesson.
        timeRef.current = Math.min(
          duration,
          timeRef.current + Math.min((now - previous) / 1000, 0.1) * speed,
        );
        setTime(timeRef.current);
      }
      previous = now;
      if (timeRef.current >= duration) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, duration]);

  const seek = useCallback(
    (value: number) => {
      timeRef.current = Math.max(0, Math.min(duration, value));
      setTime(timeRef.current);
      setNavigationVersion((value) => value + 1);
    },
    [duration],
  );

  function toggle() {
    setNavigationVersion((value) => value + 1);
    if (timeRef.current >= duration) seek(0);
    setPlaying((value) => !value);
  }

  return {
    time,
    playing,
    speed,
    navigationVersion,
    setSpeed,
    seek,
    toggle,
    pause: () => setPlaying(false),
    replay: () => {
      seek(0);
      setPlaying(true);
    },
  };
}
