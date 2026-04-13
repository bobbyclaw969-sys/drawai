import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Hunt Strategy — Tag Hunter",
  description: "Your personalized multi-year western big game draw strategy, built by AI.",
};

export default function StrategyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
