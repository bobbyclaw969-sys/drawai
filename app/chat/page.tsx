"use client";
import { useState, useRef, useEffect } from "react";
import AppNav from "@/components/AppNav";
import { ChatMessage } from "@/app/api/chat/route";

const SUGGESTIONS = [
  "What's the best elk unit in Wyoming with 8 preference points?",
  "Should I burn my 12 Colorado deer points this year or keep building?",
  "Compare Wyoming vs Montana for first-time non-resident elk hunters",
  "What's the easiest western state to draw a bull elk tag with 0 points?",
  "Walk me through Arizona's bonus point system for elk",
  "What OTC elk hunts can I do this fall for under $800 in fees?",
  "I have $1,500/yr — how do I build the best multi-state portfolio?",
  "How long realistically to draw a Utah deer tag as a non-resident?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Restore from localStorage
    try {
      const saved = localStorage.getItem("taghunter_chat");
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    try {
      if (messages.length > 0) {
        localStorage.setItem("taghunter_chat", JSON.stringify(messages.slice(-40)));
      }
    } catch {}
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: ChatMessage = { role: "user", content };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    // Load profile context from tracker if available
    let context: { species?: string[]; states?: string[] } = {};
    try {
      const tracker = localStorage.getItem("taghunter_tracker");
      if (tracker) {
        const data = JSON.parse(tracker);
        const apps = data.applications ?? [];
        context = {
          species: [...new Set(apps.map((a: { species: string }) => a.species))] as string[],
          states: [...new Set(apps.map((a: { stateId: string }) => a.stateId))] as string[],
        };
      }
    } catch {}

    let receivedBytes = 0;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context }),
      });
      if (!res.ok) throw new Error(await res.text());
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";
      const aiMsg: ChatMessage = { role: "assistant", content: "" };
      setMessages(prev => [...prev, aiMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedBytes += value?.length ?? 0;
        aiText += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: aiText };
          return updated;
        });
      }
    } catch (e) {
      const interrupted = receivedBytes > 0;
      setMessages(prev => {
        const updated = [...prev];
        if (interrupted && updated.length > 0 && updated[updated.length - 1].role === "assistant") {
          // Append a note to the partial message rather than replacing it
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + "\n\n_⚠️ Response interrupted — connection changed. Send a message to continue._",
          };
          return updated;
        }
        return [...prev, {
          role: "assistant",
          content: `Sorry, something went wrong: ${e instanceof Error ? e.message : "Unknown error"}. Please try again.`,
        }];
      });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("taghunter_chat");
  };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppNav />

      {/* Chat header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: "1rem", fontWeight: 800 }}>AI Hunting Advisor</h1>
          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
            Ask anything about western draws, units, points strategy, or gear
          </p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="btn-ghost" style={{ fontSize: 12 }}>
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 800, width: "100%", margin: "0 auto" }}>

        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎯</div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Your AI Hunting Advisor</h2>
              <p style={{ fontSize: 13, color: "var(--text-2)", maxWidth: 420, margin: "0 auto", lineHeight: 1.65 }}>
                Ask anything — draw odds, unit recommendations, point strategy, season dates,
                gear questions. This advisor knows the West cold.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="card card-hover"
                  style={{ padding: "12px 14px", textAlign: "left", cursor: "pointer", fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 10,
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "var(--amber-glow)", border: "1px solid rgba(232,150,15,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, flexShrink: 0, marginTop: 4,
              }}>
                🎯
              </div>
            )}

            <div
              style={{
                maxWidth: "80%",
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "var(--amber)" : "var(--card)",
                border: msg.role === "user" ? "none" : "1px solid var(--border)",
                color: msg.role === "user" ? "var(--text-inv)" : "var(--text)",
                fontSize: 14,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
              {loading && i === messages.length - 1 && msg.role === "assistant" && !msg.content && (
                <span style={{ display: "inline-block", width: 2, height: "1em", background: "var(--amber)", marginLeft: 2, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "12px 16px",
        background: "var(--bg-elevated)",
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about draw odds, unit recommendations, point strategy..."
            rows={1}
            style={{
              flex: 1,
              background: "var(--card)",
              border: "1px solid var(--border-2)",
              borderRadius: 12,
              color: "var(--text)",
              padding: "10px 14px",
              fontSize: 14,
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              lineHeight: 1.5,
              maxHeight: 120,
              overflow: "auto",
            }}
            onInput={e => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
            }}
            onFocus={e => e.currentTarget.style.borderColor = "var(--amber)"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border-2)"}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="btn-primary"
            style={{ padding: "10px 16px", fontSize: 14, flexShrink: 0, opacity: (!input.trim() || loading) ? 0.45 : 1 }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 10, color: "var(--text-3)", marginTop: 8, maxWidth: 800, marginInline: "auto" }}>
          AI advisor provides general strategy guidance. Always verify regulations and fees at your state's official wildlife agency.
        </p>
      </div>
    </div>
  );
}
