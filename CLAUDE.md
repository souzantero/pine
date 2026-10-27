# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Site institucional da PINE (pine.net.br): uma landing page focada em velocidade de entrega e captação de leads. Não há backend: todos os CTAs abrem um formulário que envia o lead pelo WhatsApp.

- **Stack**: Next.js 16.1 + React 19 (TypeScript), Tailwind CSS, shadcn/ui
- **Hosting**: Cloudflare Workers via OpenNext (`wrangler.toml`, worker `pine-web`)

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run deploy   # OpenNext build + deploy to Cloudflare (requires `npx wrangler login`)
```

## Architecture

### Pages

- `/` - Landing page (`app/page.tsx` is a server component that exports metadata/OG and renders `components/landing/landing-page.tsx`)
- `/privacy` - Privacy policy
- `/terms` - Terms of use
- `app/opengraph-image.tsx` - OG image generated at build time

### Key Files

- `components/landing/landing-page.tsx` - All LP sections (hero, dor, virada, Entregas, santo precisa bater, fechamento, footer)
- `components/landing/lead-form.tsx` - `LeadFormProvider` + `useLeadForm()`: side sheet form that opens WhatsApp with a prefilled message
- `components/landing/time-bars.tsx` - Animated "O jeito de sempre vs PINE" comparison
- `components/ui/` - shadcn/ui primitives (new-york style; add with `npx shadcn@latest add <component>`)

## Copy Guidelines

- Tom direto, confiante, curto; provoca curiosidade em vez de explicar o modelo de negócio
- "PINE" sempre em maiúsculo
- Não usar os termos "agência", "software house" ou "service as software" no copy
- Não usar travessões (em-dashes)
- Sem catálogo de preços

## Code Conventions

- Comments are in Portuguese (pt-BR)
- Path alias: `@/*` maps to project root
- Client components use the "use client" directive; pages that export metadata stay server components
