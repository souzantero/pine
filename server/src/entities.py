import uuid
from datetime import UTC, datetime

from sqlmodel import Field, SQLModel, String


def get_now():
    return datetime.now(UTC)


class Thread(SQLModel, table=True):
    __tablename__ = "thread"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=get_now)
    updated_at: datetime = Field(default_factory=get_now)
    owner: str | None = Field(sa_type=String, index=True)
