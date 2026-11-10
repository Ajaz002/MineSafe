"""
System & Zone Safety Settings API
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/api/settings", tags=["Settings"])

class SettingsPayload(BaseModel):
    confidence_threshold: float = 0.40
    iou_threshold: float = 0.45
    audio_alarm: bool = True
    turnstile_lock: bool = True
    theme: str = "light"
    zones: List[Dict[str, Any]] = []

CURRENT_SETTINGS = {
    "confidence_threshold": 0.40,
    "iou_threshold": 0.45,
    "audio_alarm": True,
    "turnstile_lock": True,
    "theme": "light",
    "zones": [
        {"id": "Z1", "name": "Underground Shaft B4", "helmet": True, "vest": True, "gloves": True, "goggles": True, "boots": True, "mask": True},
        {"id": "Z2", "name": "Haulage Loading Deck", "helmet": True, "vest": True, "gloves": False, "goggles": False, "boots": True, "mask": False},
        {"id": "Z3", "name": "Mineral Processing Pit", "helmet": True, "vest": True, "gloves": True, "goggles": True, "boots": True, "mask": True},
        {"id": "Z4", "name": "Main Equipment Workshop", "helmet": True, "vest": False, "gloves": True, "goggles": True, "boots": True, "mask": False},
        {"id": "Z5", "name": "Conveyor Gallery East", "helmet": True, "vest": True, "gloves": False, "goggles": False, "boots": True, "mask": False}
    ]
}

@router.get("")
def get_settings():
    """Retrieves current application settings."""
    return CURRENT_SETTINGS

@router.post("")
def update_settings(payload: SettingsPayload):
    """Updates active runtime settings."""
    CURRENT_SETTINGS.update(payload.dict())
    return {"status": "SUCCESS", "message": "Settings updated successfully.", "settings": CURRENT_SETTINGS}

