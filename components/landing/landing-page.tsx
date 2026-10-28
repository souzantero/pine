"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { LeadFormProvider, useLeadForm } from "@/components/landing/lead-form";
import { TimeBars } from "@/components/landing/time-bars";

function Cta({ children }: { children: React.ReactNode }) {
  const { openLeadForm } = useLeadForm();
  return (
    <button
      type="button"
      onClick={openLeadForm}
      className="inline-block bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest px-8 py-4 transition-opacity hover:opacity-70"
    >
      {children}
    </button>
  );
}

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("py-28 md:py-40 border-t border-foreground/10", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">{children}</div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-widest text-foreground/30">
      {children}
    </p>
  );
}

const ENTREGAS = [
  { title: "Landing pages", text: "Pronta pra campanha, rápida e medindo tudo. Em 24 horas." },
  { title: "Sites", text: "Institucional, blog ou multilíngue, com SEO desde o primeiro dia. Em 3 dias." },
  { title: "Aplicativos", text: "Web ou mobile, do protótipo à loja. Em 2 semanas." },
  { title: "Automações", text: "Planilha, CRM, email e WhatsApp conversando sozinhos." },
  { title: "Agentes de IA", text: "Atendimento, vendas e suporte respondendo a qualquer hora." },
  { title: "Criativos", text: "Peças pra anúncio, redes e campanha, no volume que você precisa." },
  { title: "Vídeos", text: "Do roteiro à edição, pra anúncio, redes ou apresentação." },
];

type DetailItem = { title: string; text: string };

// Grade de itens; o "closing" opcional fecha a grade em destaque
function DetailGrid({ items, closing }: { items: DetailItem[]; closing?: DetailItem }) {
  return (
    <div className="grid sm:grid-cols-2 gap-x-12">
      {items.map((item) => (
        <div key={item.title} className="py-6 border-t border-foreground/10 space-y-2">
          <h3 className="font-bold uppercase tracking-tight">{item.title}</h3>
          <p className="text-foreground/60 leading-relaxed">{item.text}</p>
        </div>
      ))}
      {closing && (
        <div className="p-6 bg-primary text-primary-foreground space-y-2">
          <h3 className="font-bold uppercase tracking-tight">{closing.title}</h3>
          <p className="opacity-70 leading-relaxed">{closing.text}</p>
        </div>
      )}
    </div>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="text-lg">
      {items.map((item, i) => (
        <li key={item} className="flex gap-6 py-5 border-t border-foreground/10">
          <span className="font-mono text-foreground/30">{i + 1}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Header() {
  const { openLeadForm } = useLeadForm();
  return (
    <header className="border-b border-foreground/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo versao="cor" className="h-6 w-auto" />
        <button
          type="button"
          onClick={openLeadForm}
          className="text-sm font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity"
        >
          Vamos Conversar
        </button>
      </div>
    </header>
  );
}

export function LandingPage() {
  return (
    <LeadFormProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Hero */}
        <section className="py-28 md:py-40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight leading-[0.95]">
                Você pede.
                <br />
                Acontece.
              </h1>
              <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                Landing page em 24 horas. Site em 3 dias. App em 2 semanas.
              </p>
              <Cta>Me conta o que você precisa</Cta>
            </div>
            <div className="mt-20 md:mt-28">
              <TimeBars />
            </div>
          </div>
        </section>

        {/* Dor */}
        <Section>
          <div className="space-y-8 text-2xl md:text-3xl font-bold uppercase tracking-tight leading-snug text-foreground/80">
            <p>Você já esperou semanas por um orçamento?</p>
            <p>Já viu um projeto de 30 dias virar 6 meses?</p>
            <p>Já perdeu o timing de uma ideia porque ela não saiu a tempo?</p>
          </div>
        </Section>

        {/* Virada */}
        <Section>
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
              O digital ficou rápido. Quem entrega pra você, não.
            </h2>
            <p className="text-lg text-foreground/60 leading-relaxed">
              Na PINE, tecnologia e IA trabalham juntas pra entregar em dias o
              que antes levava meses.
            </p>
          </div>
        </Section>

        {/* Entregas */}
        <Section>
          <div className="space-y-12">
            <div className="space-y-4">
              <SectionLabel>Entregas</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                Se é digital, acontece.
              </h2>
              <p className="text-lg text-foreground/60 leading-relaxed">
                A gente vive uma revolução. O que dá pra construir com tecnologia
                e IA muda toda semana, e a PINE acompanha cada mudança de perto.
                Por isso a pergunta não é o que a gente faz. É o que você precisa.
              </p>
            </div>
            <div className="space-y-4">
              <SectionLabel>Alguns exemplos</SectionLabel>
              <DetailGrid
                items={ENTREGAS}
                closing={{
                  title: "E o que mais você precisar",
                  text: "Conta o que você precisa. A gente entrega.",
                }}
              />
            </div>
            <div className="space-y-4">
              <SectionLabel>Como funciona</SectionLabel>
              <Steps
                items={[
                  "Você conta o que precisa.",
                  "Em 24 horas, recebe escopo, prazo e preço fechado.",
                  "Acontece.",
                ]}
              />
            </div>
            <div>
              <Cta>Me conta o que você precisa</Cta>
            </div>
          </div>
        </Section>

        {/* O santo precisa bater */}
        <Section>
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
              O santo precisa bater.
            </h2>
            <div className="space-y-6 text-lg text-foreground/60 leading-relaxed">
              <p>A PINE não é pra todo mundo. E tudo bem.</p>
              <p>
                Trabalhamos com quem decide rápido e quer ver acontecer. Se esse
                é o seu caso, vamos conversar. Se não, sem ressentimentos.
              </p>
            </div>
          </div>
        </Section>

        {/* Fechamento */}
        <Section>
          <div className="text-center space-y-10">
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight">
              Enquanto você espera, seu concorrente lança.
              <br />
              <span className="text-foreground/30">Pede agora.</span>
            </h2>
            <Cta>Falar com a PINE</Cta>
          </div>
        </Section>

        {/* Footer */}
        <footer className="border-t border-foreground/10 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-4 text-sm text-foreground/40">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <a href="mailto:ai@pine.net.br" className="hover:text-foreground transition-colors">
                  ai@pine.net.br
                </a>
                <span className="hidden sm:inline">|</span>
                <a
                  href="https://instagram.com/pine.ia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  @pine.ia
                </a>
                <span className="hidden sm:inline">|</span>
                <a
                  href="https://linkedin.com/company/pine-ia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
                <span className="hidden sm:inline">|</span>
                <span>PINE {new Date().getFullYear()}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacidade
                </Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Termos
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </LeadFormProvider>
  );
}
