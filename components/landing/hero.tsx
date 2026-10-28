import { Pinha } from "@/components/brand/pinha";
import { Cta } from "@/components/landing/cta";
import { TimeBars } from "@/components/landing/time-bars";
import "./hero.css";

// Sequência: "Você pede." -> a pinha se monta -> o pinhão verde pousa -> "Acontece."
export function Hero() {
  return (
    <section className="hero bg-tinta text-creme">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-2 pt-10 pb-14 md:grid-cols-[1.1fr_1fr] md:gap-12 md:pt-[72px]">
          <div>
            <h1 className="font-titulo text-[clamp(56px,8vw,112px)] leading-[0.98] tracking-[-0.01em] mb-7">
              <span className="hero-l1 block">Você pede.</span>
              <span className="hero-l2 block">Acontece.</span>
            </h1>
            <p className="hero-sub text-[19px] text-creme/60 mb-9">
              Landing page em 24 horas. Site em 3 dias. App em 2 semanas.
            </p>
            <Cta tom="escuro" destaque className="hero-cta">
              Me conta o que você precisa
            </Cta>
          </div>
          <div className="relative order-first mx-auto aspect-square w-full max-w-[300px] md:order-none md:max-w-[520px]">
            <div className="hero-brilho" />
            <Pinha animada girando className="hero-pinha" />
          </div>
        </div>
        <TimeBars />
      </div>
    </section>
  );
}
