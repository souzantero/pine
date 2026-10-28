import { Pinhao } from "@/components/brand/pinha";
import { Reveal } from "@/components/landing/reveal";

const ITENS = [
  { titulo: "Implantação", texto: "No ar, no seu domínio, funcionando de verdade." },
  { titulo: "Qualidade", texto: "Testado antes de chegar em você." },
  { titulo: "Integração", texto: "Conversando com o que você já usa." },
  { titulo: "Sustentação", texto: "Acompanhado depois da entrega." },
  { titulo: "Escala", texto: "Preparado pra crescer junto com o seu negócio." },
];

const ordem = (n: number) => ({ "--ordem": n }) as React.CSSProperties;

// O que quase ninguém entrega: a parte que faz o software acontecer de verdade
export function VemJunto() {
  return (
    <div className="space-y-12">
      <Reveal className="space-y-5">
        <p data-anima className="etiqueta text-[var(--suave)]">
          O que vem junto
        </p>
        <h2 data-anima style={ordem(1)} className="font-titulo text-[clamp(36px,5vw,56px)] leading-[1.05]">
          O que quase ninguém entrega.
        </h2>
      </Reveal>
      <Reveal>
        <ul>
          {ITENS.map((item, i) => (
            <li
              key={item.titulo}
              data-anima
              style={ordem(i)}
              className="grid gap-1 border-t border-[var(--linha)] py-5 sm:grid-cols-[220px_1fr] sm:gap-6"
            >
              <span className="flex items-center gap-3 font-semibold">
                <Pinhao className="h-3 w-auto text-terracota" />
                {item.titulo}
              </span>
              <span className="text-[var(--suave)]">{item.texto}</span>
            </li>
          ))}
        </ul>
        <p data-anima style={ordem(ITENS.length)} className="mt-8 font-titulo text-2xl">
          Não é extra. É o que faz acontecer.
        </p>
      </Reveal>
    </div>
  );
}
