# 🤖 RAG AI — Full Stack RAG Chatbot

A full-stack Retrieval-Augmented Generation (RAG) chatbot that lets you upload PDF documents and have intelligent conversations about them.
APP LINK: https://full-stack-rag-application.vercel.app/
![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## ✨ Features

- 📄 **PDF Upload & Analysis** — Upload any PDF and the AI reads it instantly
- 💬 **AI-Powered Chat** — Ask questions about your documents in natural language
- 🔍 **Smart Retrieval (RAG)** — Context-aware answers using vector search
- 🔐 **User Authentication** — Sign up / Login with per-user chat history
- 💾 **Chat Persistence** — Your chats are saved and restored when you log back in
- 🎨 **Beautiful UI** — Modern dark theme with Tailwind CSS and glassmorphism design

## 🏗️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, Tailwind CSS               |
| Backend    | FastAPI (Python), Uvicorn         |
| Database   | MongoDB                           |
| Vector DB  | Pinecone                          |
| LLM        | EURI API                          |
| Embeddings | EURI Embeddings API               |

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 16+** & npm
- **MongoDB** running locally (or a cloud URI)
- **API Keys**: EURI API key + Pinecone API key

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/Full_stack_rag.git
cd Full_stack_rag
```

### 2. Set up the Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create your .env file from the template
cp .env.example .env

# Edit .env and add your actual API keys
# EURI_API_KEY=your_key_here
# PINECONE_API_KEY=your_key_here

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Set up the Frontend

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start the frontend server
npm start
```

### 4. Open the app

Visit **http://localhost:3000** in your browser.

1. **Sign up** with your name, email, and password
2. **Upload a PDF** using the + button in the chat
3. **Ask questions** about your document!

## 📁 Project Structure

```
Full_stack_rag/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Environment config
│   │   ├── database.py          # MongoDB connection
│   │   ├── models/
│   │   │   ├── chat_model.py    # Chat data models
│   │   │   └── user_model.py    # User data models
│   │   ├── routes/
│   │   │   ├── auth.py          # Login / Signup APIs
│   │   │   ├── chat.py          # Chat streaming API
│   │   │   ├── upload.py        # PDF upload API
│   │   │   └── user_chats.py    # Per-user chat CRUD
│   │   └── services/
│   │       ├── embedding_service.py
│   │       ├── llm_service.py
│   │       ├── pdf_service.py
│   │       └── vector_service.py
│   ├── requirements.txt
│   ├── .env.example             # Template for env variables
│   └── .env                     # Your actual API keys (git-ignored)
├── frontend/
│   ├── src/
│   │   ├── App.js               # Main app with auth flow
│   │   ├── App.css              # Chat UI styles
│   │   ├── components/
│   │   │   ├── AuthPage.jsx     # Login / Signup page
│   │   │   ├── ChatBox.jsx      # Chat interface
│   │   │   └── ...
│   │   └── services/
│   │       └── api.js           # API client
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🔑 Environment Variables

Create a `backend/.env` file with the following:

| Variable          | Description                    | Where to get it                     |
|-------------------|--------------------------------|-------------------------------------|
| `EURI_API_KEY`    | EURI LLM & Embeddings API key | [euron.one](https://euron.one)      |
| `PINECONE_API_KEY`| Pinecone vector database key   | [pinecone.io](https://pinecone.io)  |
| `PINECONE_ENV`    | Pinecone environment region    | Pinecone dashboard                  |
| `MONGO_URI`       | MongoDB connection string      | Default: `mongodb://localhost:27017`|

## 📝 License

MIT License — feel free to use this project for learning and development.
