"use client";
import { Application } from "@/lib/tracker";
import { SPECIES_LABELS } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";

interface Props {
  apps: Application[];
}

export default function BudgetDashboard({ apps }: Props) {
  if (apps.length === 0) return null;

  const appsWithFees = apps.filter(a => a.feeSpent > 0);
  if (appsWithFees.length === 0) return null;

  // By year
  const byYear: Record<number, { total: number; drawn: number; count: number }> = {};
  for (const a of appsWithFees) {
    if (!byYear[a.year]) byYear[a.year] = { total: 0, drawn: 0, count: 0 };
    byYear[a.year].total += a.feeSpent;
    byYear[a.year].count += 1;
    if (a.status === "drawn") byYear[a.year].drawn += 1;
  }

  // By species
  const bySpecies: Record<string, number> = {};
  for (const a of appsWithFees) {
    bySpecies[a.species] = (bySpecies[a.species] ?? 0) + a.feeSpent;
  }

  const totalSpent = appsWithFees.reduce((s, a) => s + a.feeSpent, 0);
  const totalDrawn = apps.filter(a => a.status === "drawn").length;
  const costPerTag = totalDrawn > 0 ? Math.round(totalSpent / totalDrawn) : null;

  const years = Object.keys(byYear).map(Number).sort((a, b) => a - b);
  const maxYearTotal = Math.max(...Object.values(byYear).map(v => v.total));

  const speciesSorted = Object.entries(bySpecies).sort((a, b) => b[1] - a[1]);
  const maxSpeciesTotal = speciesSorted[0]?.[1] ?? 1;

  return (
    <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-2)" }}>
        Budget Dashboard
      </h3>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: "var(--amber)" }}>${totalSpent.toLocaleString()}</div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>Total spent</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: "var(--success)" }}>{totalDrawn}</div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>Tags drawn</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: costPerTag ? "var(--text)" : "var(--text-3)" }}>
            {costPerTag ? `$${costPerTag.toLocaleString()}` : "—"}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>Cost per tag</div>
        </div>
      </div>

      {/* Year chart */}
      {years.length > 1 && (
        <div className="mb-5">
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-3)" }}>Fees by year</p>
          <div className="space-y-2">
            {years.map(y => {
              const v = byYear[y];
              const pct = Math.round((v.total / maxYearTotal) * 100);
              return (
                <div key={y}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--text-2)" }}>{y}</span>
                    <span style={{ color: "var(--text-2)" }}>
                      ${v.total.toLocaleString()} · {v.count} apps · {v.drawn} drawn
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: v.drawn > 0 ? "var(--success)" : "var(--amber)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* By species */}
      {speciesSorted.length > 1 && (
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-3)" }}>Fees by species</p>
          <div className="space-y-2">
            {speciesSorted.map(([species, total]) => {
              const pct = Math.round((total / maxSpeciesTotal) * 100);
              return (
                <div key={species}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--text-2)" }}>{SPECIES_LABELS[species as SpeciesKey]}</span>
                    <span style={{ color: "var(--text-2)" }}>${total.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--amber)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
