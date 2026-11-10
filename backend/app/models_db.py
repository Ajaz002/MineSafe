"""
SQLAlchemy Database Models for Detection Events and Compliance Audits
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class DetectionEvent(Base):
    __tablename__ = "detection_events"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    source_type = Column(String, default="image")  # image, webcam, video, rtsp
    zone = Column(String, default="Sector Alpha")
    total_persons = Column(Integer, default=0)
    total_violations = Column(Integer, default=0)
    compliance_rate = Column(Float, nullable=True)
    is_compliant = Column(Boolean, nullable=True)
    inference_time_ms = Column(Float, default=0.0)
    original_image = Column(String, nullable=True)
    annotated_image = Column(String, nullable=True)

    objects = relationship("DetectedObject", back_populates="event", cascade="all, delete-orphan")

class DetectedObject(Base):
    __tablename__ = "detected_objects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(String, ForeignKey("detection_events.id", ondelete="CASCADE"), index=True)
    class_id = Column(Integer, nullable=False)
    class_name = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    x1 = Column(Float, nullable=False)
    y1 = Column(Float, nullable=False)
    x2 = Column(Float, nullable=False)
    y2 = Column(Float, nullable=False)
    is_violation = Column(Boolean, default=False)

    event = relationship("DetectionEvent", back_populates="objects")

class IncidentLog(Base):
    __tablename__ = "incident_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    zone = Column(String, nullable=False)
    camera_id = Column(String, default="CAM-01")
    worker_id = Column(String, default="WRK-UNKNOWN")
    violation_type = Column(String, nullable=False)
    severity = Column(String, default="MEDIUM")  # LOW, MEDIUM, HIGH, CRITICAL
    action_taken = Column(String, default="Logged")
    snapshot_path = Column(String, nullable=True)

class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow)

