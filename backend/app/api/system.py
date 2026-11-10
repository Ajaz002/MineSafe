"""
System Telemetry & Model Status Endpoints
Returns public enterprise vision engine status without leaking personal host hardware, usernames or local paths.
"""
from pathlib import Path
from fastapi import APIRouter
from ..detector import detector
from ..config import resolve_model_path, CLASSES

router = APIRouter(prefix="/api/system", tags=["System"])

@router.get("/health")
def get_system_health():
    """Returns production AI engine status for public dashboard monitoring."""
    current_model = resolve_model_path()
    model_name = Path(current_model).name

    return {
        "status": "ONLINE",
        "engine": "MineSafe Neural Vision Engine",
        "model": {
            "name": model_name,
            "version": "1.0-prod",
            "classes_count": len(CLASSES),
            "classes": list(CLASSES.values()),
            "inference_mode": "High-Throughput Safety Scanner"
        }
    }
