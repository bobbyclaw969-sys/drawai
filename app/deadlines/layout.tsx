import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Deadlines — Tag Hunter",
  description: "Every western big game application deadline in one place. Track elk, deer, pronghorn, sheep, moose, and goat draw dates.",
};

export default function DeadlinesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
