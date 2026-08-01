"""Seed a demo products collection with synthetic vectors + sample image embeds."""

from __future__ import annotations

import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from app.database import Base, SessionLocal, engine
from app.models import Collection
from app.schemas import CreateCollectionRequest, PointStruct, UpsertPointsRequest, VectorParams
from app.services.embedding import embed_image
from app.services.engine import vector_service

COLORS = [
    ((20, 180, 120), "Emerald Tee", "apparel"),
    ((30, 40, 55), "Night Runner", "footwear"),
    ((240, 120, 40), "Pulse Band", "accessories"),
    ((80, 140, 255), "Sky Bottle", "gear"),
    ((200, 40, 80), "Forge Leggings", "apparel"),
    ((250, 250, 245), "Cloud Hoodie", "apparel"),
    ((15, 15, 18), "Stealth Shorts", "apparel"),
    ((120, 220, 80), "Volt Cap", "accessories"),
]


def make_swatch(rgb: tuple[int, int, int], label: str) -> bytes:
    img = Image.new("RGB", (256, 256), rgb)
    draw = ImageDraw.Draw(img)
    draw.rectangle((24, 24, 232, 232), outline=(255, 255, 255), width=4)
    draw.text((40, 110), label[:18], fill=(255, 255, 255))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    return buf.getvalue()


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    name = "fitandsleek_products"

    existing = db.query(Collection).filter(Collection.name == name).first()
    if existing:
        vector_service.delete_collection(db, name)

    vector_service.create_collection(
        db,
        name,
        CreateCollectionRequest(vectors=VectorParams(size=512, distance="Cosine")),
    )

    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    points: list[PointStruct] = []

    for i, (rgb, title, category) in enumerate(COLORS, start=1):
        data = make_swatch(rgb, title)
        filename = f"seed_{i}_{title.lower().replace(' ', '_')}.jpg"
        (upload_dir / filename).write_bytes(data)
        vector = embed_image(data, size=512)
        points.append(
            PointStruct(
                id=i,
                vector=vector,
                payload={
                    "title": title,
                    "category": category,
                    "filename": filename,
                    "brand": "FitandSleek",
                    "price": round(19.0 + i * 7.5, 2),
                    "source": "seed",
                },
            )
        )

    # also add a few random pure vectors for API demos
    rng = np.random.default_rng(42)
    for i in range(9, 21):
        v = rng.standard_normal(512).astype(np.float32)
        v = v / np.linalg.norm(v)
        points.append(
            PointStruct(
                id=i,
                vector=v.tolist(),
                payload={"title": f"Vector Sample {i}", "category": "synthetic", "source": "seed"},
            )
        )

    vector_service.upsert_points(db, name, UpsertPointsRequest(points=points))
    print(f"Seeded collection `{name}` with {len(points)} points")
    db.close()


if __name__ == "__main__":
    main()
