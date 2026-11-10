# MineSafe Industrial AI Vision Platform
# Production Multi-Stage Container Image for FastAPI & Ultralytics YOLO

FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Install minimal runtime system libraries for OpenCV and multimedia processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch CPU and Python dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code and production model weights
COPY backend /app/backend
COPY models/minesafe_yolo11s_best.pt /app/models/minesafe_yolo11s_best.pt

# Ensure writeable directories for uploads, annotated outputs, and SQLite database
RUN mkdir -p /app/backend/uploads /app/backend/annotated /app/models

EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
