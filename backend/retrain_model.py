# backend/retrain_model.py
#
# ONE-TIME SCRIPT: Trains a KNN recommendation model on actual DB users.
# Run this from the backend/ directory whenever you want to refresh the model:
#   python retrain_model.py
#
# Output artifacts saved to backend/ml_artifacts/:
#   - nn_db.pkl           : Trained NearestNeighbors model
#   - preprocess_db.pkl   : Fitted ColumnTransformer pipeline
#   - user_id_map.json    : { "knn_index": "user_id" } mapping

import sys
import json
import joblib
import pandas as pd
from pathlib import Path
from sqlalchemy import create_engine, text
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.neighbors import NearestNeighbors

DB_URL = "postgresql://postgres:mim123@localhost:5432/qubool"
OUTPUT_DIR = Path(__file__).resolve().parent / "ml_artifacts"
OUTPUT_DIR.mkdir(exist_ok=True)

# Features to use for training
NUMERIC_COLS = ["age"]
CATEGORICAL_COLS = [
    "gender", "religion", "location", "academic_background",
    "profession", "marital_status", "dietary_preference",
    "smoking_habit", "alcohol_consumption"
]
ALL_COLS = NUMERIC_COLS + CATEGORICAL_COLS


def fetch_users():
    """Query all users with completed profiles from the database."""
    engine = create_engine(DB_URL, pool_pre_ping=True)
    query = text("""
        SELECT
            u.id          AS user_id,
            u.age,
            u.gender,
            u.religion,
            p.location,
            p.academic_background,
            p.profession,
            p.marital_status,
            p.dietary_preference,
            p.smoking_habit,
            p.alcohol_consumption
        FROM users u
        JOIN profiles p ON u.id = p.user_id
        WHERE p.is_completed = TRUE
          AND u.is_deleted = FALSE
    """)
    with engine.connect() as conn:
        result = conn.execute(query)
        rows = result.fetchall()
        columns = result.keys()

    df = pd.DataFrame(rows, columns=columns)
    print(f"✅ Fetched {len(df)} users from database")
    return df


def clean_df(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize and fill missing values."""
    df = df.copy()

    # Numeric
    df["age"] = pd.to_numeric(df["age"], errors="coerce")
    df["age"] = df["age"].fillna(df["age"].median())
    df["age"] = df["age"].clip(18, 80)

    # Categorical — lowercase, strip, fill unknowns
    for c in CATEGORICAL_COLS:
        df[c] = (
            df[c]
            .astype(str)
            .str.lower()
            .str.strip()
            .replace({"nan": "unknown", "none": "unknown", "": "unknown"})
            .fillna("unknown")
        )

    return df


def build_and_save(df: pd.DataFrame):
    """Fit preprocessor + KNN and save artifacts."""

    user_ids = df["user_id"].tolist()
    feature_df = df[ALL_COLS]

    # Build ColumnTransformer
    preprocess = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC_COLS),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_COLS),
        ]
    )

    X = preprocess.fit_transform(feature_df)
    print(f"✅ Feature matrix shape: {X.shape}")

    # Train KNN — n_neighbors capped at dataset size
    n_neighbors = min(51, len(df))
    nn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine", algorithm="brute")
    nn.fit(X)
    print(f"✅ KNN trained with n_neighbors={n_neighbors}")

    # user_id_map: knn_index (str) -> user_id
    user_id_map = {str(i): uid for i, uid in enumerate(user_ids)}

    # Save artifacts
    joblib.dump(preprocess, OUTPUT_DIR / "preprocess_db.pkl")
    joblib.dump(nn, OUTPUT_DIR / "nn_db.pkl")
    with open(OUTPUT_DIR / "user_id_map.json", "w") as f:
        json.dump(user_id_map, f)

    print(f"✅ Artifacts saved to {OUTPUT_DIR}")
    print(f"   - preprocess_db.pkl")
    print(f"   - nn_db.pkl")
    print(f"   - user_id_map.json  ({len(user_id_map)} users)")


if __name__ == "__main__":
    print("=== Retrain recommendation model on DB users ===")
    df = fetch_users()

    if len(df) < 5:
        print("❌ Not enough users to train (need at least 5). Seed more users first.")
        sys.exit(1)

    df = clean_df(df)
    build_and_save(df)
    print("\n🎉 Done! Restart the uvicorn server to load the new model.")
