"use client";
import { useState, useRef, useEffect } from "react";
import AppNav from "@/components/AppNav";
import StrategyOutput from "@/components/StrategyOutput";
import AiDisclaimer from "@/components/AiDisclaimer";
import { SPECIES_LABELS, ALL_STATES, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import { FindProfile } from "@/app/api/find/route";

// ── Design tokens ─────────────────────────────────────────────────────────
const SOIL  = "#0F0D0A";
const BARK  = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW  = "#F0A040";
const BONE  = "#E8DFC8";
const DUST  = "#7A6E5F";
const PINE  = "#4A7C59";

const FONT_DISPLAY = "var(--font-display), Georgia, serif";
const FONT_MONO    = "var(--font-dm-mono), monospace";

const SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison",
];

const HUNT_TYPES = [
  { value: "any",          label: "Any Method"   },
  { value: "archery",      label: "Archery"      },
  { value: "rifle",        label: "Rifle"        },
  { value: "muzzleloader", label: "Muzzleloader" },
];

const TROPHY = [
  { value: "otc_or_easy", label: "Hunt This Year", desc: "OTC or easy draw — I want to go now." },
  { value: "quality",     label: "Quality Hunt",   desc: "Good bulls/bucks, willing to wait 2-5 years." },
  { value: "trophy",      label: "Trophy Hunt",    desc: "Above-average trophy — waiting 5-10+ years is fine." },
  { value: "bucket_list", label: "Bucket List",    desc: "Once-in-a-lifetime caliber. I'll wait as long as it takes." },
];

const FREQUENCY = [
  { value: "every_year",  label: "Every year",      desc: "I want to hunt every season, period." },
  { value: "every_2_3",   label: "Every 2-3 years", desc: "Some waiting is fine for the right hunt." },
  { value: "once",        label: "Once is enough",  desc: "I want one great hunt. Quality over quantity." },
];

const STEPS = ["Species & Method", "Where & Points", "Priorities"];

// ── Shared label / helper styles ─────────────────────────────────────────
const sectionLabel: React.CSSProperties = {
  display: "block",
  fontFamily: FONT_MONO,
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: DUST,
  marginBottom: 12,
};

const cardStyle: React.CSSProperties = {
  background: BARK,
  border: `1px solid ${FENCE}`,
  padding: 32,
  borderRadius: 0,
  marginTop: 32,
};

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

  useEffect(() => {
    document.body.classList.add("editorial");
    return () => { document.body.classList.remove("editorial"); };
  }, []);

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

  // ── Reusable primary button ───────────────────────────────────────────
  const primaryBtnStyle = (enabled: boolean, full = true): React.CSSProperties => ({
    width: full ? "100%" : undefined,
    height: 48,
    padding: "0 24px",
    background: enabled ? AMBER : FENCE,
    color: enabled ? SOIL : DUST,
    border: "none",
    borderRadius: 0,
    fontFamily: FONT_MONO,
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: "0.04em",
    cursor: enabled ? "pointer" : "not-allowed",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    transition: "background 0.15s",
  });

  const ghostBtnStyle: React.CSSProperties = {
    height: 48,
    padding: "0 24px",
    background: "transparent",
    color: BONE,
    border: `1px solid ${FENCE}`,
    borderRadius: 0,
    fontFamily: FONT_MONO,
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  };

  return (
    <div className="page" style={{ background: SOIL, color: BONE, minHeight: "100vh", fontFamily: FONT_MONO }}>
      <AppNav />
      <div className="page-inner" style={{ maxWidth: 768, padding: "48px 24px", margin: "0 auto" }}>

        {/* ── Page header ───────────────────────────────────────────── */}
        <div>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: AMBER,
            marginBottom: 12,
          }}>
            AI HUNT FINDER
          </div>
          <h1 style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            color: BONE,
            fontSize: "clamp(36px, 6vw, 48px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            Find your perfect hunt
          </h1>
          <p style={{
            fontFamily: FONT_MONO,
            fontSize: 16,
            color: DUST,
            lineHeight: 1.6,
            maxWidth: 480,
            marginTop: 12,
          }}>
            Tell us what you want. Our AI matches you to specific units and states ranked by fit — drawing on 80+ unit profiles across the American West.
          </p>
        </div>

        {/* ── Step indicator ─────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-start", marginTop: 40 }}>
          {STEPS.map((label, i) => {
            const active = i === step;
            const done = i < step;
            const reached = active || done;
            return (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", flex: i < STEPS.length - 1 ? 1 : undefined }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 28 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    background: reached ? AMBER : "transparent",
                    border: reached ? `1px solid ${AMBER}` : `1px solid ${FENCE}`,
                    color: reached ? SOIL : DUST,
                    fontFamily: FONT_MONO,
                    fontWeight: 500,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: active ? AMBER : DUST,
                    whiteSpace: "nowrap",
                  }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: 1,
                    marginTop: 14,
                    marginLeft: 12,
                    marginRight: 12,
                    background: FENCE,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Step 0: Species & Method ─────────────────────────────── */}
        {step === 0 && (
          <div style={cardStyle}>
            <h2 style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 700,
              color: BONE,
              margin: 0,
              marginBottom: 24,
            }}>
              What are you hunting?
            </h2>

            <div style={{ marginBottom: 28 }}>
              <label style={sectionLabel}>
                Target Species <span style={{ color: AMBER }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {SPECIES.map(s => {
                  const sel = profile.species?.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSpecies(s)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: sel ? BARK : SOIL,
                        border: `1px solid ${sel ? AMBER : FENCE}`,
                        borderRadius: 0,
                        padding: "12px 16px",
                        cursor: "pointer",
                        fontFamily: FONT_MONO,
                        fontWeight: 500,
                        fontSize: 14,
                        color: BONE,
                        textAlign: "left",
                        transition: "border-color 0.15s",
                      }}
                      onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = AMBER; }}
                      onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = FENCE; }}
                    >
                      <span style={{
                        width: 14,
                        height: 14,
                        border: `1px solid ${sel ? AMBER : FENCE}`,
                        background: sel ? AMBER : "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {sel && <span style={{ width: 6, height: 6, background: SOIL }} />}
                      </span>
                      <span>{SPECIES_LABELS[s]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={sectionLabel}>Preferred Method</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {HUNT_TYPES.map(ht => {
                  const sel = profile.huntType === ht.value;
                  return (
                    <button
                      key={ht.value}
                      onClick={() => update({ huntType: ht.value })}
                      style={{
                        padding: "10px 18px",
                        background: sel ? AMBER : "transparent",
                        border: `1px solid ${sel ? AMBER : FENCE}`,
                        borderRadius: 0,
                        color: sel ? SOIL : DUST,
                        fontFamily: FONT_MONO,
                        fontSize: 13,
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.color = BONE; } }}
                      onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = FENCE; e.currentTarget.style.color = DUST; } }}
                    >
                      {ht.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!canNext0}
              style={primaryBtnStyle(canNext0)}
              onMouseEnter={e => { if (canNext0) e.currentTarget.style.background = GLOW; }}
              onMouseLeave={e => { if (canNext0) e.currentTarget.style.background = AMBER; }}
            >
              Next: Where & Points →
            </button>
          </div>
        )}

        {/* ── Step 1: States & Points ──────────────────────────────── */}
        {step === 1 && (
          <div style={cardStyle}>
            <h2 style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 700,
              color: BONE,
              margin: 0,
              marginBottom: 24,
            }}>
              Where will you hunt?
            </h2>

            <div style={{ marginBottom: 24 }}>
              <label style={sectionLabel}>
                Your Residency <span style={{ color: AMBER }}>*</span>
              </label>
              <select
                value={profile.residency ?? ""}
                onChange={e => update({ residency: e.target.value })}
                style={{
                  width: "100%",
                  maxWidth: 320,
                  height: 44,
                  padding: "0 14px",
                  background: SOIL,
                  color: BONE,
                  border: `1px solid ${FENCE}`,
                  borderRadius: 0,
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  outline: "none",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = AMBER)}
                onBlur={e => (e.currentTarget.style.borderColor = FENCE)}
              >
                <option value="">Select your home state...</option>
                {ALL_STATES.map(s => <option key={s} value={s}>{STATE_NAMES[s]} ({s})</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={sectionLabel}>
                States You&apos;ll Hunt <span style={{ color: DUST, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>(leave blank = anywhere)</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {WESTERN_STATES.map(s => {
                  const sel = profile.states?.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleState(s)}
                      style={{
                        padding: "7px 14px",
                        background: sel ? AMBER : "transparent",
                        border: `1px solid ${sel ? AMBER : FENCE}`,
                        borderRadius: 0,
                        color: sel ? SOIL : DUST,
                        fontFamily: FONT_MONO,
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.color = BONE; } }}
                      onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = FENCE; e.currentTarget.style.color = DUST; } }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Points by selected states */}
            {(profile.states?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 24 }}>
                <label style={sectionLabel}>Your Points</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                  {profile.states?.map(stateId => {
                    const pts = profile.pointsByState?.[stateId] ?? 0;
                    const has = pts > 0;
                    return (
                      <div
                        key={stateId}
                        style={{
                          padding: "12px 14px",
                          background: SOIL,
                          border: `1px solid ${has ? AMBER : FENCE}`,
                          borderRadius: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 13, color: has ? AMBER : BONE, letterSpacing: "0.06em" }}>{stateId}</div>
                          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: DUST, textTransform: "uppercase", letterSpacing: "0.08em" }}>pts</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button
                            onClick={() => update({ pointsByState: { ...profile.pointsByState, [stateId]: Math.max(0, pts - 1) } })}
                            style={{
                              width: 26, height: 26,
                              background: "transparent",
                              border: `1px solid ${FENCE}`,
                              borderRadius: 0,
                              color: BONE,
                              cursor: "pointer",
                              fontFamily: FONT_MONO,
                              fontWeight: 500,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >−</button>
                          <span style={{ minWidth: 22, textAlign: "center", fontFamily: FONT_MONO, fontWeight: 500, fontSize: 13, color: has ? AMBER : DUST }}>{pts}</span>
                          <button
                            onClick={() => update({ pointsByState: { ...profile.pointsByState, [stateId]: pts + 1 } })}
                            style={{
                              width: 26, height: 26,
                              background: "transparent",
                              border: `1px solid ${FENCE}`,
                              borderRadius: 0,
                              color: BONE,
                              cursor: "pointer",
                              fontFamily: FONT_MONO,
                              fontWeight: 500,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 32 }}>
              <label style={sectionLabel}>
                Annual Budget: <span style={{ color: AMBER, fontWeight: 500 }}>${(profile.budget ?? 600).toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={100}
                max={5000}
                step={50}
                value={profile.budget ?? 600}
                onChange={e => update({ budget: Number(e.target.value) })}
                style={{ width: "100%", accentColor: AMBER }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_MONO, fontSize: 11, color: DUST, marginTop: 6, letterSpacing: "0.06em" }}>
                <span>$100</span><span>$5,000</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep(0)}
                style={{ ...ghostBtnStyle, flex: 1 }}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!canNext1}
                style={{ ...primaryBtnStyle(canNext1), flex: 2 }}
                onMouseEnter={e => { if (canNext1) e.currentTarget.style.background = GLOW; }}
                onMouseLeave={e => { if (canNext1) e.currentTarget.style.background = AMBER; }}
              >
                Next: Priorities →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Trophy & Frequency ───────────────────────────── */}
        {step === 2 && (
          <div style={cardStyle}>
            <h2 style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 700,
              color: BONE,
              margin: 0,
              marginBottom: 24,
            }}>
              What matters most?
            </h2>

            <div style={{ marginBottom: 28 }}>
              <label style={sectionLabel}>Trophy Priority</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {TROPHY.map(t => {
                  const sel = profile.trophyPriority === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => update({ trophyPriority: t.value as FindProfile["trophyPriority"] })}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "14px 16px",
                        background: sel ? BARK : SOIL,
                        border: `1px solid ${sel ? AMBER : FENCE}`,
                        borderRadius: 0,
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: FONT_MONO,
                        transition: "border-color 0.15s",
                      }}
                      onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = AMBER; }}
                      onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = FENCE; }}
                    >
                      <span style={{
                        width: 14,
                        height: 14,
                        marginTop: 3,
                        border: `1px solid ${sel ? AMBER : FENCE}`,
                        background: sel ? AMBER : "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {sel && <span style={{ width: 6, height: 6, background: SOIL }} />}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 14, color: sel ? AMBER : BONE }}>{t.label}</div>
                        <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: DUST, marginTop: 4, lineHeight: 1.5 }}>{t.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={sectionLabel}>How Often Do You Want to Hunt?</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {FREQUENCY.map(f => {
                  const sel = profile.frequency === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => update({ frequency: f.value as FindProfile["frequency"] })}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "14px 16px",
                        background: sel ? BARK : SOIL,
                        border: `1px solid ${sel ? AMBER : FENCE}`,
                        borderRadius: 0,
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: FONT_MONO,
                        transition: "border-color 0.15s",
                      }}
                      onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = AMBER; }}
                      onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = FENCE; }}
                    >
                      <span style={{
                        width: 14,
                        height: 14,
                        marginTop: 3,
                        border: `1px solid ${sel ? AMBER : FENCE}`,
                        background: sel ? AMBER : "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {sel && <span style={{ width: 6, height: 6, background: SOIL }} />}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 14, color: sel ? AMBER : BONE }}>{f.label}</div>
                        <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: DUST, marginTop: 4, lineHeight: 1.5 }}>{f.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ ...ghostBtnStyle, flex: 1 }}>← Back</button>
              <button
                onClick={submit}
                style={{ ...primaryBtnStyle(true), flex: 2 }}
                onMouseEnter={e => (e.currentTarget.style.background = GLOW)}
                onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
              >
                Find My Hunts →
              </button>
            </div>
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────── */}
        <div ref={resultsRef} style={{ marginTop: result || loading ? 40 : 0 }}>
          {loading && !result && (
            <div style={{ ...cardStyle, marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 20, height: 20,
                border: `2px solid ${AMBER}`,
                borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
                flexShrink: 0,
                borderRadius: 0,
              }} />
              <div>
                <p style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 14, color: BONE, margin: 0 }}>Finding your best hunts...</p>
                <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: DUST, marginTop: 4, margin: 0 }}>
                  Matching your profile against 80+ units across the West
                </p>
              </div>
            </div>
          )}

          {(result || (loading && result)) && (
            <div style={{ marginTop: 32 }}>
              <AiDisclaimer />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, marginTop: 16 }}>
                <h2 style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 22,
                  fontWeight: 700,
                  color: BONE,
                  margin: 0,
                }}>
                  Your Top Hunt Matches
                </h2>
                <button
                  onClick={() => { setResult(""); setStep(0); setProfile(p => ({ ...p, species: [], states: [] })); }}
                  style={{
                    background: "transparent",
                    border: `1px solid ${FENCE}`,
                    borderRadius: 0,
                    padding: "8px 16px",
                    color: DUST,
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.color = AMBER; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = FENCE; e.currentTarget.style.color = DUST; }}
                >
                  Start Over
                </button>
              </div>
              <div style={{
                background: BARK,
                border: `1px solid ${FENCE}`,
                padding: 32,
                borderRadius: 0,
              }}>
                <StrategyOutput text={result} loading={loading} />
              </div>
              {!loading && result && (
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <a
                    href="/plan"
                    style={{ ...primaryBtnStyle(true, false), flex: 1 }}
                    onMouseEnter={e => (e.currentTarget.style.background = GLOW)}
                    onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
                  >
                    Build Full Year Plan →
                  </a>
                  <a href="/chat" style={{ ...ghostBtnStyle, flex: 1 }}>
                    Ask the AI Advisor
                  </a>
                </div>
              )}
            </div>
          )}

          {error && error !== "__interrupted__" && (
            <div style={{
              marginTop: 32,
              background: BARK,
              border: `1px solid ${FENCE}`,
              borderLeft: `3px solid ${AMBER}`,
              padding: 20,
              borderRadius: 0,
            }}>
              <p style={{ fontFamily: FONT_MONO, fontSize: 13, color: BONE, marginBottom: 12, margin: 0 }}>{error}</p>
              <button
                onClick={submit}
                style={{ ...primaryBtnStyle(true, false), marginTop: 12 }}
                onMouseEnter={e => (e.currentTarget.style.background = GLOW)}
                onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
              >
                Try Again
              </button>
            </div>
          )}
          {error === "__interrupted__" && (
            <div style={{
              marginTop: 32,
              background: BARK,
              border: `1px solid ${FENCE}`,
              borderLeft: `3px solid ${AMBER}`,
              padding: 20,
              borderRadius: 0,
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fontWeight: 500,
                  color: AMBER,
                  marginBottom: 6,
                  margin: 0,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  Results may be incomplete — connection was interrupted
                </p>
                <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: DUST, margin: 0, marginTop: 6 }}>
                  Scroll up to see what was generated. Regenerate for the full results.
                </p>
              </div>
              <button
                onClick={submit}
                style={{
                  flexShrink: 0,
                  padding: "8px 16px",
                  background: "transparent",
                  border: `1px solid ${AMBER}`,
                  borderRadius: 0,
                  color: AMBER,
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Regenerate
              </button>
            </div>
          )}
        </div>

        <p style={{
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 11,
          color: DUST,
          marginTop: 48,
          letterSpacing: "0.06em",
          lineHeight: 1.6,
        }}>
          Unit data sourced from state agency harvest reports. Always verify at your state&apos;s official wildlife agency before applying.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
