import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Checklist — Tag Hunter",
  description: "Your personalized checklist of upcoming hunting draw deadlines. Never miss an application window.",
};

export default function ChecklistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
