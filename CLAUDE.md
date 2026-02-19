# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pineai is a platform with AI agent integration and multi-tenant organization management. The project uses a decoupled architecture:

- **Frontend**: Next.js 16.1 + React 19 (TypeScript)
- **Backend**: Python FastAPI with SQLAlchemy ORM and PostgreSQL

## Commands

### Frontend (root directory)

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend (server directory)

```bash
cd server
source .venv/bin/activate    # Activate virtual environment

# Run server
uvicorn src.api:app --reload --port 8888

# Database migrations
alembic upgrade head         # Run migrations
alembic revision --autogenerate -m "description"  # Create migration

# Docker for local PostgreSQL
docker-compose up -d
```

## Architecture

### System Design

```
┌─────────────────┐         ┌─────────────────┐
│    Frontend     │  HTTP   │     Backend     │
│   Next.js App   │ ──────► │  FastAPI + DB   │
│  localhost:3000 │  JWT    │  localhost:8888 │
└─────────────────┘         └─────────────────┘
```

- Frontend is a React SPA that communicates with the Python backend via REST API
- Authentication uses JWT tokens stored in localStorage
- Current organization is managed client-side in localStorage

### Multi-Tenant RBAC System

The app implements role-based access control with organization scoping:

- **Users** can belong to multiple **Organizations** with different **Roles**
- **Roles** contain **Permissions** (THREADS_*, AGENTS_*, MEMBERS_*, ROLES_*, ORGANIZATION_MANAGE, PLATFORM_MANAGE, PROMPTS_*)
- Platform roles (null organizationId) vs Organization-scoped roles

### Authentication Flow

1. User logs in via `/auth/login` endpoint, receives JWT token
2. Token is stored in localStorage (`pineai_token`) via `lib/storage.ts`
3. `SessionProvider` (lib/session.tsx) manages user state and calls `/auth/me` to validate session
4. Current organization ID is stored in localStorage (`pineai_current_org`)
5. All API calls include `Authorization: Bearer <token>` header via `lib/api.ts`

### Key Files

**Frontend:**
- `lib/api.ts` - HTTP client for backend communication
- `lib/session.tsx` - SessionContext with `useSession()` hook providing user, memberships, currentMembership, hasPermission()
- `lib/storage.ts` - LocalStorage management (token, current org, chat settings)
- `lib/hooks/` - React hooks for API communication (use-threads, use-models, use-members, etc.)
- `lib/types/` - TypeScript types organized by category (entities, api, enums, inputs, results)

**Frontend Components (organized by feature):**
- `components/chat/` - Chat interface components (chat-area, agent-selector, chat-settings)
- `components/layout/` - Layout components (header, sidebar, org-switcher)
- `components/members/` - Member management components
- `components/prompts/` - Prompt management components
- `components/ui/` - shadcn/ui primitives

**Backend (modular architecture):**

```
server/src/
├── api.py                 # FastAPI app, CORS, router registration
├── core/                  # Shared foundation
│   ├── env.py             # Environment variables
│   ├── schemas.py         # CamelCaseModel base class
│   ├── storage.py         # S3 service
│   └── email.py           # Email service (Resend)
├── database/              # Database layer
│   ├── connection.py      # Engine, session, checkpointer
│   ├── entities.py        # SQLModel ORM entities
│   └── dependencies.py    # DatabaseDependency
├── auth/                  # Authentication module
│   ├── router.py          # /auth/* endpoints (login, register, verify, reset password)
│   ├── service.py         # Auth business logic, JWT, email verification, password reset
│   ├── schemas.py         # Auth request/response models
│   └── dependencies.py    # CurrentUserDependency, CurrentMembershipDependency
├── organization/          # Organization module
│   ├── router.py          # /organizations/* endpoints
│   ├── service.py         # Org CRUD logic
│   ├── schemas.py         # Org models
│   ├── members/           # Submodule: member management
│   └── invites/           # Submodule: invite management
├── roles/                 # Role management module
├── threads/               # Chat threads module
│   ├── router.py          # Thread CRUD + SSE streaming
│   ├── service.py         # Thread logic
│   ├── schemas.py         # Thread + RunRequest models
│   └── helpers.py         # Message formatting utilities
├── providers/             # LLM/API provider configuration
├── models/                # Available AI models
├── configs/               # Tool configurations
├── billing/               # Monetization with Stripe
│   ├── router.py          # Billing endpoints + Stripe webhook
│   ├── service.py         # Stripe integration
│   ├── schemas.py         # Billing models
│   └── limits.py          # Usage limits per plan
├── knowledge/             # Document collections + RAG
│   ├── router.py          # Collections + documents endpoints
│   ├── service.py         # Upload, processing logic
│   ├── config.py          # Chunking and retrieval config
│   ├── pipeline.py        # ETL pipeline for documents
│   ├── search.py          # RAG search tool
│   └── services/          # Specialized services
│       ├── chunking.py    # Multiple chunking strategies
│       ├── embedding.py   # Embedding generation
│       ├── extraction.py  # Document content extraction
│       ├── retrieval.py   # Hybrid search with RRF
│       └── storage.py     # Document storage
├── agent/                 # AI agent core
│   ├── agent.py           # build_agent, AgentContext
│   └── common.py          # get_model, tool display names
└── web/                   # Web tools module
    ├── search.py          # Web search tool (Tavily)
    ├── fetch.py           # Web fetch tool (Tavily)
    └── summarize.py       # Content summarization
```

- `server/db/` - Alembic migrations

### API Structure

All API routes are served by the Python backend at `localhost:8888`:

**Authentication:**
- `/auth/login` - Login, returns JWT
- `/auth/register` - User registration with email verification
- `/auth/me` - Current user and memberships
- `/auth/verify-email` - Verify email with token
- `/auth/resend-verification` - Resend verification email
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Reset password with token
- `/auth/change-password` - Change password (authenticated)

**Organizations:**
- `/organizations` - Create organization
- `/organizations/{org_id}` - Organization CRUD
- `/organizations/{org_id}/threads` - Conversation threads
- `/organizations/{org_id}/threads/{thread_id}/agents/{agent_id}/runs/stream` - AI agent invocation (streaming)
- `/organizations/{org_id}/prompts` - System prompts
- `/organizations/{org_id}/members` - Member management
- `/organizations/{org_id}/invites` - Organization invites
- `/organizations/{org_id}/roles` - Role management
- `/organizations/{org_id}/models` - Available AI models
- `/organizations/{org_id}/providers` - Provider configuration (LLM, Web Search, etc.)
- `/organizations/{org_id}/configs` - Tool configurations per organization
- `/organizations/{org_id}/collections` - Knowledge collections
- `/organizations/{org_id}/collections/{col_id}/documents` - Collection documents

**Billing:**
- `/organizations/{org_id}/billing/usage` - Billing status and usage

**Public:**
- `/invites/{token}` - Public invite info and accept

### UI Components

- Uses shadcn/ui (configured in components.json with "new-york" style)
- Primitives in `/components/ui/`
- Add components: `npx shadcn@latest add <component>`

### Page Flow

**Public pages:**
- `/` - Landing page
- `/privacy` - Privacy policy
- `/terms` - Terms of use

**Authentication:**
- `/auth/login`, `/auth/signup` - Auth pages
- `/auth/verify-pending` - Waiting for email verification
- `/auth/verify-email` - Email verification with token
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Reset password with token

**Authenticated (no org):**
- `/chat/onboarding` - Organization creation wizard (multi-step)
- `/invite/[token]` - Accept organization invites

**Authenticated (with org):**
- `/chat` - Main chat interface
- `/chat/collections`, `/chat/collections/[id]` - Knowledge collections
- `/chat/account` - User account settings
- `/chat/settings` - Organization settings
- `/chat/settings/members` - Member management
- `/chat/settings/providers` - Provider configuration
- `/chat/settings/tools` - Tool configurations
- `/chat/settings/knowledge` - Knowledge base settings
- `/chat/settings/billing` - Billing and subscription

## Code Conventions

- Comments are in Portuguese (pt-BR)
- Path alias: `@/*` maps to project root
- All frontend components use "use client" directive (SPA pattern)
- Backend uses camelCase for JSON responses (Pydantic alias_generator)

## Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8888
```

**Backend (server/.env):**
```
# Core
ENVIRONMENT=development
DATABASE_URL=postgresql://...
CHECKPOINT_SAVER_URL=postgresql://...

# OpenRouter (API keys per organization in DB)
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# JWT
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Pineai <noreply@pine.net.br>
APP_URL=http://localhost:3000

# Email verification
EMAIL_VERIFICATION_TOKEN_EXPIRATION_HOURS=24
EMAIL_VERIFICATION_RATE_LIMIT_SECONDS=60

# Password reset
PASSWORD_RESET_TOKEN_EXPIRATION_HOURS=1

```
