import src.env  # noqa: F401
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import open_checkpointer, close_checkpointer
from src.auth.router import router as auth_router
from src.organization.router import router as organization_router
from src.organization.members.router import router as members_router
from src.organization.invites.router import router as invites_router
from src.roles.router import router as roles_router
from src.routers import collections, configs, documents, models, providers, threads


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia recursos no startup e shutdown."""
    # Startup
    await open_checkpointer()
    try:
        yield
    finally:
        # Shutdown
        try:
            await close_checkpointer()
        except Exception:
            pass  # Ignora erros de cancelamento no shutdown


app = FastAPI(title="PineAI API", version="1.0.0", lifespan=lifespan)

# CORS - permitir frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(organization_router)
app.include_router(members_router)
app.include_router(invites_router)
app.include_router(roles_router)
app.include_router(threads.router)
app.include_router(providers.router)
app.include_router(models.router)
app.include_router(configs.router)
app.include_router(collections.router)
app.include_router(documents.router)
