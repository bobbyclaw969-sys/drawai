import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "https://drawai-six.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

export function proxy(request: NextRequest) {
  const { pathname, origin: requestOrigin } = request.nextUrl;
  const incomingOrigin = request.headers.get("origin");

  // ── API route protection ──────────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const ct = request.headers.get("content-type") ?? "";

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      const allowed = !incomingOrigin || ALLOWED_ORIGINS.includes(incomingOrigin);
      if (!allowed) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": incomingOrigin ?? ALLOWED_ORIGINS[0],
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Reject cross-origin POST requests from unknown origins
    if (request.method === "POST" && incomingOrigin && !ALLOWED_ORIGINS.includes(incomingOrigin)) {
      return new Response("Forbidden", { status: 403 });
    }

    // Require JSON content-type on POST
    if (request.method === "POST" && !ct.includes("application/json")) {
      return new Response("Bad Request", { status: 400 });
    }

    // Reject suspiciously large bodies
    const contentLength = parseInt(request.headers.get("content-length") ?? "0");
    if (contentLength > 50_000) {
      return new Response("Payload Too Large", { status: 413 });
    }
  }

  const response = NextResponse.next();

  // ── Security headers ──────────────────────────────────────────────────────
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // ── CORS: restrict API responses to allowed origins ───────────────────────
  if (pathname.startsWith("/api/") && incomingOrigin && ALLOWED_ORIGINS.includes(incomingOrigin)) {
    response.headers.set("Access-Control-Allow-Origin", incomingOrigin);
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Vary", "Origin");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-).*)"],
};
