import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers — required for acquisition due diligence
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Block obvious API abuse on AI routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ct = request.headers.get("content-type") ?? "";
    if (request.method === "POST" && !ct.includes("application/json")) {
      return new Response("Bad Request", { status: 400 });
    }
    // Reject suspiciously large bodies at the edge before they hit our routes
    const contentLength = parseInt(request.headers.get("content-length") ?? "0");
    if (contentLength > 50_000) {
      return new Response("Payload Too Large", { status: 413 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-).*)"],
};
