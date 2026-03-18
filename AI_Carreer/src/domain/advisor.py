from dataclasses import dataclass
from typing import Literal, Sequence

Role = Literal["user", "assistant"]

@dataclass(frozen=True)
class AdvisorMessage:
    role: Role
    content: str

@dataclass(frozen=True)
class AdvisorSession:
    session_id: str
    messages: Sequence[AdvisorMessage]
