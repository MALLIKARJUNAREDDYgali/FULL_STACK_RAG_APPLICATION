import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: API_BASE,
});

export const uploadPDF = (file, sessionId) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post(`/upload?session_id=${sessionId}`, formData);
};

/**
 * Streaming chat — calls onToken for each word/token, onDone when complete.
 */
export const sendMessageStream = async (sessionId, message, onToken, onDone) => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });

  // Check for HTTP errors before trying to read the stream
  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let doneReceived = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.token !== undefined) {
              onToken(parsed.token);
            }
            if (parsed.done) {
              doneReceived = true;
              onDone();
            }
          } catch (_) { }
        }
      }
    }
  } finally {
    // Ensure onDone is always called even if stream breaks mid-way
    if (!doneReceived) {
      onDone();
    }
  }
};

/* ─── Auth APIs ─────────────────────────────────── */

export const signupUser = (name, email, password) => {
  return API.post("/auth/signup", { name, email, password });
};

export const loginUser = (email, password) => {
  return API.post("/auth/login", { email, password });
};

/* ─── User Chats APIs ───────────────────────────── */

export const getUserChats = (userId) => {
  return API.get(`/user-chats/${userId}`);
};

export const saveUserChats = (userId, chats) => {
  return API.post("/user-chats/save", {
    user_id: userId,
    chats: chats.map((c) => ({
      chat_id: c.id,
      name: c.name,
      messages: (c.messages || []).map((m) => ({
        role: m.role,
        text: m.text || "",
      })),
    })),
  });
};

export const deleteUserChat = (userId, chatId) => {
  return API.delete("/user-chats/delete", {
    data: { user_id: userId, chat_id: chatId },
  });
};

export const renameUserChat = (userId, chatId, name) => {
  return API.put("/user-chats/rename", {
    user_id: userId,
    chat_id: chatId,
    name,
  });
};
