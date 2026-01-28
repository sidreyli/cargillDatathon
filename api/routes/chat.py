from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import asyncio
import json

from ..services.calculator_service import calculator_service
from ..services.chat_service import stream_chat_response

router = APIRouter(prefix="/api", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []


@router.post("/chat")
async def chat(req: ChatRequest):
    """SSE streaming chat endpoint."""
    async def generate():
        async for chunk in stream_chat_response(
            req.message,
            req.history,
            calculator_service,
        ):
            # Format as SSE
            data = json.dumps({"content": chunk})
            yield f"data: {data}\n\n"
            await asyncio.sleep(0.01)  # Small delay for streaming effect
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )


@router.post("/chat/sync")
async def chat_sync(req: ChatRequest):
    """Non-streaming chat endpoint (for simpler clients)."""
    chunks = []
    async for chunk in stream_chat_response(
        req.message,
        req.history,
        calculator_service,
    ):
        chunks.append(chunk)
    return {"response": "".join(chunks)}
