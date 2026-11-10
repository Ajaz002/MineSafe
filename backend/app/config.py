"""
MineSafe Backend Configuration
Resolves model weights, class ontology, and application paths.
"""
import os
from pathlib import Path

# Base Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
BACKEND_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BACKEND_DIR / "uploads"
ANNOTATED_DIR = BACKEND_DIR / "annotated"
DATABASE_URL = f"sqlite:///{BACKEND_DIR / 'minesafe.db'}"

# Ensure directories exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ANNOTATED_DIR.mkdir(parents=True, exist_ok=True)

# 13 Harmonized MineSafe Classes
CLASSES = {
    0: "person",
    1: "helmet",
    2: "no_helmet",
    3: "vest",
    4: "no_vest",
    5: "gloves",
    6: "no_gloves",
    7: "goggles",
    8: "no_goggle",
    9: "boots",
    10: "no_boots",
    11: "mask",
    12: "forklift"
}

# Color palette & category definitions
CLASS_DETAILS = {
    0: {"name": "person", "label": "Worker / Person", "category": "worker", "color": "#173D35", "is_violation": False},
    1: {"name": "helmet", "label": "Safety Helmet", "category": "compliant", "color": "#173D35", "is_violation": False},
    2: {"name": "no_helmet", "label": "NO HELMET", "category": "violation", "color": "#D9534F", "is_violation": True},
    3: {"name": "vest", "label": "Hi-Vis Vest", "category": "compliant", "color": "#173D35", "is_violation": False},
    4: {"name": "no_vest", "label": "NO VEST", "category": "violation", "color": "#D9534F", "is_violation": True},
    5: {"name": "gloves", "label": "Safety Gloves", "category": "compliant", "color": "#173D35", "is_violation": False},
    6: {"name": "no_gloves", "label": "NO GLOVES", "category": "violation", "color": "#D9534F", "is_violation": True},
    7: {"name": "goggles", "label": "Safety Goggles", "category": "compliant", "color": "#173D35", "is_violation": False},
    8: {"name": "no_goggle", "label": "NO GOGGLES", "category": "violation", "color": "#D9534F", "is_violation": True},
    9: {"name": "boots", "label": "Steel-Toe Boots", "category": "compliant", "color": "#173D35", "is_violation": False},
    10: {"name": "no_boots", "label": "NO BOOTS", "category": "violation", "color": "#D9534F", "is_violation": True},
    11: {"name": "mask", "label": "Dust / Respiration Mask", "category": "compliant", "color": "#173D35", "is_violation": False},
    12: {"name": "forklift", "label": "Forklift / Machinery", "category": "machinery", "color": "#E6A23C", "is_violation": False}
}

def resolve_model_path():
    """Locate the best available YOLO checkpoint without disturbing active training."""
    candidates = [
        PROJECT_ROOT / "models" / "minesafe_yolo11s_best.pt",
        PROJECT_ROOT / "runs" / "detect" / "runs" / "detect" / "minesafe_yolo11s" / "weights" / "best.pt",
        PROJECT_ROOT / "runs" / "detect" / "minesafe_yolo11s" / "weights" / "best.pt",
        PROJECT_ROOT / "runs" / "detect" / "runs" / "train" / "smoke_test" / "weights" / "best.pt",
        PROJECT_ROOT / "yolo11s.pt",
        PROJECT_ROOT / "yolo11n.pt"
    ]
    for candidate in candidates:
        if candidate.exists() and candidate.stat().st_size > 1024 * 1024:
            return str(candidate)
    return str(PROJECT_ROOT / "yolo11n.pt")

