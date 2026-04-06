"use client";
import { useState } from "react";
import { HunterProfile } from "@/lib/types";
import { savePlan } from "@/lib/savedPlans";

interface Props {
  profile: HunterProfile;
  strategy: string;
}

export default function SavePlanButton({ profile, strategy }: Props) {
  const [saved, setSaved] = useState(false);
  const [showName, setShowName] = useState(false);
  const [name, setName] = useState("");

  const handleSave = () => {
    const species = profile.species.map(s => s.replace(/_/g, ' ')).join(', ');
    savePlan({
      name: name.trim() || `${species} — ${new Date().getFullYear()}`,
      profile,
      strategy,
    });
    setSaved(true);
    setShowName(false);
    setTimeout(() => setSaved(false), 3000);
  };

  if (saved) {
    return (
      <div
        className="flex-1 py-3 rounded-lg text-sm font-medium text-center"
        style={{ backgroundColor: "#1a3a1a", border: "1px solid #4ade80", color: "#4ade80" }}
      >
        ✓ Plan saved to My Applications
      </div>
    );
  }

  if (showName) {
    return (
      <div className="flex-1 flex gap-2">
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setShowName(false); }}
          placeholder="Name this plan (optional)"
          className="flex-1 px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: "#1a2a1a", border: "1px solid #f59e0b", color: "#e8f0e8" }}
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg text-sm font-bold"
          style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}
        >
          Save
        </button>
        <button
          onClick={() => setShowName(false)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ color: "#8a9e8a" }}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowName(true)}
      className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
      style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }}
    >
      💾 Save Plan
    </button>
  );
}
