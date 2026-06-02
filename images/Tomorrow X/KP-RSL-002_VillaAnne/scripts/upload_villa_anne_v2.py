#!/usr/bin/env python3
"""Upload Villa Anne (KP-RSL-002) to Firebase via admin API.
Lean Inventory mode: 4 PING1 images + 1 Projects_Public record.

Run from your Mac terminal:
    python3 upload_villa_anne_v2.py

Token is read from ~/.kph_admin_token (or env var KPH_TOKEN if set).
"""
import base64
import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

BASE_URL = "https://api.aiagentpro.online/api/firebase-data"
CUSTOMER_ID = "11a3a8c9-d3db-4b32-8c08-35dd7868b959"

# Resolve token: env var first, then ~/.kph_admin_token
TOKEN = os.environ.get("KPH_TOKEN")
if not TOKEN:
    token_file = Path.home() / ".kph_admin_token"
    if token_file.exists():
        TOKEN = token_file.read_text().strip()
    else:
        sys.exit("ERROR: no KPH_TOKEN env var and ~/.kph_admin_token not found")

# Ensure Bearer prefix
if not TOKEN.lower().startswith("bearer "):
    TOKEN = "Bearer " + TOKEN

# Resolve images folder relative to this script: scripts/ → ../reference/images/villa_anne
SCRIPT_DIR = Path(__file__).resolve().parent
IMG_DIR = (SCRIPT_DIR.parent / "reference" / "images" / "villa_anne").resolve()
if not IMG_DIR.exists():
    sys.exit(f"ERROR: image dir not found: {IMG_DIR}")

NOW_ISO = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")


def request(method: str, path: str, body=None):
    url = f"{BASE_URL}{path}"
    data = None
    headers = {"Authorization": TOKEN}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            raw = resp.read().decode("utf-8")
            status = resp.status
            try:
                parsed = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                parsed = {"_raw": raw}
            return status, parsed
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        return e.code, {"_error": err_body}
    except Exception as e:
        return 0, {"_exception": str(e)}


def file_to_b64(path: Path):
    data = path.read_bytes()
    return base64.b64encode(data).decode("ascii"), len(data)


IMAGES = [
    {"image_id": "KP-IMG-RSL-002-PING1-01", "filename": "01_hero_exterior.png",    "mime": "image/png", "sort": 1, "primary": True},
    {"image_id": "KP-IMG-RSL-002-PING1-02", "filename": "02_hero_pool_seaview.png","mime": "image/png", "sort": 2, "primary": False},
    {"image_id": "KP-IMG-RSL-002-PING1-03", "filename": "10_bedroom_master.png",   "mime": "image/png", "sort": 3, "primary": False},
    {"image_id": "KP-IMG-RSL-002-PING1-04", "filename": "04_living_terrace.png",   "mime": "image/png", "sort": 4, "primary": False},
]


def main():
    total_bytes = 0
    results = []

    print("=" * 70)
    print("STEP 1 — Upload 4 PING1 images")
    print("=" * 70)

    for img in IMAGES:
        src = IMG_DIR / img["filename"]
        if not src.exists():
            results.append({"id": img["image_id"], "status": "MISSING", "file": str(src)})
            print(f"  ✗ {img['image_id']}: FILE NOT FOUND: {src}")
            continue
        b64, size = file_to_b64(src)
        total_bytes += size
        payload = {
            "_id": img["image_id"],
            "image_id": img["image_id"],
            "project_id": "KP-RSL-002",
            "customerId": CUSTOMER_ID,
            "file_name": img["filename"],
            "filename": img["filename"],
            "mime_type": img["mime"],
            "is_ping1": True,
            "is_primary": img["primary"],
            "sort_order": img["sort"],
            "image_data": b64,
            "uploaded_at": NOW_ISO,
        }
        put_code, put_resp = request("PUT", f"/Project_Images/{img['image_id']}", payload)
        print(f"  PUT  {img['image_id']}  [{size:,} bytes]  →  HTTP {put_code}")
        if put_code not in (200, 201):
            print(f"     response: {json.dumps(put_resp)[:300]}")

        get_code, get_resp = request("GET", f"/Project_Images/{img['image_id']}")
        verified = get_code == 200 and isinstance(get_resp, dict) and (
            get_resp.get("image_id") == img["image_id"] or get_resp.get("_id") == img["image_id"]
        )
        print(f"  GET  {img['image_id']}  →  HTTP {get_code}  verified={verified}")

        results.append({
            "id": img["image_id"], "put": put_code, "get": get_code,
            "verified": verified, "size": size,
        })

    print()
    print("=" * 70)
    print("STEP 2 — Create /Projects_Public/KP-RSL-002")
    print("=" * 70)

    project_payload = {
        "_id": "KP-RSL-002",
        "project_id": "KP-RSL-002",
        "customerId": CUSTOMER_ID,
        "project_name": "Villa Anne",
        "project_name_he": "Villa Anne",
        "property_type": "resale",
        "campaign_status": "inventory_only",
        "status": "Ready",
        "ready_status": "ready_furnished",
        "transaction_type": "resale",
        "ownership_type": "thai_company_structure",
        "usp_tags": ["sea_view", "boutique_neighborhood", "airbnb_active", "dual_option"],
        "price_tier": "high",
        "developer_display_name": "Private Owner (KPH listing)",
        "developer_name_internal": "Eldar",
        "seller_type": "private_owner",
        "listing_agent": "KPH",
        "location_area": "Haad Salad Bay (the Beverly Hills of Koh Phangan)",
        "location_district": "Koh Phangan",
        "location_subdistrict": "Haad Salad",
        "location_description_he": "האאד סאלאד ביי - הבוורלי הילס של קופנגן. מעל מסעדת Tomorrow X. שכונה בוטיק עם וילות יוקרה וקהילה אינטרנשונאלית איכותית (גרמנים, אמריקאים, צרפתים).",
        "location_description_en": "Haad Salad Bay - the Beverly Hills of Koh Phangan. Above Tomorrow X restaurant. Boutique neighborhood with luxury villas and a high-quality international community (Germans, Americans, French).",
        "google_maps_url": "https://maps.app.goo.gl/tDj7XxZpes5qUxdXA",
        "available_units": 1,
        "total_units": 1,
        "bedrooms": "3",
        "bathrooms": "2",
        "built_size_sqm_aircon": "110",
        "built_size_sqm_total": "170",
        "plot_size_sqm": "570",
        "floors": "1",
        "has_pool": True,
        "pool_type": "infinity",
        "furnishing_included": "fully_furnished",
        "rental_active": True,
        "rental_platform": "airbnb_booking",
        "rental_notes_internal": "Active Airbnb tenants. Viewings require coordination with cleaning schedule. Listing: https://www.airbnb.com/l/7zo6XMkh",
        "rental_yield_notes": "STR: 8000 THB/night low season, 20000 THB/night high season. LTR: 120000-150000 THB/month.",
        "purchase_options": [
            {
                "option_id": "upper_villa_only",
                "option_label_he": "רק הבית הבנוי - וילה מלאה 3 חדרים",
                "option_label_en": "Built villa only - full 3BR villa",
                "price_thb": 14700000,
                "includes": "Built villa + 110sqm A/C + 170sqm total + infinity pool + plot under villa",
            },
            {
                "option_id": "full_plot_with_potential",
                "option_label_he": "החבילה המלאה - וילה בנויה + שטח ריק לבית נוסף 90 מטר",
                "option_label_en": "Full package - built villa + empty 90sqm lot for second house",
                "price_thb": 17850000,
                "includes": "Everything in upper_villa_only + adjacent unbuilt 90sqm lot with approved plans",
            },
        ],
        "price_thb": "14700000-17850000",
        "price_range_thb": "14.7M - 17.85M THB",
        "first_message_media_urls": [
            "KP-IMG-RSL-002-PING1-01",
            "KP-IMG-RSL-002-PING1-02",
            "KP-IMG-RSL-002-PING1-03",
            "KP-IMG-RSL-002-PING1-04",
        ],
        "due_diligence_status_internal": "Pending - chanote, blue book, Thai partner company structure - flagged TBD by seller",
        "commission_internal": "1000000 THB fixed",
        "languages_supported": "EN,HE",
        "created_at": NOW_ISO,
        "updated_at": NOW_ISO,
        "last_updated_public": TODAY,
    }
    put_code, put_resp = request("PUT", "/Projects_Public/KP-RSL-002", project_payload)
    print(f"  PUT  /Projects_Public/KP-RSL-002  →  HTTP {put_code}")
    if put_code not in (200, 201):
        print(f"    response: {json.dumps(put_resp)[:500]}")

    get_code, get_resp = request("GET", "/Projects_Public/KP-RSL-002")
    print(f"  GET  /Projects_Public/KP-RSL-002  →  HTTP {get_code}")

    print()
    print("=" * 70)
    print("STEP 3 — Verification snapshot (key fields)")
    print("=" * 70)
    if isinstance(get_resp, dict):
        show_keys = [
            "_id", "project_id", "project_name", "property_type", "campaign_status",
            "status", "location_area", "bedrooms", "bathrooms", "price_range_thb",
            "has_pool", "pool_type", "rental_active", "first_message_media_urls",
        ]
        for k in show_keys:
            v = get_resp.get(k, "<MISSING>")
            if isinstance(v, list):
                v = json.dumps(v, ensure_ascii=False)
            print(f"  {k}: {v}")
        print(f"  purchase_options count: {len(get_resp.get('purchase_options', []))}")

    print()
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    ok_imgs = sum(1 for r in results if r.get("verified"))
    print(f"Images verified: {ok_imgs}/{len(IMAGES)}")
    print(f"Total image bytes uploaded: {total_bytes:,}")
    project_ok = get_code == 200 and isinstance(get_resp, dict) and get_resp.get("project_id") == "KP-RSL-002"
    print(f"Project record: {'VERIFIED' if project_ok else 'FAILED'}")
    for r in results:
        tag = "✓" if r.get("verified") else "✗"
        print(f"  {tag} {r['id']}  PUT={r.get('put')}  GET={r.get('get')}  size={r.get('size', 0):,}B")


if __name__ == "__main__":
    main()
