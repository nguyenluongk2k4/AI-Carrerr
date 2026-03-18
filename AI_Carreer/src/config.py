import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class AppConfig:
    google_api_key: str
    gemini_model: str
    chroma_db_path: str
    embed_model: str


def get_config() -> AppConfig:
    return AppConfig(
        google_api_key=os.getenv("GOOGLE_API_KEY", ""),
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        chroma_db_path=os.getenv("CHROMA_DB_PATH", "./chroma_db"),
        embed_model=os.getenv(
            "EMBED_MODEL",
            "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
        ),
    )
