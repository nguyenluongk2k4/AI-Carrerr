import asyncio
from typing import List

from langchain_core.messages import HumanMessage, AIMessage

from ..domain.advisor import AdvisorMessage


def _to_lc_messages(messages: List[AdvisorMessage]):
    lc = []
    for m in messages:
        if m.role == "user":
            lc.append(HumanMessage(content=m.content))
        else:
            lc.append(AIMessage(content=m.content))
    return lc


async def ask_advisor(chain, question: str, messages: List[AdvisorMessage]) -> str:
    payload = {
        "question": question,
        "chat_history": _to_lc_messages(messages),
    }
    return await asyncio.to_thread(chain.invoke, payload)
