# LP com o novo pitch: software que acontece

Data: 2026-10-28
Base: branch `lp-nova-identidade` (identidade visual nova já aplicada; ver `2026-10-27-lp-nova-identidade-design.md`)

> **Atualização (mesmo dia):** o fundador não se identificou com o pitch da dor ("Fazer software ficou fácil...").
> A mensagem principal passou a ser a experiência: "Você pede. Acontece." contada como uma jornada
> (pedido, briefing, protótipos, desenvolvimento, ajustes, no ar), mostrada como o rastreio de um pedido
> (`components/landing/jornada.tsx`). As seções Dor, Virada, "O que vem junto" e "Como funciona" saíram.
> Ficaram o hero, a jornada, os serviços com arte, "O santo precisa bater" e o fechamento.

## Intenção

A PINE passa a se vender só como software: landing pages, sites, apps, sistemas sob medida, automações e agentes de IA. Criativos, vídeos e página de Instagram saem da LP; o fundador oferece esses serviços na negociação.

O pitch parte de uma tensão. Hoje qualquer um gera software com agentes de IA, mas quase ninguém coloca no ar, sustenta, integra, escala e garante qualidade. O resultado comum é um emaranhado de funcionalidades que não conversam e não resolvem a dor. A PINE não é a ferramenta (o "vibe coding" em que você mesmo faz) nem o jeito de sempre (lento, cobrando pelo trabalho): **a PINE é o resultado**. "Você pede. Acontece." passa a significar que acontece de verdade, e continua acontecendo.

## Metas

- Reescrever o roteiro e o copy da LP com o novo pitch.
- Dar a cada serviço de software um espaço protagonista, com uma arte própria feita de pinhões.
- Criar a seção "O que vem junto", com o que quase ninguém entrega.

## Fora do escopo

- O nome da categoria (o fundador decide depois). A LP não nomeia a categoria.
- Identidade visual, hero animado, formulário e páginas legais: ficam como estão, só muda o texto onde indicado.
- Criativos, vídeos e gestão de Instagram não aparecem como serviço. O link para o Instagram da própria PINE no rodapé continua (chamada minha).

## Antimetas

- Citar "software house", "agência" ou "service as software", mesmo para negar (regra do CLAUDE.md). O contraste é com "a ferramenta" e "o jeito de sempre".
- Explicar demais: tom direto e curto, uma ideia por frase.
- Usar a palavra "pronto" como bandeira (o fundador não gosta). Em texto corrido, evitar também.
- Preços.

## Decisões do fundador

- Pitch e frase-âncora: "Não somos a ferramenta. Somos o resultado."
- Subtítulo do hero: "Apps, sistemas e sites em dias. Com IA."
- Serviços com destaque e arte própria, feita de pinhões, conversando com o serviço e com a identidade. Artes aprovadas no esboço (`.superpowers/brainstorm/84552-1793145547/content/servicos.html`, gerado por `servicos.py` no scratchpad, geometria reproduzida abaixo):
  - Landing pages: funil, com muitos pinhões em cima afunilando até um verde (a conversão).
  - Sites: globo de pinhões (contorno, 3 paralelos com a metade da frente, 3 meridianos); o verde é o site no mapa.
  - Apps: celular (contorno arredondado) com grade 3×5 de pinhões como ícones; o verde é o do meio.
  - Sistemas sob medida: rede hexagonal, com 7 nós (flores de 6 pinhões + 1 central) ligados por pinhões pequenos; o nó central é verde.
  - Automações: laço infinito (lemniscata) de pinhões tangentes ao caminho; um deles é verde.
  - Agentes de IA: 4 anéis de pinhões irradiando de um centro verde.

## Roteiro e copy

| # | Seção | Fundo | Conteúdo |
|---|---|---|---|
| 1 | Hero | tinta | Igual ao atual. Subtítulo novo: "Apps, sistemas e sites em dias. Com IA." |
| 2 | Dor | creme | Título: "Fazer software ficou fácil. Fazer funcionar, não." Três frases que entram em sequência: "Hoje qualquer um gera um app com IA em minutos." / "Poucos colocam no ar. Menos ainda sustentam, integram e escalam." / "O que sobra é um emaranhado de funcionalidades que não conversam entre si e não resolvem a dor." |
| 3 | Virada | tinta | Título palavra por palavra: "Não somos a ferramenta. Somos o resultado." Apoio: "A ferramenta te dá mais trabalho. O jeito de sempre te cobra pelo trabalho. A PINE te entrega o resultado: no ar, integrado, testado e preparado pra crescer." |
| 4 | Serviços | tinta | Título "O que acontece." em Fraunces, sem repetir o subtítulo do hero (chamada minha; o esboço repetia). Seis faixas (abaixo), alternando arte à direita e à esquerda. No fim, um bloco: "Tem uma ideia que não está aqui? Conta. Se for software, acontece." + CTA. |
| 5 | O que vem junto | creme | Etiqueta "O que vem junto". Título "O que quase ninguém entrega." Cinco itens (abaixo). Fecho: "Não é extra. É o que faz acontecer." |
| 6 | Como funciona | creme | Igual ao atual (linha que se desenha, pinhão verde no "Acontece."). |
| 7 | O santo precisa bater | creme | Igual ao atual. |
| 8 | Fechamento + rodapé | tinta | Iguais aos atuais. |

**Faixas de serviço** (número · prazo, nome, frase):

1. 01 · 24 horas · Landing pages · Feita pra campanha, rápida e medindo tudo. (Chamada minha: troquei "Pronta" pela regra do "pronto".)
2. 02 · 3 dias · Sites · Institucional, blog ou multilíngue, com SEO desde o primeiro dia.
3. 03 · 2 semanas · Apps · Web ou mobile, do protótipo à loja.
4. 04 · Sob medida · Sistemas sob medida · Gestão, portal do cliente, painel. Conversando com o que você já usa.
5. 05 · Sob medida · Automações · Planilha, CRM, email e WhatsApp trabalhando sozinhos.
6. 06 · Sob medida · Agentes de IA · Atendimento, vendas e suporte respondendo a qualquer hora.

**O que vem junto** (chamada minha no texto de cada item):

- Implantação: no ar, no seu domínio, funcionando de verdade.
- Qualidade: testado antes de chegar em você.
- Integração: conversando com o que você já usa.
- Sustentação: acompanhado depois da entrega.
- Escala: preparado pra crescer junto com o seu negócio.

Também mudam as descrições nos metadados (`app/page.tsx` e `app/layout.tsx`, que ainda falam em "o que antes levava meses") e na imagem OG (`app/opengraph-image.tsx`), para "Apps, sistemas e sites em dias. Com IA."

## Motion

- As faixas de serviço usam o mesmo `Reveal`. Quando a faixa entra na tela, os pinhões da arte se montam em cascata (aparecem pequenos e girados e pousam no lugar, com ~12ms entre eles) e o verde chega sempre por último, independente da posição dele na lista, com o brilho do hero. O texto da faixa sobe como nas outras seções.
- No desktop, cada faixa tem altura generosa (cerca de 80vh) e a arte ocupa cerca de 460px. No celular, a arte fica em cima, com no máximo 300px.
- `prefers-reduced-motion` e a ausência de JS mostram tudo pronto, como no resto da página.

## Arquitetura (chamada minha)

- `components/brand/artes.ts`: a geometria das seis artes em TypeScript, portada do esboço, e reutilizando `pinhao()` de `pinha.tsx` (exportar a função). Cada arte é uma lista de `{ d, verde }` num viewBox `-200 -200 400 400`.
- `components/landing/servicos.tsx`: as faixas e o bloco final.
- `components/landing/vem-junto.tsx`: a seção "O que vem junto".
- `landing-page.tsx`: o roteiro novo, sem `ENTREGAS` e sem a grade antiga.

## Como saber que deu certo

- Lint e build passam. Lighthouse mobile segue com LCP < 2,5s.
- As artes em produção batem com o esboço aprovado.
- Copy conferido contra as regras (sem os termos proibidos, sem travessão, PINE em maiúsculas, sem preço).
- Conferência em 1440 e 390px, com movimento reduzido e sem JS.
