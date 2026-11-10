"""
MineSafe Root Entrypoint
Exports the FastAPI application instance for seamless deployment on platforms
that look for `main:app` in the repository root.
"""
from backend.app.main import app

__all__ = ["app"]
