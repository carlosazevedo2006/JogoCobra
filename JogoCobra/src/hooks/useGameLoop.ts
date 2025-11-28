// src/hooks/useGameLoop.ts
import { useEffect, useRef } from "react";

export default function useGameLoop(isRunning: boolean, interval: number, stepFn: () => void) {
  const lastTime = useRef(0);
  const rafRef = useRef<number | null>(null);

  function loop(timestamp: number) {
    if (!lastTime.current) lastTime.current = timestamp;

    const delta = timestamp - lastTime.current;

    if (isRunning && delta >= interval) {
      stepFn();
      lastTime.current = timestamp;
    }

    rafRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, interval]);
}
