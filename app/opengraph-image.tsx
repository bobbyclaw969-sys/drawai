import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tag Hunter — Free AI Hunting Tag Strategy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #060d05 0%, #0b1809 50%, #091507 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Amber glow */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 400,
            background: "radial-gradient(ellipse, rgba(210,130,10,0.15) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 64,
              marginBottom: 24,
            }}
          >
            🎯
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#ede8dc",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Tag Hunter
          </div>

          <div
            style={{
              fontSize: 28,
              color: "#e8960f",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Free AI Hunting Tag Strategy
          </div>

          <div
            style={{
              display: "flex",
              gap: 32,
              fontSize: 18,
              color: "#8fb887",
            }}
          >
            <span>25+ States</span>
            <span style={{ color: "#4a6e45" }}>|</span>
            <span>9 Species</span>
            <span style={{ color: "#4a6e45" }}>|</span>
            <span>AI-Powered Plans</span>
            <span style={{ color: "#4a6e45" }}>|</span>
            <span>100% Free</span>
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "#8fb887",
          }}
        >
          Built by Factor21 — drawai-six.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
