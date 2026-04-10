"use client";
import { CSSProperties } from "react";
import { HunterProfile, SpeciesKey, StatePoints } from "@/lib/types";
import { getStatesForSpecies, STATE_NAMES, huntingData } from "@/lib/huntingData";

// ── Design tokens ───────────────────────────────────────────────────────────
const SOIL = "#0F0D0A";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

const MONO = "var(--font-dm-mono), monospace";

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

const sectionLabel: CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  color: DUST,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  marginBottom: 12,
  display: "block",
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

  // Shared button styles
  const backBtnStyle: CSSProperties = {
    background: "transparent",
    border: `1px solid ${FENCE}`,
    color: DUST,
    fontFamily: MONO,
    fontSize: 13,
    padding: "12px 24px",
    height: 48,
    borderRadius: 0,
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  };

  const primaryBtnStyle: CSSProperties = {
    background: AMBER,
    color: SOIL,
    fontFamily: MONO,
    fontWeight: 500,
    fontSize: 14,
    padding: "12px 32px",
    height: 48,
    border: "none",
    borderRadius: 0,
    cursor: "pointer",
    transition: "background 0.15s",
  };

  if (stateIds.length === 0) {
    return (
      <div>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 13,
            color: DUST,
            textAlign: "center",
            padding: "32px 0",
            lineHeight: 1.6,
          }}
        >
          Go back and select at least one species.
        </p>
        <button
          onClick={onBack}
          style={{ ...backBtnStyle, width: "100%" }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = AMBER;
            e.currentTarget.style.color = AMBER;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = FENCE;
            e.currentTarget.style.color = DUST;
          }}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* Intro */}
      <div>
        <label style={sectionLabel}>Preference Points By State</label>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 13,
            color: BONE,
            marginTop: 0,
            marginBottom: 8,
            lineHeight: 1.5,
          }}
        >
          How many preference / bonus points do you have in each state?
        </p>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: DUST,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Not sure? Enter 0 — the plan will include point-building years.
        </p>
      </div>

      {/* State rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 8,
        }}
      >
        {stateIds.map(stateId => {
          const sys = getPointSystem(stateId);
          const pts = points[stateId] ?? 0;
          const hasPoints = pts > 0;
          return (
            <div
              key={stateId}
              style={{
                background: SOIL,
                border: `1px solid ${hasPoints ? AMBER : FENCE}`,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                borderRadius: 0,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 500,
                    fontSize: 14,
                    color: hasPoints ? AMBER : BONE,
                  }}
                >
                  {STATE_NAMES[stateId.toUpperCase()] ?? stateId.toUpperCase()}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: DUST,
                    marginTop: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {sys} pts
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => setPoints(stateId, pts - 1)}
                  aria-label={`Decrease points for ${STATE_NAMES[stateId.toUpperCase()] ?? stateId}`}
                  style={{
                    width: 32,
                    height: 32,
                    background: "transparent",
                    border: `1px solid ${FENCE}`,
                    color: BONE,
                    fontFamily: MONO,
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 0,
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = AMBER)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = FENCE)}
                >
                  −
                </button>
                <span
                  style={{
                    minWidth: 32,
                    textAlign: "center",
                    fontFamily: MONO,
                    fontWeight: 500,
                    fontSize: 16,
                    color: hasPoints ? AMBER : DUST,
                  }}
                >
                  {pts}
                </span>
                <button
                  onClick={() => setPoints(stateId, pts + 1)}
                  aria-label={`Increase points for ${STATE_NAMES[stateId.toUpperCase()] ?? stateId}`}
                  style={{
                    width: 32,
                    height: 32,
                    background: "transparent",
                    border: `1px solid ${FENCE}`,
                    color: BONE,
                    fontFamily: MONO,
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 0,
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = AMBER)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = FENCE)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
        <button
          onClick={onBack}
          style={backBtnStyle}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = AMBER;
            e.currentTarget.style.color = AMBER;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = FENCE;
            e.currentTarget.style.color = DUST;
          }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          style={{ ...primaryBtnStyle, flex: 1 }}
          onMouseEnter={e => (e.currentTarget.style.background = "#F0A040")}
          onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
        >
          Build Strategy
        </button>
      </div>
    </div>
  );
}
