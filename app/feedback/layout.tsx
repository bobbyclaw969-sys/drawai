import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback — Tag Hunter",
  description: "Share feedback about Tag Hunter. Report bugs, request features, or tell us what you think.",
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
