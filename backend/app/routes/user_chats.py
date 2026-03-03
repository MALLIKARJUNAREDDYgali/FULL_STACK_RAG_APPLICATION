from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.database import user_chats_collection
from datetime import datetime

router = APIRouter(prefix="/user-chats", tags=["User Chats"])


class MessageItem(BaseModel):
    role: str
    text: str


class ChatItem(BaseModel):
    chat_id: str
    name: str
    messages: List[MessageItem] = []


class SaveChatsRequest(BaseModel):
    user_id: str
    chats: List[ChatItem]


class DeleteChatRequest(BaseModel):
    user_id: str
    chat_id: str


class RenameChatRequest(BaseModel):
    user_id: str
    chat_id: str
    name: str


@router.get("/{user_id}")
async def get_user_chats(user_id: str):
    """Get all chats for a specific user."""
    try:
        chats = list(user_chats_collection.find(
            {"user_id": user_id},
            {"_id": 0, "user_id": 0}
        ))
        return {"chats": chats}
    except Exception as e:
        return {"chats": []}


@router.post("/save")
async def save_chat(request: SaveChatsRequest):
    """Save/update all chats for a user (full sync)."""
    try:
        for chat in request.chats:
            user_chats_collection.update_one(
                {"user_id": request.user_id, "chat_id": chat.chat_id},
                {
                    "$set": {
                        "user_id": request.user_id,
                        "chat_id": chat.chat_id,
                        "name": chat.name,
                        "messages": [m.dict() for m in chat.messages],
                        "updated_at": datetime.utcnow().isoformat(),
                    }
                },
                upsert=True
            )
        return {"message": "Chats saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete")
async def delete_chat(request: DeleteChatRequest):
    """Delete a specific chat for a user."""
    try:
        user_chats_collection.delete_one(
            {"user_id": request.user_id, "chat_id": request.chat_id}
        )
        return {"message": "Chat deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/rename")
async def rename_chat(request: RenameChatRequest):
    """Rename a specific chat."""
    try:
        user_chats_collection.update_one(
            {"user_id": request.user_id, "chat_id": request.chat_id},
            {"$set": {"name": request.name, "updated_at": datetime.utcnow().isoformat()}}
        )
        return {"message": "Chat renamed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
