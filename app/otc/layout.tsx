import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NR OTC Tag Finder — Hunt This Year | Tag Hunter",
  description:
    "Find over-the-counter hunting tags available to non-residents right now. No draw required — buy and hunt this season.",
  openGraph: {
    title: "NR OTC Tag Finder — Hunt This Year | Tag Hunter",
    description:
      "Over-the-counter hunting tags for non-residents. No draw, hunt this year.",
  },
};

export default function OtcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
