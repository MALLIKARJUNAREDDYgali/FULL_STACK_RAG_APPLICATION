import sys, traceback
sys.path.insert(0, '.')

pdf_path = r'C:\Users\malli\OneDrive\Desktop\Gali Mallikarjuna Reddy_Resume.pdf'

print("=== Step 1: PDF extraction ===")
try:
    from app.services.pdf_service import extract_text_from_pdf
    with open(pdf_path, 'rb') as f:
        text = extract_text_from_pdf(f)
    print(f"Text length: {len(text)} chars")
    print(f"Preview: {repr(text[:200])}")
except Exception:
    traceback.print_exc()
    sys.exit(1)

print("\n=== Step 2: Chunking ===")
try:
    from app.services.rag_service import chunk_text
    chunks = chunk_text(text)
    print(f"Number of chunks: {len(chunks)}")
except Exception:
    traceback.print_exc()
    sys.exit(1)

print("\n=== Step 3: Embedding (first chunk only) ===")
try:
    from app.services.embedding_service import generate_embeddings
    emb = generate_embeddings(chunks[0])
    print(f"Embedding length: {len(emb)}")
except Exception:
    traceback.print_exc()
    sys.exit(1)

print("\n=== Step 4: Upsert to ChromaDB ===")
try:
    from app.services.vector_service import upsert_vectors
    import uuid
    vectors = [{'id': str(uuid.uuid4()), 'values': emb, 'metadata': {'text': chunks[0]}}]
    upsert_vectors(vectors, namespace='test123')
    print("Upsert OK!")
except Exception:
    traceback.print_exc()
    sys.exit(1)

print("\n=== ALL STEPS PASSED ===")
