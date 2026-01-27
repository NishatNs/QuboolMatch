# backend/seed_ml_data.py

import pandas as pd
import uuid
import bcrypt
from pathlib import Path
from datetime import datetime, timezone
from sqlalchemy import create_engine, text


DB_URL = "postgresql://postgres:mim123@localhost:5432/qubool"
LIMIT = 1000          # how many demo users to create
BATCH_SIZE = 300      # commit per batch (safe on memory)
DEFAULT_PASSWORD = "seed123"


BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "ml_artifacts" / "clean_profiles.csv"

engine = create_engine(DB_URL, pool_pre_ping=True)




def hash_password_demo(pw: str) -> str:
    """
    Hash password using bcrypt to match the application's authentication system.
    """
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode()


def safe_str(x, limit=255):
    if x is None:
        return None
    s = str(x)
    if s.lower() == "nan":
        return None
    return s[:limit]


def map_gender(sex):
    s = str(sex).lower().strip()
    if s in ["m", "male"]:
        return "male"
    if s in ["f", "female"]:
        return "female"
    return "other"


def map_diet(d):
    d = str(d).lower().strip()
    if d == "nan" or d == "" or d == "none":
        return None
    if "vegan" in d:
        return "vegan"
    if "vegetarian" in d:
        return "vegetarian"
    # keep as "non-vegetarian" or simply store original if you prefer
    return "non-vegetarian"


def map_smoking(v):
    v = str(v).lower().strip()
    if v == "nan" or v == "" or v == "none":
        return None
    if "no" in v or "never" in v:
        return "no"
    if "yes" in v:
        return "yes"
    # sometimes / trying to quit / socially -> keep "sometimes"
    return "sometimes"


def map_alcohol(v):
    v = str(v).lower().strip()
    if v == "nan" or v == "" or v == "none":
        return None
    if "not at all" in v or "never" in v:
        return "no"
    # socially/often/very often -> yes
    return "yes"


def map_religion(r):
    # Keep a short version; you can normalize later if needed
    rr = safe_str(r, 120)
    if rr is None:
        return None
    return rr


# -------------------------
# Core insert batch
# -------------------------
def insert_batch(users_batch, profiles_batch):
    """
    Inserts into users, then inserts into profiles using user_id.
    Uses a transaction; if anything fails, this batch rolls back.
    """
    with engine.begin() as conn:
        # 1) Insert USERS (only columns that exist in your users table)
        conn.execute(
            text("""
                INSERT INTO users
                (id, name, email, hashed_password, gender, nid, age, religion, is_demo, is_admin, created_at, verification_status)
                VALUES
                (:id, :name, :email, :hashed_password, :gender, :nid, :age, :religion, :is_demo, :is_admin, :created_at, :verification_status)
                ON CONFLICT (email) DO NOTHING
            """),
            users_batch
        )

        # 2) Insert PROFILES (user_id already set in profiles_batch)
        conn.execute(
            text("""
                INSERT INTO profiles
                (id, user_id, location, academic_background, profession, marital_status, hobbies,
                 dietary_preference, smoking_habit, alcohol_consumption, interests,
                 is_completed, is_demo, created_at, updated_at)
                VALUES
                (:id, :user_id, :location, :academic_background, :profession, :marital_status, :hobbies,
                 :dietary_preference, :smoking_habit, :alcohol_consumption, :interests,
                 :is_completed, :is_demo, :created_at, :updated_at)
            """),
            profiles_batch
        )

    print(f"✅ Inserted batch: {len(users_batch)} users + profiles")


def seed(limit=LIMIT):
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"CSV not found at: {CSV_PATH}")

    # read csv safely
    df = pd.read_csv(CSV_PATH, engine="python", on_bad_lines="skip")

    # choose sample
    df = df.sample(n=min(limit, len(df)), random_state=42).reset_index(drop=True)

    pw_hash = hash_password_demo(DEFAULT_PASSWORD)

    users_batch = []
    profiles_batch = []

    for i, r in df.iterrows():
        print(f"Processing row {i + 1}/{len(df)}", end="\r")
        uid = uuid.uuid4().hex[:10]
        user_id = str(uuid.uuid4())  # Generate UUID for user
        email = f"seed_{uid}@demo.quboolmatch.com"
        nid = f"SEED_{uuid.uuid4().hex[:12]}"

        age = int(r["age"]) if pd.notna(r.get("age")) else None
        gender = map_gender(r.get("sex"))
        religion = map_religion(r.get("religion"))

        # ---- USERS payload (matches your users columns) ----
        users_batch.append({
            "id": user_id,
            "name": f"DemoUser{uid}",
            "email": email,
            "hashed_password": pw_hash,
            "gender": gender,
            "nid": nid,
            "age": age,
            "religion": religion,
            "is_demo": True,
            "is_admin": False,
            "created_at": datetime.now(timezone.utc),
            "verification_status": "verified"  # Mark demo users as verified
        })

        # ---- PROFILES payload (matches your profiles columns) ----
        profiles_batch.append({
            "id": str(uuid.uuid4()),  # Generate UUID for profile
            "email": email,  # temp key for mapping user_id
            "user_id": user_id,  # Use the generated user_id
            "location": safe_str(r.get("location"), 200),
            "academic_background": safe_str(r.get("education"), 200),
            "profession": safe_str(r.get("job"), 200),
            "marital_status": "single",
            "hobbies": safe_str(r.get("essay_text", ""), 2000),
            "dietary_preference": map_diet(r.get("diet")),
            "smoking_habit": map_smoking(r.get("smokes")),
            "alcohol_consumption": map_alcohol(r.get("drinks")),
            "interests": None,      # optional: fill later from your NLP extractor
            "is_completed": True,   # important so these are eligible for matching
            "is_demo": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })
        break
        # batch commit
        if (i + 1) % BATCH_SIZE == 0:
            insert_batch(users_batch, profiles_batch)
            users_batch, profiles_batch = [], []

    # last batch
    if users_batch:
        insert_batch(users_batch, profiles_batch)

    print("\n✅ Seeding complete.")
    print(f"🔑 Demo password for all seeded users: {DEFAULT_PASSWORD}")


if __name__ == "__main__":
    seed(LIMIT)
