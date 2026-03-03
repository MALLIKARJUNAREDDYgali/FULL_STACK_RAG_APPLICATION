from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from app.config import MONGO_URI

try:
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'), serverSelectionTimeoutMS=10000)
    # Test the connection with a ping
    client.admin.command('ping')
    db = client["rag_chatbot"]
    chat_collection = db["chat_sessions"]
    users_collection = db["users"]
    user_chats_collection = db["user_chats"]
    # Create unique index on email to prevent duplicates
    users_collection.create_index("email", unique=True)
    # Index for fast user chat lookups
    user_chats_collection.create_index("user_id")
    print("[OK] Connected to MongoDB Atlas successfully")
except Exception as e:
    print(f"[WARN] MongoDB not available ({e}). Chat history will not be saved.")
    # Create a dummy collection that silently ignores all operations
    class DummyCollection:
        def update_one(self, *args, **kwargs): pass
        def find_one(self, *args, **kwargs): return None
        def find(self, *args, **kwargs): return []
        def insert_one(self, *args, **kwargs): return None
        def delete_one(self, *args, **kwargs): pass
        def delete_many(self, *args, **kwargs): pass
    chat_collection = DummyCollection()
    users_collection = DummyCollection()
    user_chats_collection = DummyCollection()
