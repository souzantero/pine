"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Pinhao } from "@/components/brand/pinha";
import "./jornada.css";

const PASSOS = [
  { frase: "Você pede.", apoio: "Conta o que você precisa, do seu jeito. Uma conversa resolve.", etapa: "Pedido recebido", status: "Feito" },
  {
    frase: "A gente entende.",
    apoio: "A gente mergulha no problema e devolve escopo, prazo e preço em 24 horas.",
    etapa: "Briefing",
    status: "24h",
  },
  {
    frase: "Você escolhe.",
    apoio: "Você recebe protótipos e escolhe o caminho antes de qualquer linha de código.",
    etapa: "Protótipos",
    status: "Aprovado",
  },
  {
    frase: "A gente desenvolve.",
    apoio: "Com IA fazendo o volume e gente experiente cuidando do resultado.",
    etapa: "Desenvolvimento",
    status: "Em curso",
  },
  { frase: "Você ajusta.", apoio: "Duas ou três rodadas de ajuste, até ficar do jeito certo.", etapa: "Ajustes", status: "2 de 3" },
  { frase: "Acontece.", apoio: "No ar, funcionando. Você pediu. Aconteceu.", etapa: "No ar", status: "Aconteceu" },
];

const ULTIMO = PASSOS.length - 1;

// A jornada como rastreio de pedido: a seção fica presa na tela e cada trecho de rolagem avança uma etapa.
// Sem JS ou com movimento reduzido, mostra todas as etapas e o pedido concluído.
export function Jornada() {
  const ref = useRef<HTMLElement>(null);
  const [atual, setAtual] = useState(ULTIMO);
  const [rolando, setRolando] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const passo = () => {
      const r = el.getBoundingClientRect();
      const progresso = Math.min(1, Math.max(0, -r.top / (el.offsetHeight - innerHeight)));
      setAtual(Math.min(ULTIMO, Math.floor(progresso * PASSOS.length)));
    };
    // Liga o modo de rolagem no próximo quadro, já com a etapa certa
    const quadro = requestAnimationFrame(() => {
      setRolando(true);
      passo();
    });
    addEventListener("scroll", passo, { passive: true });
    addEventListener("resize", passo);
    return () => {
      cancelAnimationFrame(quadro);
      removeEventListener("scroll", passo);
      removeEventListener("resize", passo);
    };
  }, []);

  return (
    <section ref={ref} className={cn("jornada bg-tinta text-creme", rolando && "jornada-rolando")}>
      <div className="jornada-palco mx-auto max-w-[1200px] px-6">
        <div>
          <p className="etiqueta text-creme/60">Como acontece</p>
          <ol className="jornada-passos">
            {PASSOS.map((p, i) => (
              <li key={p.frase} className={cn(i === atual && "agora", i < atual && "antes")}>
                <h2 className="font-titulo text-[clamp(44px,7vw,96px)] leading-[1.05]">{p.frase}</h2>
                <p className="mt-6 max-w-[440px] text-creme/60">{p.apoio}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="jornada-cartao" aria-hidden="true">
          <div className="mb-6 flex items-baseline justify-between">
            <span className="font-titulo text-[22px]">Seu pedido</span>
            <span className="etiqueta text-creme/60">#0427</span>
          </div>
          <ol className="relative" style={{ "--n": atual } as React.CSSProperties}>
            <span className="jornada-trilha" />
            {PASSOS.map((p, i) => (
              <li
                key={p.etapa}
                className={cn(
                  "jornada-etapa",
                  i < atual && "feito",
                  i === atual && "agora",
                  i === ULTIMO && "final"
                )}
              >
                <Pinhao className="jornada-pinhao" />
                <span className="font-semibold">{p.etapa}</span>
                <span className="etiqueta text-[11px]">{p.status}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
