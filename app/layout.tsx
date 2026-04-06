import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Tag Hunter — Free Hunting Tag Strategy",
  description:
    "Free AI concierge that builds your personalized multi-year hunting strategy. Elk, deer, pronghorn, sheep, and more. No signup required.",
  openGraph: {
    title: "Tag Hunter — Free Hunting Tag Strategy",
    description:
      "Stop guessing. Get a personalized 10-year hunt plan based on your points, budget, and goals. Free, no signup.",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Tag Hunter",
  },
};

export const viewport = {
  themeColor: "#e8960f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
