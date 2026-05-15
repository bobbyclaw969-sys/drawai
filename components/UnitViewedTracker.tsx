"use client";
import { useEffect } from "react";
import { track } from "@/lib/posthog";

interface Props {
  state: string;
  /** When TagHunter has true sub-state units this should be the unit number/slug.
   *  For now the state page is the closest analog so we pass the state id.   */
  unitId: string;
  speciesSlug?: string;
}

/** Fires a single `unit_viewed` event on mount. Use inside server components. */
export default function UnitViewedTracker({ state, unitId, speciesSlug }: Props) {
  useEffect(() => {
    track("unit_viewed", { state, unit_id: unitId, species_slug: speciesSlug ?? null });
  }, [state, unitId, speciesSlug]);
  return null;
}
