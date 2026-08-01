from __future__ import annotations

from typing import Any, Optional

import numpy as np


def normalize(v: np.ndarray) -> np.ndarray:
    norm = np.linalg.norm(v, axis=-1, keepdims=True)
    norm = np.where(norm == 0, 1.0, norm)
    return v / norm


def score_vectors(query: np.ndarray, matrix: np.ndarray, distance: str) -> np.ndarray:
    """Return similarity scores (higher is better) for ranking."""
    if matrix.size == 0:
        return np.array([], dtype=np.float32)

    if distance == "Cosine":
        q = normalize(query.astype(np.float32))
        m = normalize(matrix.astype(np.float32))
        return m @ q
    if distance == "Dot":
        return matrix.astype(np.float32) @ query.astype(np.float32)
    # Euclid → convert distance to similarity: -distance
    diffs = matrix.astype(np.float32) - query.astype(np.float32)
    dists = np.linalg.norm(diffs, axis=1)
    return -dists


def match_payload(payload: Optional[dict[str, Any]], flt: Optional[dict[str, Any]]) -> bool:
    """Minimal Qdrant-like filter: must / should / must_not with match & range."""
    if not flt:
        return True
    payload = payload or {}

    must = flt.get("must") or []
    should = flt.get("should") or []
    must_not = flt.get("must_not") or []

    for cond in must:
        if not _match_condition(payload, cond):
            return False

    for cond in must_not:
        if _match_condition(payload, cond):
            return False

    if should:
        return any(_match_condition(payload, cond) for cond in should)

    return True


def _match_condition(payload: dict[str, Any], cond: dict[str, Any]) -> bool:
    if "must" in cond or "should" in cond or "must_not" in cond:
        return match_payload(payload, cond)

    key = cond.get("key")
    if key is None:
        return True

    value = _nested_get(payload, key)

    if "match" in cond:
        m = cond["match"]
        if "value" in m:
            return value == m["value"]
        if "any" in m:
            return value in m["any"]
        if "except" in m:
            return value not in m["except"]
        if "text" in m:
            return isinstance(value, str) and m["text"].lower() in value.lower()

    if "range" in cond:
        r = cond["range"]
        if value is None:
            return False
        try:
            num = float(value)
        except (TypeError, ValueError):
            return False
        if "gt" in r and not (num > r["gt"]):
            return False
        if "gte" in r and not (num >= r["gte"]):
            return False
        if "lt" in r and not (num < r["lt"]):
            return False
        if "lte" in r and not (num <= r["lte"]):
            return False
        return True

    if "is_empty" in cond:
        empty = value is None or value == "" or value == [] or value == {}
        return empty if cond["is_empty"] else not empty

    return True


def _nested_get(payload: dict[str, Any], key: str) -> Any:
    cur: Any = payload
    for part in key.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


def filter_payload_fields(
    payload: Optional[dict[str, Any]], with_payload: bool | list[str]
) -> Optional[dict[str, Any]]:
    if with_payload is False:
        return None
    if with_payload is True:
        return payload or {}
    if isinstance(with_payload, list):
        src = payload or {}
        return {k: src.get(k) for k in with_payload}
    return payload or {}
