import { cn } from "@/lib/utils";
import { N_PINHOES, PINHAO_D, PINHOES, f } from "./geometria";
import "./pinha.css";

export { PINHAO_D, PINHOES, pinhao } from "./geometria";

export function Pinhao({ className }: { className?: string }) {
  return (
    <svg viewBox="-6 -10 12 20" aria-hidden="true" className={cn("pinhao", className)}>
      <path d={PINHAO_D} fill="currentColor" />
    </svg>
  );
}

interface PinhaProps {
  // Monta pinhão por pinhão ao carregar (sequência do hero)
  animada?: boolean;
  // Gira bem devagar; o atraso vem de --giro-atraso
  girando?: boolean;
  corDestaque?: "verde" | "verde-claro";
  className?: string;
}

export function Pinha({ animada, girando, corDestaque = "verde-claro", className }: PinhaProps) {
  return (
    <svg
      viewBox="-310 -310 620 620"
      aria-hidden="true"
      className={cn("pinha", animada && "pinha-animada", girando && "pinha-girando", className)}
    >
      {PINHOES.map((p, i) => {
        const destaque = i === N_PINHOES - 1;
        return (
          <path
            key={i}
            d={p.d}
            className={destaque ? "destaque" : undefined}
            fill={destaque ? `var(--${corDestaque})` : "var(--terracota)"}
            style={
              animada
                ? ({ "--i": i + 1, "--x": `${f(p.x)}px`, "--y": `${f(p.y)}px` } as React.CSSProperties)
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}
