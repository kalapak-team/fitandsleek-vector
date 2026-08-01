from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import CreateCollectionRequest
from app.services.auth import require_admin, require_auth
from app.services.engine import vector_service

router = APIRouter(tags=["collections"])


@router.get("/collections")
def list_collections(db: Session = Depends(get_db), _auth=Depends(require_auth)):
    return vector_service.list_collections(db)


@router.put("/collections/{collection_name}")
def create_collection(
    collection_name: str,
    body: CreateCollectionRequest,
    db: Session = Depends(get_db),
    _auth=Depends(require_admin),
):
    return vector_service.create_collection(db, collection_name, body)


@router.get("/collections/{collection_name}")
def get_collection(collection_name: str, db: Session = Depends(get_db), _auth=Depends(require_auth)):
    return vector_service.get_collection(db, collection_name)


@router.delete("/collections/{collection_name}")
def delete_collection(collection_name: str, db: Session = Depends(get_db), _auth=Depends(require_admin)):
    return vector_service.delete_collection(db, collection_name)


@router.get("/collections/{collection_name}/exists")
def collection_exists(collection_name: str, db: Session = Depends(get_db), _auth=Depends(require_auth)):
    return vector_service.collection_exists(db, collection_name)
