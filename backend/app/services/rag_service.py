def chunk_text(text, chunk_size=500, overlap=50):
    if not text or not text.strip():
        return []

    chunks = []
    start = 0

    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        next_start = end - overlap
        # Prevent infinite loop: always move forward
        if next_start <= start:
            break
        start = next_start

    return chunks