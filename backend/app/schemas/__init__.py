from enum import Enum
from typing import Any, Optional, Union

from pydantic import BaseModel, Field


class Distance(str, Enum):
    COSINE = "Cosine"
    EUCLID = "Euclid"
    DOT = "Dot"


class VectorParams(BaseModel):
    size: int = Field(..., gt=0, le=65536)
    distance: Distance = Distance.COSINE
    on_disk: bool = False


class HnswConfig(BaseModel):
    m: int = 16
    ef_construct: int = 100
    full_scan_threshold: int = 10000
    max_indexing_threads: int = 0
    on_disk: bool = False


class OptimizersConfig(BaseModel):
    deleted_threshold: float = 0.2
    vacuum_min_vector_number: int = 1000
    default_segment_number: int = 0
    indexing_threshold: int = 20000
    flush_interval_sec: int = 5
    max_optimization_threads: Optional[int] = None


class CollectionConfig(BaseModel):
    params: VectorParams
    hnsw_config: HnswConfig = Field(default_factory=HnswConfig)
    optimizer_config: OptimizersConfig = Field(default_factory=OptimizersConfig)


class CreateCollectionRequest(BaseModel):
    vectors: VectorParams
    hnsw_config: Optional[HnswConfig] = None
    optimizers_config: Optional[OptimizersConfig] = None
    on_disk_payload: bool = True


class CollectionInfo(BaseModel):
    status: str
    optimizer_status: str
    vectors_count: Optional[int] = None
    indexed_vectors_count: int
    points_count: int
    segments_count: int
    config: dict[str, Any]
    payload_schema: dict[str, Any] = Field(default_factory=dict)


class CollectionDescription(BaseModel):
    name: str


class CollectionsResponse(BaseModel):
    collections: list[CollectionDescription]


class PointStruct(BaseModel):
    id: Union[int, str]
    vector: Union[list[float], dict[str, list[float]]]
    payload: Optional[dict[str, Any]] = None


class UpsertPointsRequest(BaseModel):
    points: list[PointStruct]
    wait: bool = True


class PointsSelector(BaseModel):
    points: Optional[list[Union[int, str]]] = None
    filter: Optional[dict[str, Any]] = None


class DeletePointsRequest(BaseModel):
    points: Optional[list[Union[int, str]]] = None
    filter: Optional[dict[str, Any]] = None
    wait: bool = True


class FilterCondition(BaseModel):
    key: str
    match: Optional[dict[str, Any]] = None
    range: Optional[dict[str, Any]] = None


class SearchRequest(BaseModel):
    vector: Union[list[float], dict[str, list[float]]]
    filter: Optional[dict[str, Any]] = None
    params: Optional[dict[str, Any]] = None
    limit: int = Field(default=10, ge=1, le=1000)
    offset: int = Field(default=0, ge=0)
    with_payload: Union[bool, list[str]] = True
    with_vector: Union[bool, list[str]] = False
    score_threshold: Optional[float] = None


class RecommendRequest(BaseModel):
    positive: list[Union[int, str]] = Field(default_factory=list)
    negative: list[Union[int, str]] = Field(default_factory=list)
    filter: Optional[dict[str, Any]] = None
    limit: int = Field(default=10, ge=1, le=1000)
    with_payload: Union[bool, list[str]] = True
    with_vector: bool = False
    score_threshold: Optional[float] = None


class ScrollRequest(BaseModel):
    offset: Optional[Union[int, str]] = None
    limit: int = Field(default=10, ge=1, le=1000)
    filter: Optional[dict[str, Any]] = None
    with_payload: Union[bool, list[str]] = True
    with_vector: bool = False
    order_by: Optional[str] = None


class CountRequest(BaseModel):
    filter: Optional[dict[str, Any]] = None
    exact: bool = True


class ScoredPoint(BaseModel):
    id: Union[int, str]
    version: int = 0
    score: float
    payload: Optional[dict[str, Any]] = None
    vector: Optional[list[float]] = None


class Record(BaseModel):
    id: Union[int, str]
    payload: Optional[dict[str, Any]] = None
    vector: Optional[list[float]] = None


class UpdateResult(BaseModel):
    operation_id: int = 0
    status: str = "completed"


class ApiResponse(BaseModel):
    result: Any = None
    status: str = "ok"
    time: float = 0.0


class ClusterInfo(BaseModel):
    status: str = "enabled"
    peer_id: int = 0
    peers: dict[str, Any] = Field(default_factory=dict)
    raft_info: dict[str, Any] = Field(default_factory=dict)
    consensus_thread_status: dict[str, Any] = Field(default_factory=dict)


class TelemetryResponse(BaseModel):
    id: str
    app: dict[str, Any]
    collections: dict[str, Any]
    cluster: dict[str, Any]
    requests: dict[str, Any]


class EmbedImageResponse(BaseModel):
    vector: list[float]
    size: int
    model: str


class ImageSearchRequest(BaseModel):
    collection_name: str
    limit: int = 10
    with_payload: bool = True
    score_threshold: Optional[float] = None
