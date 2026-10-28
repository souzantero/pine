# LP com a nova identidade visual e motion

Data: 2026-10-27

## Intenção

A PINE ganhou uma identidade nova (pasta `brand/`): a pinha em espiral com 89 pinhões e um pinhão verde, Fraunces nos títulos, Inter no texto, JetBrains Mono nas etiquetas, e uma paleta de tinta, creme, terracota e verde. A LP atual ainda usa a identidade antiga (Montserrat extrabold em caixa alta, preto e off-white, logo só em texto).

O objetivo é que a LP pareça profissional e "bem motion design", nas palavras do fundador, usando a pinha como protagonista. O motion não é enfeite: ele conta a promessa "Você pede. Acontece." Algo se monta sozinho, rápido e com precisão, e o verde marca o momento em que acontece.

## Metas

- Aplicar a identidade de `brand/` em toda a LP: cores, fontes, logo, favicon e imagem OG.
- Hero animado igual ao protótipo aprovado (ver "Hero" abaixo).
- Motion em todas as seções, disparado pela rolagem, com a mesma linguagem do hero.
- Manter a LP rápida: nenhuma biblioteca de animação; só CSS, SVG e `IntersectionObserver`.

## Fora do escopo

- Copy: o texto da LP continua exatamente o atual (`components/landing/landing-page.tsx`). Só muda a tipografia (sai a caixa alta, entra Fraunces em caixa normal nos títulos).
- Formulário de lead: o comportamento continua igual (sheet lateral que abre o WhatsApp). Só ganha as cores e fontes novas.
- Páginas `/privacy` e `/terms`: recebem só o que vier de graça das fontes e cores globais; não serão redesenhadas.

## Antimetas (seria um fracasso mesmo funcionando)

- Animação que atrasa a leitura ou o clique: o CTA do hero precisa estar clicável em até ~3s, e nada da página pode depender da animação para aparecer.
- Cara de template: nada de gradientes genéricos, cards arredondados com sombra ou ícones de biblioteca.
- Verde em excesso: um acento verde por tela, no máximo.
- Quebrar as regras de copy do CLAUDE.md.
- Piorar o desempenho de forma perceptível no celular.

## Restrições

- Next.js 16.1 + React 19 + Tailwind 4, deploy na Cloudflare via OpenNext. Sem backend.
- Fontes via `next/font/google`: Fraunces 400, Inter 400/600, JetBrains Mono 400.
- Paleta exata de `brand/tokens.css`. No escuro o acento é `#5B9E78`; no claro, `#2F6B4F`.
- Logo: usar os SVGs de `brand/logo/svg/` (versão `cor` no fundo escuro, `negativo` no claro). Não redesenhar o logo em código.
- `prefers-reduced-motion`: a página aparece já no estado final, sem animação.
- Comentários de código em pt-BR.

## Decisões já tomadas com o fundador

- **Fundos alternados**: hero e fechamento em tinta (escuro); seções de leitura em creme. A marca vive no escuro.
- **Hero** (protótipo aprovado em `.superpowers/brainstorm/.../hero-prototipo.html`):
  - Grade com texto à esquerda e pinha à direita; no celular, a pinha vai em cima, com no máximo 300px.
  - "Você pede." entra primeiro (opacidade, subida e desfoque).
  - Os 89 pinhões voam até o lugar na ordem da espiral, cada um saindo do centro girado e pequeno.
  - O pinhão verde pousa por último, com um brilho, e "Acontece." entra junto.
  - Depois entram o subtítulo e o CTA. O CTA é creme e tem um pinhão verde que se mexe no hover.
  - A pinha passa a girar muito devagar (uma volta a cada ~140s).
  - Abaixo, as barras "O jeito de sempre / 90 dias" e "PINE / dias", com a da PINE em verde.
  - Sequência total de uns 3s.
- **Cabeçalho**: logo horizontal `cor` à esquerda e "Vamos conversar" em JetBrains Mono à direita.
- **Etiquetas** de seção em JetBrains Mono, caixa alta.
- **CTAs** carregam um pequeno pinhão.

## Onde o verde aparece (chamada minha)

O verde significa "acontece". Ele aparece só onde essa ideia está presente:

- Hero: no pinhão da pinha, no pinhão do CTA e na barra da PINE. É uma exceção já aprovada no protótipo, porque o hero é o momento em que a promessa se cumpre.
- Como funciona: no marcador do passo "Acontece.".
- Fechamento: no pinhão da pinha grande.

Os demais CTAs e o bloco "E o que mais você precisar" usam o pinhão em terracota. Assim, fora do hero, nunca há mais de um verde na mesma tela.

## Seções e motion (proposta, chamada minha)

Cada seção entra quando ~20% dela aparece na tela, uma vez só.

| Seção | Fundo | Motion |
|---|---|---|
| Hero | tinta | Como acima |
| Dor (as três perguntas) | creme | Cada pergunta sobe e aparece em sequência, com intervalo de ~250ms |
| Virada | tinta | O título se revela palavra por palavra; a frase de apoio aparece depois |
| Entregas | creme | Título e texto sobem; os itens da grade entram em cascata. No hover, um pinhão terracota aparece ao lado do título do item. O bloco "E o que mais você precisar" é o destaque em tinta, com um pinhão terracota. |
| Como funciona | creme (mesma seção de Entregas) | Uma linha fina se desenha ligando os passos 1, 2 e 3. No "Acontece.", o marcador vira um pinhão verde. |
| O santo precisa bater | creme | Revelação simples (sobe e aparece) |
| Fechamento | tinta | Pinha grande, girando devagar e parcialmente cortada pela borda; título em Fraunces grande; CTA |
| Rodapé | tinta | Sem animação; logo `cor` pequeno |

## Arquitetura (chamada minha)

- `app/globals.css`: tokens da marca como variáveis CSS, mapeados no `@theme` do Tailwind (`bg-tinta`, `text-creme` etc.). Removem-se os tokens shadcn que não forem usados pelo sheet e pelos inputs.
- `app/layout.tsx`: troca Montserrat por Fraunces + Inter + JetBrains Mono.
- `components/brand/pinha.tsx`: componente server-friendly que gera os 89 pinhões com a mesma geometria de `brand/_gerador/gerar.py` (ângulo áureo 137,508°, raio 270, comprimento `16 + 0,2r`, largura `0,6 × comprimento`). Recebe uma prop para animar ou não. Uma fonte de verdade para a geometria no front.
- `components/brand/logo.tsx`: substitui `components/logo.tsx`; renderiza o SVG horizontal (`cor` ou `negativo`) copiado de `brand/logo/svg/`.
- `components/landing/reveal.tsx`: um único hook/componente com `IntersectionObserver` que adiciona uma classe quando a seção entra na tela. As animações ficam em CSS.
- Favicon e ícones: copiar `brand/favicon/*` para `public/` (ou `app/icon.svg`, `app/apple-icon.png`) e atualizar `metadata.icons`.
- Imagem OG: refazer `app/opengraph-image.tsx` em tinta, com a pinha à direita e "Você pede. Acontece." em Fraunces (carregar a fonte no `ImageResponse`).

## Fica a critério de quem constrói

- Easing e durações finas, desde que a sequência do hero respeite os ~3s e as revelações por rolagem fiquem entre 0,5 e 0,9s.
- Tamanhos tipográficos exatos e espaçamentos, seguindo o protótipo e o `brand/index.html`.
- Como cortar a pinha no fechamento.

## Como saber que deu certo

- `npm run build` e `npm run lint` passam.
- Conferência visual em 1440px e 390px, com e sem `prefers-reduced-motion`.
- Desempenho (chamada minha): a animação do hero manda, mas o LCP no celular precisa ficar abaixo de 2,5s, o limite que o Google considera "bom". Como o texto do hero começa invisível, o LCP vai subir em relação a hoje. Antes de começar, rodar o Lighthouse mobile da versão atual para ter a referência. Se o LCP passar de 2,5s, a primeira saída é encurtar os atrasos do hero, sem mudar a sequência.
- O fundador aprova olhando a LP rodando local antes do deploy.
