from pinecone import Pinecone
from app.config import PINECONE_API_KEY

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Connect to the cloud index
index = pc.Index("rag-vectors")

print("[OK] Connected to Pinecone cloud successfully")


def upsert_vectors(vectors, namespace):
    """Upsert document vectors into Pinecone cloud index."""
    pinecone_vectors = []
    for v in vectors:
        pinecone_vectors.append({
            "id": v["id"],
            "values": v["values"],
            "metadata": {
                "text": v["metadata"]["text"],
                "namespace": namespace,
            }
        })

    # Upsert in batches of 100
    batch_size = 100
    for i in range(0, len(pinecone_vectors), batch_size):
        batch = pinecone_vectors[i:i + batch_size]
        index.upsert(vectors=batch, namespace=namespace)


def query_vectors(embedding, namespace):
    """Query vectors from Pinecone cloud by namespace."""
    try:
        results = index.query(
            vector=embedding,
            top_k=5,
            namespace=namespace,
            include_metadata=True,
        )

        # Convert Pinecone response to match the format used by the chat route
        documents = []
        metadatas = []
        for match in results.get("matches", []):
            metadata = match.get("metadata", {})
            documents.append(metadata.get("text", ""))
            metadatas.append(metadata)

        return {
            "documents": [documents],
            "metadatas": [metadatas],
        }
    except Exception as e:
        print(f"[WARN] Pinecone query error: {e}")
        return {"documents": [[]], "metadatas": [[]]}