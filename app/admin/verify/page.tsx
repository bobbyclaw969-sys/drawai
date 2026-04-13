"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { huntingData, SPECIES_LABELS, DATA_YEAR } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import {
  DeadlineVerification,
  VerificationInput,
  getAllVerifications,
  upsertVerification,
  deleteVerification,
  buildVerificationMap,
} from "@/lib/verifications";

// ── Design tokens ─────────────────────────────────────────────────────────
const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW = "#F0A040";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";
const PINE = "#4A7C59";
const DISPLAY = "var(--font-display), Georgia, serif";
const MONO = "var(--font-dm-mono), monospace";

const SEASON_YEAR = DATA_YEAR;

const ALL_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison",
];

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Rows whose hasOTC flag was changed in the most recent data audit.
// Admin should re-verify these against the official source first.
const RECENTLY_UPDATED = new Set<string>([
  "or-elk",
  "wa-elk",
  "id-black_bear",
  "or-black_bear",
  "co-black_bear",
  "ca-black_bear",
]);

const KNOWN_SOURCES: { state: string; url: string }[] = [
  { state: "Arizona",    url: "https://www.azgfd.com/hunting/draw/" },
  { state: "California", url: "https://wildlife.ca.gov/Licensing/Hunting" },
  { state: "Colorado",   url: "https://cpw.state.co.us/thingstodo/Pages/Hunting-Application.aspx" },
  { state: "Idaho",      url: "https://idfg.idaho.gov/licenses/hunting" },
  { state: "Montana",    url: "https://fwp.mt.gov/hunting" },
  { state: "Nevada",     url: "https://www.ndow.org/hunting/" },
  { state: "New Mexico", url: "https://www.wildlife.state.nm.us/hunting/" },
  { state: "Oregon",     url: "https://myodfw.com/hunting" },
  { state: "Utah",       url: "https://wildlife.utah.gov/hunting-in-utah.html" },
  { state: "Washington", url: "https://wdfw.wa.gov/licenses/hunting" },
  { state: "Wyoming",    url: "https://wgfd.wyo.gov/Hunting/Apply-for-a-License" },
];

interface DeadlineRow {
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  closeMonth: number;
  closeDay: number;
  feeNonresident: number;
  pointSystem: string;
}

/** Build a deduped list of (state, species) rows from huntingData. */
function buildDeadlineRows(): DeadlineRow[] {
  const seen = new Set<string>();
  const rows: DeadlineRow[] = [];
  for (const d of huntingData) {
    const key = `${d.stateId}-${d.species}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      stateId: d.stateId,
      stateName: d.stateName,
      species: d.species as SpeciesKey,
      closeMonth: d.appCloseMonth,
      closeDay: d.appCloseDay,
      feeNonresident: d.feeNonresident,
      pointSystem: d.pointSystem,
    });
  }
  return rows.sort((a, b) =>
    a.stateName.localeCompare(b.stateName) || a.species.localeCompare(b.species),
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function AdminVerifyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const adminEmails = useMemo(
    () => (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
      .split(",")
      .map(e => e.trim().toLowerCase())
      .filter(Boolean),
    [],
  );
  const isAdmin = !!user?.email && adminEmails.includes(user.email.toLowerCase());

  const [verifications, setVerifications] = useState<DeadlineVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SpeciesKey | "all">("all");
  const [showSources, setShowSources] = useState(false);

  // Redirect logged-out users
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [authLoading, user, router]);

  // Fetch verifications on mount + after each mutation
  const refresh = async () => {
    const data = await getAllVerifications(SEASON_YEAR);
    setVerifications(data);
    setLoading(false);
  };
  useEffect(() => {
    // eslint-disable-next-line
    if (isAdmin) refresh();
  }, [isAdmin]);

  const allRows = useMemo(() => buildDeadlineRows(), []);
  const verificationMap = useMemo(() => buildVerificationMap(verifications), [verifications]);

  const filteredRows = useMemo(
    () => filter === "all" ? allRows : allRows.filter(r => r.species === filter),
    [allRows, filter],
  );

  const totalCount = allRows.length;
  const verifiedCount = allRows.filter(r => verificationMap.has(`${r.stateId}-${r.species}`)).length;
  const unverifiedCount = totalCount - verifiedCount;
  const pct = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;
  const lastVerified = verifications[0]?.verified_at;

  // ── Auth gates ──
  if (authLoading) {
    return (
      <div style={{ background: SOIL, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, color: DUST, fontSize: 14 }}>
        Loading…
      </div>
    );
  }
  if (!user) return null; // redirecting
  if (!isAdmin) {
    return (
      <div style={{ background: SOIL, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, color: DUST, fontSize: 14, padding: 24, textAlign: "center" }}>
        Access denied.
      </div>
    );
  }

  return (
    <div style={{ background: SOIL, minHeight: "100vh", color: BONE, fontFamily: MONO }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${FENCE}`, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ color: AMBER, fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: "-0.01em" }}>
          ◎ TAG HUNTER
        </Link>
        <span style={{ fontFamily: MONO, fontSize: 12, color: DUST, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          ADMIN · {user.email}
        </span>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 80px" }}>
        {/* Title */}
        <h1 style={{ fontFamily: DISPLAY, fontSize: 36, fontWeight: 700, color: BONE, letterSpacing: "-0.02em", marginBottom: 12 }}>
          Data Verification
        </h1>
        <p style={{ fontFamily: MONO, fontSize: 14, color: DUST, lineHeight: 1.6, maxWidth: 640 }}>
          Verify all deadline data against official state agency sources before publishing. Each verified row stamps a public credibility badge on the dashboard.
        </p>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 32, marginBottom: 16, alignItems: "baseline" }}>
          <Stat
            value={`${verifiedCount} / ${totalCount}`}
            valueColor={AMBER}
            label="Verified"
          />
          <Stat
            value={String(unverifiedCount)}
            valueColor={unverifiedCount === 0 ? BONE : AMBER}
            label="Unverified"
          />
          <Stat value={`Season ${SEASON_YEAR}`} valueColor={BONE} label="Year" />
          <Stat
            value={lastVerified ? formatRelative(lastVerified) : "Never"}
            valueColor={BONE}
            label="Last verified"
          />
        </div>

        {/* Progress bar */}
        <div style={{ background: FENCE, height: 4, width: "100%", marginBottom: 8 }}>
          <div style={{ background: AMBER, height: "100%", width: `${pct}%`, transition: "width 0.3s" }} />
        </div>
        <p style={{ fontFamily: MONO, fontSize: 11, color: DUST, marginBottom: 32, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {pct}% of records verified
        </p>

        {/* Source reference panel */}
        <div style={{ marginBottom: 32, border: `1px solid ${FENCE}`, background: BARK }}>
          <button
            onClick={() => setShowSources(v => !v)}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              fontFamily: MONO,
              fontSize: 12,
              color: BONE,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            <span>Source Reference — Official State Agencies</span>
            <span style={{ color: DUST, fontSize: 11 }}>{showSources ? "−" : "+"}</span>
          </button>
          {showSources && (
            <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
              {KNOWN_SOURCES.map(s => (
                <a
                  key={s.state}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    color: DUST,
                    padding: "6px 0",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
                  onMouseLeave={e => (e.currentTarget.style.color = DUST)}
                >
                  <span style={{ color: BONE }}>{s.state}</span> &nbsp;·&nbsp; {s.url.replace(/https?:\/\//, "")}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Species filter tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>All</FilterPill>
          {ALL_SPECIES.map(s => (
            <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)}>
              {SPECIES_LABELS[s]}
            </FilterPill>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ fontFamily: MONO, color: DUST, fontSize: 14, textAlign: "center", padding: 40 }}>
            Loading verifications…
          </p>
        ) : (
          <div>
            {filteredRows.map(row => (
              <VerificationRow
                key={`${row.stateId}-${row.species}`}
                row={row}
                verification={verificationMap.get(`${row.stateId}-${row.species}`) ?? null}
                adminEmail={user.email!}
                onChange={refresh}
              />
            ))}
            {filteredRows.length === 0 && (
              <p style={{ fontFamily: MONO, color: DUST, fontSize: 14, textAlign: "center", padding: 40 }}>
                No rows for this filter.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function Stat({ value, valueColor, label }: { value: string; valueColor: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, color: valueColor, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: DUST, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {label}
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? AMBER : "transparent",
        color: active ? SOIL : DUST,
        border: `1px solid ${active ? AMBER : FENCE}`,
        borderRadius: 0,
        fontFamily: MONO,
        fontSize: 12,
        padding: "0 14px",
        height: 32,
        cursor: "pointer",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {children}
    </button>
  );
}

function VerificationRow({
  row,
  verification,
  adminEmail,
  onChange,
}: {
  row: DeadlineRow;
  verification: DeadlineVerification | null;
  adminEmail: string;
  onChange: () => Promise<void>;
}) {
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [feeNr, setFeeNr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-derive source label from URL host
  const handleUrlChange = (v: string) => {
    setSourceUrl(v);
    if (!sourceLabel && v) {
      try {
        const u = new URL(v);
        setSourceLabel(u.hostname.replace(/^www\./, ""));
      } catch {
        // ignore
      }
    }
  };

  const handleVerify = async () => {
    if (!sourceUrl.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const input: VerificationInput = {
        state_id: row.stateId,
        species: row.species,
        season_year: SEASON_YEAR,
        source_url: sourceUrl.trim(),
        source_label: sourceLabel.trim() || sourceUrl.trim(),
        notes: notes.trim() || null,
        close_date_confirmed: closeDate || null,
        fee_nr_confirmed: feeNr ? parseInt(feeNr, 10) : null,
        verified_by: adminEmail,
      };
      await upsertVerification(input);
      await onChange();
      setSourceUrl(""); setSourceLabel(""); setNotes(""); setCloseDate(""); setFeeNr("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Remove verification for ${row.stateName} ${SPECIES_LABELS[row.species]}?`)) return;
    setSubmitting(true);
    try {
      await deleteVerification(row.stateId, row.species, SEASON_YEAR);
      await onChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setSubmitting(false);
    }
  };

  const isVerified = !!verification;
  const inputStyle: React.CSSProperties = {
    background: SOIL,
    border: `1px solid ${FENCE}`,
    borderRadius: 0,
    color: BONE,
    fontFamily: MONO,
    fontSize: 13,
    padding: "0 12px",
    height: 36,
    outline: "none",
  };

  return (
    <div style={{
      background: BARK,
      borderTop: `1px solid ${FENCE}`,
      borderRight: `1px solid ${FENCE}`,
      borderBottom: `1px solid ${FENCE}`,
      borderLeft: `2px solid ${isVerified ? PINE : AMBER}`,
      borderRadius: 0,
      padding: 20,
      marginBottom: 8,
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-start" }}>
        {/* LEFT */}
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 18, color: BONE, fontWeight: 700 }}>{row.stateName}</span>
            <span style={{ fontFamily: MONO, fontSize: 12, color: DUST, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {SPECIES_LABELS[row.species]}
            </span>
            {RECENTLY_UPDATED.has(`${row.stateId}-${row.species}`) && (
              <span
                title="hasOTC was changed in the most recent data audit — verify against the source"
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  border: `1px solid ${AMBER}`,
                  color: AMBER,
                  background: "transparent",
                  borderRadius: 0,
                  whiteSpace: "nowrap",
                }}
              >
                ⚠ Data updated — verify
              </span>
            )}
          </div>
          <p style={{ fontFamily: MONO, fontSize: 11, color: DUST, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Closes {MONTHS[row.closeMonth]} {row.closeDay} · NR ${row.feeNonresident.toLocaleString()} · {row.pointSystem}
          </p>
          {isVerified ? (
            <p style={{ fontFamily: MONO, fontSize: 11, color: PINE, marginTop: 6 }}>
              ✓ Verified {formatRelative(verification!.verified_at)} by {verification!.verified_by}
            </p>
          ) : (
            <p style={{ fontFamily: MONO, fontSize: 11, color: AMBER, marginTop: 6 }}>
              ⚠ Unverified
            </p>
          )}
          {isVerified && verification!.notes && (
            <p style={{ fontFamily: MONO, fontSize: 11, color: DUST, fontStyle: "italic", marginTop: 4 }}>
              {verification!.notes}
            </p>
          )}
        </div>

        {/* RIGHT — form or compact verified state */}
        <div style={{ flex: "1 1 460px", minWidth: 0 }}>
          {isVerified ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                <a
                  href={verification!.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: AMBER,
                    fontFamily: MONO,
                    fontSize: 13,
                    textDecoration: "underline",
                  }}
                >
                  {verification!.source_label} ↗
                </a>
                {(verification!.close_date_confirmed || verification!.fee_nr_confirmed) && (
                  <span style={{ fontFamily: MONO, fontSize: 10, color: DUST, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {verification!.close_date_confirmed && `Date: ${verification!.close_date_confirmed}`}
                    {verification!.close_date_confirmed && verification!.fee_nr_confirmed && " · "}
                    {verification!.fee_nr_confirmed && `Fee: $${verification!.fee_nr_confirmed}`}
                  </span>
                )}
              </div>
              <button
                onClick={handleRemove}
                disabled={submitting}
                style={{
                  background: "transparent",
                  border: `1px solid ${FENCE}`,
                  borderRadius: 0,
                  color: DUST,
                  fontFamily: MONO,
                  fontSize: 11,
                  padding: "0 12px",
                  height: 28,
                  cursor: submitting ? "not-allowed" : "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
              <input
                type="url"
                placeholder="https://wildlife.state.gov/..."
                value={sourceUrl}
                onChange={e => handleUrlChange(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleVerify(); }}
                style={{ ...inputStyle, width: 240 }}
              />
              <input
                type="text"
                placeholder="source label"
                value={sourceLabel}
                onChange={e => setSourceLabel(e.target.value)}
                style={{ ...inputStyle, width: 140 }}
              />
              <input
                type="text"
                placeholder="notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ ...inputStyle, width: 160 }}
              />
              <input
                type="date"
                value={closeDate}
                onChange={e => setCloseDate(e.target.value)}
                style={{ ...inputStyle, width: 140 }}
                title="Confirmed close date (optional)"
              />
              <input
                type="number"
                placeholder="$"
                value={feeNr}
                onChange={e => setFeeNr(e.target.value)}
                style={{ ...inputStyle, width: 70 }}
                title="Confirmed NR fee (optional)"
              />
              <button
                onClick={handleVerify}
                disabled={submitting || !sourceUrl.trim()}
                style={{
                  background: !sourceUrl.trim() || submitting ? FENCE : AMBER,
                  color: !sourceUrl.trim() || submitting ? DUST : SOIL,
                  border: "none",
                  borderRadius: 0,
                  fontFamily: MONO,
                  fontWeight: 500,
                  fontSize: 13,
                  padding: "0 14px",
                  height: 36,
                  cursor: !sourceUrl.trim() || submitting ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (sourceUrl.trim() && !submitting) e.currentTarget.style.background = GLOW; }}
                onMouseLeave={e => { if (sourceUrl.trim() && !submitting) e.currentTarget.style.background = AMBER; }}
              >
                {submitting ? "…" : "✓ Mark Verified"}
              </button>
            </div>
          )}
          {error && (
            <p style={{ fontFamily: MONO, fontSize: 11, color: AMBER, marginTop: 8, textAlign: "right" }}>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
