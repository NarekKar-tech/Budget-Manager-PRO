from decimal import Decimal

from pydantic import BaseModel


class CategoryExpense(BaseModel):
    category: str
    amount: Decimal
    color: str


class MonthlyPoint(BaseModel):
    month: str
    income: Decimal
    expense: Decimal


class DashboardSummary(BaseModel):
    balance: Decimal
    income: Decimal
    expense: Decimal
    savings_rate: float
    category_expenses: list[CategoryExpense]
    monthly_trend: list[MonthlyPoint]
