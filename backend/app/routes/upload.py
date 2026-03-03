from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.concurrency import run_in_threadpool
from app.services.pdf_service import extract_text_from_pdf
from app.services.rag_service import chunk_text
from app.services.embedding_service import generate_embeddings
from app.services.vector_service import upsert_vectors
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), session_id: str = ""):

    # ── 1. Validate file type ────────────────────────────────────────────
    if file.content_type not in ("application/pdf", "application/octet-stream") \
            and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # ── 2. Extract text ──────────────────────────────────────────────────
    try:
        text = await run_in_threadpool(extract_text_from_pdf, file.file)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to read PDF: {str(e)}")

    if not text or not text.strip():
        raise HTTPException(
            status_code=422,
            detail="No readable text found in this PDF (it may be scanned/image-only)."
        )

    # ── 3. Chunk ─────────────────────────────────────────────────────────
    chunks = chunk_text(text)
    if not chunks:
        raise HTTPException(status_code=422, detail="Could not split PDF into chunks.")

    # ── 4. Embed + upsert ────────────────────────────────────────────────
    vectors = []
    try:
        for chunk in chunks:
            embedding = await run_in_threadpool(generate_embeddings, chunk)
            vectors.append({
                "id": str(uuid.uuid4()),
                "values": embedding,
                "metadata": {"text": chunk}
            })

        await run_in_threadpool(upsert_vectors, vectors, session_id)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector storage error: {str(e)}")

    return {
        "message": "PDF processed successfully",
        "chunks": len(chunks)
    }
