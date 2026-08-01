from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.auth import require_admin, require_auth
from app.services.engine import vector_service

router = APIRouter(tags=["snapshots"])


@router.post("/collections/{collection_name}/snapshots")
def create_snapshot(collection_name: str, db: Session = Depends(get_db), _auth=Depends(require_admin)):
    return vector_service.create_snapshot(db, collection_name)


@router.get("/collections/{collection_name}/snapshots")
def list_snapshots(collection_name: str, db: Session = Depends(get_db), _auth=Depends(require_auth)):
    return vector_service.list_snapshots(db, collection_name)


@router.delete("/collections/{collection_name}/snapshots/{snapshot_name}")
def delete_snapshot(
    collection_name: str,
    snapshot_name: str,
    db: Session = Depends(get_db),
    _auth=Depends(require_admin),
):
    return vector_service.delete_snapshot(db, collection_name, snapshot_name)
