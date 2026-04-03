export default function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor: i < step ? "#f59e0b" : i === step ? "#f59e0b" : "#2a3a2a",
                color: i <= step ? "#0f1a0f" : "#8a9e8a",
                border: i === step ? "2px solid #d97706" : "none",
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < total - 1 && (
              <div
                className="flex-1 h-0.5 mx-1"
                style={{ backgroundColor: i < step ? "#f59e0b" : "#2a3a2a" }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs" style={{ color: "#8a9e8a" }}>
        <span>Your goals</span>
        <span>Your points</span>
        <span>Your strategy</span>
      </div>
    </div>
  );
}
