import React, { useState, useRef, useEffect } from "react";
import { sendMessageStream, uploadPDF } from "../services/api";

function ChatBox({ sessionId, messages = [], quote, setMessages }) {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userText = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    // Add empty assistant message (will stream into it)
    setMessages((prev) => [...prev, { role: "assistant", text: "", streaming: true }]);
    setIsStreaming(true);

    try {
      await sendMessageStream(
        sessionId,
        userText,
        // onToken — append each token to the last message
        (token) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                text: last.text + token,
              };
            }
            return updated;
          });
        },
        // onDone — remove streaming flag
        () => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = { ...last, streaming: false };
            }
            return updated;
          });
          setIsStreaming(false);
        }
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            text: "⚠️ Something went wrong. Please try again.",
            streaming: false,
          };
        }
        return updated;
      });
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShowUpload(false);

    // Show uploading indicator
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `📄 Uploaded: ${file.name}` },
    ]);

    // Show processing message while upload is in progress
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: "⏳ Processing your PDF... This may take a moment.", streaming: true },
    ]);

    try {
      await uploadPDF(file, sessionId);
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            text: "❌ Upload failed. Please try again.",
            streaming: false,
          };
        }
        return updated;
      });
      e.target.value = "";
      return;
    }

    // Clear the processing message and stream the AI greeting into it
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && last.role === "assistant") {
        updated[updated.length - 1] = { ...last, text: "", streaming: true };
      }
      return updated;
    });
    setIsStreaming(true);

    // Hidden trigger prompt — not shown as user message, just to get AI confirmation
    const triggerPrompt = `The user just uploaded a PDF file named "${file.name}". 
Greet the user warmly and let them know you have completely read the entire document. 
Tell them they can ask you anything about it. Keep it friendly, confident, and brief (2-3 sentences).`;

    try {
      await sendMessageStream(
        sessionId,
        triggerPrompt,
        // onToken — stream each word into last assistant message
        (token) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                text: last.text + token,
              };
            }
            return updated;
          });
        },
        // onDone — stop streaming
        () => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = { ...last, streaming: false };
            }
            return updated;
          });
          setIsStreaming(false);
        }
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            text: `✅ I've read the entire **${file.name}**! Feel free to ask me anything about it.`,
            streaming: false,
          };
        }
        return updated;
      });
      setIsStreaming(false);
    }

    e.target.value = "";
  };

  return (
    <div className="chat-wrapper">
      {/* ── Messages ─────────────────────────── */}
      <div className="messages">
        {messages.length === 0 && (
          <div className="quote-center">
            <h1>{quote}</h1>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`message-row ${msg.role}`}>
            <div className="message-inner">
              {msg.role === "user" ? (
                <div className="user-bubble">{msg.text}</div>
              ) : (
                <>
                  <div className="assistant-icon">🤖</div>
                  <div className="assistant-text">
                    {msg.text}
                    {msg.streaming && <span className="typing-cursor" />}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Upload popup ──────────────────────── */}
      {showUpload && (
        <div className="upload-popup">
          <label onClick={() => fileInputRef.current?.click()}>
            📄 Upload PDF document
          </label>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="file-input"
        onChange={handleFileChange}
      />

      {/* ── Input Area ────────────────────────── */}
      <div className="input-area">
        <div className="input-box">
          <button
            className="plus-btn"
            title="Attach file"
            onClick={() => setShowUpload((p) => !p)}
          >
            +
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask anything..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />

          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            title="Send"
          >
            ↑
          </button>
        </div>
        <p className="input-hint">
          RAG AI can make mistakes. Double-check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatBox;