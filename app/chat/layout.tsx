import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Hunting Advisor — Ask Anything | Tag Hunter",
  description:
    "Chat with an AI advisor about draw strategies, application deadlines, point systems, fees, and regulations across 25+ states.",
  openGraph: {
    title: "AI Hunting Advisor — Ask Anything | Tag Hunter",
    description:
      "Free AI hunting advisor for western big game draw strategy.",
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
