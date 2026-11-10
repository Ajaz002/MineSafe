"""
Detection History and Forensic Audit Endpoints
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models_db import DetectionEvent, IncidentLog

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("")
def get_history(
    limit: int = Query(50, ge=1, le=200),
    zone: Optional[str] = None,
    compliant_only: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Retrieves chronological detection events with filtering capabilities."""
    query = db.query(DetectionEvent).order_by(DetectionEvent.timestamp.desc())

    if zone:
        query = query.filter(DetectionEvent.zone == zone)
    if compliant_only is not None:
        query = query.filter(DetectionEvent.is_compliant == compliant_only)

    events = query.limit(limit).all()

    return {
        "total": len(events),
        "events": [
            {
                "id": e.id,
                "timestamp": e.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "source_type": e.source_type,
                "zone": e.zone,
                "total_persons": e.total_persons,
                "total_violations": e.total_violations,
                "compliance_rate": e.compliance_rate,
                "is_compliant": e.is_compliant,
                "inference_time_ms": e.inference_time_ms,
                "annotated_image": e.annotated_image
            }
            for e in events
        ]
    }

@router.get("/incidents")
def get_incidents(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieves critical non-compliance incident logs."""
    incidents = db.query(IncidentLog).order_by(IncidentLog.timestamp.desc()).limit(limit).all()
    return {
        "total": len(incidents),
        "incidents": [
            {
                "id": inc.id,
                "timestamp": inc.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "zone": inc.zone,
                "camera_id": inc.camera_id,
                "worker_id": inc.worker_id,
                "violation_type": inc.violation_type,
                "severity": inc.severity,
                "action_taken": inc.action_taken,
                "snapshot_path": inc.snapshot_path
            }
            for inc in incidents
        ]
    }

