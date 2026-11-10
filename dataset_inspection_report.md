# MineSafe: YOLO-Based Intelligent PPE Detection & Workplace Safety Compliance Monitoring System
## Comprehensive Dataset Inspection & Audit Report

**Date of Inspection:** November 10, 2026  
**Project Workspace:** `C:\Users\Ajaz\OneDrive\Documents\Minesafe`  
**Inspector:** Antigravity AI Pair Programmer  
**Report Target:** `dataset_inspection_report.md`  

---

## 1. Executive Summary

This report delivers a full technical audit of the four pre-downloaded datasets located in the `Datasets/` directory of the **MineSafe** project. Every image file, label text file, and configuration file (`data.yaml`) was inspected programmatically without modifying, moving, combining, or deleting any original files.

### Key Inspection Highlights at a Glance

| Metric | 20250731-ppe2286y | atharion-v1.0-public | construction-ppe | PPE detection (Hugging Face) | Combined Total |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Total Images** | 2,286 | 1,130 | 1,000 | 12,076 | **16,492** |
| **Total Label Files** | 2,286 | 1,130 | 1,000 | 12,076 | **16,492** |
| **Total Bounding Boxes** | 6,038 | 5,355 | 14,863 | 16,008 | **42,264** |
| **Number of Classes (`nc`)**| 4 | 3 | 12 | 6 | **16 unique classes** |
| **Disk Size** | ~228.02 MB | ~93.85 MB | ~617.09 MB | ~630.36 MB | **~1.57 GB** |
| **Splits Available** | Train, Valid (No Test) | Train, Valid, Test | Train, Val (No Test) | Train, Valid, Test | Mixed |
| **Empty Label Files** | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | **3,756 (31.1%)** | 3,756 |
| **Corrupt Images** | 0 | 0 | 0 | 0 | **0** |
| **Label Formatting Errors** | 0 | 0 | 0 | **1 (Polygon found)** | 1 |
| **Internal Duplicates** | 0 | 0 | 0 | **2,274 files (1,137 pairs)**| 2,274 files |
| **Train/Val Data Leakage** | None | None | None | **512 duplicate pairs** | **Severe Leakage** |
| **Windows MAX_PATH Risk** | Safe (<120 chars) | Safe (<120 chars) | Safe (<100 chars) | **16 files >= 240 chars (up to 277)** | **High Risk** |
| **Current Training Readiness** | ❌ Fails (Bad Path) | ⚠️ Needs Path Fix | ⚠️ Needs Path Fix | ❌ Fails (Bad Rel Path) | **Needs Config Fixes** |

---

## 2. Deep Dive: Dataset-by-Dataset Audit

---

### Dataset 1: `20250731-ppe2286y`

* **Source / Origin:** Exported from Roboflow Universe (`ying2001/20250731-ppe2286-m0ega`) in July 2025 under CC BY 4.0.
* **Directory Structure:**
  ```text
  Datasets/20250731-ppe2286y/
  ├── data.yaml
  ├── README.dataset.txt
  ├── README.roboflow.txt
  ├── 01.py  (CRITICAL WARNING: Risky script inside folder)
  ├── train/
  │   ├── images/ (1,829 files)
  │   └── labels/ (1,829 files)
  └── valid/
      ├── images/ (457 files)
      └── labels/ (457 files)
  ```

#### Image & Split Counts
* **Train Set:** 1,829 images (80.0%)
* **Validation Set:** 457 images (20.0%)
* **Test Set:** None (0 images)
* **Total Images:** 2,286 (.jpg format)
* **Primary Resolutions:** 640x640 (472 images), 1200x800 (71 images), 1280x720 (63 images), 500x333 (61 images), 600x400 (41 images).

#### Annotation & Class Details
* **Annotation Format:** Standard YOLO Bounding Box (`class_id x_center y_center width height`), normalized between 0.0 and 1.0.
* **Total Bounding Boxes:** 6,038
* **Empty Label Files:** 0 (Every image has at least one annotation).
* **Missing Labels / Missing Images:** 0 (100% paired).
* **Class Names & Counts:**
  * `Helmet` (Class 0): 2,421 instances (Train: 1,970 | Valid: 451)
  * `NoHelmet` (Class 1): 1,174 instances (Train: 960 | Valid: 214)
  * `NoVest` (Class 2): 1,058 instances (Train: 836 | Valid: 222)
  * `Vest` (Class 3): 1,385 instances (Train: 1,096 | Valid: 289)

#### Configuration Analysis (`data.yaml`)
```yaml
path: C:/Users/0/Desktop/ultralytics-8391/20250731-ppe2286y
train: ./train/images
val: ./valid/images
test:

nc: 4
names: ['Helmet', 'NoHelmet', 'NoVest', 'Vest']
```
* **Configuration Findings:**
  1. **Fatal Hardcoded Path:** `path:` points to the original uploader's desktop path (`C:/Users/0/Desktop/ultralytics-8391/20250731-ppe2286y`). Any attempt to run YOLO training on this dataset as-is will instantly crash with `FileNotFoundError`.
  2. **No Test Split:** The `test:` field is left blank.
  3. **Risky Python Script Present:** The folder contains a script named 01_.py`. Inspection of its code shows it hardcodes `D:/20250731-PPE2286/...` and randomly shifts 20% of training files into validation every time it runs. **Do not run this script!**

---

### Dataset 2: `atharion-v1.0-public`

* **Source / Origin:** Created by Atharion (Group 17) for the Samsung Innovation Campus capstone. Curated from Ultralytics Construction-PPE 1.0.0 (1,026 images under AGPL-3.0) and Roboflow Construction Site Safety v28 (104 images under CC BY 4.0).
* **Directory Structure:**
  ```text
  Datasets/atharion-v1.0-public/
  ├── data.yaml
  ├── DATASET_CARD.md
  ├── NOTICE.md
  ├── attribution.csv
  ├── build-summary.json
  ├── train/
  │   ├── images/ (791 files)
  │   └── labels/ (791 files)
  ├── valid/
  │   ├── images/ (170 files)
  │   └── labels/ (170 files)
  └── test/
      ├── images/ (169 files)
      └── labels/ (169 files)
  ```

#### Image & Split Counts
* **Train Set:** 791 images (70.0%)
* **Validation Set:** 170 images (15.0%)
* **Test Set:** 169 images (15.0%)
* **Total Images:** 1,130 (988 `.jpg`, 142 `.jpeg`)
* **Primary Resolutions:** 640x640 (1,119 images, 99.0%), 1024x1024 (2 images), 1024x681 (2 images).

#### Annotation & Class Details
* **Annotation Format:** Standard YOLO Bounding Box (`class_id x_center y_center width height`), normalized between 0.0 and 1.0.
* **Total Bounding Boxes:** 5,355
* **Empty Label Files:** 0
* **Class Names & Counts:**
  * `Person` (Class 0): 2,002 instances (Train: 1,292 | Valid: 354 | Test: 356)
  * `Hardhat` (Class 1): 1,776 instances (Train: 1,119 | Valid: 348 | Test: 309)
  * `Safety Vest` (Class 2): 1,577 instances (Train: 1,065 | Valid: 292 | Test: 220)

#### Configuration Analysis (`data.yaml`)
```yaml
path: .
train: train/images
val: valid/images
test: test/images
nc: 3
names: ['Person', 'Hardhat', 'Safety Vest']
```
* **Configuration Findings:**
  1. **Relative Path Issue:** `path: .` assumes the training process is launched directly inside `Datasets/atharion-v1.0-public`. If launched from the workspace root `Minesafe`, YOLO will fail to find `train/images`.
  2. **High Quality Splitting:** Atharion used **scene-grouped splitting**. Frames from the same video or scene are placed into the same split to avoid data leakage and prevent artificially inflated benchmark scores.
  3. **Class Name Nuance:** Note that Atharion uses the labels `'Hardhat'` and `'Safety Vest'` (instead of `'helmet'` and `'vest'`), and detects general `'Person'` presence rather than explicit violation boxes (`'no_helmet'`).

---

### Dataset 3: `construction-ppe` (Ultralytics Construction-PPE)

* **Source / Origin:** Official dataset released by Ultralytics in November 2026, licensed under CC BY 4.0.
* **Directory Structure:**
  ```text
  Datasets/construction-ppe/
  ├── data.yaml
  ├── LICENSE.txt
  ├── README.md
  ├── manifest.jsonl
  ├── images/
  │   ├── train/ (800 files)
  │   └── val/   (200 files)
  └── labels/
      ├── train/ (800 files)
      └── val/   (200 files)
  ```

#### Image & Split Counts
* **Train Set:** 800 images (80.0%)
* **Validation Set:** 200 images (20.0%)
* **Test Set:** None (0 images)
* **Total Images:** 1,000 (.jpg format)
* **Primary Resolutions:** High-definition photography: 2048x1360 (361 images), 2048x1152 (141 images), 1360x2048 (141 images), 1152x2048 (141 images), 2048x2048 (141 images).

#### Annotation & Class Details
* **Annotation Format:** Standard YOLO Bounding Box (`class_id x_center y_center width height`), normalized between 0.0 and 1.0.
* **Total Bounding Boxes:** 14,863 (Extremely dense; average ~14.8 objects per image).
* **Empty Label Files:** 0 (100% annotated).
* **Missing Labels / Missing Images:** 0.
* **Class Names & Counts (12 Classes):**
  * `helmet` (Class 0): 1,576 instances (Train: 1,282 | Val: 294)
  * `gloves` (Class 1): 1,929 instances (Train: 1,548 | Val: 381)
  * `vest` (Class 2): 1,816 instances (Train: 1,476 | Val: 340)
  * `boots` (Class 3): 2,484 instances (Train: 2,003 | Val: 481)
  * `goggles` (Class 4): 751 instances (Train: 612 | Val: 139)
  * `Person` (Class 5): 2,443 instances (Train: 1,962 | Val: 481)
  * `no_helmet` (Class 6): 813 instances (Train: 634 | Val: 179)
  * `no_goggle` (Class 7): 347 instances (Train: 265 | Val: 82)
  * `no_gloves` (Class 8): 1,042 instances (Train: 839 | Val: 203)
  * `no_boots` (Class 9): 747 instances (Train: 569 | Val: 178)
  * `forklift` (Class 10): 348 instances (Train: 275 | Val: 73)
  * `no_vest` (Class 11): 567 instances (Train: 437 | Val: 130)

#### Configuration Analysis (`data.yaml`)
```yaml
path: construction-ppe
train: images/train
val: images/val
names:
  0: helmet
  1: gloves
  2: vest
  3: boots
  4: goggles
  5: Person
  6: no_helmet
  7: no_goggle
  8: no_gloves
  9: no_boots
  10: forklift
  11: no_vest
```
* **Configuration Findings:**
  1. **Layout Difference:** Directory layout is inverted (`images/train` instead of `train/images`). Ultralytics supports both, but path resolution depends on where execution begins.
  2. **Class Names Format:** Written as an integer dictionary rather than a YAML list.
  3. **No `test` Split:** Dedicated testing split is not included.
  4. **Overall Quality:** Highest quality, cleanest, and most detailed dataset in the collection. Provides comprehensive coverage for both PPE compliance and non-compliance across multiple gear categories.

---

### Dataset 4: `PPE detection (Hugging Face)`

* **Source / Origin:** Exported from Roboflow Universe (`tanish-y7iqo/ppe-detection_data-adcya` v3) under CC BY 4.0 and mirrored on Hugging Face.
* **Directory Structure:**
  ```text
  Datasets/PPE detection (hugging Face)/
  ├── data.yaml
  ├── README.dataset.txt
  ├── README.roboflow.txt
  ├── train/
  │   ├── images/ (8,774 files)
  │   └── labels/ (8,774 files)
  ├── valid/
  │   ├── images/ (2,070 files)
  │   └── labels/ (2,070 files)
  └── test/
      ├── images/ (1,234 files)
      └── labels/ (1,234 files)
  ```

#### Image & Split Counts
* **Train Set:** 8,774 images (72.6%)
* **Validation Set:** 2,070 images (17.1%)
* **Test Set:** 1,234 images (10.2%)
* **Total Images:** 12,078 images (.jpg format)
* **Primary Resolutions:** 640x640 (100% stretched or letterboxed by Roboflow export).

#### Annotation & Class Details
* **Total Bounding Boxes:** 16,008
* **Class Names & Counts (6 Classes):**
  * `Gloves` (Class 0): 2,690 instances (Train: 1,834 | Valid: 558 | Test: 298)
  * `Vest` (Class 1): 4,418 instances (Train: 3,104 | Valid: 842 | Test: 472)
  * `goggles` (Class 2): 1,431 instances (Train: 994 | Valid: 298 | Test: 139)
  * `helmet` (Class 3): 2,702 instances (Train: 1,896 | Valid: 210 | Test: 596)
  * `mask` (Class 4): 2,761 instances (Train: 2,267 | Valid: 408 | Test: 86)
  * `safety_shoe` (Class 5): 2,006 instances (Train: 1,628 | Valid: 188 | Test: 190)

#### Configuration Analysis (`data.yaml`)
```yaml
train: ../train/images
val: ../valid/images
test: ../test/images

nc: 6
names: ['Gloves', 'Vest', 'goggles', 'helmet', 'mask', 'safety_shoe']

roboflow:
  workspace: tanish-y7iqo
  project: ppe-detection_data-adcya
  version: 3
  license: CC BY 4.0
  url: https://universe.roboflow.com/tanish-y7iqo/ppe-detection_data-adcya/dataset/3
```

#### Critical Anomalies & Dataset Issues Discovered

1. **3,756 Empty Label Files (31.1% Unannotated Background):**
   * Train has **2,632 empty `.txt` files**
   * Valid has **751 empty `.txt` files**
   * Test has **373 empty `.txt` files**
   * In YOLO, empty files act as "negative samples" (background images with no objects). However, having almost one-third of the dataset empty dilutes object density and can cause gradient instability if not handled deliberately.

2. **Severe Data Leakage Across Splits:**
   * **512 identical images** appear in multiple splits (e.g. the exact same image appears in `train` and `valid`, or `train` and `test` under different randomized filenames).
   * Examples:
     * `00000383_jpg.rf.30da...jpg` (in `valid`) == `00000383_jpg.rf.2d78...jpg` (in `train`)
     * `hard_hat_workers1002_png.rf.8016...jpg` (in `valid`) == `hard_hat_workers1002_png.rf.a9c2...jpg` (in `train`)
     * `esy-058030444_jpg.rf.4e14...jpg` (in `train`) == `esy-058030444_jpg.rf.7f6c...jpg` (in `test`)
   * *Why this is bad:* When a test/validation image is already present in the training set, the model's evaluation accuracy is falsely high ("cheating"), masking poor real-world performance.

3. **Massive Internal Duplication:**
   * Inside this dataset alone, there are **1,137 duplicate groups** comprising **2,274 files**. Many web-scraped images were duplicated during generation or multi-export.

4. **YOLO Format Contamination (Segmentation Polygon Found):**
   * In `test/labels/VID-20240831-WA0012_mp4-0011_jpg.rf.73aaa67dc6da6df0e3abe775abd7c0aa.txt`, line 1 contains **117 values** (a polygon segmentation mask) instead of the standard 5 values required for bounding-box detection. This will trigger a parsing error in standard YOLO box detection pipelines.

5. **Windows MAX_PATH Violation (Paths up to 277 Characters):**
   * 16 files have paths >= 240 characters, with some reaching **277 characters**.
   * Example: `train/labels/imgi_98_Long-Split-Leather-Welding-Glove-Cuff-Welder-Protective-Soldering-Gloves-Protect-Your-Hands-Leather-Gloves-From-Pakistan_jpg_300x300_jpg.rf.57a890703a1f8f46b0ca04ccddfd6d0d.txt`
   * Windows standard filesystem API limits paths to 260 characters (`MAX_PATH`). Standard Python open commands without extended prefix `\\?\` fail with `FileNotFoundError`.

6. **Broken Relative Paths in `data.yaml`:**
   * `train: ../train/images` assumes execution from inside a subdirectory; from project root it resolves outside the dataset folder.
   * Folder name contains spaces and parentheses: `PPE detection (hugging Face)`.

---

## 3. Cross-Dataset Comparison & Compatibility Analysis

### Class Taxonomy Alignment Matrix

The four datasets have significant differences in how classes are defined, capitalized, and scoped:

| Unified Concept | 20250731-ppe2286y | atharion-v1.0-public | construction-ppe | PPE detection (HF) |
| :--- | :--- | :--- | :--- | :--- |
| **Worker / Human** | ❌ Not labeled | `Person` | `Person` | ❌ Not labeled |
| **Helmet / Hardhat** | `Helmet` | `Hardhat` | `helmet` | `helmet` |
| **No Helmet (Violation)**| `NoHelmet` | ❌ (Infer from Person) | `no_helmet` | ❌ Not labeled |
| **Safety Vest** | `Vest` | `Safety Vest` | `vest` | `Vest` |
| **No Vest (Violation)** | `NoVest` | ❌ (Infer from Person) | `no_vest` | ❌ Not labeled |
| **Protective Gloves** | ❌ Not labeled | ❌ Not labeled | `gloves` | `Gloves` |
| **No Gloves (Violation)**| ❌ Not labeled | ❌ Not labeled | `no_gloves` | ❌ Not labeled |
| **Safety Boots / Shoes** | ❌ Not labeled | ❌ Not labeled | `boots` | `safety_shoe` |
| **No Boots (Violation)** | ❌ Not labeled | ❌ Not labeled | `no_boots` | ❌ Not labeled |
| **Safety Goggles** | ❌ Not labeled | ❌ Not labeled | `goggles` | `goggles` |
| **No Goggles (Violation)**| ❌ Not labeled | ❌ Not labeled | `no_goggle` | ❌ Not labeled |
| **Protective Mask** | ❌ Not labeled | ❌ Not labeled | ❌ Not labeled | `mask` |
| **Heavy Machinery** | ❌ Not labeled | ❌ Not labeled | `forklift` | ❌ Not labeled |

#### Key Takeaway on Classes:
1. **Capitalization & Naming Inconsistency:** `Helmet` vs `helmet` vs `Hardhat`; `Vest` vs `vest` vs `Safety Vest`; `boots` vs `safety_shoe`. If combined without remapping, the model would treat these as completely separate objects.
2. **Detection Philosophy Difference:**
   * `construction-ppe` and `20250731-ppe2286y` label **violations directly** (`no_helmet`, `no_vest`, etc.).
   * `atharion-v1.0-public` detects the `Person` and equipment presence, leaving violation logic to post-processing (e.g. checking if a detected person's head overlaps with a hardhat box).

### Image Overlap Across Datasets
* **Atharion ↔ Construction-PPE:** 1,026 of Atharion's 1,130 images originate from Ultralytics Construction-PPE (resized to 640x640 by Atharion).
* **Atharion ↔ Hugging Face:** 14 exact identical images were found between Atharion and the Hugging Face dataset (originating from shared Kaggle/Roboflow mirrors).
* **20250731-ppe2286y ↔ Hugging Face:** 122 images share base filenames, but have different resolutions/compressions.

---

## 4. Summary of Critical Risks & Failures

Before any training or preprocessing can begin, the following blockers must be addressed in subsequent stages:

1. **Path Failures in `data.yaml`:**
   * None of the four `data.yaml` files will work out of the box from the `Minesafe` workspace root.
   * `20250731-ppe2286y` has a hardcoded foreign desktop path.
   * `PPE detection (hugging Face)` has invalid `../` relative paths.
   * `construction-ppe` and `atharion` require consistent relative or absolute root path declarations.
2. **Data Leakage in Hugging Face Dataset:**
   * 512 images are repeated across train, validation, and test sets. Training on this dataset as-is will produce invalid validation metrics.
3. **Empty Background Overload:**
   * 31.1% of images in Hugging Face dataset have 0 annotations. This needs to be pruned or controlled.
4. **Windows Path Length Limits:**
   * 16 files in Hugging Face dataset exceed standard Windows path limits and can crash standard Windows training scripts.
5. **Segmentation Contamination:**
   * 1 label file in the Hugging Face test set contains polygon segmentation data that breaks standard YOLO bounding-box parsers.
6. **Destructive Script in Dataset 1:**
   * `01_分割訓練及測試資料.py` inside `20250731-ppe2286y` must remain untouched and quarantined.

---

## 5. Recommended Architecture & Next Steps for MineSafe

As a beginner-friendly path toward building a hackathon-winning and production-grade project, the recommended development roadmap is:

### Phase 1: Dataset Harmonization (Next Step)
* Create a unified class ontology for **MineSafe** (e.g., standardizing on 8 core classes: `person`, `helmet`, `no_helmet`, `vest`, `no_vest`, `gloves`, `boots`, `goggles`).
* Clean the Hugging Face dataset by removing duplicates, fixing data leakage, trimming overly long filenames, and removing the polygon entry.
* Generate a clean, verified, centralized `data.yaml` with valid paths relative to the project directory.

### Phase 2: Baseline Model Training (YOLOv8 / YOLOv11)
* Establish baseline training on the cleanest dataset (`construction-ppe` + `atharion-v1.0-public`) first to verify the pipeline.
* Incrementally add cleaned samples from `20250731-ppe2286y` and the Hugging Face dataset.

### Phase 3: Compliance & Violation Rule Engine
* Build the logic layer to detect violations (e.g., Worker present without Helmet or Vest in a designated hazardous zone).

### Phase 4: Application Interface (Frontend & Backend)
* Build the Streamlit / FastAPI dashboard for real-time video stream monitoring and alert logging.

---

*Inspection concluded successfully. Original datasets have been left 100% untouched and unmodified.*  
*Awaiting your approval before proceeding to the next stage.*

