import React from "react";

function MessageBubble({ role, text }) {
  return (
    <div className={`message ${role}`}>
      <div className="avatar">
        {role === "user" ? "🧑" : "🤖"}
      </div>
      <div className="text">{text}</div>
    </div>
  );
}

export default MessageBubble;