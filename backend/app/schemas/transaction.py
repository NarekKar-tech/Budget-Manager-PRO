from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.category import CategoryRead


class TransactionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str | None = None
    amount: Decimal = Field(gt=0)
    type: Literal["income", "expense"]
    transaction_date: date
    category_id: int


class TransactionUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    amount: Decimal | None = Field(default=None, gt=0)
    type: Literal["income", "expense"] | None = None
    transaction_date: date | None = None
    category_id: int | None = None


class TransactionRead(BaseModel):
    id: int
    title: str
    description: str | None
    amount: Decimal
    type: str
    transaction_date: date
    created_at: datetime
    category: CategoryRead

    model_config = ConfigDict(from_attributes=True)
