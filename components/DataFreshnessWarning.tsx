"use client";
import { DATA_YEAR, isDataStale } from "@/lib/huntingData";

export default function DataFreshnessWarning() {
  if (!isDataStale()) return null;

  return (
    <div
      style={{
        padding: "8px 14px",
        marginBottom: 16,
        borderRadius: 8,
        fontSize: 12,
        lineHeight: 1.5,
        color: "var(--warning)",
        background: "var(--warning-bg)",
        border: "1px solid var(--warning-border)",
      }}
    >
      Data last verified for {DATA_YEAR}. Fees, deadlines, and draw odds may
      have changed. Always verify at your state&apos;s official wildlife agency.
    </div>
  );
}
