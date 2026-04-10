"use client";
import { useState, useRef, useEffect } from "react";
import AppNav from "@/components/AppNav";
import { ChatMessage } from "@/app/api/chat/route";

const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW = "#F0A040";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

const DISPLAY = "var(--font-display), Georgia, serif";
const MONO = "var(--font-dm-mono), monospace";

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

// Minimal markdown renderer — bold, bullets, inline code
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let buf: string[] = [];
  const flushBuf = (keyBase: string) => {
    if (buf.length === 0) return;
    const joined = buf.join("\n");
    out.push(
      <p key={`${keyBase}-p`} style={{ margin: "0 0 10px 0", whiteSpace: "pre-wrap" }}>
        {renderInline(joined)}
      </p>
    );
    buf = [];
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      flushBuf(`b${i}`);
      out.push(
        <div
          key={`bullet-${i}`}
          style={{
            color: DUST,
            borderLeft: `2px solid ${AMBER}`,
            paddingLeft: 12,
            margin: "6px 0",
            lineHeight: 1.6,
          }}
        >
          {renderInline(bullet[1])}
        </div>
      );
    } else if (line.trim() === "") {
      flushBuf(`e${i}`);
    } else {
      buf.push(line);
    }
  });
  flushBuf("end");
  return out;
}

function renderInline(text: string): React.ReactNode[] {
  // Handle **bold** and `code`
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*)|(`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let idx = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <span key={`b${idx++}`} style={{ fontWeight: 500, color: BONE, fontFamily: MONO }}>
          {token.slice(2, -2)}
        </span>
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`c${idx++}`}
          style={{
            background: SOIL,
            border: `1px solid ${FENCE}`,
            color: AMBER,
            fontFamily: MONO,
            fontSize: "0.92em",
            padding: "1px 6px",
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

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

    // 30-second timeout — abort the fetch if no response by then
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    const FRIENDLY_ERROR =
      "Something went wrong on our end. Please try again in a moment — or refresh the page if the issue persists.";

    let receivedBytes = 0;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("non-2xx");
      if (!res.body) throw new Error("no body");

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
    } catch {
      const interrupted = receivedBytes > 0;
      setMessages(prev => {
        const updated = [...prev];
        if (interrupted && updated.length > 0 && updated[updated.length - 1].role === "assistant") {
          // Append a note to the partial message rather than replacing it
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + "\n\n_Response interrupted — connection changed. Send a message to continue._",
          };
          return updated;
        }
        return [...prev, {
          role: "assistant",
          content: FRIENDLY_ERROR,
        }];
      });
    } finally {
      clearTimeout(timeoutId);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: SOIL,
        color: BONE,
        fontFamily: MONO,
      }}
    >
      <AppNav />

      {/* Page header bar */}
      <div
        style={{
          background: BARK,
          borderBottom: `1px solid ${FENCE}`,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: 26,
              fontWeight: 700,
              color: BONE,
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            AI Hunting Advisor
          </h1>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 13,
              color: DUST,
              margin: "4px 0 0 0",
            }}
          >
            Ask anything about western draws, units, points strategy, or gear
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            style={{
              border: `1px solid ${FENCE}`,
              background: "transparent",
              color: DUST,
              fontFamily: MONO,
              fontSize: 12,
              padding: "8px 16px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderRadius: 0,
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = AMBER;
              e.currentTarget.style.color = AMBER;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = FENCE;
              e.currentTarget.style.color = DUST;
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          background: SOIL,
        }}
      >
        <div
          style={{
            maxWidth: 720,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Empty state */}
          {messages.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                paddingTop: 16,
              }}
            >
              <div style={{ borderLeft: `2px solid ${AMBER}`, paddingLeft: 16 }}>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: AMBER,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    marginBottom: 10,
                  }}
                >
                  Field Desk / Advisor
                </div>
                <h2
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 28,
                    fontWeight: 700,
                    color: BONE,
                    margin: "0 0 10px 0",
                    lineHeight: 1.15,
                  }}
                >
                  Your AI Hunting Advisor
                </h2>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    color: DUST,
                    lineHeight: 1.65,
                    maxWidth: 560,
                    margin: 0,
                  }}
                >
                  Ask anything — draw odds, unit recommendations, point strategy,
                  season dates, gear questions. This advisor knows the West cold.
                </p>
              </div>

              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: DUST,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginTop: 8,
                }}
              >
                Start With
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 10,
                }}
              >
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      background: BARK,
                      border: `1px solid ${FENCE}`,
                      padding: "14px 16px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: MONO,
                      fontSize: 13,
                      color: BONE,
                      lineHeight: 1.55,
                      borderRadius: 0,
                      transition: "border-color 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = AMBER;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = FENCE;
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message thread */}
          {messages.map((msg, i) => {
            if (msg.role === "user") {
              return (
                <div
                  key={i}
                  style={{
                    background: AMBER,
                    color: SOIL,
                    fontFamily: MONO,
                    fontSize: 14,
                    padding: "12px 18px",
                    maxWidth: 480,
                    marginLeft: "auto",
                    borderRadius: 0,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
              );
            }

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  maxWidth: 720,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: AMBER,
                    color: SOIL,
                    fontFamily: MONO,
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    borderRadius: 0,
                    lineHeight: 1,
                    marginTop: 4,
                  }}
                >
                  ◎
                </div>
                <div
                  style={{
                    flex: 1,
                    background: BARK,
                    border: `1px solid ${FENCE}`,
                    color: BONE,
                    fontFamily: MONO,
                    fontSize: 14,
                    padding: "16px 20px",
                    borderRadius: 0,
                    lineHeight: 1.65,
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content ? (
                    renderMarkdown(msg.content)
                  ) : (
                    loading && i === messages.length - 1 && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 14,
                          background: AMBER,
                          verticalAlign: "middle",
                          animation: "blink 1s step-end infinite",
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div
        style={{
          background: BARK,
          borderTop: `1px solid ${FENCE}`,
          padding: "16px 24px",
          flexShrink: 0,
          position: "sticky",
          bottom: 0,
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about draw odds, unit recommendations, point strategy..."
            rows={1}
            style={{
              flex: 1,
              background: SOIL,
              border: `1px solid ${FENCE}`,
              borderRadius: 0,
              color: BONE,
              padding: "0 16px",
              height: 44,
              fontSize: 14,
              fontFamily: MONO,
              outline: "none",
              resize: "none",
              lineHeight: "44px",
              overflow: "hidden",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = AMBER)}
            onBlur={e => (e.currentTarget.style.borderColor = FENCE)}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              background: (!input.trim() || loading) ? FENCE : AMBER,
              color: (!input.trim() || loading) ? DUST : SOIL,
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 13,
              padding: "0 20px",
              height: 44,
              border: "none",
              borderRadius: 0,
              cursor: (!input.trim() || loading) ? "not-allowed" : "pointer",
              flexShrink: 0,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => {
              if (!(!input.trim() || loading)) e.currentTarget.style.background = GLOW;
            }}
            onMouseLeave={e => {
              if (!(!input.trim() || loading)) e.currentTarget.style.background = AMBER;
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 10,
            color: DUST,
            marginTop: 10,
            marginBottom: 0,
            maxWidth: 720,
            marginInline: "auto",
            letterSpacing: "0.02em",
          }}
        >
          AI advisor provides general strategy guidance. Always verify regulations and fees at your state's official wildlife agency.
        </p>
      </div>
    </div>
  );
}
