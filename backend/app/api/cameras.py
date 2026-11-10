"""
Multi-Camera Management Endpoints
"""
from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/api/cameras", tags=["Cameras"])

CAMERAS_REGISTRY = [
    {
        "id": "CAM-01",
        "name": "Local Device Webcam",
        "location": "Control Terminal / Workstation",
        "type": "USB / Browser Integrated",
        "status": "READY",
        "fps": 30,
        "resolution": "1920x1080",
        "active_workers": 1,
        "is_local_webcam": True
    },
    {
        "id": "CAM-02",
        "name": "Underground Shaft B4 Dome",
        "location": "Shaft B4 Main Entry",
        "type": "RTSP (H.264 High-Speed)",
        "status": "ONLINE",
        "fps": 25,
        "resolution": "2560x1440",
        "active_workers": 14,
        "is_local_webcam": False
    },
    {
        "id": "CAM-03",
        "name": "Haulage Loading Deck Telephoto",
        "location": "Haulage Staging Deck",
        "type": "RTSP (Thermal + Optical)",
        "status": "ONLINE",
        "fps": 30,
        "resolution": "1920x1080",
        "active_workers": 8,
        "is_local_webcam": False
    },
    {
        "id": "CAM-04",
        "name": "Equipment Workshop PTZ",
        "location": "Maintenance Bay 2",
        "type": "RTSP (Industrial PTZ)",
        "status": "ONLINE",
        "fps": 30,
        "resolution": "1920x1080",
        "active_workers": 5,
        "is_local_webcam": False
    },
    {
        "id": "CAM-05",
        "name": "Mineral Processing Perimeter",
        "location": "Crusher Feed Line",
        "type": "RTSP (Explosion Proof)",
        "status": "STANDBY",
        "fps": 15,
        "resolution": "1920x1080",
        "active_workers": 0,
        "is_local_webcam": False
    }
]

@router.get("")
def list_cameras():
    """Returns list of all registered security and monitoring cameras with connection status."""
    return {"cameras": CAMERAS_REGISTRY}

