from dataclasses import dataclass
from typing import Any, Dict

@dataclass(frozen=True)
class KnowledgeChunk:
    content: str
    metadata: Dict[str, Any]


@dataclass(frozen=True)
class KnowledgeMatch:
    content: str
    metadata: Dict[str, Any]
    score: float
