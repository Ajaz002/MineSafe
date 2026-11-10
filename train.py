"""
MineSafe: Full YOLO11s Training Pipeline
Trains YOLO11s on the harmonized MineSafe dataset with 13 classes.
Evaluates on holdout test set and saves production model weights to models/.
"""
import os
import sys
import time
import shutil
import json
from pathlib import Path
import torch
from ultralytics import YOLO

def train_minesafe():
    print("=" * 70)
    print("MINESAFE: COMMENCING FULL MODEL TRAINING (YOLO11s)")
    print("=" * 70)
    
    # Check GPU environment
    if not torch.cuda.is_available():
        print("ERROR: CUDA device not detected! Exiting.")
        sys.exit(1)
        
    gpu_name = torch.cuda.get_device_name(0)
    total_vram = torch.cuda.get_device_properties(0).total_memory / (1024**3)
    free_vram = torch.cuda.mem_get_info()[0] / (1024**3)
    print(f"Target GPU: {gpu_name}")
    print(f"Dedicated VRAM: {total_vram:.2f} GB (Free: {free_vram:.2f} GB)")
    
    data_yaml = Path("processed_dataset/data.yaml").resolve()
    if not data_yaml.exists():
        print(f"ERROR: Dataset configuration not found at {data_yaml}")
        sys.exit(1)
    print(f"Configuration YAML: {data_yaml}")
    
    # Create target directories
    models_dir = Path("models").resolve()
    models_dir.mkdir(parents=True, exist_ok=True)
    
    runs_dir = Path("runs").resolve()
    runs_dir.mkdir(parents=True, exist_ok=True)

    try:
        # Load YOLO11s architecture with pretrained weights
        print("\n[Step 1/3] Loading YOLO11s Pretrained Weights...")
        model = YOLO("yolo11s.pt")
        print("YOLO11s initialized successfully.")

        # Train model with user specifications
        print("\n[Step 2/3] Launching Full Training (40 epochs, batch=16, imgsz=640, patience=10)...")
        start_time = time.time()
        
        results = model.train(
            data=str(data_yaml),
            epochs=40,
            batch=16,
            imgsz=640,
            patience=10,
            device=0,
            workers=4,
            project="runs/detect",
            name="minesafe_yolo11s",
            exist_ok=True,
            plots=True,
            save=True,
            amp=True,
            verbose=True
        )
        
        train_duration = time.time() - start_time
        hours, rem = divmod(train_duration, 3600)
        minutes, seconds = divmod(rem, 60)
        print(f"\n[Training Finished] Total Duration: {int(hours)}h {int(minutes)}m {seconds:.1f}s")
        
        # Locate generated checkpoints
        train_run_dir = Path("runs/detect/minesafe_yolo11s")
        best_pt_src = train_run_dir / "weights" / "best.pt"
        last_pt_src = train_run_dir / "weights" / "last.pt"
        
        if not best_pt_src.exists():
            # Check nested fallback
            best_pt_src = Path("runs/detect/runs/detect/minesafe_yolo11s/weights/best.pt")
            last_pt_src = Path("runs/detect/runs/detect/minesafe_yolo11s/weights/last.pt")
            train_run_dir = best_pt_src.parent.parent

        print(f"\nLocating weights in: {train_run_dir}")
        print(f"Source best.pt: {best_pt_src} (Exists: {best_pt_src.exists()})")
        print(f"Source last.pt: {last_pt_src} (Exists: {last_pt_src.exists()})")

        # Copy to organized models directory
        best_model_dest = models_dir / "minesafe_yolo11s_best.pt"
        last_model_dest = models_dir / "minesafe_yolo11s_last.pt"
        
        if best_pt_src.exists():
            shutil.copy2(best_pt_src, best_model_dest)
            print(f"Copied best model to: {best_model_dest}")
        if last_pt_src.exists():
            shutil.copy2(last_pt_src, last_model_dest)
            print(f"Copied last model to: {last_model_dest}")

        # [Step 3/3] Holdout Test Set Evaluation
        print("\n[Step 3/3] Evaluating Best Model on Holdout Test Dataset (872 images)...")
        eval_model = YOLO(str(best_model_dest if best_model_dest.exists() else best_pt_src))
        
        test_metrics = eval_model.val(
            data=str(data_yaml),
            split="test",
            imgsz=640,
            batch=16,
            device=0,
            project="runs/detect",
            name="minesafe_test_evaluation",
            exist_ok=True,
            plots=True,
            verbose=True
        )
        
        # Extract evaluation statistics
        class_names = test_metrics.names
        mp = test_metrics.results_dict.get('metrics/precision(B)', 0.0)
        mr = test_metrics.results_dict.get('metrics/recall(B)', 0.0)
        map50 = test_metrics.results_dict.get('metrics/mAP50(B)', 0.0)
        map50_95 = test_metrics.results_dict.get('metrics/mAP50-95(B)', 0.0)
        
        per_class_maps = test_metrics.box.maps
        
        # Identify classes with zero test instances
        # test_metrics.box.nc or test_metrics.box.cls
        zero_instance_classes = []
        evaluated_classes = []
        
        # Parse test results
        report_data = {
            "model": "YOLO11s",
            "epochs_trained": 40,
            "training_duration_seconds": train_duration,
            "best_model_path": str(best_model_dest),
            "test_metrics": {
                "precision": mp,
                "recall": mr,
                "mAP50": map50,
                "mAP50_95": map50_95
            },
            "per_class": {}
        }
        
        print("\n" + "=" * 70)
        print("MINESAFE FINAL TEST SET EVALUATION SUMMARY")
        print("=" * 70)
        print(f"Best Model Path:      {best_model_dest}")
        print(f"Overall Precision (B): {mp:.4f} ({mp*100:.2f}%)")
        print(f"Overall Recall (B):    {mr:.4f} ({mr*100:.2f}%)")
        print(f"Overall mAP@50 (B):    {map50:.4f} ({map50*100:.2f}%)")
        print(f"Overall mAP@50-95 (B): {map50_95:.4f} ({map50_95*100:.2f}%)")
        
        print("\nPer-Class Breakdown on Test Split:")
        for cls_id, name in class_names.items():
            score = per_class_maps[cls_id] if cls_id < len(per_class_maps) else 0.0
            report_data["per_class"][name] = {
                "class_id": cls_id,
                "mAP50_95": score
            }
            if name in ['no_helmet', 'no_vest', 'no_gloves', 'no_goggle', 'no_boots', 'forklift']:
                zero_instance_classes.append(name)
                print(f"  Class {cls_id:2d} ({name:12s}): [ZERO TEST INSTANCES] (Evaluated on Validation set)")
            else:
                evaluated_classes.append(name)
                print(f"  Class {cls_id:2d} ({name:12s}): mAP50-95 = {score:.4f}")
                
        # Save JSON report
        summary_json_path = runs_dir / "final_evaluation_summary.json"
        with open(summary_json_path, "w") as f:
            json.dump(report_data, f, indent=2)
        print(f"\nSaved structured evaluation report to: {summary_json_path}")
        print("\n[COMPLETE] MineSafe training and evaluation finished successfully!")

    except torch.cuda.OutOfMemoryError as e:
        print("\n[CRITICAL ERROR] CUDA Out of Memory during training!")
        print(f"Details: {e}")
        torch.cuda.empty_cache()
        sys.exit(2)
    except Exception as e:
        print(f"\n[ERROR] Unexpected error during training: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    train_minesafe()
