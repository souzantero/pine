from contextlib import AsyncExitStack
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from sqlmodel import Session, create_engine

from src.env import database_url, checkpoint_saver_url

engine = create_engine(database_url)


def get_session():
    with Session(engine) as session:
        yield session


async def get_checkpoint_saver():
    async with AsyncPostgresSaver.from_conn_string(
        checkpoint_saver_url
    ) as checkpoint_saver:
        yield checkpoint_saver


async def open_checkpoint_saver() -> tuple[AsyncExitStack, AsyncPostgresSaver]:
    checkpoint_saver_stack = AsyncExitStack()
    checkpoint_saver_context = AsyncPostgresSaver.from_conn_string(checkpoint_saver_url)
    checkpoint_saver = await checkpoint_saver_stack.enter_async_context(
        checkpoint_saver_context
    )
    return checkpoint_saver_stack, checkpoint_saver
