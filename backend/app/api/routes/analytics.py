from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.analytics import CategoryExpense, DashboardSummary, MonthlyPoint

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=DashboardSummary)
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardSummary:
    today = date.today()
    month_start = date(today.year, today.month, 1)

    income = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == current_user.id,
            Transaction.type == "income",
            Transaction.transaction_date >= month_start,
        )
    ) or Decimal("0")

    expense = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            Transaction.transaction_date >= month_start,
        )
    ) or Decimal("0")

    total_income = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == current_user.id,
            Transaction.type == "income",
        )
    ) or Decimal("0")

    total_expense = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
        )
    ) or Decimal("0")

    category_rows = db.execute(
        select(Category.name, Category.color, func.sum(Transaction.amount))
        .join(Transaction, Transaction.category_id == Category.id)
        .where(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            Transaction.transaction_date >= month_start,
        )
        .group_by(Category.name, Category.color)
    ).all()

    trend_rows = db.execute(
        select(
            func.to_char(Transaction.transaction_date, "YYYY-MM").label("period"),
            func.sum(
                case((Transaction.type == "income", Transaction.amount), else_=0)
            ).label("income"),
            func.sum(
                case((Transaction.type == "expense", Transaction.amount), else_=0)
            ).label("expense"),
        )
        .where(Transaction.user_id == current_user.id)
        .group_by("period")
        .order_by("period")
    ).all()[-6:]

    savings_rate = float(((income - expense) / income) * 100) if income else 0

    return DashboardSummary(
        balance=total_income - total_expense,
        income=income,
        expense=expense,
        savings_rate=round(savings_rate, 1),
        category_expenses=[
            CategoryExpense(category=name, color=color, amount=amount)
            for name, color, amount in category_rows
        ],
        monthly_trend=[
            MonthlyPoint(month=period, income=income_value or 0, expense=expense_value or 0)
            for period, income_value, expense_value in trend_rows
        ],
    )
