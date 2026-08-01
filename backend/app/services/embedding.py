"""Deterministic image / text embedding for FitandSleek Vector.

Produces fixed-size vectors without heavyweight ML downloads so the app
runs offline. Swap `embed_image` / `embed_text` for CLIP later if needed.
"""

from __future__ import annotations

import hashlib
import io
from typing import Union

import numpy as np
from PIL import Image


MODEL_NAME = "fitandsleek-vision-v1"
DEFAULT_SIZE = 512


def _seeded_projection(seed: bytes, size: int) -> np.ndarray:
    digest = hashlib.sha256(seed).digest()
    rng = np.random.default_rng(int.from_bytes(digest[:8], "little"))
    mat = rng.standard_normal((64, size), dtype=np.float32)
    return mat


def _color_histogram(img: Image.Image, bins: int = 16) -> np.ndarray:
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    feats = []
    for c in range(3):
        hist, _ = np.histogram(arr[:, :, c], bins=bins, range=(0, 256), density=True)
        feats.append(hist.astype(np.float32))
    gray = arr.mean(axis=2)
    gh, _ = np.histogram(gray, bins=bins, range=(0, 256), density=True)
    feats.append(gh.astype(np.float32))
    # simple spatial averages (4x4 grid)
    h, w, _ = arr.shape
    grid = []
    for i in range(4):
        for j in range(4):
            block = arr[i * h // 4 : (i + 1) * h // 4, j * w // 4 : (j + 1) * w // 4]
            grid.append(block.mean(axis=(0, 1)))
    feats.append(np.concatenate(grid).astype(np.float32))
    return np.concatenate(feats)


def embed_image(data: bytes, size: int = DEFAULT_SIZE) -> list[float]:
    img = Image.open(io.BytesIO(data))
    img = img.convert("RGB").resize((224, 224))
    feats = _color_histogram(img)
    # pad / trim to 64 dims then project
    if feats.shape[0] < 64:
        feats = np.pad(feats, (0, 64 - feats.shape[0]))
    else:
        feats = feats[:64]
    proj = _seeded_projection(b"fitandsleek-image", size)
    vec = feats @ proj
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.astype(np.float32).tolist()


def embed_text(text: str, size: int = DEFAULT_SIZE) -> list[float]:
    tokens = text.lower().encode("utf-8")
    # bag of hashed n-grams
    feats = np.zeros(64, dtype=np.float32)
    for n in (1, 2, 3):
        for i in range(max(0, len(tokens) - n + 1)):
            chunk = tokens[i : i + n]
            h = int.from_bytes(hashlib.md5(chunk).digest()[:4], "little")
            feats[h % 64] += 1.0
    if feats.sum() > 0:
        feats = feats / np.linalg.norm(feats)
    proj = _seeded_projection(b"fitandsleek-text", size)
    vec = feats @ proj
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.astype(np.float32).tolist()


def bytes_to_vector(raw: bytes) -> np.ndarray:
    return np.frombuffer(raw, dtype=np.float32).copy()


def vector_to_bytes(vector: Union[list[float], np.ndarray]) -> bytes:
    arr = np.asarray(vector, dtype=np.float32)
    return arr.tobytes()
