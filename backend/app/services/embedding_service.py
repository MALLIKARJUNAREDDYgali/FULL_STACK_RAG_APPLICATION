import requests
from app.config import EURI_API_KEY

def generate_embeddings(text):
    url = "https://api.euron.one/api/v1/euri/embeddings"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {EURI_API_KEY}"
    }

    payload = {
        "input": text,
        "model": "text-embedding-3-small"
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()

    if "data" not in data or not data["data"]:
        raise RuntimeError(f"Embedding API error: {data.get('error', data)}")

    return data['data'][0]['embedding']