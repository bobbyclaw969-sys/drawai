import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Hunt Finder — Match Units to Your Points | Tag Hunter",
  description:
    "Tell us your species, points, and budget. Our AI finds the best units and states for your western big game hunt.",
  openGraph: {
    title: "AI Hunt Finder — Match Units to Your Points | Tag Hunter",
    description:
      "AI-powered unit matching for western big game hunters.",
  },
};

export default function FindLayout({ children }: { children: React.ReactNode }) {
  return children;
}
