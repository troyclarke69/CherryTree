# Cherry Tree API (FastAPI). Used by docker-compose.yml and by `fly deploy` from this folder.
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /srv

# Dependencies first, so code changes don't reinstall them
COPY requirements.txt .
RUN pip install -r requirements.txt

# Only the app package is copied, so a local .env never ends up in the image.
# Settings come from environment variables (env_file in docker-compose.yml, secrets on Fly).
COPY app ./app

RUN useradd --create-home --uid 1000 appuser
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
