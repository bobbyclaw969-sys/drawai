// Shown above any AI-generated strategy or hunt recommendation output
export default function AiDisclaimer() {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "12px 16px",
      borderRadius: 10,
      background: "var(--info-bg)",
      border: "1px solid var(--info-border)",
      marginBottom: 20,
    }}>
      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>🤖</span>
      <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
        <strong style={{ color: "var(--info)" }}>AI by Anthropic — verify before acting.</strong>{" "}
        Unit numbers, draw odds, fees, and deadlines are based on historical data and may not reflect
        current-year regulations. Always confirm at your state&apos;s official wildlife agency before
        submitting any application or making purchasing decisions.
      </p>
    </div>
  );
}
