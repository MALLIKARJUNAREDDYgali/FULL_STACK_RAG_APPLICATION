import requests
import json
from app.config import EURI_API_KEY

def generate_completion_stream(messages):
    """Generator that yields text chunks from EURI streaming API."""
    url = "https://api.euron.one/api/v1/euri/chat/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {EURI_API_KEY}"
    }

    payload = {
        "messages": messages,
        "model": "gpt-4.1-nano",
        "max_tokens": 1000,
        "temperature": 0.7,
        "stream": True
    }

    response = requests.post(url, headers=headers, json=payload, stream=True)

    for line in response.iter_lines():
        if line:
            decoded = line.decode("utf-8")
            if decoded.startswith("data: "):
                data_str = decoded[6:]
                if data_str.strip() == "[DONE]":
                    return
                try:
                    chunk = json.loads(data_str)
                    delta = chunk["choices"][0].get("delta", {})
                    content = delta.get("content", "")
                    if content:
                        yield content
                except Exception:
                    pass


def generate_completion(messages):
    """Non-streaming fallback."""
    url = "https://api.euron.one/api/v1/euri/chat/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {EURI_API_KEY}"
    }

    payload = {
        "messages": messages,
        "model": "gpt-4.1-nano",
        "max_tokens": 1000,
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    return data["choices"][0]["message"]["content"]