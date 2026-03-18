"""
embed.py — Hành Trang Số
========================
Script tạo ChromaDB vector database từ file data.json.
Chạy 1 lần trước khi dùng chatbot.py:

    python embed.py

Sau khi chạy xong, thư mục ./chroma_db sẽ được tạo ra
và chatbot.py có thể load lại ngay mà không cần embed lại.
"""

import os
import json
import sys

from dotenv import load_dotenv
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
try:
    from langchain_core.documents import Document
except ImportError:
    from langchain.docstore.document import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

# ─── Cấu hình ────────────────────────────────────────────────
DATA_FILES     = [os.getenv("DATA_FILE", "data.json"), "data_2.json"]
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
# Đổi sang model đa ngôn ngữ — hỗ trợ tiếng Việt tốt hơn
EMBED_MODEL    = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
CHUNK_SIZE     = 800   # Tăng để giữ đủ context mỗi bản ghi
CHUNK_OVERLAP  = 100


def load_data(filepaths: list[str]) -> list[Document]:
    """Đọc các file JSON và trả về danh sách LangChain Document."""
    documents = []
    
    # Chuẩn hóa filepaths thành list nếu chưa phải
    if isinstance(filepaths, str):
        filepaths = [filepaths]
        
    for filepath in filepaths:
        print(f"[1/4] Đang đọc dữ liệu từ '{filepath}' ...")

        if not os.path.exists(filepath):
            print(f"[CẢNH BÁO] Không tìm thấy file '{filepath}'. Bỏ qua.")
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            try:
                raw = json.load(f)
            except json.JSONDecodeError as e:
                print(f"[LỖI] File '{filepath}' bị lỗi cú pháp: {e}")
                continue

        if not raw:
            print(f"[CẢNH BÁO] File '{filepath}' trống.")
            continue

        count_file = 0
        for record in raw:
            content = record.get("content", "").strip()
            # Bỏ qua content rỗng
            if not content:
                continue
                
            documents.append(
                Document(
                    page_content=content,
                    metadata={
                        "id":   record.get("id",   "unknown"),
                        "type": record.get("type", "unknown"),
                        "source": filepath
                    }
                )
            )
            count_file += 1
        print(f"       → Tải xong {count_file} bản ghi từ '{filepath}'.")

    if not documents:
        print("[LỖI] Không có dữ liệu nào được tải. Dừng chương trình.")
        # sys.exit(1) # Không exit ở đây để debug
    
    return documents


def chunk_documents(documents: list[Document]) -> list[Document]:
    """Chia nhỏ các Document thành các chunk nhỏ hơn."""
    print(f"[2/4] Đang chunk dữ liệu (size={CHUNK_SIZE}, overlap={CHUNK_OVERLAP}) ...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ".", "。", " "],
    )
    chunks = splitter.split_documents(documents)
    print(f"       → Tạo được {len(chunks)} chunks.")
    return chunks


def build_embeddings() -> HuggingFaceEmbeddings:
    """Tải embedding model về máy (chạy local, không cần API key)."""
    print(f"[3/4] Đang tải embedding model '{EMBED_MODEL}' ...")
    print("       (Lần đầu sẽ tải model ~90MB từ HuggingFace, xin chờ...)")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBED_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )
    print("       → Model đã sẵn sàng.")
    return embeddings


def save_to_chromadb(chunks: list[Document], embeddings: HuggingFaceEmbeddings) -> None:
    """Embed và lưu toàn bộ chunks vào ChromaDB persistent."""
    print(f"[4/4] Đang embed và lưu vào ChromaDB tại '{CHROMA_DB_PATH}' ...")

    # Create directory if it doesn't exist
    os.makedirs(CHROMA_DB_PATH, exist_ok=True)
    
    # Try to delete old DB if exists (skip if mounted volume)
    if os.path.exists(CHROMA_DB_PATH):
        import shutil
        try:
            shutil.rmtree(CHROMA_DB_PATH)
            print(f"       → Đã xóa ChromaDB cũ.")
        except (PermissionError, OSError) as e:
            # Skip deletion if volume is mounted (Docker case)
            print(f"       → Skipping deletion (mounted volume): {e}")
            pass
    
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DB_PATH,
        collection_name="hanh_trang_so",
    )

    count = vectorstore._collection.count()
    print(f"       → Đã lưu {count} vectors vào ChromaDB.")


def verify_db(embeddings: HuggingFaceEmbeddings) -> None:
    """Kiểm tra nhanh ChromaDB bằng 1 câu query thử."""
    print("\n[Kiểm tra] Đang thực hiện test query ...")
    db = Chroma(
        persist_directory=CHROMA_DB_PATH,
        embedding_function=embeddings,
        collection_name="hanh_trang_so",
    )
    results = db.similarity_search("học phí FPT", k=2)
    if results:
        print(f"           ✓ Query thành công! Tìm thấy {len(results)} kết quả.")
        print(f"           → Preview: \"{results[0].page_content[:100]}...\"")
    else:
        print("           ⚠ Không tìm thấy kết quả. Hãy kiểm tra lại data.json.")


def main():
    print("=" * 55)
    print("   HANH TRANG SO - Tao ChromaDB Vector Database")
    print("=" * 55)
    print()

    # Load file
    documents = load_data(DATA_FILES)
    if not documents:
        print("[LỖI] Không tìm thấy dữ liệu để embed. Kiểm tra data.json và data_2.json.")
        return

    # Pipeline: Chunk → Embed → Save → Verify
    chunks     = chunk_documents(documents)
    embeddings = build_embeddings()
    save_to_chromadb(chunks, embeddings)
    verify_db(embeddings)

    print()
    print("=" * 55)
    print("✅ HOÀN THÀNH! ChromaDB đã sẵn sàng.")
    print(f"   Thư mục: {os.path.abspath(CHROMA_DB_PATH)}")
    print("   Bây giờ hãy chạy:  python chatbot.py")
    print("=" * 55)


if __name__ == "__main__":
    main()
