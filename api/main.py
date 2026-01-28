"""
Cargill Ocean Transportation - FastAPI Backend
==============================================
Wraps existing Python analytics with a REST API.
Pre-computes optimization results on startup for instant responses.
"""

import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Load .env file from project root
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent.parent / ".env"
    load_dotenv(env_path)
    print(f"[ENV] Loaded from {env_path}")
except ImportError:
    print("[ENV] python-dotenv not installed, using system env vars")

from .services.calculator_service import calculator_service
from .routes import portfolio, voyage, scenario, ml_routes, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize calculator service on startup."""
    print("=" * 60)
    print("Cargill Ocean Transportation API - Starting")
    print("=" * 60)
    calculator_service.initialize()
    print("=" * 60)
    print("API ready at http://localhost:8000")
    print("Docs at http://localhost:8000/docs")
    print("=" * 60)
    yield
    print("Shutting down...")


app = FastAPI(
    title="Cargill Ocean Transportation API",
    description="Maritime shipping analytics for vessel-cargo optimization",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(portfolio.router)
app.include_router(voyage.router)
app.include_router(scenario.router)
app.include_router(ml_routes.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {
        "name": "Cargill Ocean Transportation API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "vessels": "/api/vessels",
            "cargoes": "/api/cargoes",
            "portfolio": "/api/portfolio/optimize",
            "voyages": "/api/portfolio/all-voyages",
            "bunker_scenario": "/api/scenario/bunker",
            "delay_scenario": "/api/scenario/port-delay",
            "ml_delays": "/api/ml/port-delays",
            "model_info": "/api/ml/model-info",
            "chat": "/api/chat",
            "docs": "/docs",
        },
    }


@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "healthy"}
