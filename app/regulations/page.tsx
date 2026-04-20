import AppNav from "@/components/AppNav";
import { allRegulations } from "@/lib/regulations";
import RegulationsClient from "./RegulationsClient";

export const metadata = {
  title: "State Hunting Regulations Lookup — NR Fees, Deadlines, OTC | Tag Hunter",
  description:
    "Interactive lookup for non-resident hunting regulations across western states. Application deadlines, draw systems, fee breakdowns, OTC availability, and season dates for elk, deer, pronghorn, sheep, goat, bear, and moose.",
};

export default function RegulationsPage() {
  // Dataset schema — describes the structured regulations data this page exposes.
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Western Non-Resident Hunting Regulations 2026",
    description:
      "Application deadlines, draw systems, NR fees, OTC availability, GMU lists, and season dates for non-resident hunters across 10 western states.",
    url: "https://taghunter.us/regulations",
    creator: { "@type": "Organization", name: "Tag Hunter" },
    spatialCoverage: allRegulations.map(s => ({ "@type": "AdministrativeArea", name: s.state })),
    keywords:
      "hunting regulations, non-resident, NR fees, draw odds, application deadlines, OTC tags, elk, mule deer, pronghorn, bighorn sheep",
    license: "https://taghunter.us/terms",
    datePublished: "2026-04-20",
  };

  return (
    <div className="page">
      <AppNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <RegulationsClient />
    </div>
  );
}
