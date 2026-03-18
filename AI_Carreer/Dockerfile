# Backend Dockerfile - AI Career Guidance Platform (Python/FastAPI)
FROM python:3.11-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create chroma_db directory with proper permissions
RUN mkdir -p ./chroma_db && chmod 755 ./chroma_db

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/docs')" || exit 1

# Entrypoint script inline - check and build ChromaDB then start API
CMD ["sh", "-c", "if [ ! -d \"$CHROMA_DB_PATH\" ] || [ -z \"$(ls -A $CHROMA_DB_PATH 2>/dev/null)\" ]; then echo 'Building ChromaDB...' && python embed.py; else echo 'ChromaDB exists, skipping embed.'; fi && echo 'Starting FastAPI...' && python run_api.py"]
