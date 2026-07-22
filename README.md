# Budget Manager Pro

Full-stack personal finance application with a custom dark fintech UI.

## Stack
- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: FastAPI, Python, SQLAlchemy
- Database: PostgreSQL
- Authentication: JWT
- Charts: Recharts
- No Docker

## Features
- Registration and login
- JWT authentication
- Dashboard summary
- Income and expense CRUD
- Categories
- Monthly budgets
- Budget progress
- Analytics charts
- Responsive dark interface
- PostgreSQL persistence
- Swagger API documentation

## PostgreSQL Setup

```sql
CREATE DATABASE budget_manager_pro;
```

## Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.seed
uvicorn main:app --reload
```

Backend: http://localhost:8000  
Swagger: http://localhost:8000/docs

## Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend: http://localhost:3000

## Demo account

Email: `demo@budgetpro.dev`  
Password: `Demo123!`
