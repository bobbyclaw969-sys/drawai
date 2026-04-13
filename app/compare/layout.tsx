import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare States — Tag Hunter",
  description: "Side-by-side comparison of hunting states. Compare draw odds, fees, point systems, and tag availability.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
