"use client";
import { useEffect, useRef } from "react";

interface Props {
  text: string;
  loading: boolean;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '');
}

export default function StrategyOutput({ text, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [text, loading]);

  if (!text && !loading) return null;

  return (
    <div
      className="rounded-xl p-6 sm:p-8"
      style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}
    >
      {loading && !text && (
        <div className="flex items-center gap-3 py-8 justify-center">
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#f59e0b", borderTopColor: "transparent" }}
          />
          <span style={{ color: "#8a9e8a" }}>Building your hunt plan...</span>
        </div>
      )}

      {text && (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
        />
      )}

      {loading && text && (
        <span
          className="inline-block w-2 h-4 ml-1 animate-pulse"
          style={{ backgroundColor: "#f59e0b" }}
        />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
