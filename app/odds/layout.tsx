import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draw Odds Calculator — Every State, Every Species | Tag Hunter",
  description:
    "Compare draw odds across states and species. See how preference points affect your chances for elk, mule deer, pronghorn, sheep, moose, and goat tags.",
  openGraph: {
    title: "Draw Odds Calculator — Every State, Every Species | Tag Hunter",
    description:
      "Compare western big game draw odds by state, species, and point level.",
  },
};

export default function OddsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
