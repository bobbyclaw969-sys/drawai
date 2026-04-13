import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hunter Dashboard — Tag Hunter",
  description: "Your hunting command center. Track deadlines, applications, points, and draw results across every state.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
