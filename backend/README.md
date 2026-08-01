---
title: FitandSleek Vector
emoji: 🏃
colorFrom: green
colorTo: gray
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# FitandSleek Vector API

Qdrant-compatible vector database backend for FitandSleek image similarity search.

## Endpoints

- Docs: `/docs`
- Health: `/healthz`
- Auth: `/auth/register`, `/auth/login`
- Collections / points / search (Qdrant-style)

## Required secrets (Space Settings → Variables and secrets)

Add these as **Secrets** (not public variables):

| Name | Example |
|---|---|
| `DATABASE_URL` | `postgresql://USER:PASSWORD@ep-xxxx.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | long random string |
| `CORS_ORIGINS` | `https://your-app.vercel.app,http://localhost:3000` |
| `AUTH_REQUIRED` | `true` |

Copy the connection string from Neon dashboard. You can paste the Neon URL as-is; the app converts it for SQLAlchemy.

After saving secrets, click **Factory reboot** on the Space.

## API key usage

```http
api-key: fsv_xxxxxxxx
```
