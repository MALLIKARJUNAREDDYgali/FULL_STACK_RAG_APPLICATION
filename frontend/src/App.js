import React, { useEffect, useState, useCallback, useRef } from "react";
import ChatBox from "./components/ChatBox";
import AuthPage from "./components/AuthPage";
import {
  getUserChats,
  saveUserChats,
  deleteUserChat,
  renameUserChat,
} from "./services/api";
import "./App.css";

const quotes = [
  "What can I help with?",
  "Ask me anything about your PDF 📄",
  "Upload a document and explore it 🚀",
  "Turn documents into conversations 💬",
  "Let's discover insights together 🔍",
];

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("session_id");
  };

  // Don't render anything until we've checked auth state
  if (!authChecked) return null;

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // ── Logged-in App ────────────────────────────
  return <MainApp user={user} onLogout={handleLogout} />;
}

function MainApp({ user, onLogout }) {
  const createChat = () => ({
    id: crypto.randomUUID(),
    name: "New Chat",
    messages: [],
    quote: quotes[Math.floor(Math.random() * quotes.length)],
  });

  const [sessionId, setSessionId] = useState("");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  // Ref to track save debounce
  const saveTimerRef = useRef(null);
  const chatsRef = useRef(chats);
  chatsRef.current = chats;

  // ── Load user's chats from MongoDB on mount ──
  useEffect(() => {
    if (!user?.id) return;

    const loadChats = async () => {
      try {
        const res = await getUserChats(user.id);
        const dbChats = res.data.chats;

        if (dbChats && dbChats.length > 0) {
          // Restore chats from DB
          const restored = dbChats.map((c) => ({
            id: c.chat_id,
            name: c.name,
            messages: (c.messages || []).map((m) => ({
              role: m.role,
              text: m.text,
            })),
            quote: quotes[Math.floor(Math.random() * quotes.length)],
          }));
          setChats(restored);
          setActiveChat(restored[0].id);
        } else {
          // New user — start with one empty chat
          const newChat = createChat();
          setChats([newChat]);
          setActiveChat(newChat.id);
        }
      } catch (err) {
        console.error("Failed to load chats:", err);
        // Fallback: start fresh
        const newChat = createChat();
        setChats([newChat]);
        setActiveChat(newChat.id);
      }
      setChatsLoaded(true);
    };

    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── Session ID ──
  useEffect(() => {
    let id = localStorage.getItem("session_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("session_id", id);
    }
    setSessionId(id);
  }, []);

  // ── Auto-set active chat ──
  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0].id);
    }
  }, [chats, activeChat]);

  // ── Debounced save to MongoDB ──
  const saveChatsToDb = useCallback(() => {
    if (!user?.id || !chatsLoaded) return;

    // Clear any pending save
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Debounce — save after 1 second of inactivity
    saveTimerRef.current = setTimeout(async () => {
      try {
        // Only save chats that have messages (don't persist empty chats)
        const chatsToSave = chatsRef.current.filter(
          (c) => c.messages && c.messages.length > 0
        );
        if (chatsToSave.length > 0) {
          await saveUserChats(user.id, chatsToSave);
        }
      } catch (err) {
        console.error("Failed to save chats:", err);
      }
    }, 1000);
  }, [user?.id, chatsLoaded]);

  // ── Save chats whenever they change ──
  useEffect(() => {
    if (chatsLoaded) {
      saveChatsToDb();
    }
  }, [chats, chatsLoaded, saveChatsToDb]);

  // ── Chat operations ──
  const createNewChat = () => {
    const c = createChat();
    setChats((p) => [...p, c]);
    setActiveChat(c.id);
  };

  const deleteChat = async (id) => {
    // Delete from DB first
    try {
      await deleteUserChat(user.id, id);
    } catch (err) {
      console.error("Failed to delete chat from DB:", err);
    }

    const updated = chats.filter((c) => c.id !== id);
    if (updated.length === 0) {
      const nc = createChat();
      setChats([nc]);
      setActiveChat(nc.id);
    } else {
      setChats(updated);
      setActiveChat(updated[0].id);
    }
  };

  const handleRenameChat = async (id) => {
    const name = prompt("Enter new name:");
    if (!name) return;

    // Update locally
    setChats((p) => p.map((c) => (c.id === id ? { ...c, name } : c)));

    // Update in DB
    try {
      await renameUserChat(user.id, id, name);
    } catch (err) {
      console.error("Failed to rename chat:", err);
    }
  };

  const updateMessages = (chatId, updater) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const current = Array.isArray(c.messages) ? c.messages : [];
        const next = typeof updater === "function" ? updater(current) : updater;
        return { ...c, messages: Array.isArray(next) ? next : current };
      })
    );
  };

  const activeChatData = chats.find((c) => c.id === activeChat) || chats[0];

  // Get user initials for avatar
  const initials = user.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  // Show loading state while chats are being fetched
  if (!chatsLoaded) {
    return (
      <div className="app-container">
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8e8ea0",
            fontSize: "16px",
          }}
        >
          Loading your chats...
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <span className="sidebar-logo">🤖 RAG AI</span>
        </div>

        <button className="new-chat-btn" onClick={createNewChat}>
          ✏️&nbsp;&nbsp;New chat
        </button>

        <div className="sidebar-section-label">Your chats</div>

        <div className="chat-history">
          {chats.map((chat, i) => (
            <div
              key={chat.id}
              className={`history-item ${chat.id === activeChat ? "active" : ""}`}
            >
              <span
                className="history-item-name"
                onClick={() => setActiveChat(chat.id)}
              >
                {chat.name || `Chat ${i + 1}`}
              </span>

              <div className="chat-actions">
                <span title="Rename" onClick={() => handleRenameChat(chat.id)}>
                  ✏️
                </span>
                <span title="Delete" onClick={() => deleteChat(chat.id)}>
                  🗑️
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-user" onClick={onLogout} title="Click to logout">
          <div className="user-avatar">{initials}</div>
          <span className="user-name">{user.name}</span>
          <span className="logout-icon">🚪</span>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────── */}
      <main className="chat-area">
        <ChatBox
          sessionId={sessionId}
          messages={activeChatData?.messages || []}
          quote={activeChatData?.quote || quotes[0]}
          setMessages={(updater) => updateMessages(activeChatData?.id, updater)}
        />
      </main>
    </div>
  );
}

export default App;