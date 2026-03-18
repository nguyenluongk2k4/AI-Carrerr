from langchain_google_genai import ChatGoogleGenerativeAI


def build_llm(api_key: str, model: str) -> ChatGoogleGenerativeAI:
    if not api_key:
        raise ValueError("GOOGLE_API_KEY is missing")
    return ChatGoogleGenerativeAI(
        model=model,
        google_api_key=api_key,
        temperature=0.3,
    )
