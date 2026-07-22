# Architecture

The Next.js App Router frontend calls the FastAPI REST API under `/api/v1`.
JWT tokens are stored in browser local storage and sent through the
`Authorization` header.

PostgreSQL tables:
- users
- categories
- transactions
- budgets

Every finance record is scoped to the authenticated user.
