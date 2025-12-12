from typing import Annotated
from fastapi import Depends, FastAPI, Query
from sqlmodel import Session, col, select

from src.entities import Thread
from src.database import get_session

app = FastAPI()

SessionDependency = Annotated[Session, Depends(get_session)]


@app.post("/threads")
def create_thread(thread: Thread, session: SessionDependency):
    session.add(thread)
    session.commit()
    session.refresh(thread)
    return thread


@app.get("/threads/search")
async def search_threads(
    session: SessionDependency,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    statement = (
        select(Thread)
        .offset(offset)
        .order_by(col(Thread.created_at).desc())
        .limit(limit)
    )
    return session.exec(statement).all()
