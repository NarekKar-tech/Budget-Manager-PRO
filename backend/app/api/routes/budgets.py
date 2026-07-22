from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user, get_db
from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.budget import BudgetCreate, BudgetRead

router = APIRouter(prefix="/budgets", tags=["Budgets"])


def serialize(db: Session, budget: Budget) -> BudgetRead:
    spent = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == budget.user_id,
            Transaction.category_id == budget.category_id,
            Transaction.type == "expense",
            func.extract("month", Transaction.transaction_date) == budget.month,
            func.extract("year", Transaction.transaction_date) == budget.year,
        )
    ) or Decimal("0")

    progress = float((spent / budget.amount) * 100) if budget.amount else 0
    return BudgetRead(
        id=budget.id,
        amount=budget.amount,
        month=budget.month,
        year=budget.year,
        category=budget.category,
        spent=spent,
        progress=round(progress, 1),
    )


@router.get("", response_model=list[BudgetRead])
def list_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[BudgetRead]:
    items = list(
        db.scalars(
            select(Budget)
            .options(joinedload(Budget.category))
            .where(Budget.user_id == current_user.id)
            .order_by(Budget.year.desc(), Budget.month.desc())
        )
    )
    return [serialize(db, item) for item in items]


@router.post("", response_model=BudgetRead, status_code=status.HTTP_201_CREATED)
def create_budget(
    payload: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BudgetRead:
    category = db.scalar(
        select(Category).where(
            Category.id == payload.category_id,
            Category.user_id == current_user.id,
        )
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    existing = db.scalar(
        select(Budget).where(
            Budget.user_id == current_user.id,
            Budget.category_id == payload.category_id,
            Budget.month == payload.month,
            Budget.year == payload.year,
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Budget already exists")

    item = Budget(**payload.model_dump(), user_id=current_user.id)
    db.add(item)
    db.commit()
    item = db.scalar(
        select(Budget)
        .options(joinedload(Budget.category))
        .where(Budget.id == item.id)
    )
    return serialize(db, item)
