# LP com a nova identidade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir a LP da PINE com a identidade de `brand/` (pinha em espiral, Fraunces/Inter/JetBrains Mono, tinta/creme/terracota/verde) e motion em todas as seções.

**Architecture:** Tokens da marca viram variáveis CSS mapeadas no `@theme` do Tailwind 4. Um componente `Pinha` reproduz a geometria de `brand/_gerador/gerar.py` em SVG. As animações são CSS puro, disparadas por classe: o hero anima no carregamento e as demais seções ganham `.visivel` via um único `IntersectionObserver` (`Reveal`). Sem biblioteca de animação.

**Tech Stack:** Next.js 16.1, React 19, Tailwind 4, next/font/google, Playwright (MCP) para conferência visual, Lighthouse via `npx`.

**Spec:** `docs/superpowers/specs/2026-10-27-lp-nova-identidade-design.md`

**Referência visual:** `.superpowers/brainstorm/84552-1793145547/content/hero-prototipo.html` (CSS e tempos do hero aprovados) e `brand/index.html`.

## Global Constraints

- Paleta exata: tinta `#1B1410`, creme `#F3EBDD`, terracota `#9C4A2B`, verde `#2F6B4F` (no claro), verde-claro `#5B9E78` (no escuro).
- Fontes: Fraunces 400 (títulos, caixa normal), Inter 400/600 (texto), JetBrains Mono 400 (etiquetas, caixa alta, `letter-spacing: .12em`).
- Copy idêntico ao atual de `components/landing/landing-page.tsx`. "PINE" em maiúsculas, sem travessões, sem "agência"/"software house"/"service as software", sem preços.
- Verde só em: hero (pinha, CTA, barra PINE), marcador do passo "Acontece.", pinha do fechamento. Demais pinhões de CTA e destaque em terracota.
- Logo: SVGs de `brand/logo/svg/`, nunca redesenhado em código. `cor` no escuro, `negativo` no claro.
- `prefers-reduced-motion: reduce` mostra tudo no estado final, sem animação.
- Sem dependências novas de runtime.
- Comentários em pt-BR.
- LCP mobile < 2,5s.

## Review Focus

- Sem JavaScript ou antes da hidratação, as seções com `Reveal` não podem ficar invisíveis para sempre: o estado escondido só vale sob `html.js` (classe posta por script inline no `<head>`).
- `prefers-reduced-motion`: hero, barras, pinha girando e revelações aparecem prontos.
- Celular de 360 a 390px: sem rolagem horizontal, mesmo com a pinha do fechamento cortada pela borda (`overflow: hidden` na seção).
- O sheet do formulário abre por cima de seções escuras e claras com contraste legível (fundo creme, texto tinta).
- Voltar para o topo ou rolar de novo não reanima as seções (a revelação acontece uma vez só).

---

### Task 0: Medir a versão atual

**Files:** nenhum (registrar o resultado na descrição do commit da Task 1)

- [ ] **Step 1:** `npm run build && npm run start` (porta 3000).
- [ ] **Step 2:** `npx -y lighthouse http://localhost:3000 --only-categories=performance --form-factor=mobile --quiet --chrome-flags="--headless" --output=json --output-path=<scratchpad>/lh-antes.json`
- [ ] **Step 3:** Anotar `performance` e `largest-contentful-paint` (de `audits`). Parar o servidor.

### Task 1: Fundação da marca (tokens, fontes, logo, ícones)

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `components/brand/logo.tsx`; `public/logo/pine-horizontal-cor.svg`, `public/logo/pine-horizontal-negativo.svg` (cópias de `brand/logo/svg/`)
- Create: `app/icon.svg` (de `brand/favicon/favicon.svg`), `app/apple-icon.png` (de `brand/favicon/apple-touch-icon.png`)
- Delete: `components/logo.tsx`, `public/favicon.svg`

**Interfaces:**
- Produces:
  - Classes Tailwind `bg-tinta text-creme bg-creme text-tinta text-terracota fill-terracota text-verde text-verde-claro`.
  - `font-titulo`, `font-sans` (Inter), `font-mono` (JetBrains Mono).
  - Utilitário `.etiqueta` (mono, 12px, caixa alta, `.12em`).
  - `Logo({ versao: "cor" | "negativo", className?: string })`: `<img>` com `alt="PINE"`, altura vem do `className`.

- [ ] **Step 1:** Em `globals.css`, definir as variáveis `--tinta --creme --terracota --verde --verde-claro` e mapear no `@theme inline` como `--color-*`. Mapear `--font-titulo/--font-sans/--font-mono` para as variáveis do next/font. Redefinir os tokens shadcn usados pelo sheet e pelos inputs: `--background` creme, `--foreground` tinta, `--primary` tinta, `--primary-foreground` creme, `--border`/`--input` tinta a 15%, `--ring` terracota, `--muted-foreground` tinta a 60%. Declarar `.etiqueta` em `@layer components`.
- [ ] **Step 2:** Em `layout.tsx`, trocar Montserrat por `Fraunces({ weight: "400", variable: "--font-fraunces" })`, `Inter({ weight: ["400","600"], variable: "--font-inter" })` e JetBrains Mono. Adicionar `<head><script dangerouslySetInnerHTML={{__html:"document.documentElement.classList.add('js')"}} /></head>`. Remover `icons` de `metadata`, porque `app/icon.svg` e `app/apple-icon.png` passam a cuidar disso.
- [ ] **Step 3:** Criar `Logo`, copiar os SVGs e ícones, apagar os arquivos antigos e trocar o import em `landing-page.tsx` para `@/components/brand/logo` (`<Logo versao="cor" className="h-6 w-auto" />`, por enquanto).
- [ ] **Step 4:** `npm run lint && npm run build`. Esperado: sucesso. Em `/privacy` (dev), o texto aparece em Inter sobre creme.
- [ ] **Step 5:** Commit em uma branch `lp-nova-identidade`, junto com `brand/`, `.gitignore` e os docs: "Aplicar a base da nova identidade (tokens, fontes, logo, ícones)".

### Task 2: Componente Pinha

**Files:**
- Create: `components/brand/pinha.tsx`, `components/brand/pinha.css` (importado no componente)

**Interfaces:**
- Produces:
  - `Pinha({ animada?: boolean; girando?: boolean; corDestaque?: "verde" | "verde-claro"; className?: string })`: um `<svg viewBox="-310 -310 620 620" aria-hidden>` com 89 `<path>`.
  - Export `PINHOES: { d: string; x: number; y: number }[]`, calculado uma vez no módulo.
  - Export `PINHAO_D: string`: o pinhão isolado centrado na origem, para os ícones dos CTAs.

- [ ] **Step 1:** Implementar a geometria idêntica à de `gerar.py`: `c = 270/√89`; para n = 1..89, `r = c√n`, `θ = n·137.508°`, centro `(r·sinθ, −r·cosθ)`, comprimento `L = 16 + 0.2r`, largura `0.6L`; a gota é a mesma de `pinhao()` (pontos em `(0,−L/2)`, `(L·0.3,−L/4)`, `(L·0.3,L/2)`, `(0,L/2)`, espelhados), rotacionada por θ. O path 89 recebe `class="destaque"`. Arredondar a 2 casas.
- [ ] **Step 2:** Portar o CSS do protótipo para `pinha.css`, com escopo em `.pinha`:
  - Com `animada`, cada path recebe `style={{"--i": n, "--x": x, "--y": y}}` e a animação do protótipo (atraso `.55s + i·11ms`; o destaque pousa em 1,65s e brilha em 2,05s).
  - `girando` aplica a rotação de 140s depois de 2,4s.
  - Tudo dentro de `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 3:** Conferir: renderizar `<Pinha />` estático temporariamente na página e comparar com `brand/logo/png/pine-simbolo-cor.png` por screenshot (mesmo desenho, o verde no mesmo lugar). Remover o teste temporário.
- [ ] **Step 4:** `npm run lint`. Commit: "Adicionar componente Pinha com a geometria da marca".

### Task 3: Header, Cta e Hero

**Files:**
- Create: `components/landing/cta.tsx`, `components/landing/hero.tsx`, `components/landing/hero.css`
- Modify: `components/landing/time-bars.tsx`, `components/landing/landing-page.tsx`

**Interfaces:**
- Consumes: `Pinha`, `PINHAO_D`, `Logo`, `useLeadForm`.
- Produces:
  - `Cta({ children, tom?: "claro" | "escuro", destaque?: boolean })`. `tom="escuro"` é o botão creme para fundo tinta; `"claro"` é o botão tinta para fundo creme. `destaque` deixa o pinhão do ícone verde-claro; sem ele, terracota. O pinhão se mexe no hover.
  - `Hero()`.
  - `TimeBars({ comecar: boolean })`.

- [ ] **Step 1:** `Header` com fundo tinta, `<Logo versao="cor" className="h-[26px] w-auto" />` e um botão `.etiqueta` "Vamos conversar" em creme/60, que vai para creme no hover.
- [ ] **Step 2:** `Hero` seguindo a grade, os tamanhos e os tempos do protótipo:
  - `h1` em Fraunces com `.l1` "Você pede." e `.l2` "Acontece.".
  - Subtítulo "Landing page em 24 horas. Site em 3 dias. App em 2 semanas.".
  - `<Cta tom="escuro" destaque>Me conta o que você precisa</Cta>`.
  - `<Pinha animada girando corDestaque="verde-claro" />` com o brilho radial.
  - Abaixo, `TimeBars`.
  - As classes de animação ficam sob `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 3:** `TimeBars` restilizado como no protótipo:
  - Rótulos `.etiqueta`.
  - Barra antiga em creme/30, com 6s de duração e atraso de 2,9s.
  - Barra PINE em verde-claro, em 6% com 0,45s de duração e atraso de 3,1s.
  - A animação usa classes CSS em vez de estado e `requestAnimationFrame`. A prop `comecar` some se não for necessária.
  - Manter o `aria-label` atual.
- [ ] **Step 4:** Conferência com Playwright em 1440 e 390px, aos 0,5s e aos 4s, comparando com o protótipo. Repetir com `emulateMedia({ reducedMotion: "reduce" })`: tudo visível de imediato.
- [ ] **Step 5:** `npm run lint`. Commit: "Novo hero com a pinha animada".

### Task 4: Reveal e seções de leitura (Dor, Virada, Entregas, Como funciona, Santo)

**Files:**
- Create: `components/landing/reveal.tsx`, `components/landing/secoes.css`
- Modify: `components/landing/landing-page.tsx`

**Interfaces:**
- Consumes: `Cta`, `PINHAO_D`.
- Produces:
  - `Reveal({ as?: "section" | "div", className?: string, children })`: adiciona `.visivel` quando 20% do elemento entra na tela (`threshold: 0.2`) e depois desconecta.
  - `Section({ tom: "claro" | "escuro", children, className? })`: substitui o atual, envolve `Reveal` e aplica o fundo e o texto correspondentes.

- [ ] **Step 1:** Em `secoes.css`, o estado escondido só vale para `html.js .reveal:not(.visivel) [data-anima]`, e só dentro de `prefers-reduced-motion: no-preference`. Filhos com `data-anima` sobem 24px e aparecem, com atraso `calc(var(--ordem, 0) * 120ms)`. Duração de 0,7s, `cubic-bezier(.2,.7,.2,1)`.
- [ ] **Step 2:** Dor (claro): as três perguntas em Fraunces, com `--ordem` 0, 1 e 2 e intervalo de 250ms (sobrescrever o passo para essa seção).
- [ ] **Step 3:** Virada (escuro): o título em Fraunces é quebrado em `<span data-anima>` por palavra, com `--ordem` = índice e passo de 60ms. A frase de apoio vem depois de todas as palavras.
- [ ] **Step 4:** Entregas (claro):
  - Etiquetas `.etiqueta`, títulos em Fraunces.
  - Os itens da grade em cascata.
  - No hover, um pinhão terracota (`PINHAO_D`) aparece à esquerda do título do item.
  - O bloco final "E o que mais você precisar" fica em tinta, com o pinhão terracota.
- [ ] **Step 5:** Como funciona (dentro de Entregas):
  - Uma linha vertical de 1px liga os marcadores 1, 2 e 3 e se desenha com `scaleY` de 0 a 1 em 1,2s quando a seção fica `.visivel`.
  - Os marcadores 1 e 2 são números em mono.
  - O marcador do passo 3 é um pinhão em verde `#2F6B4F`, que aparece no fim da linha.
  - Logo abaixo, `<Cta tom="claro">`.
- [ ] **Step 6:** O santo precisa bater (claro): revelação simples.
- [ ] **Step 7:** Playwright: rolar seção a seção em 1440 e 390px, com screenshot de cada uma depois de 1,5s. Recarregar com `reducedMotion: "reduce"` e com JavaScript desligado (`browser_run_code` com um contexto `javaScriptEnabled: false`, ou o protótipo HTML gerado pelo `next build`): as seções têm que estar visíveis.
- [ ] **Step 8:** `npm run lint`. Commit: "Seções de leitura com a nova identidade e revelação na rolagem".

### Task 5: Fechamento e rodapé

**Files:**
- Modify: `components/landing/landing-page.tsx`, `components/landing/secoes.css`

**Interfaces:**
- Consumes: `Section`, `Pinha`, `Cta`, `Logo`.

- [ ] **Step 1:** Fechamento (escuro, `overflow-hidden`):
  - Título em Fraunces grande. "Pede agora." em creme/40.
  - `<Cta tom="escuro">Falar com a PINE</Cta>`, com o pinhão terracota.
  - `<Pinha girando corDestaque="verde-claro" />` grande (cerca de 70vw no desktop), posicionada à direita e cortada pela borda. No celular fica atrás do texto, com opacidade de 0,35. O giro só começa quando a seção fica `.visivel`.
- [ ] **Step 2:** Rodapé (escuro): `<Logo versao="cor" className="h-5 w-auto" />`, os mesmos links atuais em `.etiqueta` creme/50 e uma linha creme/15 no topo.
- [ ] **Step 3:** Playwright em 390px: `document.documentElement.scrollWidth === 390`.
- [ ] **Step 4:** `npm run lint`. Commit: "Fechamento com a pinha grande e rodapé novo".

### Task 6: Formulário, imagem OG e páginas legais

**Files:**
- Modify: `components/landing/lead-form.tsx`, `app/opengraph-image.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`

- [ ] **Step 1:** No sheet:
  - Fundo creme.
  - `SheetTitle` "Me conta." em Fraunces, em caixa normal.
  - Labels `.etiqueta`.
  - Botão de envio em tinta/creme, com o pinhão verde (é o momento do "acontece").
  - O comportamento continua igual.
- [ ] **Step 2:** Imagem OG 1200×630:
  - Fundo `#1B1410`.
  - "Você pede." e "Acontece." em Fraunces 400, 112px, cor creme. Carregar o TTF da Fraunces com `fetch` da URL do Google Fonts (CSS2 com `text=` para subsetar) dentro da função, `ArrayBuffer` passado em `fonts`.
  - A pinha à direita, como `<img src="data:image/svg+xml;base64,…">` do `pine-simbolo-cor.svg`, lido com `readFile` de `brand/logo/svg/` no build.
  - O subtítulo atual em Inter/creme 60%.
- [ ] **Step 3:** Em `/privacy` e `/terms`, trocar o header atual por `Logo versao="negativo"` + "Voltar", e o `h1` para Fraunces. O resto continua igual.
- [ ] **Step 4:** `npm run build`. Abrir `/opengraph-image` no navegador e conferir. Abrir o sheet na LP e conferir. Commit: "Formulário, imagem OG e páginas legais na nova identidade".

### Task 7: Verificação final

- [ ] **Step 1:** `npm run lint && npm run build`: sem erros.
- [ ] **Step 2:** Lighthouse mobile como na Task 0. Comparar com a medição de antes. Critério: LCP < 2,5s. Se falhar, encurtar os atrasos do hero (de `.l1` e do subtítulo) sem mudar a ordem, e medir de novo.
- [ ] **Step 3:** Screenshots finais em 1440 e 390px da página inteira, e checagem dos itens da Review Focus.
- [ ] **Step 4:** Apagar `.playwright-mcp/`. Commit final, se houver ajuste. Não fazer deploy: o fundador aprova olhando localmente primeiro.
