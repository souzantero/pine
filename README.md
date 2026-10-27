# PINE

Site institucional da PINE: landing page com captação de leads via WhatsApp.

## Stack

- Next.js 16.1 + React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- Deploy no Cloudflare Workers via OpenNext

## Requisitos

- Node.js 20+

## Setup

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
pine/
├── app/
│   ├── page.tsx              # Landing page (metadata + SEO)
│   ├── opengraph-image.tsx   # Imagem OG gerada no build
│   ├── privacy/              # Política de privacidade
│   └── terms/                # Termos de uso
├── components/
│   ├── landing/              # Seções da LP, formulário de lead e barras de tempo
│   ├── logo.tsx
│   └── ui/                   # shadcn/ui primitives
├── lib/utils.ts
└── public/
```

## Scripts

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # ESLint
npm run deploy   # Build OpenNext + deploy no Cloudflare (requer `npx wrangler login`)
```
