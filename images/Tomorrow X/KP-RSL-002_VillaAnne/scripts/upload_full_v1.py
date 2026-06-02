#!/usr/bin/env python3
"""
KP-RSL-002 Villa Anne — Full upload (images + sequence + lease_eligibility)
Generated: 2026-05-12
PWRC: GET → image upload (if missing) → PUT sequence → GET verify
THB primary in price displays. lease_eligibility = lease_or_company (updated 2026-05-12 — developer confirmed lease via land-holding company).
"""

import requests
import json
import os
import base64
import mimetypes
from datetime import datetime, timezone

# === CONFIG ===
PROJECT_ID = "KP-RSL-002"
BASE = "https://api.aiagentpro.online/api/firebase-data"

with open(os.path.expanduser("~/.kph_admin_token"), "r") as f:
    raw = f.read().strip()
TOKEN = raw.replace("Bearer ", "").strip()
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

# === LOCAL IMAGE PATHS ===
IMAGES_DIR = os.path.expanduser(
    "~/Business/01_Real-Estate-Leads/01_campaigns/KP-RSL-002_VillaAnne/reference/images/villa_anne"
)

PING1_IMAGES = [
    {
        "id": "KP-IMG-RSL-002-PING1-01",
        "filename": "01_hero_exterior.png",
        "sort_order": 1,
        "is_primary": True,
    },
    {
        "id": "KP-IMG-RSL-002-PING1-02",
        "filename": "02_hero_pool_seaview.png",
        "sort_order": 2,
        "is_primary": False,
    },
    {
        "id": "KP-IMG-RSL-002-PING1-03",
        "filename": "03_hero_pool_seaview_alt.png",
        "sort_order": 3,
        "is_primary": False,
    },
    {
        "id": "KP-IMG-RSL-002-PING1-04",
        "filename": "04_living_terrace.png",
        "sort_order": 4,
        "is_primary": False,
    },
]

CUSTOMER_ID = "11a3a8c9-d3db-4b32-8c08-35dd7868b959"

# === SEQUENCE CONTENT ===

HEBREW_BUBBLES = [
    {
        "content": """היי! 👋
תודה שפנית בנוגע ל-Villa Anne 🌊

וילת 3 חדרי שינה עם נוף ים יוקרתי, מעל מסעדת Tomorrow X במפרץ סלאד:
בריכת אינפיניטי פרטית, מאובזרת לחלוטין, ומניבה הכנסה מהיום הראשון.

✨ Airbnb פעיל — 5 כוכבים Superhost
✨ 110 מ"ר ממוזג, 170 מ"ר כולל מרפסת ובריכה
✨ 3 חדרי שינה, 2 חדרי רחצה
✨ עיצוב boho-chic עם עץ טיק
✨ קהילה בינלאומית פעילה (גרמנים, אמריקאים, צרפתים)

איזה היבט מעניין אותך — השקעה, מגורים, או שילוב?"""
    },
    {
        "content": "📸 הצצה לוילה:"
    },
    {
        "content": """💰 *תקציר השקעה*

מחיר: 17.85 מיליון באט
(~1.97 מיליון ש"ח / 560,000 דולר / 480,000 אירו)

📊 *הכנסה משכירות (בפועל)*
- 20,000 באט ללילה בעונה (Airbnb)
- 120,000–150,000 באט לחודש בשכירות ארוכה
- כבר Superhost עם דירוג 5 כוכבים

📋 *מבנה עסקה — שתי אפשרויות*
✅ רכישה דרך חברה תאילנדית (Freehold)
✅ חכירה (ליס) דרך החברה שמחזיקה בקרקע
✅ קהילה בינלאומית פעילה במקום

🏗️ *סטטוס*
מוכנה ופעילה — מסירה מיידית
לא בבנייה — הוילה קיימת ומאובזרת"""
    },
    {
        "content": """📍 *מיקום:*
https://maps.app.goo.gl/tDj7XxZpes5qUxdXA

מפרץ סלאד — חוף בוטיק בקופנגן
מעל מסעדת Tomorrow X

🏠 *לצפייה ב-Airbnb בפעולה:*
https://www.airbnb.com/l/7zo6XMkh

יש כמה שאלות לפני שמתקדמים:
1️⃣ מתי אתה מתכנן להגיע לאי?
2️⃣ מה התקציב המקסימלי שלך?
3️⃣ זה לרכישה אישית או להשקעה?

אני כאן לכל שאלה 🙏"""
    }
]

ENGLISH_BUBBLES = [
    {
        "content": """Hi! 👋
Thanks for reaching out about Villa Anne 🌊

A 3-bedroom villa with prime sea views, located above Tomorrow X restaurant in Haad Salad Bay:
Private infinity pool, fully furnished, generating income from day one.

✨ Active Airbnb — 5-star Superhost
✨ 110 sqm aircon, 170 sqm total with terrace + pool
✨ 3 bedrooms, 2 bathrooms
✨ Boho-chic design with teak wood
✨ Active international community (Germans, Americans, French)

Which aspect interests you most — investment, residential, or both?"""
    },
    {
        "content": "📸 Glimpse of the villa:"
    },
    {
        "content": """💰 *Investment summary*

Price: 17.85 million THB
(~560,000 USD / 480,000 EUR / 1,970,000 ILS)

📊 *Rental income (actual)*
- 20,000 THB per night in season (Airbnb)
- 120,000–150,000 THB/month long-term rental
- Already Superhost with 5-star rating

📋 *Deal structure — two options*
✅ Purchase via Thai company (Freehold)
✅ Lease via the land-holding company
✅ Active international community in place

🏗️ *Status*
Ready and operational — immediate handover
Not under construction — villa exists and is fully furnished"""
    },
    {
        "content": """📍 *Location:*
https://maps.app.goo.gl/tDj7XxZpes5qUxdXA

Haad Salad Bay — boutique beach in Koh Phangan
Above Tomorrow X restaurant

🏠 *See Airbnb in action:*
https://www.airbnb.com/l/7zo6XMkh

A few quick questions:
1️⃣ When are you planning to visit the island?
2️⃣ What's your maximum budget?
3️⃣ Personal use or investment?

Happy to answer anything 🙏"""
    }
]

MEDIA_URLS = [img["id"] for img in PING1_IMAGES]

# === HELPERS ===

def upload_image(img_meta):
    path = os.path.join(IMAGES_DIR, img_meta["filename"])
    if not os.path.exists(path):
        return False, f"File not found: {path}"

    mime, _ = mimetypes.guess_type(path)
    if not mime:
        mime = "image/png" if path.lower().endswith(".png") else "image/jpeg"

    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")

    payload = {
        "_id": img_meta["id"],
        "image_id": img_meta["id"],
        "project_id": PROJECT_ID,
        "customerId": CUSTOMER_ID,
        "file_name": img_meta["filename"],
        "mime_type": mime,
        "is_ping1": True,
        "is_primary": img_meta["is_primary"],
        "sort_order": img_meta["sort_order"],
        "image_data": b64,
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }

    r = requests.put(
        f"{BASE}/Project_Images/{img_meta['id']}",
        headers=HEADERS,
        json=payload,
    )
    if r.status_code >= 400:
        return False, f"HTTP {r.status_code}: {r.text[:200]}"
    return True, "OK"


# === EXECUTION ===

print("=" * 70)
print(f"KP-RSL-002 Villa Anne — Full Upload v1 (THB primary, lease_or_company)")
print("=" * 70)

# --- STEP 1 ---
print("\n[1/5] GET project record...")
r = requests.get(f"{BASE}/Projects_Public", headers=HEADERS)
r.raise_for_status()
projects = r.json()

project = None
for p in (projects if isinstance(projects, list) else projects.values()):
    if isinstance(p, dict) and (p.get("_id") == PROJECT_ID or p.get("project_id") == PROJECT_ID):
        project = p
        break

if not project:
    print(f"❌ Project {PROJECT_ID} NOT FOUND. Aborting.")
    exit(1)

print(f"✓ Found: {project.get('project_name', '?')}")
print(f"  Current sequence_he: {'PRESENT' if project.get('first_message_sequence_he') else 'MISSING'}")
print(f"  Current sequence_en: {'PRESENT' if project.get('first_message_sequence_en') else 'MISSING'}")
print(f"  Current media_urls: {len(project.get('first_message_media_urls', []) or [])}")
print(f"  Current lease_eligibility: {project.get('lease_eligibility', 'MISSING')}")

# --- STEP 2 ---
print("\n[2/5] GET existing images...")
r = requests.get(f"{BASE}/Project_Images", headers=HEADERS)
r.raise_for_status()
all_images = r.json()
items = all_images if isinstance(all_images, list) else list(all_images.values())
project_images = [
    i for i in items
    if isinstance(i, dict) and i.get("project_id") == PROJECT_ID
]
existing_ids = {i.get("_id") or i.get("image_id") for i in project_images}
print(f"  Total images for project: {len(project_images)}")
print(f"  Existing IDs: {sorted(existing_ids)}")

missing = [img for img in PING1_IMAGES if img["id"] not in existing_ids]
print(f"  PING1 needed: {len(PING1_IMAGES)} | Missing: {len(missing)}")

# --- STEP 3 ---
if missing:
    print(f"\n[3/5] Uploading {len(missing)} missing images...")
    print(f"  Source: {IMAGES_DIR}")
    ans = input("  Proceed with image uploads? (yes/no): ").strip().lower()
    if ans != "yes":
        print("  Aborted before image upload.")
        exit(0)
    for img in missing:
        ok, msg = upload_image(img)
        status = "✓" if ok else "❌"
        print(f"  {status} {img['id']}: {msg}")
else:
    print("\n[3/5] All PING1 images already in Firebase. Skipping upload.")

# --- STEP 4 ---
print("\n[4/5] Build & PUT sequence + lease_eligibility...")
now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d")
payload = {
    "first_message_sequence_he": HEBREW_BUBBLES,
    "first_message_sequence_en": ENGLISH_BUBBLES,
    "first_message_media_urls": MEDIA_URLS,
    "lease_eligibility": "lease_or_company",
    "last_updated_public": now_iso,
}
print(f"  Fields: {list(payload.keys())}")
print(f"  HE bubbles: {len(HEBREW_BUBBLES)} (THB primary)")
print(f"  EN bubbles: {len(ENGLISH_BUBBLES)} (THB primary)")
print(f"  Media URLs: {MEDIA_URLS}")
print(f"  lease_eligibility: lease_or_company")

ans = input("  Proceed with sequence PUT? (yes/no): ").strip().lower()
if ans != "yes":
    print("  Aborted before sequence PUT.")
    exit(0)

r = requests.put(
    f"{BASE}/Projects_Public/{PROJECT_ID}",
    headers=HEADERS,
    json=payload,
)
print(f"  PUT status: {r.status_code}")
if r.status_code >= 400:
    print(f"  ❌ Error: {r.text[:500]}")
    exit(1)
print(f"  ✓ Sequence PUT succeeded")

# --- STEP 5 ---
print("\n[5/5] GET to verify...")
r = requests.get(f"{BASE}/Projects_Public/{PROJECT_ID}", headers=HEADERS)
r.raise_for_status()
verified = r.json()
if isinstance(verified, list) and verified:
    verified = verified[0]

seq_he = verified.get("first_message_sequence_he")
seq_en = verified.get("first_message_sequence_en")
media = verified.get("first_message_media_urls", [])
print(f"  lease_eligibility: {verified.get('lease_eligibility', 'MISSING')}")
print(f"  sequence_he: {'OK' if seq_he else 'MISSING'} ({len(seq_he) if seq_he else 0} bubbles)")
print(f"  sequence_en: {'OK' if seq_en else 'MISSING'} ({len(seq_en) if seq_en else 0} bubbles)")
print(f"  media_urls: {len(media)} items → {media}")
print(f"  last_updated_public: {verified.get('last_updated_public', 'MISSING')}")

ok = (
    verified.get("lease_eligibility") == "lease_or_company"
    and seq_he and seq_en
    and len(media) == 4
)
print("\n" + "=" * 70)
if ok:
    print("✅ ALL CHECKS PASSED — KP-RSL-002 DONE")
else:
    print("⚠️  SOME CHECKS FAILED — please review output above")
print("=" * 70)
