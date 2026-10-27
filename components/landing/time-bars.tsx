"use client";

import { useEffect, useState } from "react";

// Compara o prazo de sempre com o da PINE: a barra da PINE enche rápido, a outra se arrasta
export function TimeBars() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto text-left space-y-5" aria-label="O jeito de sempre leva 90 dias. Na PINE, dias.">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-xs font-semibold uppercase tracking-widest text-foreground/40">
          <span>O jeito de sempre</span>
          <span className="font-mono normal-case tracking-normal">90 dias</span>
        </div>
        <div className="h-2.5 bg-foreground/10">
          <div
            className="h-full bg-foreground/30 transition-[width] duration-[6000ms] ease-linear motion-reduce:transition-none"
            style={{ width: started ? "100%" : "0%" }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-xs font-semibold uppercase tracking-widest">
          <span>PINE</span>
          <span className="font-mono normal-case tracking-normal">dias</span>
        </div>
        <div className="h-2.5 bg-foreground/10">
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: started ? "6%" : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
