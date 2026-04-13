import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hunter Profile — Tag Hunter",
  description: "Set up your hunter profile to unlock personalized strategy recommendations and application pre-fill.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
