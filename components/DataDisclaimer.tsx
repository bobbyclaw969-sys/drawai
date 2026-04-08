// Shown anywhere we display state-specific fees, deadlines, or odds
export default function DataDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center", marginTop: 16 }}>
        ⚠️ Fees, odds & deadlines are estimates for 2026. Always verify at your state&apos;s official wildlife agency before applying.
      </p>
    );
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "12px 16px",
      borderRadius: 10,
      background: "var(--warning-bg)",
      border: "1px solid var(--warning-border)",
      marginBottom: 20,
    }}>
      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>⚠️</span>
      <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
        <strong style={{ color: "var(--warning)" }}>Data is estimated for the 2026 season.</strong>{" "}
        Fees, deadlines, and odds change every year. Always confirm the exact deadline and fee at your
        state&apos;s official wildlife agency website before submitting any application.
      </p>
    </div>
  );
}
