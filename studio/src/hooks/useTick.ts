import { useEffect, useRef } from 'react';

type Listener = (seconds: number) => void;

const listeners = new Set<Listener>();
let raf = 0;

function loop(now: number): void {
  for (const listener of listeners) {
    listener(now / 1000);
  }
  raf = requestAnimationFrame(loop);
}

/** Calls back on every animation frame with the time in seconds, from one shared clock. */
export function useTick(listener: Listener): void {
  const latest = useRef(listener);
  latest.current = listener;
  useEffect(() => {
    const call: Listener = (seconds) => latest.current(seconds);
    listeners.add(call);
    if (listeners.size === 1) {
      raf = requestAnimationFrame(loop);
    }
    return () => {
      listeners.delete(call);
      if (listeners.size === 0) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);
}
