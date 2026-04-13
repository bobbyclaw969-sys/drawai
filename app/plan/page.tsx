"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HunterProfile } from "@/lib/types";
import AppNav from "@/components/AppNav";
import StepOne from "@/components/StepOne";
import StepTwo from "@/components/StepTwo";

// ── Design tokens ───────────────────────────────────────────────────────────
const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

const DISPLAY = "var(--font-display), Georgia, serif";
const MONO = "var(--font-dm-mono), monospace";

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
    <div style={{ background: SOIL, minHeight: "100vh" }}>
      <AppNav />

      {/* Custom slider styles — scoped to the plan page */}
      <style jsx global>{`
        .plan-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          background: ${FENCE};
          border-radius: 0;
          outline: none;
          cursor: pointer;
        }
        .plan-slider::-webkit-slider-runnable-track {
          height: 4px;
          background: ${FENCE};
          border-radius: 0;
        }
        .plan-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: ${AMBER};
          border: none;
          border-radius: 0;
          cursor: pointer;
          margin-top: -6px;
          box-shadow: none;
        }
        .plan-slider::-moz-range-track {
          height: 4px;
          background: ${FENCE};
          border-radius: 0;
        }
        .plan-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: ${AMBER};
          border: none;
          border-radius: 0;
          cursor: pointer;
          box-shadow: none;
        }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 96px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: AMBER,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Build Plan
          </div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: 48,
              fontWeight: 700,
              color: BONE,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Tell us about your hunt
          </h1>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 16,
              color: DUST,
              marginTop: 12,
              maxWidth: 520,
              lineHeight: 1.5,
            }}
          >
            Answer a few questions and we&apos;ll build a multi-year draw strategy matched to your points, budget, and goals.
          </p>
        </div>

        {/* Step progress indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: 40,
          }}
        >
          {STEPS.map((label, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flex: i < STEPS.length - 1 ? 1 : undefined,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: isActive || isDone ? AMBER : "transparent",
                      border: isActive || isDone ? `1px solid ${AMBER}` : `1px solid ${FENCE}`,
                      color: isActive || isDone ? SOIL : DUST,
                      fontFamily: MONO,
                      fontWeight: 500,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 11,
                      color: isActive || isDone ? AMBER : DUST,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      margin: "14px 12px 0 12px",
                      background: FENCE,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div
          style={{
            background: BARK,
            border: `1px solid ${FENCE}`,
            padding: 32,
            borderRadius: 0,
          }}
        >
          {step === 0 && (
            <StepOne profile={profile} onChange={update} onNext={() => setStep(1)} />
          )}
          {step === 1 && (
            <StepTwo profile={profile} onChange={update} onNext={handleFinish} onBack={() => setStep(0)} />
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 11,
            color: DUST,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: 24,
          }}
        >
          Free. No signup. Your profile stays on your device. AI requests use Anthropic&apos;s API.
        </p>
      </div>
    </div>
  );
}
