from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User


def run() -> None:
    db = SessionLocal()
    try:
        email = "demo@budgetpro.dev"
        if db.scalar(select(User).where(User.email == email)):
            print("Demo user already exists.")
            return

        user = User(
            name="Demo User",
            email=email,
            hashed_password=hash_password("Demo123!"),
        )
        db.add(user)
        db.flush()

        data = [
            ("Salary", "#22C55E", "Briefcase"),
            ("Food", "#F97316", "Utensils"),
            ("Housing", "#8B5CF6", "House"),
            ("Transport", "#3B82F6", "Car"),
            ("Entertainment", "#EC4899", "Film"),
        ]

        categories = {}
        for name, color, icon in data:
            category = Category(name=name, color=color, icon=icon, user_id=user.id)
            db.add(category)
            db.flush()
            categories[name] = category

        today = date.today()
        rows = [
            ("Monthly salary", Decimal("4200"), "income", "Salary", today.replace(day=1)),
            ("Apartment rent", Decimal("1200"), "expense", "Housing", today.replace(day=2)),
            ("Groceries", Decimal("186.40"), "expense", "Food", today - timedelta(days=3)),
            ("Fuel", Decimal("74.90"), "expense", "Transport", today - timedelta(days=5)),
            ("Cinema", Decimal("32.00"), "expense", "Entertainment", today - timedelta(days=7)),
        ]

        for title, amount, kind, category_name, tx_date in rows:
            db.add(
                Transaction(
                    title=title,
                    amount=amount,
                    type=kind,
                    transaction_date=tx_date,
                    category_id=categories[category_name].id,
                    user_id=user.id,
                )
            )

        for category_name, amount in [
            ("Housing", Decimal("1400")),
            ("Food", Decimal("600")),
            ("Transport", Decimal("350")),
            ("Entertainment", Decimal("250")),
        ]:
            db.add(
                Budget(
                    amount=amount,
                    month=today.month,
                    year=today.year,
                    category_id=categories[category_name].id,
                    user_id=user.id,
                )
            )

        db.commit()
        print("Demo data created.")
        print("Email: demo@budgetpro.dev")
        print("Password: Demo123!")
    finally:
        db.close()


if __name__ == "__main__":
    run()
