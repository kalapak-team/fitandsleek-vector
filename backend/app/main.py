from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect, text

from app.config import get_settings
from app.database import Base, engine
from app.routers import auth, collections, media, points, snapshots, system

settings = get_settings()


def _ensure_schema() -> None:
    if settings.is_local_database:
        print(
            "WARNING: DATABASE_URL points to localhost. "
            "On Hugging Face, set Secret DATABASE_URL to your Neon connection string."
        )

    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        raise RuntimeError(
            "Failed to connect to PostgreSQL. "
            "Set Hugging Face Space Secret `DATABASE_URL` to your Neon URL "
            "(include sslmode=require). "
            f"Current host looks local={settings.is_local_database}. "
            f"Original error: {exc}"
        ) from exc

    inspector = inspect(engine)
    tables = inspector.get_table_names()

    with engine.begin() as conn:
        if "api_keys" in tables:
            cols = {c["name"] for c in inspector.get_columns("api_keys")}
            if "user_id" not in cols:
                conn.execute(text("DROP TABLE IF EXISTS api_keys CASCADE"))
        if "collections" in tables:
            cols = {c["name"] for c in inspector.get_columns("collections")}
            if "owner_id" not in cols:
                conn.execute(text("ALTER TABLE collections ADD COLUMN IF NOT EXISTS owner_id INTEGER"))

    Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(_: FastAPI):
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    Path(settings.data_dir).mkdir(parents=True, exist_ok=True)
    _ensure_schema()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "FitandSleek Vector — custom Qdrant-compatible vector database. "
        "Create an account to receive an API key. Send header `api-key: <key>` like Qdrant Cloud."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system.router)
app.include_router(auth.router)
app.include_router(collections.router)
app.include_router(points.router)
app.include_router(snapshots.router)
app.include_router(media.router)

uploads = Path(settings.upload_dir)
uploads.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads)), name="uploads")
