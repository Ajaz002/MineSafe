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
from .api import detect, cameras, history, analytics, reports, settings, system

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MineSafe Industrial AI Safety API",
    description="Real-Time Computer Vision PPE Detection & Workplace Safety Compliance Backend",
    version="1.0.0"
)

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

