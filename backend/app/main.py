"""
MineSafe Backend Application
FastAPI Server for Real-Time YOLO11 PPE Detection & Safety Compliance
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .database import engine, Base
from .config import UPLOAD_DIR, ANNOTATED_DIR
from .detector import detector
from .api import detect, cameras, history, analytics, reports, settings, system

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MineSafe Industrial AI Safety API",
    description="Real-Time Computer Vision PPE Detection & Workplace Safety Compliance Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

@app.on_event("startup")
def startup_warmup():
    detector.warmup_async()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static file directories for generated images
app.mount("/static/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/static/annotated", StaticFiles(directory=str(ANNOTATED_DIR)), name="annotated")

# Primary Health Check Endpoints (Zero-delay for cloud deployment health monitors)
@app.get("/health")
@app.get("/api/health")
def root_health():
    return {
        "status": "ONLINE",
        "service": "MineSafe AI Safety API",
        "engine": "FastAPI + Ultralytics YOLO",
        "version": "1.0.0"
    }

# Mount Routers
app.include_router(detect.router)
app.include_router(cameras.router)
app.include_router(history.router)
app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(settings.router)
app.include_router(system.router)

@app.get("/")
def root():
    return {
        "service": "MineSafe AI Safety API",
        "status": "RUNNING",
        "documentation": "/docs",
        "version": "1.0.0"
    }

