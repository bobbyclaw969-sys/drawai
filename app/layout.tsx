import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DrawAI — Free Hunting Tag Strategy",
  description:
    "Free AI concierge that builds your personalized multi-year hunting strategy. Elk, deer, pronghorn, sheep, and more. No signup required.",
  openGraph: {
    title: "DrawAI — Free Hunting Tag Strategy",
    description:
      "Stop guessing. Get a personalized 10-year hunt plan based on your points, budget, and goals. Free, no signup.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#0f1a0f", color: "#e8f0e8" }}>
        {children}
      </body>
    </html>
  );
}
