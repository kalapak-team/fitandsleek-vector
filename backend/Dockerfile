FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY seed.py .
COPY README.md .

RUN mkdir -p uploads data

# Hugging Face Spaces expects port 7860
ENV PORT=7860
EXPOSE 7860

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
