from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_database_url(url: str) -> str:
    """Accept Neon/postgres URLs and make them SQLAlchemy + psycopg2 friendly."""
    value = (url or "").strip().strip('"').strip("'")
    if value.startswith("postgres://"):
        value = "postgresql://" + value[len("postgres://") :]
    if value.startswith("postgresql://") and "+psycopg2" not in value:
        value = "postgresql+psycopg2://" + value[len("postgresql://") :]
    # Neon often appends channel_binding=require — psycopg2 can reject it.
    value = value.replace("&channel_binding=require", "").replace("?channel_binding=require&", "?").replace("?channel_binding=require", "")
    if "sslmode=" not in value and ("neon.tech" in value or "neon." in value):
        sep = "&" if "?" in value else "?"
        value = f"{value}{sep}sslmode=require"
    return value


class Settings(BaseSettings):
    app_name: str = "FitandSleek Vector"
    app_version: str = "1.0.0"
    api_prefix: str = ""
    # Override with Space secret DATABASE_URL (Neon). Do not rely on localhost in production.
    database_url: str = "postgresql+psycopg2://fitandsleek:fitandsleek@localhost:5433/fitandsleek_vector"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    upload_dir: str = "uploads"
    data_dir: str = "data"
    default_vector_size: int = 512
    max_upload_mb: int = 10
    jwt_secret: str = "fitandsleek-vector-dev-secret-change-me"
    jwt_expire_hours: int = 72
    auth_required: bool = True

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @field_validator("database_url", mode="before")
    @classmethod
    def _normalize_db(cls, value: object) -> object:
        if isinstance(value, str):
            return normalize_database_url(value)
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_local_database(self) -> bool:
        return "localhost" in self.database_url or "127.0.0.1" in self.database_url


@lru_cache
def get_settings() -> Settings:
    return Settings()
