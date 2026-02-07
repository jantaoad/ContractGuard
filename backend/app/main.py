"""
ContractGuard Backend - FastAPI Application
Comprehensive AI-powered contract analysis platform
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import logging

logger = logging.getLogger(__name__)

# Import routers (to be created)
# from app.api.routes import auth, contracts, analysis, alerts, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI
    Handles startup and shutdown events
    """
    # Startup
    logger.info("ContractGuard Backend starting up...")
    # Initialize connections, load models, etc.
    yield
    # Shutdown
    logger.info("ContractGuard Backend shutting down...")
    # Cleanup


def create_app() -> FastAPI:
    """
    Application factory for ContractGuard backend
    """
    app = FastAPI(
        title="ContractGuard API",
        description="AI-Powered Contract Intelligence Platform",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # CORS Configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://localhost:5173",
            "https://contractguard.app",
            "http://contractguard-app-prod.s3-website-us-east-1.amazonaws.com",
            "https://contractguard-app-prod.s3.amazonaws.com",
            "https://p22dbd8vui.us-east-2.awsapprunner.com",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Trusted Host Middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[
            "localhost",
            "*.contractguard.app",
            "contractguard-app-prod.s3-website-us-east-1.amazonaws.com",
            "contractguard-app-prod.s3.amazonaws.com",
            "p22dbd8vui.us-east-2.awsapprunner.com",
        ],
    )

    # Health Check Endpoint
    @app.get("/health")
    async def health_check():
        """AI-powered contract analysis API is healthy"""
        return {
            "status": "healthy",
            "version": "1.0.0",
            "service": "ContractGuard",
        }

    # API v1 Routes (to be added)
    # app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
    # app.include_router(contracts.router, prefix="/api/v1/contracts", tags=["Contracts"])
    # app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["Analysis"])
    # app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
    # app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
