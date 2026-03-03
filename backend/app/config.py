import os
from dotenv import load_dotenv

load_dotenv()

EURI_API_KEY = os.getenv("EURI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")
MONGO_URI = os.getenv("MONGO_URI")