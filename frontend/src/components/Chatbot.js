import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { FaComments, FaTimes } from "react-icons/fa";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I am InnovateHub Assistant. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");

    setMessages(prev => [...prev, { from: "user", text: input }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`   // 🔥 IMPORTANT
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { from: "bot", text: data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "⚠️ Server error. Try again." }
      ]);
    }
  };

  return (
    <>
      <div className="chatbot-icon" onClick={() => setOpen(!open)}>
        {open ? <FaTimes /> : <FaComments />}
      </div>

      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            InnovateHub Assistant 🤖
            <FaTimes onClick={() => setOpen(false)} />
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              placeholder="Ask about Research, SIH, MSME, Grants..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
