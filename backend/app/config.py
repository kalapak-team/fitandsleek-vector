from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "FitandSleek Vector"
    app_version: str = "1.0.0"
    api_prefix: str = ""
    database_url: str = "postgresql+psycopg2://fitandsleek:fitandsleek@localhost:5433/fitandsleek_vector"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    upload_dir: str = "uploads"
    data_dir: str = "data"
    default_vector_size: int = 512
    max_upload_mb: int = 10
    jwt_secret: str = "fitandsleek-vector-dev-secret-change-me"
    jwt_expire_hours: int = 72
    auth_required: bool = True

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
