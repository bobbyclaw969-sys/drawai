import Link from "next/link";
import AppNav from "@/components/AppNav";
import { huntingData, SPECIES_LABELS, SPECIES_EMOJI, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";

export const metadata = {
  title: "State Hunting Profiles — Draw Tags, OTC & Fees | Tag Hunter",
  description: "Browse every western and eastern hunting state. Non-resident fees, draw odds, preference points, OTC tags, and application deadlines.",
};

export default function StatesIndexPage() {
  const stateIds = [...new Set(huntingData.map(d => d.stateId))].sort();

  const stateData = stateIds.map(id => {
    const entries = huntingData.filter(d => d.stateId === id);
    const species = [...new Set(entries.map(d => d.species as SpeciesKey))];
    const hasOTC = entries.some(e => e.hasOTC);
    const minFee = Math.min(...entries.map(e => e.feeNonresident));
    const stateName = entries[0]?.stateName ?? STATE_NAMES[id.toUpperCase()] ?? id.toUpperCase();
    return { id, stateName, species, hasOTC, minFee };
  });

  const western = stateData.filter(s =>
    ["co","wy","mt","id","ut","nv","az","nm","or","wa","ca","sd"].includes(s.id)
  );
  const eastern = stateData.filter(s =>
    !["co","wy","mt","id","ut","nv","az","nm","or","wa","ca","sd"].includes(s.id)
  );

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner-wide">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>State Profiles</h1>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>All western states, all species</p>
        </div>

        <StateGroup title="Western States" states={western} />
        {eastern.length > 0 && <StateGroup title="Eastern States" states={eastern} />}

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 32 }}>
          Tag Hunter — Free. Not affiliated with any state agency.
        </p>
      </div>
    </div>
  );
}

function StateGroup({ title, states }: { title: string; states: ReturnType<typeof Array.prototype.map> }) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-2)" }}>
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(states as { id: string; stateName: string; species: SpeciesKey[]; hasOTC: boolean; minFee: number }[]).map(s => (
          <Link key={s.id} href={`/states/${s.id}`}
            className="rounded-xl p-4 transition-all hover:border-amber-500"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", textDecoration: "none" }}>
            <div className="flex items-start justify-between mb-2">
              <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{s.stateName}</span>
              {s.hasOTC && (
                <span className="badge badge-green">
                  OTC
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {s.species.slice(0, 5).map(sp => (
                <span key={sp} title={SPECIES_LABELS[sp]} className="text-base">{SPECIES_EMOJI[sp]}</span>
              ))}
              {s.species.length > 5 && (
                <span className="text-xs" style={{ color: "var(--text-3)" }}>+{s.species.length - 5}</span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-3)" }}>
              <span>{s.species.length} species</span>
              <span style={{ color: "var(--amber)" }}>NR from ${s.minFee.toLocaleString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
