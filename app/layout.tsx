import type { Metadata } from "next";
import { Inter, Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["700", "900"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Tag Hunter — Free Hunting Tag Strategy",
  description:
    "Free AI concierge that builds your personalized multi-year hunting strategy. Elk, deer, pronghorn, sheep, and more. No signup required.",
  openGraph: {
    title: "Tag Hunter — Free Hunting Tag Strategy",
    description:
      "Stop guessing. Get a personalized 10-year hunt plan based on your points, budget, and goals. Free, no signup.",
    siteName: "Tag Hunter",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tag Hunter — Free Hunting Tag Strategy",
    description:
      "AI-powered draw strategy for every western big game species. Build your 10-year hunt plan free.",
  },
  other: {
    "mobile-web-app-capable": "yes",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Tag Hunter",
        url: "https://taghunter.us",
        description:
          "Free AI concierge that builds your personalized multi-year hunting strategy across 25+ states and 9 big game species.",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Organization",
        name: "Factor21",
        url: "https://f21.ai",
        description: "Technology company building tools that close information gaps.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is Tag Hunter really free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Tag Hunter is 100% free with no credit card, hidden fees, or premium tier required.",
            },
          },
          {
            "@type": "Question",
            name: "What states does Tag Hunter cover?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Tag Hunter covers 25+ states with deep data on the major western states: Wyoming, Colorado, Montana, Idaho, Utah, Arizona, New Mexico, Nevada, Oregon, and Washington.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to create an account?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. All core features work without an account. Your data is stored locally in your browser.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className={`h-full ${inter.variable} ${playfair.variable} ${dmMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
