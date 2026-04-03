"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  loading: boolean;
}

const LOADING_MESSAGES = [
  "Analyzing your preference points...",
  "Checking non-resident quotas...",
  "Calculating draw odds by state...",
  "Building your year-by-year roadmap...",
  "Flagging upcoming deadlines...",
  "Identifying OTC opportunities...",
  "Sizing up your budget against fees...",
  "Finalizing your strategy...",
];

function renderMarkdown(raw: string): string {
  let html = raw;

  // Escape HTML (basic)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');

  // Bold / italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');

  // Lists — collect consecutive list items into <ul>
  // First pass: convert "- item" lines to <li>
  html = html.replace(/^[ \t]*[-*] (.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> runs in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)(\n<li>[\s\S]*?<\/li>)*/g, m => `<ul>${m}</ul>`);

  // Paragraphs — wrap non-tagged blocks
  const lines = html.split('\n');
  const result: string[] = [];
  let inPara = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inPara) { result.push('</p>'); inPara = false; }
      continue;
    }
    const isBlock = /^<(h[1-6]|ul|ol|li|hr|p|div|blockquote)/.test(trimmed);
    if (isBlock) {
      if (inPara) { result.push('</p>'); inPara = false; }
      result.push(trimmed);
    } else {
      if (!inPara) { result.push('<p>'); inPara = true; }
      result.push(trimmed);
    }
  }
  if (inPara) result.push('</p>');

  return result.join('\n');
}

export default function StrategyOutput({ text, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [msgIndex, setMsgIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cycle loading messages
  useEffect(() => {
    if (loading && !text) {
      intervalRef.current = setInterval(() => {
        setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length);
      }, 2200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setMsgIndex(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [loading, text]);

  // Auto-scroll while streaming
  useEffect(() => {
    if (loading && text) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [text, loading]);

  if (!text && !loading) return null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}
    >
      {/* Loading state — no text yet */}
      {loading && !text && (
        <div className="flex flex-col items-center justify-center py-16 px-8 gap-5">
          <div className="relative w-12 h-12">
            <div
              className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#f59e0b", borderTopColor: "transparent" }}
            />
            <div className="absolute inset-2 flex items-center justify-center text-lg">🎯</div>
          </div>
          <div className="text-center">
            <p className="font-semibold mb-1" style={{ color: "#e8f0e8" }}>Building your hunt plan</p>
            <p
              className="text-sm transition-all duration-500"
              style={{ color: "#8a9e8a", minHeight: "1.25rem" }}
            >
              {LOADING_MESSAGES[msgIndex]}
            </p>
          </div>
          <div className="w-48 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2a3a2a" }}>
            <div
              className="h-full rounded-full animate-pulse"
              style={{ backgroundColor: "#f59e0b", width: "60%" }}
            />
          </div>
        </div>
      )}

      {/* Strategy content */}
      {text && (
        <div className="p-6 sm:p-8">
          <div
            className="strategy-output"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
          />

          {/* Streaming cursor */}
          {loading && (
            <span
              className="inline-block w-2 h-4 ml-1 align-middle animate-pulse"
              style={{ backgroundColor: "#f59e0b" }}
            />
          )}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
