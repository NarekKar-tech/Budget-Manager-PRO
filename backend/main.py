from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings

app = FastAPI(title=settings.APP_NAME, version="1.0.0")

# 1. Define the domains allowed to make requests to your API
origins = [
    "http://localhost:3000",      # React local development
    "http://localhost:5173",      # Vite / Vue local development
    "https://yourfrontend.com", 
    "http://192.168.1.12:3000"  # Production frontend domain
]

# 2. Add the CORS middleware to your FastAPI application
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|172\.17\.0\.\d+):3000",  # Allow all origins (for development purposes)
    allow_origins=origins,           # Allowed domains
    allow_credentials=True,         # Allow cookies and auth headers
    allow_methods=["*"],             # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],             # Allow all HTTP headers
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root() -> dict[str, str]:
    return {"name": settings.APP_NAME, "status": "running", "docs": "/docs"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
