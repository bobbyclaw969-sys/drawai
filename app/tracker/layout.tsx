import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Tracker — Tag Hunter",
  description: "Track your hunting draw applications, fees spent, and results across every state and species.",
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
