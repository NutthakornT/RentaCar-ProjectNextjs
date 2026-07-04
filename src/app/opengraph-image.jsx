import { ImageResponse } from "next/og";

export const alt = "DriveLux — Premium Car Rental";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social share image. Kept ASCII-only and with explicit flex layout so
 * it renders without downloading dynamic fonts (Satori requirements).
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundImage:
            "linear-gradient(135deg, #0f4c81 0%, #0d3f6b 55%, #102c47 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.14)",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            D
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: "20px",
              fontSize: "40px",
              fontWeight: 700,
            }}
          >
            <span>Drive</span>
            <span style={{ color: "#f6c445" }}>Lux</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "76px",
              fontWeight: 800,
              lineHeight: 1.05,
              maxWidth: "900px",
            }}
          >
            Drive something exceptional
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "24px",
              fontSize: "34px",
              color: "#cbd5e1",
              maxWidth: "820px",
            }}
          >
            Premium cars by the day. Transparent pricing, instant booking.
          </div>
        </div>

        <div style={{ display: "flex", gap: "28px", fontSize: "26px", color: "#94a3b8" }}>
          <span>4.9 rating</span>
          <span>12,000+ trips</span>
          <span>24/7 support</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
