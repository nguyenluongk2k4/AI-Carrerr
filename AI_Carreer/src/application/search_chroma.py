import asyncio
from typing import List

from ..domain.knowledge import KnowledgeChunk, KnowledgeMatch


async def search_knowledge(store, query: str, k: int = 5) -> List[KnowledgeChunk]:
    from ..infrastructure.chroma_store import similarity_search

    return await asyncio.to_thread(similarity_search, store, query, k)


async def search_knowledge_with_scores(
    store, query: str, k: int = 5
) -> List[KnowledgeMatch]:
    from ..infrastructure.chroma_store import similarity_search_with_score

    return await asyncio.to_thread(similarity_search_with_score, store, query, k)


async def count_knowledge(store) -> int:
    from ..infrastructure.chroma_store import count_vectors

    return await asyncio.to_thread(count_vectors, store)
