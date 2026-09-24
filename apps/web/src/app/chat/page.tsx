"use client";
import React, { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import EventCard from "@/components/events/EventCard";
import Link from "next/link";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  events?: any[];
}

const suggestions = [
  "Find music events",
  "Show concerts in New York",
  "What comedy shows are coming up?",
  "Show my upcoming events",
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

  if (!user) return (
    <div className="container" style={{ paddingTop: 60, textAlign: "center" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Sign in to chat with AI</h2>
      <Link href="/login" className="btn btn-primary">Sign In</Link>
    </div>
  );

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.chat.send(text, conversationId);
      setConversationId(res.data.conversationId);
      const events = res.data.toolResults?.result?.events || res.data.toolResults?.result?.rsvps?.map((r: any) => r.eventId) || [];
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.response, events: events.length > 0 ? events : undefined }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 700 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>AI Event Assistant</h1>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", minHeight: 400, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: 24, overflowY: "auto", maxHeight: 500 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Ask me anything about events!</p>
              <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 14 }}>I can search events, check your RSVPs, and help you plan.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {suggestions.map((s) => (
                  <button key={s} className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{
                display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 16px", borderRadius: 12,
                  background: msg.role === "user" ? "var(--accent)" : "var(--bg)",
                  color: msg.role === "user" ? "white" : "var(--text)",
                  fontSize: 14, lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
              {msg.events && msg.events.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginTop: 12, paddingLeft: 8 }}>
                  {msg.events.filter(Boolean).map((e: any) => <EventCard key={e._id} event={e} />)}
                </div>
              )}
            </div>
          ))}
          {loading && <div style={{ color: "var(--text-muted)", fontSize: 14, padding: "8px 16px" }}>Thinking...</div>}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", padding: 16, display: "flex", gap: 8 }}>
          <input
            className="input" placeholder="Ask about events..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !loading) sendMessage(input); }}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
