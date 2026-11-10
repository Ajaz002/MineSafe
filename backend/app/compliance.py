"""
MineSafe Compliance Association Engine
Associates raw bounding boxes with worker entities to determine worker-level safety compliance.
"""
import math
from typing import List, Dict, Any
from .config import CLASS_DETAILS

def bbox_containment(inner_box, outer_box):
    """Calculate how much of inner_box is contained within outer_box."""
    ix1, iy1, ix2, iy2 = inner_box
    ox1, oy1, ox2, oy2 = outer_box

    inter_x1 = max(ix1, ox1)
    inter_y1 = max(iy1, oy1)
    inter_x2 = min(ix2, ox2)
    inter_y2 = min(iy2, oy2)

    if inter_x2 < inter_x1 or inter_y2 < inter_y1:
        return 0.0

    inter_area = (inter_x2 - inter_x1) * (inter_y2 - inter_y1)
    inner_area = (ix2 - ix1) * (iy2 - iy1)
    if inner_area <= 0:
        return 0.0
    return inter_area / inner_area

def box_distance(box_a, box_b):
    """Euclidean distance between center points of two boxes."""
    cx_a = (box_a[0] + box_a[2]) / 2
    cy_a = (box_a[1] + box_a[3]) / 2
    cx_b = (box_b[0] + box_b[2]) / 2
    cy_b = (box_b[1] + box_b[3]) / 2
    return math.sqrt((cx_a - cx_b) ** 2 + (cy_a - cy_b) ** 2)

def evaluate_compliance(raw_detections: List[Dict[str, Any]], required_ppe: Dict[str, bool] = None) -> Dict[str, Any]:
    """
    Evaluates worker-level PPE compliance from detected objects.
    
    Returns:
    - workers: list of workers with their associated PPE items and compliance status
    - violations: list of all detected violations
    - compliance_rate: overall percentage
    - proximity_alerts: list of machinery proximity hazards
    """
    if required_ppe is None:
        required_ppe = {
            "helmet": True,
            "vest": True,
            "boots": True,
            "gloves": False,
            "goggles": False,
            "mask": False
        }

    persons = [d for d in raw_detections if d["class_id"] == 0]
    machinery = [d for d in raw_detections if d["class_id"] == 12]  # forklift
    ppe_items = [d for d in raw_detections if d["class_id"] != 0 and d["class_id"] != 12]

    direct_violations = [d for d in raw_detections if CLASS_DETAILS.get(d["class_id"], {}).get("is_violation", False)]
    workers_compliance = []
    proximity_alerts = []

    # Worker-level association
    for p_idx, person in enumerate(persons):
        p_box = (person["x1"], person["y1"], person["x2"], person["y2"])
        p_height = person["y2"] - person["y1"]
        
        # Head sub-region: top 30% of person
        head_box = (person["x1"], person["y1"], person["x2"], person["y1"] + p_height * 0.30)
        # Torso sub-region: 20% to 70% of person
        torso_box = (person["x1"], person["y1"] + p_height * 0.20, person["x2"], person["y1"] + p_height * 0.70)
        # Feet sub-region: bottom 25%
        feet_box = (person["x1"], person["y1"] + p_height * 0.75, person["x2"], person["y2"])

        has_helmet = False
        has_vest = False
        has_boots = False
        has_gloves = False
        has_goggles = False
        has_mask = False

        missing_items = []
        worker_violations = []

        # Check overlapping items
        for item in ppe_items:
            i_box = (item["x1"], item["y1"], item["x2"], item["y2"])
            overlap = bbox_containment(i_box, p_box)

            if overlap > 0.30:
                cid = item["class_id"]
                cname = item["class_name"]

                if cid == 1:  # helmet
                    has_helmet = True
                elif cid == 2:  # no_helmet
                    worker_violations.append("NO HELMET (Head Protection Violation)")
                elif cid == 3:  # vest
                    has_vest = True
                elif cid == 4:  # no_vest
                    worker_violations.append("NO VEST (Torso Visibility Violation)")
                elif cid == 5:  # gloves
                    has_gloves = True
                elif cid == 6:  # no_gloves
                    worker_violations.append("NO GLOVES")
                elif cid == 7:  # goggles
                    has_goggles = True
                elif cid == 8:  # no_goggle
                    worker_violations.append("NO GOGGLES")
                elif cid == 9:  # boots
                    has_boots = True
                elif cid == 10:  # no_boots
                    worker_violations.append("NO BOOTS (Footwear Violation)")
                elif cid == 11:  # mask
                    has_mask = True

        # Check requirement enforcement
        if required_ppe.get("helmet") and not has_helmet and "NO HELMET (Head Protection Violation)" not in worker_violations:
            missing_items.append("Helmet")
        if required_ppe.get("vest") and not has_vest and "NO VEST (Torso Visibility Violation)" not in worker_violations:
            missing_items.append("Hi-Vis Vest")
        if required_ppe.get("boots") and not has_boots and "NO BOOTS (Footwear Violation)" not in worker_violations:
            missing_items.append("Steel-Toe Boots")
        if required_ppe.get("gloves") and not has_gloves:
            missing_items.append("Safety Gloves")
        if required_ppe.get("goggles") and not has_goggles:
            missing_items.append("Safety Goggles")
        if required_ppe.get("mask") and not has_mask:
            missing_items.append("Dust Mask")

        is_worker_compliant = len(worker_violations) == 0 and len(missing_items) == 0

        # Check machinery proximity hazard
        for fork in machinery:
            f_box = (fork["x1"], fork["y1"], fork["x2"], fork["y2"])
            dist = box_distance(p_box, f_box)
            # Threshold: close proximity (distance less than 1.5x worker height)
            if dist < p_height * 1.5:
                proximity_alerts.append({
                    "worker_id": f"WRK-{p_idx + 1:02d}",
                    "machinery": "Forklift",
                    "hazard_level": "CRITICAL PROXIMITY",
                    "distance_px": round(dist, 1)
                })

        workers_compliance.append({
            "worker_id": f"WRK-{p_idx + 1:02d}",
            "box": person,
            "has_helmet": has_helmet,
            "has_vest": has_vest,
            "has_boots": has_boots,
            "has_gloves": has_gloves,
            "has_goggles": has_goggles,
            "has_mask": has_mask,
            "violations": worker_violations,
            "missing_ppe": missing_items,
            "is_compliant": is_worker_compliant
        })

    # Total metrics
    total_persons = len(persons)
    compliant_persons = sum(1 for w in workers_compliance if w["is_compliant"])
    all_violations_count = len(direct_violations) + sum(len(w["missing_ppe"]) for w in workers_compliance)

    # Compliance calculation: if zero workers are detected, compliance is indeterminate (never 100%)
    if total_persons == 0:
        if len(direct_violations) > 0:
            compliance_rate = 0.0
            is_site_compliant = False
            compliance_status = "VIOLATION_DETECTED"
        else:
            compliance_rate = None
            is_site_compliant = None
            compliance_status = "UNABLE_TO_CALCULATE"
    else:
        compliance_rate = round((compliant_persons / total_persons * 100), 1)
        is_site_compliant = (all_violations_count == 0)
        compliance_status = "COMPLIANT" if is_site_compliant else "VIOLATION_DETECTED"

    return {
        "total_workers": total_persons,
        "compliant_workers": compliant_persons,
        "compliance_rate": compliance_rate,
        "is_site_compliant": is_site_compliant,
        "compliance_status": compliance_status,
        "direct_violations_count": len(direct_violations),
        "total_violations_count": all_violations_count,
        "workers": workers_compliance,
        "proximity_alerts": proximity_alerts
    }

