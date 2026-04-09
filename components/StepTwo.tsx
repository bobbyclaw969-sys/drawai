"use client";
import { HunterProfile, SpeciesKey, StatePoints } from "@/lib/types";
import { getStatesForSpecies, STATE_NAMES, huntingData } from "@/lib/huntingData";

interface Props {
  profile: Partial<HunterProfile>;
  onChange: (updates: Partial<HunterProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const POINT_SYSTEM_LABELS: Record<string, string> = {
  preference: "Preference",
  bonus: "Bonus",
  weighted: "Weighted",
  lottery: "Lottery",
  otc: "OTC",
  none: "Lottery",
};

export default function StepTwo({ profile, onChange, onNext, onBack }: Props) {
  const species = profile.species ?? [];
  const stateIds = getStatesForSpecies(species as SpeciesKey[]);
  const points: StatePoints = profile.pointsByState ?? {};

  const setPoints = (stateId: string, val: number) => {
    onChange({ pointsByState: { ...points, [stateId]: Math.max(0, Math.min(30, val)) } });
  };

  const getPointSystem = (stateId: string): string => {
    const entry = huntingData.find(
      d => d.stateId === stateId && species.includes(d.species as SpeciesKey)
    );
    return entry ? (POINT_SYSTEM_LABELS[entry.pointSystem] ?? "?") : "?";
  };

  if (stateIds.length === 0) {
    return (
      <div>
        <p style={{ color: "var(--text-3)", textAlign: "center", padding: "32px 0" }}>
          Go back and select at least one species.
        </p>
        <button onClick={onBack} className="btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
          How many preference / bonus points do you have in each state?
        </p>
        <p style={{ fontSize: 13, color: "var(--text-3)" }}>
          Not sure? Enter 0 — the plan will include point-building years.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
        {stateIds.map(stateId => {
          const sys = getPointSystem(stateId);
          const pts = points[stateId] ?? 0;
          const hasPoints = pts > 0;
          return (
            <div
              key={stateId}
              className="card"
              style={{
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                borderColor: hasPoints ? "var(--amber-dim)" : undefined,
                background: hasPoints ? "var(--amber-glow)" : undefined,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: hasPoints ? "var(--amber)" : "var(--text)" }}>
                  {STATE_NAMES[stateId.toUpperCase()] ?? stateId.toUpperCase()}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{sys} pts</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => setPoints(stateId, pts - 1)}
                  aria-label={`Decrease points for ${STATE_NAMES[stateId.toUpperCase()] ?? stateId}`}
                  style={{
                    width: 28, height: 28,
                    borderRadius: 6,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >−</button>
                <span style={{
                  minWidth: 28,
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: 16,
                  color: hasPoints ? "var(--amber)" : "var(--text-3)",
                }}>
                  {pts}
                </span>
                <button
                  onClick={() => setPoints(stateId, pts + 1)}
                  aria-label={`Increase points for ${STATE_NAMES[stateId.toUpperCase()] ?? stateId}`}
                  style={{
                    width: 28, height: 28,
                    borderRadius: 6,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
        <button onClick={onBack} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
          ← Back
        </button>
        <button
          onClick={onNext}
          className="btn-primary"
          style={{ flex: 2, justifyContent: "center", padding: "14px", fontSize: 15 }}
        >
          Build My Strategy →
        </button>
      </div>
    </div>
  );
}
