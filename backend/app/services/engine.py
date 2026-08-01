from __future__ import annotations

import time
import uuid
from typing import Any, Optional, Union

import numpy as np
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Collection, Point, Snapshot
from app.schemas import (
    CollectionInfo,
    CountRequest,
    CreateCollectionRequest,
    DeletePointsRequest,
    Distance,
    PointStruct,
    RecommendRequest,
    Record,
    ScrollRequest,
    ScoredPoint,
    SearchRequest,
    UpdateResult,
    UpsertPointsRequest,
)
from app.services.embedding import bytes_to_vector, vector_to_bytes
from app.services.vector_math import filter_payload_fields, match_payload, score_vectors


def _now_result(result: Any, started: float) -> dict[str, Any]:
    return {"result": result, "status": "ok", "time": round(time.perf_counter() - started, 6)}


def _extract_vector(vector: Union[list[float], dict[str, list[float]]]) -> list[float]:
    if isinstance(vector, dict):
        if "" in vector:
            return vector[""]
        if len(vector) == 1:
            return next(iter(vector.values()))
        raise HTTPException(status_code=400, detail="Named vectors must include a single vector or '' key")
    return vector


class VectorService:
    def list_collections(self, db: Session) -> dict[str, Any]:
        started = time.perf_counter()
        rows = db.query(Collection).order_by(Collection.name).all()
        return _now_result({"collections": [{"name": c.name} for c in rows]}, started)

    def create_collection(self, db: Session, name: str, body: CreateCollectionRequest) -> dict[str, Any]:
        started = time.perf_counter()
        existing = db.query(Collection).filter(Collection.name == name).first()
        if existing:
            raise HTTPException(status_code=409, detail=f"Collection `{name}` already exists")

        hnsw = body.hnsw_config.model_dump() if body.hnsw_config else {
            "m": 16,
            "ef_construct": 100,
            "full_scan_threshold": 10000,
            "max_indexing_threads": 0,
            "on_disk": False,
        }
        optimizers = body.optimizers_config.model_dump() if body.optimizers_config else {
            "deleted_threshold": 0.2,
            "vacuum_min_vector_number": 1000,
            "default_segment_number": 0,
            "indexing_threshold": 20000,
            "flush_interval_sec": 5,
            "max_optimization_threads": None,
        }
        config = {
            "params": {
                "vectors": body.vectors.model_dump(),
                "shard_number": 1,
                "replication_factor": 1,
                "write_consistency_factor": 1,
                "on_disk_payload": body.on_disk_payload,
            },
            "hnsw_config": hnsw,
            "optimizer_config": optimizers,
        }

        row = Collection(
            name=name,
            vector_size=body.vectors.size,
            distance=body.vectors.distance.value if isinstance(body.vectors.distance, Distance) else body.vectors.distance,
            on_disk=body.vectors.on_disk,
            config=config,
            payload_schema={},
        )
        db.add(row)
        db.commit()
        return _now_result(True, started)

    def get_collection(self, db: Session, name: str) -> dict[str, Any]:
        started = time.perf_counter()
        row = self._get_collection_or_404(db, name)
        info = CollectionInfo(
            status=row.status,
            optimizer_status=row.optimizer_status,
            vectors_count=row.points_count,
            indexed_vectors_count=row.indexed_vectors_count,
            points_count=row.points_count,
            segments_count=row.segments_count,
            config=row.config or {},
            payload_schema=row.payload_schema or {},
        )
        return _now_result(info.model_dump(), started)

    def delete_collection(self, db: Session, name: str) -> dict[str, Any]:
        started = time.perf_counter()
        row = self._get_collection_or_404(db, name)
        db.query(Point).filter(Point.collection_id == row.id).delete()
        db.delete(row)
        db.commit()
        return _now_result(True, started)

    def collection_exists(self, db: Session, name: str) -> dict[str, Any]:
        started = time.perf_counter()
        exists = db.query(Collection).filter(Collection.name == name).first() is not None
        return _now_result(exists, started)

    def upsert_points(self, db: Session, name: str, body: UpsertPointsRequest) -> dict[str, Any]:
        started = time.perf_counter()
        col = self._get_collection_or_404(db, name)

        for p in body.points:
            vec = _extract_vector(p.vector)
            if len(vec) != col.vector_size:
                raise HTTPException(
                    status_code=400,
                    detail=f"Vector size mismatch: expected {col.vector_size}, got {len(vec)}",
                )
            point_id = str(p.id)
            existing = (
                db.query(Point)
                .filter(Point.collection_id == col.id, Point.point_id == point_id)
                .first()
            )
            payload = p.payload or {}
            self._update_payload_schema(col, payload)
            if existing:
                existing.vector = vector_to_bytes(vec)
                existing.payload = payload
            else:
                db.add(
                    Point(
                        collection_id=col.id,
                        point_id=point_id,
                        vector=vector_to_bytes(vec),
                        payload=payload,
                    )
                )

        db.flush()
        col.points_count = db.query(Point).filter(Point.collection_id == col.id).count()
        col.indexed_vectors_count = col.points_count
        db.commit()
        return _now_result(UpdateResult().model_dump(), started)

    def get_point(self, db: Session, name: str, point_id: str, with_payload: bool = True, with_vector: bool = False) -> dict[str, Any]:
        started = time.perf_counter()
        col = self._get_collection_or_404(db, name)
        point = (
            db.query(Point)
            .filter(Point.collection_id == col.id, Point.point_id == str(point_id))
            .first()
        )
        if not point:
            raise HTTPException(status_code=404, detail=f"Point `{point_id}` not found")
        rec = Record(
            id=_cast_id(point.point_id),
            payload=point.payload if with_payload else None,
            vector=bytes_to_vector(point.vector).tolist() if with_vector else None,
        )
        return _now_result(rec.model_dump(), started)

    def delete_points(self, db: Session, name: str, body: DeletePointsRequest) -> dict[str, Any]:
        started = time.perf_counter()
        col = self._get_collection_or_404(db, name)
        q = db.query(Point).filter(Point.collection_id == col.id)

        if body.points is not None:
            ids = [str(x) for x in body.points]
            q.filter(Point.point_id.in_(ids)).delete(synchronize_session=False)
        elif body.filter is not None:
            rows = q.all()
            for row in rows:
                if match_payload(row.payload, body.filter):
                    db.delete(row)
        else:
            raise HTTPException(status_code=400, detail="Provide points or filter")

        db.flush()
        col.points_count = db.query(Point).filter(Point.collection_id == col.id).count()
        col.indexed_vectors_count = col.points_count
        db.commit()
        return _now_result(UpdateResult().model_dump(), started)

    def search(self, db: Session, name: str, body: SearchRequest) -> dict[str, Any]:
        started = time.perf_counter()
        col = self._get_collection_or_404(db, name)
        query = np.asarray(_extract_vector(body.vector), dtype=np.float32)
        if query.shape[0] != col.vector_size:
            raise HTTPException(status_code=400, detail="Query vector size mismatch")

        points = db.query(Point).filter(Point.collection_id == col.id).all()
        filtered = [p for p in points if match_payload(p.payload, body.filter)]
        if not filtered:
            return _now_result([], started)

        matrix = np.vstack([bytes_to_vector(p.vector) for p in filtered])
        scores = score_vectors(query, matrix, col.distance)
        order = np.argsort(-scores)

        results: list[ScoredPoint] = []
        for idx in order:
            score = float(scores[idx])
            if body.score_threshold is not None and score < body.score_threshold:
                continue
            p = filtered[int(idx)]
            results.append(
                ScoredPoint(
                    id=_cast_id(p.point_id),
                    score=score,
                    payload=filter_payload_fields(p.payload, body.with_payload),
                    vector=bytes_to_vector(p.vector).tolist() if body.with_vector else None,
                )
            )
            if len(results) >= body.offset + body.limit:
                break

        sliced = results[body.offset : body.offset + body.limit]
        return _now_result([r.model_dump() for r in sliced], started)

    def recommend(self, db: Session, name: str, body: RecommendRequest) -> dict[str, Any]:
        started = time.perf_counter()
        col = self._get_collection_or_404(db, name)
        if not body.positive:
            raise HTTPException(status_code=400, detail="At least one positive example is required")

        pos_vecs = []
        for pid in body.positive:
            point = db.query(Point).filter(Point.collection_id == col.id, Point.point_id == str(pid)).first()
            if not point:
                raise HTTPException(status_code=404, detail=f"Positive point `{pid}` not found")
            pos_vecs.append(bytes_to_vector(point.vector))

        query = np.mean(np.vstack(pos_vecs), axis=0)
        if body.negative:
            neg_vecs = []
            for pid in body.negative:
                point = db.query(Point).filter(Point.collection_id == col.id, Point.point_id == str(pid)).first()
                if point:
                    neg_vecs.append(bytes_to_vector(point.vector))
            if neg_vecs:
                query = query - np.mean(np.vstack(neg_vecs), axis=0)

        exclude = {str(x) for x in body.positive + body.negative}
        search_body = SearchRequest(
            vector=query.tolist(),
            filter=body.filter,
            limit=body.limit + len(exclude),
            with_payload=body.with_payload,
            with_vector=body.with_vector,
            score_threshold=body.score_threshold,
        )
        raw = self.search(db, name, search_body)
        filtered = [r for r in raw["result"] if str(r["id"]) not in exclude][: body.limit]
        return _now_result(filtered, started)

    def scroll(self, db: Session, name: str, body: ScrollRequest) -> dict[str, Any]:
        started = time.perf_counter()
        col = self._get_collection_or_404(db, name)
        q = db.query(Point).filter(Point.collection_id == col.id).order_by(Point.id.asc())
        rows = q.all()
        filtered = [p for p in rows if match_payload(p.payload, body.filter)]

        start_idx = 0
        if body.offset is not None:
            for i, p in enumerate(filtered):
                if p.point_id == str(body.offset):
                    start_idx = i + 1
                    break

        page = filtered[start_idx : start_idx + body.limit]
        next_offset = page[-1].point_id if len(page) == body.limit and start_idx + body.limit < len(filtered) else None
        points = [
            Record(
                id=_cast_id(p.point_id),
                payload=filter_payload_fields(p.payload, body.with_payload),
                vector=bytes_to_vector(p.vector).tolist() if body.with_vector else None,
            ).model_dump()
            for p in page
        ]
        return _now_result({"points": points, "next_page_offset": next_offset}, started)

    def count(self, db: Session, name: str, body: CountRequest) -> dict[str, Any]:
        started = time.perf_counter()
        col = self._get_collection_or_404(db, name)
        rows = db.query(Point).filter(Point.collection_id == col.id).all()
        count = sum(1 for p in rows if match_payload(p.payload, body.filter))
        return _now_result({"count": count}, started)

    def create_snapshot(self, db: Session, name: str) -> dict[str, Any]:
        started = time.perf_counter()
        col = self._get_collection_or_404(db, name)
        snap_name = f"{name}-{int(time.time())}-{uuid.uuid4().hex[:8]}.snapshot"
        size = col.points_count * col.vector_size * 4
        snap = Snapshot(collection_name=name, name=snap_name, size_bytes=size)
        db.add(snap)
        db.commit()
        return _now_result({"name": snap_name}, started)

    def list_snapshots(self, db: Session, name: str) -> dict[str, Any]:
        started = time.perf_counter()
        self._get_collection_or_404(db, name)
        rows = db.query(Snapshot).filter(Snapshot.collection_name == name).order_by(Snapshot.created_at.desc()).all()
        return _now_result(
            [
                {
                    "name": s.name,
                    "creation_time": s.created_at.isoformat() if s.created_at else None,
                    "size": s.size_bytes,
                }
                for s in rows
            ],
            started,
        )

    def delete_snapshot(self, db: Session, name: str, snapshot_name: str) -> dict[str, Any]:
        started = time.perf_counter()
        row = (
            db.query(Snapshot)
            .filter(Snapshot.collection_name == name, Snapshot.name == snapshot_name)
            .first()
        )
        if not row:
            raise HTTPException(status_code=404, detail="Snapshot not found")
        db.delete(row)
        db.commit()
        return _now_result(True, started)

    def _get_collection_or_404(self, db: Session, name: str) -> Collection:
        row = db.query(Collection).filter(Collection.name == name).first()
        if not row:
            raise HTTPException(status_code=404, detail=f"Collection `{name}` doesn't exist")
        return row

    def _update_payload_schema(self, col: Collection, payload: dict[str, Any]) -> None:
        schema = dict(col.payload_schema or {})
        for key, value in payload.items():
            if key in schema:
                continue
            if isinstance(value, bool):
                t = "bool"
            elif isinstance(value, int):
                t = "integer"
            elif isinstance(value, float):
                t = "float"
            elif isinstance(value, dict):
                t = "object"
            elif isinstance(value, list):
                t = "list"
            else:
                t = "keyword"
            schema[key] = {"data_type": t, "points": 0}
        col.payload_schema = schema


def _cast_id(point_id: str) -> Union[int, str]:
    if point_id.isdigit():
        return int(point_id)
    return point_id


vector_service = VectorService()
