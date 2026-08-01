import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import Collection, Point

router = APIRouter(tags=["cluster"])
settings = get_settings()
STARTED_AT = time.time()


@router.get("/")
def root():
    return {"title": settings.app_name, "version": settings.app_version}


@router.get("/telemetry")
def telemetry(db: Session = Depends(get_db)):
    collections = db.query(Collection).count()
    points = db.query(Point).count()
    return {
        "id": "fitandsleek-vector-local",
        "app": {
            "name": settings.app_name,
            "version": settings.app_version,
            "uptime": int(time.time() - STARTED_AT),
        },
        "collections": {"number_of_collections": collections, "number_of_points": points},
        "cluster": {"enabled": False},
        "requests": {"rest": {"responses": {"ok": points, "fail": 0}}},
    }


@router.get("/cluster")
def cluster():
    return {
        "result": {
            "status": "disabled",
            "peer_id": 0,
            "peers": {},
            "raft_info": {},
            "consensus_thread_status": {"consensus_thread_status": "stopped"},
        },
        "status": "ok",
        "time": 0,
    }


@router.get("/aliases")
def aliases():
    return {"result": {"aliases": []}, "status": "ok", "time": 0}


@router.get("/healthz")
def healthz():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}
