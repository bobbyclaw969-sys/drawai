import type { NextConfig } from "next";

// CSP: Next.js requires unsafe-inline for its hydration scripts/styles.
// frame-ancestors 'none' is the modern replacement for X-Frame-Options: DENY.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  // Supabase for auth + data; accounts.google.com for Google OAuth
  "connect-src 'self' https://tynbozzvqztyqapdfkna.supabase.co https://accounts.google.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  serverExternalPackages: ["@anthropic-ai/sdk"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",     value: "nosniff" },
          { key: "X-XSS-Protection",           value: "1; mode=block" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy",    value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
