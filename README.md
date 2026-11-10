# MineSafe 🛡️
### Deep Learning-Based PPE Detection & Industrial Safety Compliance Platform

[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![YOLOv11](https://img.shields.io/badge/YOLO11-Ultralytics%20Vision-00FFFF?logo=ultralytics&logoColor=black)](https://github.com/ultralytics/ultralytics)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**MineSafe** is an end-to-end, edge-ready computer vision intelligence platform engineered for mining shafts, construction sites, and heavy industrial facilities. It uses a custom-trained **YOLO11s** neural network across a harmonized 13-class taxonomy to automatically detect workers, verify mandatory Personal Protective Equipment (PPE), flag violations in real time, and audit safety compliance in accordance with OSHA and MSHA standards.

---

## 🌟 Key Capabilities

* **13-Class Computer Vision Ontology:** Detects workers (`person`), mandatory gear (`helmet`, `vest`, `gloves`, `goggles`, `boots`, `mask`), active violations (`no_helmet`, `no_vest`, `no_gloves`, `no_goggle`, `no_boots`), and heavy machinery (`forklift`).
* **Zero-Worker Integrity Standard:** When no workers are detected in a scene, the system correctly reports `"Unable to calculate compliance"` (`N/A`) rather than issuing misleading 100% compliance marks.
* **Proximity Hazard Telemetry:** Calculates Euclidean distances between detected workers and operating heavy machinery (e.g. forklifts), triggering immediate perimeter intrusion warnings.
* **Batch Video Processing & Audit Timeline:** Scans uploaded surveillance footage frame-by-frame, tags timestamped non-compliance events, and exports an annotated video stream.
* **Live Webcam Safety Scanner:** Streams frames to the inference backend at sub-120ms latencies with real-time FPS and compliance scoring.
* **Audit Trail & Executive Reporting:** Persistent logging of every detection event in SQLite, real-time analytics aggregation, and one-click downloadable OSHA-compliant CSV and JSON audit summaries.
* **Industrial UI & Responsive Design:** Built with React 19, Tailwind CSS v4, Lucide icons, and Recharts, featuring instant light and dark themes (Forest Green / Deep Slate) persisted across sessions.

---

## 🏗️ System Architecture

```
                                  [ Edge Cameras / Surveillance Feeds / Client Browser ]
                                                            │
                                        HTTP/REST & Multipart Form Streams
                                                            │
                                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            MineSafe FastAPI Gateway                                             │
├──────────────────────────┬─────────────────────────────┬──────────────────────────┬─────────────────────────────┤
│   Image Detection API    │     Video Processing API    │    Live Webcam Stream    │   Analytics & Reports API   │
│   (/api/detect/image)    │     (/api/detect/video)     │   (/api/detect/frame)    │   (/api/analytics, /report) │
└─────────────┬────────────┴──────────────┬──────────────┴────────────┬─────────────┴──────────────┬──────────────┘
              │                           │                           │                            │
              ▼                           ▼                           ▼                            │
┌─────────────────────────────────────────────────────────────────────────────────┐                │
│                         Ultralytics YOLO11s Vision Engine                       │                │
│                  Checkpoint: models/minesafe_yolo11s_best.pt (18.3 MB)          │                │
└─────────────────────────────────────────┬───────────────────────────────────────┘                │
                                          │                                                        │
                         Bounding Boxes & Confidence Scores                                        │
                                          │                                                        │
                                          ▼                                                        │
┌─────────────────────────────────────────────────────────────────────────────────┐                │
│                      Compliance & Hazard Calculation Engine                     │                │
│              - Worker IoU Association      - Machinery Proximity Alerts         │                │
│              - PPE Verification Matrix     - Zero-Worker Fallback Handling      │                │
└─────────────────────────────────────────┬───────────────────────────────────────┘                │
                                          │                                                        │
                                    DB Event Logs                                                  │
                                          │                                                        │
                                          ▼                                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       SQLAlchemy ORM & SQLite Forensic DB                                       │
│                                  (DetectionEvents, IncidentLogs, SensorFeeds)                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏷️ Target Classes & Compliance Matrix

The model is trained on a unified dataset across 13 classes:

| Class ID | Class Name | Category | Safety Significance |
| :---: | :--- | :--- | :--- |
| `0` | `person` | Worker Presence | Primary human worker anchor |
| `1` | `helmet` | Head Protection | Hard hat verified compliant |
| `2` | `no_helmet` | **Critical Violation** | Missing hard hat in designated zone |
| `3` | `vest` | Torso Visibility | High-visibility safety vest verified |
| `4` | `no_vest` | **Critical Violation** | Missing reflective vest |
| `5` | `gloves` | Hand Protection | Protective safety gloves verified |
| `6` | `no_gloves` | **Violation** | Bare hands in hazardous work zone |
| `7` | `goggles` | Eye Protection | Safety glasses or visor verified |
| `8` | `no_goggle` | **Violation** | Missing eye protection |
| `9` | `boots` | Footwear Safety | Steel-toe protective boots verified |
| `10` | `no_boots` | **Violation** | Substandard or missing footwear |
| `11` | `mask` | Respiratory | Dust or respirator mask verified |
| `12` | `forklift` | Heavy Machinery | Proximity hazard marker |

---

## 💻 Tech Stack

* **Deep Learning & Computer Vision:** PyTorch, Ultralytics YOLO11s, OpenCV, Pillow, NumPy
* **Backend:** FastAPI, Uvicorn, SQLAlchemy, Pydantic, SQLite
* **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide React, Recharts
* **Deployment & Containerization:** Docker, Linux `python:3.11-slim`, Vercel, Render, Railway

---

## 📁 Repository Structure

```
Minesafe/
├── backend/
│   ├── app/
│   │   ├── api/                 # Endpoints (detect, history, analytics, reports, cameras)
│   │   ├── compliance.py        # Safety logic, worker IoU association, zero-worker rule
│   │   ├── config.py            # Model path resolution, class ontology
│   │   ├── database.py          # SQLAlchemy SQLite connection setup
│   │   ├── detector.py          # Ultralytics YOLO inference wrapper
│   │   ├── main.py              # FastAPI server entry point & CORS configuration
│   │   └── models_db.py         # SQLAlchemy ORM schemas
│   ├── requirements.txt         # Production backend dependencies
│   └── uploads/, annotated/     # Static output folders (.gitkeep)
├── frontend/
│   ├── public/samples/          # Bundled sample images and videos for one-click demos
│   ├── src/
│   │   ├── api/client.js        # API client with dynamic VITE_API_URL fallback
│   │   ├── components/          # React components (Detection, Dashboard, Video, Webcam)
│   │   ├── App.jsx              # Main view switcher and persistent theme manager
│   │   └── index.css            # Tailwind CSS v4 custom theme variants
│   ├── package.json
│   ├── vercel.json              # Vercel SPA routing rewrite rules
│   └── vite.config.js           # Vite dev proxy configuration
├── models/
│   └── minesafe_yolo11s_best.pt # Production YOLO11s trained weights (18.3 MB)
├── Dockerfile                   # Production container build
├── render.yaml                  # Render Infrastructure-as-Code manifest
├── railway.json                 # Railway deployment configuration
├── requirements.txt             # Full platform dependencies
├── train.py                     # YOLO11s training script (40 epochs, mAP evaluation)
└── README.md
```

---

## 🚀 Quickstart & Local Installation

### Prerequisites
* Python 3.10, 3.11, or 3.12
* Node.js 18+ and npm
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/Ajaz002/MineSafe.git
cd MineSafe
```

### 2. Set Up the Backend
```bash
# Create and activate virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Start the FastAPI server
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Interactive Swagger API Documentation: `http://127.0.0.1:8000/docs`
* System Health Endpoint: `http://127.0.0.1:8000/api/system/health`

### 3. Set Up the Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
* Open your browser at: `http://127.0.0.1:5173/`

---

## 📦 Model Weights & Deployment Strategy

* **Direct Repository Inclusion:** The custom-trained model weights ([`models/minesafe_yolo11s_best.pt`](models/minesafe_yolo11s_best.pt)) are only **18.3 MB**, well beneath GitHub's 100 MB per-file limit. This allows instant out-of-the-box local execution and zero-latency cloud container builds without external cloud storage credentials.
* **Production Docker Container:** The provided `Dockerfile` installs CPU-optimized PyTorch wheels (`~150MB` instead of `~2GB` CUDA wheels), keeping the final container image under 600MB for smooth deployment on free/starter tiers of **Render**, **Railway**, or **Google Cloud Run**.

---

## ☁️ Cloud Deployment Guide

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Ajaz002/MineSafe)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAjaz002%2FMineSafe&root-directory=frontend)

### Deploying Backend (Render / Railway)
1. **Render:**
   * Create a new Web Service and link your GitHub repository `Ajaz002/MineSafe`.
   * Environment: `Docker` (Render automatically detects `./Dockerfile`).
   * Start Command: Managed by Dockerfile (`uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`).
   * Note the assigned backend URL (e.g. `https://minesafe-api.onrender.com`).
2. **Railway:**
   * Create a new Project from your GitHub repo.
   * Railway uses [`railway.json`](railway.json) and [`Dockerfile`](Dockerfile) automatically.

### Deploying Frontend (Vercel / Netlify)
1. Import your `MineSafe` repository into **Vercel**.
2. Root Directory: Select `frontend`.
3. Framework Preset: `Vite`.
4. Environment Variables:
   * Key: `VITE_API_URL`
   * Value: `https://your-deployed-backend.onrender.com` (leave empty for same-origin proxy).
5. Click **Deploy**. Vercel will build and serve the application globally.

---

## ⚠️ Known Limitations

1. **CPU vs. GPU Cloud Latency:** While local GPU inference achieves 80+ FPS, free-tier cloud containers (Render/Railway) execute inference on 0.5 - 1 shared vCPU, resulting in frame processing latencies of ~150-350ms per frame.
2. **Heavy Fog & Extreme Glare:** While trained across underground mine and outdoor construction scenes, severe optical obscuration or lens dust can decrease detection confidence for distant PPE items (e.g., safety glasses).
3. **Audio Alarms:** Audio strobe alerts are triggered virtually in the application dashboard; physical siren integration requires hardware relays via industrial IoT protocols (e.g. Modbus/MQTT).

---

## 👨‍💻 Developer & Credits

* **Developer:** Ajaz
* **GitHub Profile:** [@Ajaz002](https://github.com/Ajaz002)
* **Direct Contact:** [ajaz90450@gmail.com](mailto:ajaz90450@gmail.com)
* **Project Portfolio:** Developed as an advanced Computer Vision Safety Compliance Engineering system.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

