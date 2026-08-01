# FitandSleek Vector

Custom **Qdrant-compatible** vector database + full website for FitandSleek image similarity search.

## Stack

- **Frontend:** Next.js (React) — marketing site + console
- **Backend:** Python FastAPI — Qdrant-shaped REST API
- **Database:** PostgreSQL — collections, points, payloads, snapshots
- **pgAdmin:** database UI in Docker

## Features (Qdrant-like)

- Collections CRUD (Cosine / Euclid / Dot)
- Points upsert / get / delete / scroll / count
- Vector search + recommend + payload filters
- Snapshots
- Image embed + image search + image upsert
- Console dashboard + API docs page + Swagger (`/docs`)

## Run everything on Docker Desktop

Make sure **Docker Desktop is running**, then in the project root:

```bash
docker compose up --build -d
```

Seed demo data once:

```bash
docker compose exec api python seed.py
```

### URLs

| Service | URL | Login |
|---|---|---|
| Website | http://localhost:3000 | — |
| Console | http://localhost:3000/console | — |
| API / Swagger | http://localhost:6333/docs | — |
| pgAdmin | http://localhost:5050 | `admin@fitandsleek.com` / `admin123` |
| PostgreSQL | `localhost:5433` | user `fitandsleek` / pass `fitandsleek` / db `fitandsleek_vector` |

### Connect DB inside pgAdmin

Server is preloaded as **FitandSleek Vector DB**.

- Host: `db` (inside Docker network)
- Port: `5432`
- Database: `fitandsleek_vector`
- Username: `fitandsleek`
- Password: `fitandsleek`

### Useful commands

```bash
# View logs
docker compose logs -f

# Stop all
docker compose down

# Stop + delete DB data
docker compose down -v
```

## Local development (without full Docker stack)

### 1) Database only in Docker

```bash
docker compose up -d db pgadmin
```

PostgreSQL host port: **5433**

### 2) Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 6333
python seed.py
```

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project layout

```
backend/              FastAPI vector engine
frontend/             Next.js website + console
docker/pgadmin/       pgAdmin server config
docker-compose.yml    db + pgadmin + api + web
```

Built as an original FitandSleek system inspired by Qdrant — not a hosted Qdrant dependency.
