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
  preference: "Pref",
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

  // Get the point system type for display
  const getPointSystem = (stateId: string): string => {
    const entry = huntingData.find(
      d => d.stateId === stateId && species.includes(d.species as SpeciesKey)
    );
    return entry ? POINT_SYSTEM_LABELS[entry.pointSystem] ?? "?" : "?";
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-base font-medium mb-1">How many preference / bonus points do you have in each state?</p>
        <p className="text-sm" style={{ color: "#8a9e8a" }}>
          Not sure? Enter 0 — we&apos;ll include point-building in your plan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stateIds.map(stateId => {
          const sys = getPointSystem(stateId);
          const pts = points[stateId] ?? 0;
          return (
            <div
              key={stateId}
              className="flex items-center justify-between px-4 py-3 rounded-lg"
              style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {STATE_NAMES[stateId.toUpperCase()] ?? stateId.toUpperCase()}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#8a9e8a" }}>
                  {sys} points
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={() => setPoints(stateId, pts - 1)}
                  className="w-7 h-7 rounded flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: "#2a3a2a", color: "#e8f0e8" }}
                >−</button>
                <span
                  className="w-8 text-center font-bold text-base"
                  style={{ color: pts > 0 ? "#f59e0b" : "#8a9e8a" }}
                >
                  {pts}
                </span>
                <button
                  onClick={() => setPoints(stateId, pts + 1)}
                  className="w-7 h-7 rounded flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: "#2a3a2a", color: "#e8f0e8" }}
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      {stateIds.length === 0 && (
        <p className="text-center py-8" style={{ color: "#8a9e8a" }}>
          Go back and select at least one species.
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-lg font-medium text-sm"
          style={{ backgroundColor: "#1a2a1a", border: "1px solid #2a3a2a", color: "#c8d8c8" }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={stateIds.length === 0}
          className="flex-[2] py-3 rounded-lg font-bold text-base"
          style={{
            backgroundColor: stateIds.length > 0 ? "#f59e0b" : "#2a3a2a",
            color: stateIds.length > 0 ? "#0f1a0f" : "#8a9e8a",
            cursor: stateIds.length > 0 ? "pointer" : "not-allowed",
          }}
        >
          Build My Strategy →
        </button>
      </div>
    </div>
  );
}
