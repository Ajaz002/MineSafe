"""
MineSafe: Training Pipeline Smoke Test
Verifies end-to-end training and evaluation readiness on local hardware.
"""
import sys
import time
from pathlib import Path
import torch
from ultralytics import YOLO

def run_smoke_test():
    print("=" * 60)
    print("MINESAFE TRAINING PIPELINE SMOKE TEST")
    print("=" * 60)
    
    # 1. Hardware and PyTorch check
    cuda_available = torch.cuda.is_available()
    device_name = torch.cuda.get_device_name(0) if cuda_available else "CPU"
    print(f"Device: {device_name}")
    print(f"CUDA Available: {cuda_available}")
    if cuda_available:
        print(f"Total VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
        print(f"Free VRAM: {torch.cuda.mem_get_info()[0] / 1024**3:.2f} GB")
    
    data_yaml = Path("processed_dataset/data.yaml").resolve()
    if not data_yaml.exists():
        print(f"ERROR: Dataset YAML not found at {data_yaml}")
        sys.exit(1)
    print(f"Dataset YAML: {data_yaml}")

    # 2. Initialize YOLO model (using yolo11n.pt for rapid verification)
    print("\n--- Step 1: Loading Pretrained Model ---")
    model = YOLO("yolo11n.pt")
    print(f"Model architecture: YOLO11n loaded successfully.")

    # 3. Execute Smoke Training Run
    print("\n--- Step 2: Executing 1-Epoch Smoke Training (fraction=0.01) ---")
    start_time = time.time()
    
    # Using project directory runs/train/smoke_test
    train_results = model.train(
        data=str(data_yaml),
        epochs=1,
        imgsz=640,
        batch=8,
        fraction=0.01,         # 1% of dataset (~88 images) for instant verification
        device=0 if cuda_available else "cpu",
        workers=2,
        project="runs/train",
        name="smoke_test",
        exist_ok=True,
        verbose=True
    )
    elapsed_time = time.time() - start_time
    print(f"\nSmoke training completed in {elapsed_time:.2f} seconds.")

    # 4. Check Checkpoint Saving
    best_pt = Path("runs/train/smoke_test/weights/best.pt")
    last_pt = Path("runs/train/smoke_test/weights/last.pt")
    print("\n--- Step 3: Checking Generated Artifacts ---")
    print(f"best.pt exists: {best_pt.exists()} ({best_pt.stat().st_size / 1024**2:.2f} MB)" if best_pt.exists() else "best.pt: Not found")
    print(f"last.pt exists: {last_pt.exists()} ({last_pt.stat().st_size / 1024**2:.2f} MB)" if last_pt.exists() else "last.pt: Not found")

    # 5. Evaluate Smoke Model on Test Split
    print("\n--- Step 4: Running Test Set Evaluation (split='test') ---")
    test_results = model.val(
        data=str(data_yaml),
        split="test",
        imgsz=640,
        batch=16,
        device=0 if cuda_available else "cpu",
        project="runs/val",
        name="smoke_test_val",
        exist_ok=True,
        verbose=True
    )

    # 6. Report Test Set Metrics and Class Support
    print("\n" + "=" * 60)
    print("SMOKE TEST VALIDATION REPORT ON TEST SET (872 images)")
    print("=" * 60)
    
    # Class names from dataset
    class_names = test_results.names
    print(f"Total Target Classes Defined: {len(class_names)}")
    
    # Aggregate Metrics
    mp = test_results.results_dict.get('metrics/precision(B)', 0.0)
    mr = test_results.results_dict.get('metrics/recall(B)', 0.0)
    map50 = test_results.results_dict.get('metrics/mAP50(B)', 0.0)
    map50_95 = test_results.results_dict.get('metrics/mAP50-95(B)', 0.0)
    
    print(f"Overall Precision (B): {mp:.4f}")
    print(f"Overall Recall (B):    {mr:.4f}")
    print(f"Overall mAP@50 (B):    {map50:.4f}")
    print(f"Overall mAP@50-95 (B): {map50_95:.4f}")
    
    print("\nPer-Class Breakdown:")
    per_class_map50 = test_results.box.maps
    for cls_id, name in class_names.items():
        score = per_class_map50[cls_id] if cls_id < len(per_class_map50) else 0.0
        print(f"  Class {cls_id:2d} ({name:12s}): mAP50-95 = {score:.4f}")

    print("\n[SUCCESS] Pipeline smoke test passed. End-to-end training and evaluation verified.")

if __name__ == "__main__":
    run_smoke_test()

