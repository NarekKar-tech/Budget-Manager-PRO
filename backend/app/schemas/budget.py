from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.category import CategoryRead


class BudgetCreate(BaseModel):
    amount: Decimal = Field(gt=0)
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2000, le=2100)
    category_id: int


class BudgetRead(BaseModel):
    id: int
    amount: Decimal
    month: int
    year: int
    category: CategoryRead
    spent: Decimal = Decimal("0")
    progress: float = 0

    model_config = ConfigDict(from_attributes=True)
