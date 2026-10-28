"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Pinha, Pinhao } from "@/components/brand/pinha";
import { cn } from "@/lib/utils";
import { LeadFormProvider, useLeadForm } from "@/components/landing/lead-form";
import { Cta } from "@/components/landing/cta";
import { Hero } from "@/components/landing/hero";
import { Reveal } from "@/components/landing/reveal";

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

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <p data-anima className="etiqueta text-[var(--suave)]">
      {children}
    </p>
  );
}

// Atalho para o atraso da cascata
const ordem = (n: number) => ({ "--ordem": n }) as React.CSSProperties;

const ENTREGAS = [
  { title: "Landing pages", text: "Pronta pra campanha, rápida e medindo tudo. Em 24 horas." },
  { title: "Sites", text: "Institucional, blog ou multilíngue, com SEO desde o primeiro dia. Em 3 dias." },
  { title: "Aplicativos", text: "Web ou mobile, do protótipo à loja. Em 2 semanas." },
  { title: "Automações", text: "Planilha, CRM, email e WhatsApp conversando sozinhos." },
  { title: "Agentes de IA", text: "Atendimento, vendas e suporte respondendo a qualquer hora." },
  { title: "Criativos", text: "Peças pra anúncio, redes e campanha, no volume que você precisa." },
  { title: "Vídeos", text: "Do roteiro à edição, pra anúncio, redes ou apresentação." },
];

const PASSOS = [
  "Você conta o que precisa.",
  "Em 24 horas, recebe escopo, prazo e preço fechado.",
  "Acontece.",
];

const VIRADA = "O digital ficou rápido. Quem entrega pra você, não.";

// Grade de entregas: cascata ao aparecer e um pinhão que surge no hover
function Entregas() {
  return (
    <Reveal className="grid gap-x-12 sm:grid-cols-2">
      {ENTREGAS.map((item, i) => (
        <div
          key={item.title}
          data-anima
          style={ordem(i)}
          className="group space-y-2 border-t border-[var(--linha)] py-6"
        >
          <h3 className="relative font-semibold">
            <Pinhao className="absolute top-1/2 -left-5 h-3 w-auto -translate-y-1/2 text-terracota opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {item.title}
          </h3>
          <p className="leading-relaxed text-[var(--suave)]">{item.text}</p>
        </div>
      ))}
      <div data-anima style={ordem(ENTREGAS.length)} className="space-y-2 bg-tinta p-6 text-creme">
        <h3 className="flex items-center gap-3 font-semibold">
          <Pinhao className="h-3.5 w-auto text-terracota" />
          E o que mais você precisar
        </h3>
        <p className="leading-relaxed text-creme/60">Conta o que você precisa. A gente entrega.</p>
      </div>
    </Reveal>
  );
}

// Como funciona: uma linha liga os passos e o último vira o pinhão verde
function Passos() {
  return (
    <Reveal className="passos">
      <ol className="relative text-lg">
        <span aria-hidden="true" className="passos-linha absolute top-8 bottom-8 left-[11px] w-px bg-[var(--linha)]" />
        {PASSOS.map((passo, i) => {
          const ultimo = i === PASSOS.length - 1;
          return (
            <li key={passo} className="relative flex items-center gap-6 border-t border-[var(--linha)] py-5">
              <span className="flex w-6 shrink-0 justify-center bg-creme py-1">
                {ultimo ? (
                  <Pinhao className="passo-acontece h-5 w-auto text-verde" />
                ) : (
                  <span className="font-mono text-sm text-[var(--suave)]">{i + 1}</span>
                )}
              </span>
              <span className={cn(ultimo && "font-titulo text-2xl")}>{passo}</span>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

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

const titulo = "font-titulo text-[clamp(36px,5vw,56px)] leading-[1.05]";

export function LandingPage() {
  return (
    <LeadFormProvider>
      <div className="min-h-screen bg-tinta">
        <Header />

        <Hero />

        {/* Dor */}
        <Section tom="claro">
          <Reveal className="space-y-8 font-titulo text-[clamp(28px,4vw,44px)] leading-[1.15] [--passo:250ms]">
            <p data-anima style={ordem(0)}>Você já esperou semanas por um orçamento?</p>
            <p data-anima style={ordem(1)}>Já viu um projeto de 30 dias virar 6 meses?</p>
            <p data-anima style={ordem(2)}>Já perdeu o timing de uma ideia porque ela não saiu a tempo?</p>
          </Reveal>
        </Section>

        {/* Virada */}
        <Section tom="escuro">
          <Reveal className="space-y-8">
            <h2 className={cn(titulo, "palavras")}>
              {VIRADA.split(" ").map((palavra, i) => (
                <span key={i}>
                  <span data-anima style={ordem(i)}>
                    {palavra}
                  </span>{" "}
                </span>
              ))}
            </h2>
            <p
              data-anima
              style={{ "--ordem": VIRADA.split(" ").length + 4, "--passo": "60ms" } as React.CSSProperties}
              className="text-lg leading-relaxed text-[var(--suave)]"
            >
              Na PINE, tecnologia e IA trabalham juntas pra entregar em dias o que antes levava meses.
            </p>
          </Reveal>
        </Section>

        {/* Entregas */}
        <Section tom="claro">
          <div className="space-y-16">
            <Reveal className="space-y-5">
              <Etiqueta>Entregas</Etiqueta>
              <h2 data-anima style={ordem(1)} className={titulo}>
                Se é digital, acontece.
              </h2>
              <p data-anima style={ordem(2)} className="text-lg leading-relaxed text-[var(--suave)]">
                A gente vive uma revolução. O que dá pra construir com tecnologia e IA muda toda semana, e a
                PINE acompanha cada mudança de perto. Por isso a pergunta não é o que a gente faz. É o que
                você precisa.
              </p>
            </Reveal>
            <div className="space-y-5">
              <p className="etiqueta text-[var(--suave)]">Alguns exemplos</p>
              <Entregas />
            </div>
            <div className="space-y-5">
              <p className="etiqueta text-[var(--suave)]">Como funciona</p>
              <Passos />
            </div>
            <div>
              <Cta>Me conta o que você precisa</Cta>
            </div>
          </div>
        </Section>

        {/* O santo precisa bater */}
        <Section tom="claro" className="border-t border-[var(--linha)] pt-24 md:pt-32">
          <Reveal className="space-y-8">
            <h2 data-anima className={titulo}>
              O santo precisa bater.
            </h2>
            <div data-anima style={ordem(1)} className="space-y-6 text-lg leading-relaxed text-[var(--suave)]">
              <p>A PINE não é pra todo mundo. E tudo bem.</p>
              <p>
                Trabalhamos com quem decide rápido e quer ver acontecer. Se esse é o seu caso, vamos conversar.
                Se não, sem ressentimentos.
              </p>
            </div>
          </Reveal>
        </Section>

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
