import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = new Set([
  "https://taghunter.us",
  "https://www.taghunter.us",
  "https://drawai-six.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
]);

/** Check allowed origins including Vercel preview deploys */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    return url.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

/** Resolve effective origin from either Origin or Referer header. */
function effectiveOrigin(req: NextRequest): string | null {
  const origin = req.headers.get("origin");
  if (origin) return origin;
  const referer = req.headers.get("referer");
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const incomingOrigin = request.headers.get("origin");
  const effective = effectiveOrigin(request);

  // ── API route protection ──────────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const ct = request.headers.get("content-type") ?? "";

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      const allowed = !incomingOrigin || isAllowedOrigin(incomingOrigin);
      if (!allowed) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": incomingOrigin ?? "https://taghunter.us",
          "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // CSRF: mutating requests must have a trusted origin/referer.
    // Missing-origin requests (curl, scripts) are blocked.
    const isMutating = request.method === "POST" || request.method === "DELETE" || request.method === "PUT" || request.method === "PATCH";
    if (isMutating && !isAllowedOrigin(effective)) {
      return new Response("Forbidden", { status: 403 });
    }

    // Require JSON content-type on POST/PUT/PATCH/DELETE (when body is sent)
    if (isMutating && !ct.includes("application/json") && parseInt(request.headers.get("content-length") ?? "0") > 0) {
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
  if (pathname.startsWith("/api/") && incomingOrigin && isAllowedOrigin(incomingOrigin)) {
    response.headers.set("Access-Control-Allow-Origin", incomingOrigin);
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Vary", "Origin");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-).*)"],
};
