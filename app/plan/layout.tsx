import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Free Hunt Plan — Tag Hunter",
  description:
    "Create a personalized multi-year western big game draw strategy. Choose species, states, and budget — get an AI-built roadmap free.",
  openGraph: {
    title: "Build Your Free Hunt Plan — Tag Hunter",
    description:
      "Create a personalized multi-year western big game draw strategy free.",
  },
};

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
