# PINE

Aplicacao de chat com integracao de agentes de IA e gestao multi-tenant de organizacoes.

## Stack

- **Frontend**: Next.js 16.1 + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Python FastAPI + SQLAlchemy + PostgreSQL
- **Auth**: JWT com tokens armazenados no localStorage

## Requisitos

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Docker (opcional, para PostgreSQL local)

## Setup

### 1. Backend

```bash
cd server

# Criar virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou .venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variaveis de ambiente
cp .env.example .env
# Editar .env com suas configuracoes

# Iniciar PostgreSQL (com Docker)
docker-compose up -d

# Rodar migrations
alembic upgrade head

# Iniciar servidor
uvicorn src.api:app --reload --port 8888
```

### 2. Frontend

```bash
# Na raiz do projeto

# Instalar dependencias
npm install

# Configurar variaveis de ambiente
echo "NEXT_PUBLIC_API_URL=http://localhost:8888" > .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
pine/
├── app/                    # Next.js pages e layouts
├── components/             # React components
│   └── ui/                 # shadcn/ui primitives
├── lib/                    # Utilitarios frontend
│   ├── api.ts              # Cliente HTTP para backend
│   └── session.tsx         # Context de sessao/autenticacao
├── server/                 # Backend Python (arquitetura modular)
│   ├── src/
│   │   ├── api.py          # FastAPI app
│   │   ├── core/           # Base compartilhada (env, schemas, storage, email)
│   │   ├── database/       # Conexao, entities, dependencies
│   │   ├── auth/           # Autenticacao, JWT, verificacao email, reset senha
│   │   ├── organization/   # Organizacoes, members, invites
│   │   ├── roles/          # Gestao de roles
│   │   ├── threads/        # Threads de chat, streaming SSE
│   │   ├── providers/      # Configuracao de provedores LLM
│   │   ├── models/         # Modelos de IA disponiveis
│   │   ├── configs/        # Configuracoes de ferramentas
│   │   ├── billing/        # Monetizacao com Stripe
│   │   ├── knowledge/      # Collections, documentos e RAG (pipeline ETL)
│   │   ├── agent/          # Agente de IA (LangGraph)
│   │   └── web/            # Ferramentas web (search, fetch)
│   └── db/                 # Alembic migrations
└── public/                 # Assets estaticos
```

## Funcionalidades

**Autenticacao e Usuarios:**
- Autenticacao com JWT (login, registro)
- Verificacao de email no registro (Resend)
- Recuperacao e alteracao de senha
- Gestao de conta do usuario

**Organizacoes:**
- Gestao de organizacoes multi-tenant
- Sistema de permissoes RBAC
- Convites para organizacoes
- Gestao de membros e roles
- Wizard de onboarding multi-step

**Chat e IA:**
- Threads de conversacao com streaming em tempo real
- Renderizacao de Markdown nas mensagens
- Agente de IA com ferramentas (web_search, web_fetch, knowledge_search)
- Configuracao de ferramentas por organizacao
- Prompts de sistema
- Configuracao de provedores (LLM: OpenAI, OpenRouter, Anthropic, Google; Web Search: Tavily)

**Base de Conhecimento (RAG):**
- Upload e processamento de documentos
- Multiplas estrategias de chunking
- Busca hibrida (semantica + keywords) com RRF
- Ferramenta de busca RAG integrada ao agente

**Monetizacao:**
- Integracao com Stripe (checkout, portal, webhooks)
- Planos e limites de uso
- Pagina de billing e assinaturas

**Outros:**
- Landing page profissional
- Paginas de Politica de Privacidade e Termos de Uso

## Scripts

### Frontend

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de producao
npm run start    # Servidor de producao
npm run lint     # ESLint
```

### Backend

```bash
cd server
uvicorn src.api:app --reload --port 8888    # Servidor dev
alembic upgrade head                         # Rodar migrations
alembic revision --autogenerate -m "msg"     # Criar migration
```

## API

O backend expoe os seguintes endpoints:

| Endpoint | Descricao |
|----------|-----------|
| `POST /auth/login` | Login, retorna JWT |
| `POST /auth/register` | Registro de usuario com verificacao de email |
| `GET /auth/me` | Usuario atual e memberships |
| `POST /auth/verify-email` | Verificar email com token |
| `POST /auth/forgot-password` | Solicitar reset de senha |
| `POST /auth/reset-password` | Resetar senha com token |
| `POST /auth/change-password` | Alterar senha (autenticado) |
| `GET /organizations/{id}/threads` | Listar threads |
| `GET /organizations/{id}/prompts` | Listar prompts |
| `GET /organizations/{id}/members` | Listar membros |
| `GET /organizations/{id}/roles` | Listar roles |
| `GET /organizations/{id}/models` | Modelos disponiveis |
| `GET /organizations/{id}/providers` | Provedores configurados (LLM, Web Search) |
| `GET /organizations/{id}/configs` | Configuracoes de ferramentas |
| `GET /organizations/{id}/collections` | Collections de conhecimento |
| `GET /organizations/{id}/billing` | Status e uso do billing |
| `POST /organizations/{id}/billing/checkout` | Criar sessao de checkout Stripe |

Documentacao completa da API em: `http://localhost:8888/docs`
