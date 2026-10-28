import { cn } from "@/lib/utils";
import { ARTES, type ServicoId } from "@/components/brand/artes";
import { Cta } from "@/components/landing/cta";
import { Reveal } from "@/components/landing/reveal";

const SERVICOS: { id: ServicoId; prazo: string; nome: string; texto: string }[] = [
  { id: "landing", prazo: "24 horas", nome: "Landing pages", texto: "Feita pra campanha, rápida e medindo tudo." },
  { id: "site", prazo: "3 dias", nome: "Sites", texto: "Institucional, blog ou multilíngue, com SEO desde o primeiro dia." },
  { id: "app", prazo: "2 semanas", nome: "Apps", texto: "Web ou mobile, do protótipo à loja." },
  {
    id: "sistema",
    prazo: "Sob medida",
    nome: "Sistemas",
    texto: "Gestão, portal do cliente, painel. Conversando com o que você já usa.",
  },
  { id: "automacao", prazo: "Sob medida", nome: "Automações", texto: "Planilha, CRM, email e WhatsApp trabalhando sozinhos." },
  { id: "agente", prazo: "Sob medida", nome: "Agentes de IA", texto: "Atendimento, vendas e suporte respondendo a qualquer hora." },
];

// Arte do serviço: os pinhões se montam quando a faixa aparece; o verde chega por último
function ArteServico({ id }: { id: ServicoId }) {
  return (
    <svg viewBox="-200 -200 400 400" aria-hidden="true" className="arte-servico">
      {ARTES[id].map((p, i) => (
        <path
          key={i}
          d={p.d}
          className={p.verde ? "destaque" : undefined}
          fill={p.verde ? "var(--verde-claro)" : "var(--terracota)"}
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

export function Servicos() {
  return (
    <section className="bg-tinta text-creme">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="pb-12">
          <h2 data-anima className="font-titulo text-[clamp(36px,5vw,56px)] leading-[1.05]">
            O que acontece.
          </h2>
        </Reveal>

        {SERVICOS.map((s, i) => (
          <Reveal
            key={s.id}
            className="grid items-center gap-6 border-t border-creme/15 py-14 md:min-h-[80vh] md:grid-cols-2 md:gap-16"
          >
            <div className={cn(i % 2 === 1 && "md:order-2")}>
              <p data-anima className="etiqueta text-creme/60">
                {String(i + 1).padStart(2, "0")} · {s.prazo}
              </p>
              <h3 data-anima style={{ "--ordem": 1 } as React.CSSProperties} className="mt-3.5 mb-5 font-titulo text-[clamp(44px,6vw,84px)] leading-none">
                {s.nome}
              </h3>
              <p data-anima style={{ "--ordem": 2 } as React.CSSProperties} className="max-w-[420px] text-creme/60">
                {s.texto}
              </p>
            </div>
            <div className="order-first mx-auto aspect-square w-full max-w-[300px] md:order-none md:max-w-[460px]">
              <ArteServico id={s.id} />
            </div>
          </Reveal>
        ))}

        <Reveal className="space-y-8 border-t border-creme/15 py-20 md:py-28">
          <p data-anima className="max-w-2xl font-titulo text-[clamp(28px,4vw,44px)] leading-[1.15]">
            Tem uma ideia que não está aqui? Conta. Se for digital, acontece.
          </p>
          <div data-anima style={{ "--ordem": 1 } as React.CSSProperties}>
            <Cta tom="escuro">Me conta o que você precisa</Cta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
