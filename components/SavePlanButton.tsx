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
        style={{ backgroundColor: "var(--success-bg)", border: "1px solid var(--success-border)", color: "var(--success)" }}
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
          style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--amber)", color: "var(--text)" }}
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg text-sm font-bold"
          style={{ backgroundColor: "var(--amber)", color: "var(--text-inv)" }}
        >
          Save
        </button>
        <button
          onClick={() => setShowName(false)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ color: "var(--text-2)" }}
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
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}
    >
      💾 Save Plan
    </button>
  );
}
