import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tag Hunter — Free AI-powered western draw strategy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SOIL = "#0F0D0A";
const AMBER = "#D4852A";
const BONE = "#FFFFFF";
const DUST = "#7A6E5F";

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
          background: SOIL,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Subtle amber glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 400,
            background: "radial-gradient(ellipse, rgba(212,133,42,0.16) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 104,
            fontWeight: 700,
            color: BONE,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textAlign: "center",
            position: "relative",
            display: "flex",
          }}
        >
          ◎ TAG HUNTER
        </div>

        {/* Amber rule */}
        <div
          style={{
            width: 120,
            height: 3,
            background: AMBER,
            marginTop: 36,
            marginBottom: 36,
            display: "flex",
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: DUST,
            textAlign: "center",
            position: "relative",
            display: "flex",
            fontFamily: "Georgia, serif",
          }}
        >
          Free AI-powered western draw strategy
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            fontSize: 22,
            color: AMBER,
            letterSpacing: "0.08em",
            display: "flex",
            fontFamily: "Georgia, serif",
          }}
        >
          taghunter.us
        </div>
      </div>
    ),
    { ...size },
  );
}
