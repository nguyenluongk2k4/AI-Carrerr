from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

SYSTEM_TEMPLATE = """Bạn là chuyên gia tư vấn tuyển sinh của dự án Hành Trang Số.
Quy tắc:
- Chỉ dùng thông tin trong CONTEXT để trả lời.
- Nếu context không đủ, hãy hỏi thêm thông tin từ người dùng.
- Không bịa điểm chuẩn, học phí, hoặc dữ liệu không có trong context.
Văn phong: thân thiện, ngắn gọn, hành động được.

CONTEXT từ cơ sở dữ liệu:
{context}
"""


def build_rag_chain(vectorstore, llm, search_filter: dict | None = None):
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 10,
            **({"filter": search_filter} if search_filter else {}),
        },
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_TEMPLATE),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ])

    def format_docs(docs) -> str:
        return "\n\n---\n".join(d.page_content for d in docs)

    def retrieve_context(inputs: dict) -> dict:
        question = inputs["question"]
        docs = retriever.invoke(question)
        return {
            "context": format_docs(docs),
            "chat_history": inputs.get("chat_history", []),
            "question": question,
        }

    chain = (
        RunnableLambda(retrieve_context)
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain
