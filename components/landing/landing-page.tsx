"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Pinha } from "@/components/brand/pinha";
import { cn } from "@/lib/utils";
import { LeadFormProvider, useLeadForm } from "@/components/landing/lead-form";
import { Cta } from "@/components/landing/cta";
import { Hero } from "@/components/landing/hero";
import { Reveal } from "@/components/landing/reveal";
import { Servicos } from "@/components/landing/servicos";
import { Jornada } from "@/components/landing/jornada";

type Tom = "claro" | "escuro";

// Cores de apoio de cada fundo: linhas e texto secundário
const TONS: Record<Tom, string> = {
  claro: "bg-creme text-tinta [--linha:rgb(27_20_16/0.15)] [--suave:rgb(27_20_16/0.6)]",
  escuro: "bg-tinta text-creme [--linha:rgb(243_235_221/0.15)] [--suave:rgb(243_235_221/0.6)]",
};

function Section({ tom, children, className }: { tom: Tom; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("py-28 md:py-40", TONS[tom], className)}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-3xl">{children}</div>
      </div>
    </section>
  );
}

// Atalho para o atraso da cascata
const ordem = (n: number) => ({ "--ordem": n }) as React.CSSProperties;

function Header() {
  const { openLeadForm } = useLeadForm();
  return (
    <header className="bg-tinta text-creme">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between border-b border-creme/15 px-6">
        <Logo versao="cor" className="h-[26px] w-auto" />
        <button
          type="button"
          onClick={openLeadForm}
          className="etiqueta text-creme/60 transition-colors hover:text-creme"
        >
          Vamos conversar
        </button>
      </div>
    </header>
  );
}

function Rodape() {
  const link = "transition-colors hover:text-creme";
  return (
    <footer className="bg-tinta text-creme">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 border-t border-creme/15 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <Logo versao="cor" className="h-5 w-auto self-start" />
        <div className="etiqueta flex flex-wrap gap-x-6 gap-y-3 text-creme/50">
          <a href="mailto:ai@pine.net.br" className={cn(link, "normal-case")}>
            ai@pine.net.br
          </a>
          <a href="https://instagram.com/pine.ia" target="_blank" rel="noopener noreferrer" className={cn(link, "normal-case")}>
            @pine.ia
          </a>
          <a href="https://linkedin.com/company/pine-ia" target="_blank" rel="noopener noreferrer" className={link}>
            LinkedIn
          </a>
          <Link href="/privacy" className={link}>
            Privacidade
          </Link>
          <Link href="/terms" className={link}>
            Termos
          </Link>
          <span>PINE {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}


export function LandingPage() {
  return (
    <LeadFormProvider>
      <div className="min-h-screen bg-tinta">
        <Header />

        <Hero />

        <Jornada />

        <Servicos />

        {/* Fechamento */}
        <Section tom="escuro" className="relative overflow-hidden md:py-48">
          <Reveal>
            <div className="fechamento-pinha">
              <Pinha girando />
            </div>
            <div className="relative space-y-10">
              <h2 data-anima className="font-titulo text-[clamp(40px,6vw,80px)] leading-[1.02]">
                Enquanto você espera, seu concorrente lança.
                <br />
                <span className="text-creme/40">Pede agora.</span>
              </h2>
              <div data-anima style={ordem(2)}>
                <Cta tom="escuro">Falar com a PINE</Cta>
              </div>
            </div>
          </Reveal>
        </Section>

        <Rodape />
      </div>
    </LeadFormProvider>
  );
}
