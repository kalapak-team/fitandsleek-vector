from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import CountRequest, DeletePointsRequest, RecommendRequest, ScrollRequest, SearchRequest, UpsertPointsRequest
from app.services.auth import require_admin, require_auth
from app.services.engine import vector_service

router = APIRouter(tags=["points"])


@router.put("/collections/{collection_name}/points")
def upsert_points(
    collection_name: str,
    body: UpsertPointsRequest,
    db: Session = Depends(get_db),
    _auth=Depends(require_admin),
):
    return vector_service.upsert_points(db, collection_name, body)


@router.post("/collections/{collection_name}/points")
def upsert_points_post(
    collection_name: str,
    body: UpsertPointsRequest,
    db: Session = Depends(get_db),
    _auth=Depends(require_admin),
):
    return vector_service.upsert_points(db, collection_name, body)


@router.get("/collections/{collection_name}/points/{point_id}")
def get_point(
    collection_name: str,
    point_id: str,
    with_payload: bool = Query(True),
    with_vector: bool = Query(False),
    db: Session = Depends(get_db),
    _auth=Depends(require_auth),
):
    return vector_service.get_point(db, collection_name, point_id, with_payload, with_vector)


@router.post("/collections/{collection_name}/points/delete")
def delete_points(
    collection_name: str,
    body: DeletePointsRequest,
    db: Session = Depends(get_db),
    _auth=Depends(require_admin),
):
    return vector_service.delete_points(db, collection_name, body)


@router.post("/collections/{collection_name}/points/search")
def search_points(
    collection_name: str,
    body: SearchRequest,
    db: Session = Depends(get_db),
    _auth=Depends(require_auth),
):
    return vector_service.search(db, collection_name, body)


@router.post("/collections/{collection_name}/points/recommend")
def recommend_points(
    collection_name: str,
    body: RecommendRequest,
    db: Session = Depends(get_db),
    _auth=Depends(require_auth),
):
    return vector_service.recommend(db, collection_name, body)


@router.post("/collections/{collection_name}/points/scroll")
def scroll_points(
    collection_name: str,
    body: ScrollRequest,
    db: Session = Depends(get_db),
    _auth=Depends(require_auth),
):
    return vector_service.scroll(db, collection_name, body)


@router.post("/collections/{collection_name}/points/count")
def count_points(
    collection_name: str,
    body: CountRequest,
    db: Session = Depends(get_db),
    _auth=Depends(require_auth),
):
    return vector_service.count(db, collection_name, body)
