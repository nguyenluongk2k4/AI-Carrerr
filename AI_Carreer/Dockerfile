# Backend Dockerfile - AI Career Guidance Platform (Python/FastAPI)
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt ./

# Force CPU-only PyTorch to avoid pulling CUDA/NVIDIA wheels on servers
RUN pip install --upgrade pip \
    && pip install --index-url https://download.pytorch.org/whl/cpu torch \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create chroma_db directory with proper permissions
RUN mkdir -p ./chroma_db && chmod 755 ./chroma_db

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/docs')" || exit 1

# Check and build ChromaDB then start API
CMD ["sh", "-c", "python embed.py && echo 'Starting FastAPI...' && python run_api.py"]
