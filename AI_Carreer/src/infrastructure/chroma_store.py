import os
from typing import Iterable, List

from langchain_community.vectorstores import Chroma

from ..domain.knowledge import KnowledgeChunk, KnowledgeMatch


def load_chroma(persist_dir: str, embeddings) -> Chroma:
    if not os.path.exists(persist_dir) or not os.listdir(persist_dir):
        raise FileNotFoundError(
            f"Chroma DB not found at '{persist_dir}'. Run embed.py first."
        )
    return Chroma(
        persist_directory=persist_dir,
        embedding_function=embeddings,
        collection_name="hanh_trang_so",
    )


def count_vectors(store: Chroma) -> int:
    return store._collection.count()


def similarity_search(store: Chroma, query: str, k: int = 5) -> List[KnowledgeChunk]:
    docs = store.similarity_search(query, k=k)
    return [KnowledgeChunk(content=d.page_content, metadata=d.metadata) for d in docs]


def similarity_search_with_score(
    store: Chroma, query: str, k: int = 5
) -> List[KnowledgeMatch]:
    docs = store.similarity_search_with_score(query, k=k)
    return [
        KnowledgeMatch(content=d.page_content, metadata=d.metadata, score=score)
        for d, score in docs
    ]
