from pypdf import PdfReader

def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        # extract_text() can return None for image-only/scanned pages
        text += page.extract_text() or ""
    return text