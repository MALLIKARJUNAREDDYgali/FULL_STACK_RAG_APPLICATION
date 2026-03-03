from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.embedding_service import generate_embeddings
from app.services.vector_service import query_vectors
from app.services.llm_service import generate_completion_stream
from app.database import chat_collection
from datetime import datetime
import json

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str
    message: str


@router.post("/chat")
def chat(request: ChatRequest):
    try:
        query_embedding = generate_embeddings(request.message)
        results = query_vectors(query_embedding, request.session_id)
        documents = results["documents"][0] if results["documents"] else []
        context = "\n".join(documents)
    except Exception as e:
        context = ""

    # Build messages with context-aware system prompt
    if context.strip():
        messages = [
            {"role": "system", "content": (
                "You are a helpful AI assistant that answers questions based on the provided document context. "
                "Use the context below to answer the user's question accurately. "
                "If the answer is not in the context, say so honestly."
            )},
            {"role": "user", "content": f"Context from uploaded document:\n{context}\n\nUser question:\n{request.message}"}
        ]
    else:
        messages = [
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": request.message}
        ]

    collected = []

    def stream_generator():
        try:
            for token in generate_completion_stream(messages):
                collected.append(token)
                yield f"data: {json.dumps({'token': token})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'token': f'Error: {str(e)}'})}\n\n"

        # Save full response to MongoDB
        full_response = "".join(collected)
        try:
            chat_collection.update_one(
                {"session_id": request.session_id},
                {
                    "$push": {
                        "messages": {
                            "$each": [
                                {"role": "user", "content": request.message, "timestamp": datetime.utcnow()},
                                {"role": "assistant", "content": full_response, "timestamp": datetime.utcnow()}
                            ]
                        }
                    }
                },
                upsert=True
            )
        except Exception:
            pass

        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )