"use client";
import { useState, useRef, useEffect } from "react";
import AppNav from "@/components/AppNav";
import StrategyOutput from "@/components/StrategyOutput";
import AiDisclaimer from "@/components/AiDisclaimer";
import { SPECIES_LABELS, SPECIES_EMOJI, ALL_STATES, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import { FindProfile } from "@/app/api/find/route";

const SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison",
];

const HUNT_TYPES = [
  { value: "any",          label: "Any Method",    emoji: "✓" },
  { value: "archery",      label: "Archery",        emoji: "🏹" },
  { value: "rifle",        label: "Rifle",          emoji: "🎯" },
  { value: "muzzleloader", label: "Muzzleloader",  emoji: "💨" },
];

const TROPHY = [
  { value: "otc_or_easy", label: "Hunt This Year", desc: "OTC or easy draw — I want to go now.", emoji: "🏕️" },
  { value: "quality",     label: "Quality Hunt",   desc: "Good bulls/bucks, willing to wait 2-5 years.", emoji: "🦌" },
  { value: "trophy",      label: "Trophy Hunt",    desc: "Above-average trophy — waiting 5-10+ years is fine.", emoji: "🏆" },
  { value: "bucket_list", label: "Bucket List",    desc: "Once-in-a-lifetime caliber. I'll wait as long as it takes.", emoji: "⭐" },
];

const FREQUENCY = [
  { value: "every_year",  label: "Every year",     desc: "I want to hunt every season, period." },
  { value: "every_2_3",   label: "Every 2-3 years", desc: "Some waiting is fine for the right hunt." },
  { value: "once",        label: "Once is enough",  desc: "I want one great hunt. Quality over quantity." },
];

const STEPS = ["Species & Method", "Where & Points", "Priorities"];

export default function FindPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<FindProfile>>({
    species: [],
    huntType: "any",
    residency: "",
    states: [],
    pointsByState: {},
    budget: 600,
    trophyPriority: "quality",
    frequency: "every_2_3",
    planningYears: 10,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = (u: Partial<FindProfile>) => setProfile(p => ({ ...p, ...u }));
  const toggleSpecies = (s: SpeciesKey) => {
    const cur = profile.species ?? [];
    update({ species: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] });
  };
  const toggleState = (s: string) => {
    const cur = profile.states ?? [];
    update({ states: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] });
  };

  const canNext0 = (profile.species?.length ?? 0) > 0;
  const canNext1 = !!profile.residency;

  // AUTO-RETRY: silently retry once if the network drops before significant
  // content arrives (< 500 bytes). If substantial content was received, show
  // the interruption banner instead of discarding what the user already has.
  const streamFind = async (): Promise<{ receivedBytes: number; error?: unknown }> => {
    let receivedBytes = 0;
    try {
      const res = await fetch("/api/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      if (!res.ok) throw new Error(await res.text());
      if (!res.body) throw new Error("No response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedBytes += value?.length ?? 0;
        setResult(prev => prev + decoder.decode(value, { stream: true }));
      }
      return { receivedBytes };
    } catch (e) {
      return { receivedBytes, error: e };
    }
  };

  const submit = async () => {
    setLoading(true);
    setResult("");
    setError("");

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    let { receivedBytes, error } = await streamFind();

    // Silent auto-retry if very little content arrived (network blip)
    if (error && receivedBytes < 500) {
      setResult("");
      await new Promise(r => setTimeout(r, 1500)); // brief pause for network to stabilise
      ({ receivedBytes, error } = await streamFind());
    }

    if (error) {
      setError(receivedBytes > 0 ? "__interrupted__" : (error instanceof Error ? error.message : "Something went wrong."));
    }

    setLoading(false);
  };

  const WESTERN_STATES = ALL_STATES.filter(s =>
    ["WY","CO","MT","UT","AZ","NM","ID","NV","OR","WA","CA","SD","ND","NE","KS"].includes(s)
  );

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner" style={{ maxWidth: 680 }}>

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "4px 12px", borderRadius: 999,
            background: "var(--amber-glow)", border: "1px solid rgba(232,150,15,0.3)",
            fontSize: 11, fontWeight: 700, color: "var(--amber)",
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14,
          }}>
            🔍 AI Hunt Finder
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 10 }}>
            Find your perfect hunt
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, maxWidth: 520 }}>
            Tell us what you want. Our AI matches you to specific units and states ranked by fit —
            drawing on 80+ unit profiles across the American West.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div className={`step-dot ${i < step ? "done" : i === step ? "active" : "todo"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 11, fontWeight: i === step ? 700 : 500, color: i === step ? "var(--amber)" : "var(--text-3)", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, margin: "0 8px", marginBottom: 22, background: i < step ? "var(--amber)" : "var(--border)", borderRadius: 1 }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 0: Species & Method ─────────────────────────────────── */}
        {step === 0 && (
          <div className="card" style={{ padding: "28px 24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 20 }}>What are you hunting?</h2>

            <div style={{ marginBottom: 24 }}>
              <label className="field-label">Target Species <span className="req">*</span></label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 8 }}>
                {SPECIES.map(s => {
                  const sel = profile.species?.includes(s);
                  return (
                    <button key={s} onClick={() => toggleSpecies(s)} className={`choice-btn${sel ? " selected" : ""}`}>
                      <div className="check">{sel ? "✓" : ""}</div>
                      <span style={{ fontSize: "1.05rem" }}>{SPECIES_EMOJI[s]}</span>
                      <span style={{ fontSize: 13 }}>{SPECIES_LABELS[s]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="field-label">Preferred Method</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {HUNT_TYPES.map(ht => (
                  <button key={ht.value} onClick={() => update({ huntType: ht.value })}
                    className={`pill-btn${profile.huntType === ht.value ? " selected" : ""}`}>
                    {ht.emoji} {ht.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(1)} className="btn-primary"
              disabled={!canNext0}
              style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 15, opacity: canNext0 ? 1 : 0.45 }}>
              Next: Where & Points →
            </button>
          </div>
        )}

        {/* ── Step 1: States & Points ──────────────────────────────────── */}
        {step === 1 && (
          <div className="card" style={{ padding: "28px 24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 20 }}>Where will you hunt?</h2>

            <div style={{ marginBottom: 20 }}>
              <label className="field-label">Your Residency <span className="req">*</span></label>
              <select value={profile.residency ?? ""} onChange={e => update({ residency: e.target.value })}
                className="input" style={{ maxWidth: 280 }}>
                <option value="">Select your home state...</option>
                {ALL_STATES.map(s => <option key={s} value={s}>{STATE_NAMES[s]} ({s})</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="field-label">States You'll Hunt <span style={{ color: "var(--text-3)", fontSize: 10, fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(leave blank = anywhere)</span></label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {WESTERN_STATES.map(s => {
                  const sel = profile.states?.includes(s);
                  return (
                    <button key={s} onClick={() => toggleState(s)}
                      className={`pill-btn${sel ? " selected" : ""}`}
                      style={{ fontSize: 11, padding: "5px 12px" }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Points by selected states */}
            {(profile.states?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 20 }}>
                <label className="field-label">Your Points</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                  {profile.states?.map(stateId => {
                    const pts = profile.pointsByState?.[stateId] ?? 0;
                    return (
                      <div key={stateId} className="card" style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: pts > 0 ? "var(--amber-glow)" : undefined, borderColor: pts > 0 ? "var(--amber-dim)" : undefined }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: pts > 0 ? "var(--amber)" : "var(--text)" }}>{stateId}</div>
                          <div style={{ fontSize: 11, color: "var(--text-3)" }}>pts</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button onClick={() => update({ pointsByState: { ...profile.pointsByState, [stateId]: Math.max(0, pts - 1) } })}
                            style={{ width: 26, height: 26, borderRadius: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <span style={{ minWidth: 24, textAlign: "center", fontWeight: 800, color: pts > 0 ? "var(--amber)" : "var(--text-3)" }}>{pts}</span>
                          <button onClick={() => update({ pointsByState: { ...profile.pointsByState, [stateId]: pts + 1 } })}
                            style={{ width: 26, height: 26, borderRadius: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label className="field-label">Annual Budget: <span style={{ color: "var(--amber)", fontWeight: 800 }}>${(profile.budget ?? 600).toLocaleString()}</span></label>
              <input type="range" min={100} max={5000} step={50} value={profile.budget ?? 600}
                onChange={e => update({ budget: Number(e.target.value) })} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>
                <span>$100</span><span>$5,000</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(0)} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>← Back</button>
              <button onClick={() => setStep(2)} className="btn-primary" disabled={!canNext1}
                style={{ flex: 2, justifyContent: "center", padding: "13px", fontSize: 15, opacity: canNext1 ? 1 : 0.45 }}>
                Next: Priorities →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Trophy & Frequency ───────────────────────────────── */}
        {step === 2 && (
          <div className="card" style={{ padding: "28px 24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 20 }}>What matters most?</h2>

            <div style={{ marginBottom: 24 }}>
              <label className="field-label">Trophy Priority</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {TROPHY.map(t => {
                  const sel = profile.trophyPriority === t.value;
                  return (
                    <button key={t.value} onClick={() => update({ trophyPriority: t.value as FindProfile["trophyPriority"] })}
                      className={`choice-btn${sel ? " selected" : ""}`}>
                      <div className="check">{sel ? "✓" : ""}</div>
                      <span style={{ fontSize: "1.2rem" }}>{t.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: sel ? "var(--amber)" : "var(--text)" }}>{t.label}</div>
                        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{t.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label className="field-label">How Often Do You Want to Hunt?</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {FREQUENCY.map(f => {
                  const sel = profile.frequency === f.value;
                  return (
                    <button key={f.value} onClick={() => update({ frequency: f.value as FindProfile["frequency"] })}
                      className={`choice-btn${sel ? " selected" : ""}`}>
                      <div className="check">{sel ? "✓" : ""}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: sel ? "var(--amber)" : "var(--text)" }}>{f.label}</div>
                        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{f.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>← Back</button>
              <button onClick={submit} className="btn-primary"
                style={{ flex: 2, justifyContent: "center", padding: "14px", fontSize: 15 }}>
                Find My Hunts →
              </button>
            </div>
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────────── */}
        <div ref={resultsRef} style={{ marginTop: result || loading ? 32 : 0 }}>
          {loading && !result && (
            <div className="card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                border: "2px solid var(--amber)", borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite", flexShrink: 0,
              }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 14 }}>Finding your best hunts...</p>
                <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
                  Matching your profile against 80+ units across the West
                </p>
              </div>
            </div>
          )}

          {(result || (loading && result)) && (
            <div>
              <AiDisclaimer />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Your Top Hunt Matches</h2>
                <button onClick={() => { setResult(""); setStep(0); setProfile(p => ({ ...p, species: [], states: [] })); }}
                  className="btn-ghost" style={{ fontSize: 12 }}>
                  Start Over
                </button>
              </div>
              <div className="card" style={{ padding: "24px 20px" }}>
                <StrategyOutput text={result} loading={loading} />
              </div>
              {!loading && result && (
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <a href="/plan" className="btn-primary" style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}>
                    Build Full Year Plan →
                  </a>
                  <a href="/chat" className="btn-ghost" style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}>
                    Ask the AI Advisor
                  </a>
                </div>
              )}
            </div>
          )}

          {error && error !== "__interrupted__" && (
            <div className="card" style={{ padding: 20, background: "var(--danger-bg)", borderColor: "var(--danger-border)" }}>
              <p style={{ fontSize: 13, color: "var(--danger)", marginBottom: 12 }}>{error}</p>
              <button onClick={submit} className="btn-primary" style={{ fontSize: 13 }}>Try Again</button>
            </div>
          )}
          {error === "__interrupted__" && (
            <div className="card" style={{ padding: 16, background: "#1a1a0a", borderColor: "#4a3a00", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b", marginBottom: 4 }}>Results may be incomplete — connection was interrupted</p>
                <p style={{ fontSize: 12, color: "#8a7a50" }}>Scroll up to see what was generated. Regenerate for the full results.</p>
              </div>
              <button onClick={submit} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "#2a2000", border: "1px solid #4a3a00", color: "#f59e0b", cursor: "pointer" }}>Regenerate</button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 32 }}>
          Unit data sourced from state agency harvest reports. Always verify at your state's official wildlife agency before applying.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
