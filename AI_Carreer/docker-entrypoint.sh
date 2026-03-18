#!/bin/bash
set -e

echo "======================================"
echo "  Hành Trang Số - Backend Startup"
echo "======================================"

# Check if ChromaDB exists and has data
if [ ! -d "$CHROMA_DB_PATH" ] || [ -z "$(ls -A $CHROMA_DB_PATH 2>/dev/null)" ]; then
    echo "[INFO] ChromaDB not found or empty. Building vector database..."
    echo "[INFO] This may take a few minutes on first run..."
    python embed.py
    echo "[INFO] ChromaDB built successfully!"
else
    echo "[INFO] ChromaDB already exists. Skipping embed step."
fi

echo "[INFO] Starting FastAPI server..."
exec "$@"
