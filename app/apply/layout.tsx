import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Tags — State-by-State Guides | Tag Hunter",
  description: "Step-by-step application guides for every western big game state. Official links, deadlines, and fees.",
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
