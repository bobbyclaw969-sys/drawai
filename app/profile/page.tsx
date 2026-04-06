"use client";
import { useState, useEffect } from "react";
import AppNav from "@/components/AppNav";
import Link from "next/link";

export interface HunterProfile {
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  city: string;
  residencyState: string;
  zip: string;
  phone: string;
  email: string;
  hunterEdNumber: string;
  hunterEdState: string;
  licenses: Record<string, string>; // stateId → license number
  ssn4: string; // last 4 digits only — never stored server-side
}

const BLANK: HunterProfile = {
  firstName: "",
  lastName: "",
  dob: "",
  address: "",
  city: "",
  residencyState: "",
  zip: "",
  phone: "",
  email: "",
  hunterEdNumber: "",
  hunterEdState: "",
  licenses: {},
  ssn4: "",
};

const STATE_ABBREVS = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

// States where hunters commonly need to enter a license number when applying
const LICENSE_STATES = [
  { id: "co", name: "Colorado" },
  { id: "wy", name: "Wyoming" },
  { id: "mt", name: "Montana" },
  { id: "id", name: "Idaho" },
  { id: "ut", name: "Utah" },
  { id: "az", name: "Arizona" },
  { id: "nv", name: "Nevada" },
  { id: "nm", name: "New Mexico" },
  { id: "or", name: "Oregon" },
  { id: "wa", name: "Washington" },
];

const STORAGE_KEY = "taghunter_hunter_profile";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label className="field-label">{label}</label>
      {hint && <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: -4 }}>{hint}</p>}
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<HunterProfile>(BLANK);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile({ ...BLANK, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  const set = (key: keyof HunterProfile, value: string) => {
    setSaved(false);
    setProfile(p => ({ ...p, [key]: value }));
  };

  const setLicense = (stateId: string, value: string) => {
    setSaved(false);
    setProfile(p => ({ ...p, licenses: { ...p.licenses, [stateId]: value } }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
  };

  const handleClear = () => {
    if (confirm("Clear your entire hunter profile? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setProfile(BLANK);
      setSaved(false);
    }
  };

  if (!loaded) return null;

  const isComplete = profile.firstName && profile.lastName && profile.dob && profile.address;

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner">

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            My Hunter Profile
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>
            Fill once. Tag Hunter uses this to generate pre-fill cards for every state application.
          </p>
        </div>

        {/* Privacy notice */}
        <div className="card" style={{
          padding: "12px 16px",
          marginBottom: 24,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          background: "rgba(74,222,128,0.06)",
          borderColor: "rgba(74,222,128,0.2)",
        }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>🔒</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", marginBottom: 2 }}>
              100% local. Never uploaded.
            </p>
            <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6 }}>
              Your profile is stored only in your browser (localStorage). No server ever sees your name, address, or license numbers. Tag Hunter does not collect personal data.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Personal Info */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: "var(--text)" }}>
              Personal Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="First Name">
                <input className="input" value={profile.firstName}
                  onChange={e => set("firstName", e.target.value)} placeholder="John" />
              </Field>
              <Field label="Last Name">
                <input className="input" value={profile.lastName}
                  onChange={e => set("lastName", e.target.value)} placeholder="Smith" />
              </Field>
              <Field label="Date of Birth" hint="Required by all state wildlife agencies">
                <input className="input" type="date" value={profile.dob}
                  onChange={e => set("dob", e.target.value)} />
              </Field>
              <Field label="SSN Last 4" hint="Many state portals require this for account verification">
                <input className="input" value={profile.ssn4} maxLength={4}
                  onChange={e => set("ssn4", e.target.value.replace(/\D/g, ""))}
                  placeholder="1234" inputMode="numeric" />
              </Field>
              <Field label="Phone">
                <input className="input" value={profile.phone}
                  onChange={e => set("phone", e.target.value)} placeholder="(555) 867-5309" />
              </Field>
              <Field label="Email">
                <input className="input" type="email" value={profile.email}
                  onChange={e => set("email", e.target.value)} placeholder="you@email.com" />
              </Field>
            </div>
          </div>

          {/* Address */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: "var(--text)" }}>
              Home Address
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Street Address">
                <input className="input" value={profile.address}
                  onChange={e => set("address", e.target.value)} placeholder="123 Main St" />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
                <Field label="City">
                  <input className="input" value={profile.city}
                    onChange={e => set("city", e.target.value)} placeholder="Denver" />
                </Field>
                <Field label="State">
                  <select className="input" value={profile.residencyState}
                    onChange={e => set("residencyState", e.target.value)}>
                    <option value="">—</option>
                    {STATE_ABBREVS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="ZIP">
                  <input className="input" value={profile.zip} maxLength={10}
                    onChange={e => set("zip", e.target.value)} placeholder="80202" />
                </Field>
              </div>
            </div>
          </div>

          {/* Hunter Education */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: "var(--text)" }}>
              Hunter Education
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Certificate Number" hint="Found on your hunter ed card">
                <input className="input" value={profile.hunterEdNumber}
                  onChange={e => set("hunterEdNumber", e.target.value)} placeholder="CO-12345" />
              </Field>
              <Field label="Issuing State">
                <select className="input" value={profile.hunterEdState}
                  onChange={e => set("hunterEdState", e.target.value)}>
                  <option value="">—</option>
                  {STATE_ABBREVS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 12 }}>
              Most states accept hunter education certificates from other states via reciprocity.
            </p>
          </div>

          {/* State License Numbers */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>
              State License Numbers
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 18, lineHeight: 1.6 }}>
              Optional — add the license or customer number for states you already have accounts in.
              Saves time when generating pre-fill cards.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {LICENSE_STATES.map(s => (
                <Field key={s.id} label={s.name}>
                  <input className="input" value={profile.licenses[s.id] ?? ""}
                    onChange={e => setLicense(s.id, e.target.value)}
                    placeholder={`${s.id.toUpperCase()} license #`} />
                </Field>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", paddingBottom: 32 }}>
            <button
              onClick={handleSave}
              className="btn-primary"
              style={{ padding: "12px 28px" }}
            >
              {saved ? "✓ Saved" : "Save Profile"}
            </button>
            {isComplete && (
              <Link href="/apply" className="btn-ghost" style={{ padding: "12px 24px" }}>
                Go to Application Center →
              </Link>
            )}
            <button
              onClick={handleClear}
              style={{
                marginLeft: "auto",
                fontSize: 12,
                color: "var(--text-3)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Clear Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
