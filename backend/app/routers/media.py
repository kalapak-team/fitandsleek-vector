import secrets
import time
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import Collection, Point
from app.schemas import SearchRequest
from app.services.auth import require_admin, require_auth
from app.services.embedding import DEFAULT_SIZE, MODEL_NAME, embed_image, embed_text
from app.services.engine import vector_service

router = APIRouter(tags=["fitandsleek"])
settings = get_settings()


@router.post("/embed/image")
async def embed_image_endpoint(
    file: UploadFile = File(...),
    size: int = Form(DEFAULT_SIZE),
    _auth=Depends(require_auth),
):
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    vector = embed_image(data, size=size)
    return {"result": {"vector": vector, "size": len(vector), "model": MODEL_NAME}, "status": "ok", "time": 0}


@router.post("/embed/text")
async def embed_text_endpoint(
    text: str = Form(...),
    size: int = Form(DEFAULT_SIZE),
    _auth=Depends(require_auth),
):
    vector = embed_text(text, size=size)
    return {"result": {"vector": vector, "size": len(vector), "model": MODEL_NAME}, "status": "ok", "time": 0}


@router.post("/search/image")
async def search_by_image(
    collection_name: str = Form(...),
    file: UploadFile = File(...),
    limit: int = Form(10),
    with_payload: bool = Form(True),
    db: Session = Depends(get_db),
    _auth=Depends(require_auth),
):
    started = time.perf_counter()
    col = db.query(Collection).filter(Collection.name == collection_name).first()
    if not col:
        raise HTTPException(status_code=404, detail=f"Collection `{collection_name}` doesn't exist")

    data = await file.read()
    vector = embed_image(data, size=col.vector_size)

    upload_root = Path(settings.upload_dir)
    upload_root.mkdir(parents=True, exist_ok=True)
    filename = f"{secrets.token_hex(8)}_{file.filename or 'query.jpg'}"
    path = upload_root / filename
    path.write_bytes(data)

    body = SearchRequest(vector=vector, limit=limit, with_payload=with_payload, with_vector=False)
    result = vector_service.search(db, collection_name, body)
    result["time"] = round(time.perf_counter() - started, 6)
    result["query"] = {"filename": filename, "model": MODEL_NAME}
    return result


@router.post("/collections/{collection_name}/points/upload-image")
async def upsert_image_point(
    collection_name: str,
    file: UploadFile = File(...),
    point_id: str | None = Form(None),
    title: str | None = Form(None),
    category: str | None = Form(None),
    db: Session = Depends(get_db),
    _auth=Depends(require_admin),
):
    col = db.query(Collection).filter(Collection.name == collection_name).first()
    if not col:
        raise HTTPException(status_code=404, detail=f"Collection `{collection_name}` doesn't exist")

    data = await file.read()
    vector = embed_image(data, size=col.vector_size)

    upload_root = Path(settings.upload_dir)
    upload_root.mkdir(parents=True, exist_ok=True)
    filename = f"{secrets.token_hex(8)}_{file.filename or 'image.jpg'}"
    (upload_root / filename).write_bytes(data)

    pid = point_id or secrets.token_hex(8)
    from app.schemas import PointStruct, UpsertPointsRequest

    body = UpsertPointsRequest(
        points=[
            PointStruct(
                id=pid,
                vector=vector,
                payload={
                    "title": title or file.filename or pid,
                    "category": category or "uncategorized",
                    "filename": filename,
                    "content_type": file.content_type,
                    "source": "image-upload",
                },
            )
        ]
    )
    return vector_service.upsert_points(db, collection_name, body)


@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db), _auth=Depends(require_auth)):
    collections = db.query(Collection).all()
    points = db.query(Point).count()
    return {
        "result": {
            "collections": len(collections),
            "points": points,
            "vectors_indexed": sum(c.indexed_vectors_count for c in collections),
            "distances": list({c.distance for c in collections}),
            "avg_vector_size": int(sum(c.vector_size for c in collections) / len(collections)) if collections else 0,
        },
        "status": "ok",
        "time": 0,
    }
