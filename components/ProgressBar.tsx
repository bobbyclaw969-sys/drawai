export default function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor: i <= step ? "var(--amber)" : "var(--border)",
                color: i <= step ? "var(--text-inv)" : "var(--text-2)",
                border: i === step ? "2px solid var(--amber-dim)" : "none",
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < total - 1 && (
              <div
                className="flex-1 h-0.5 mx-1"
                style={{ backgroundColor: i < step ? "var(--amber)" : "var(--border)" }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs" style={{ color: "var(--text-2)" }}>
        <span>Your goals</span>
        <span>Your points</span>
        <span>Your strategy</span>
      </div>
    </div>
  );
}
