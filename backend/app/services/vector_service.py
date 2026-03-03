import chromadb
import os

# Create local persistent DB using the modern PersistentClient API
_chroma_path = os.path.join(os.path.dirname(__file__), "..", "..", "chroma_db")
client = chromadb.PersistentClient(path=os.path.abspath(_chroma_path))

# Collection name
collection = client.get_or_create_collection(name="rag_collection")


def upsert_vectors(vectors, namespace):
    ids = []
    documents = []
    embeddings = []
    metadatas = []

    for v in vectors:
        ids.append(v["id"])
        embeddings.append(v["values"])
        documents.append(v["metadata"]["text"])
        metadatas.append({"namespace": namespace})

    # Use upsert to avoid duplicate ID errors
    collection.upsert(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas
    )


def query_vectors(embedding, namespace):
    # Check if the collection has any documents before querying
    if collection.count() == 0:
        return {"documents": [[]], "metadatas": [[]], "distances": [[]]}

    # Filter by namespace (session_id) so we only get this session's documents
    results = collection.query(
        query_embeddings=[embedding],
        n_results=5,
        where={"namespace": namespace}
    )

    return results