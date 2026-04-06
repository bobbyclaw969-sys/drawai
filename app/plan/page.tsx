"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HunterProfile } from "@/lib/types";
import AppNav from "@/components/AppNav";
import StepOne from "@/components/StepOne";
import StepTwo from "@/components/StepTwo";

const STEPS = ["Your goals", "Your points", "Strategy"];

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
    <div className="page">
      <AppNav />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Progress stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div className={`step-dot ${i < step ? "done" : i === step ? "active" : "todo"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: i === step ? 700 : 500,
                  color: i === step ? "var(--amber)" : i < step ? "var(--text-2)" : "var(--text-3)",
                  whiteSpace: "nowrap",
                }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1,
                  height: 2,
                  margin: "0 8px",
                  marginBottom: 22,
                  background: i < step ? "var(--amber)" : "var(--border)",
                  borderRadius: 1,
                  transition: "background 0.3s",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "32px 28px" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 24 }}>
            {step === 0 ? "Tell us about your hunt" : "Your preference points by state"}
          </h2>

          {step === 0 && (
            <StepOne profile={profile} onChange={update} onNext={() => setStep(1)} />
          )}
          {step === 1 && (
            <StepTwo profile={profile} onChange={update} onNext={handleFinish} onBack={() => setStep(0)} />
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 20 }}>
          Free. No signup. Data never leaves your browser.
        </p>
      </div>
    </div>
  );
}
