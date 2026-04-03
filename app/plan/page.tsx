"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HunterProfile } from "@/lib/types";
import ProgressBar from "@/components/ProgressBar";
import StepOne from "@/components/StepOne";
import StepTwo from "@/components/StepTwo";

const DEFAULT_PROFILE: Partial<HunterProfile> = {
  species: [],
  huntType: "any",
  residency: "",
  budget: 500,
  goal: "balance",
  planningYears: 10,
  pointsByState: {},
};

export default function PlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<HunterProfile>>(DEFAULT_PROFILE);

  const update = (updates: Partial<HunterProfile>) =>
    setProfile(prev => ({ ...prev, ...updates }));

  const handleFinish = () => {
    const encoded = btoa(JSON.stringify(profile));
    router.push(`/strategy?p=${encoded}`);
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🎯</div>
          <h1 className="text-2xl font-bold" style={{ color: "#f59e0b" }}>DrawAI</h1>
          <p className="text-sm mt-1" style={{ color: "#8a9e8a" }}>
            Free AI hunting tag strategy
          </p>
        </div>

        <ProgressBar step={step} total={2} />

        <div
          className="rounded-xl p-6 sm:p-8"
          style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}
        >
          <h2 className="text-lg font-semibold mb-6" style={{ color: "#e8f0e8" }}>
            {step === 0 ? "Tell us about your hunt" : "Your preference points by state"}
          </h2>

          {step === 0 && (
            <StepOne
              profile={profile}
              onChange={update}
              onNext={() => setStep(1)}
            />
          )}

          {step === 1 && (
            <StepTwo
              profile={profile}
              onChange={update}
              onNext={handleFinish}
              onBack={() => setStep(0)}
            />
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#8a9e8a" }}>
          DrawAI is free. Built by Factor21. Not affiliated with any state agency.
        </p>
      </div>
    </main>
  );
}
