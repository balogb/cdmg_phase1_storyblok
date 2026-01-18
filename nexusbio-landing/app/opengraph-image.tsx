import { ImageResponse } from "next/og";

/**
 * Default Open Graph Image
 * Generated dynamically for social sharing when no specific OG image is set.
 *
 * This creates a branded fallback image for:
 * - Facebook shares
 * - Twitter cards
 * - LinkedIn posts
 * - Slack previews
 *
 * Customize colors and text for client branding.
 */

export const runtime = "edge";
export const alt = "Company Name - Investor Relations";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Logo placeholder - replace with actual logo */}
        <div
          style={{
            width: "120px",
            height: "120px",
            background: "white",
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
            fontSize: "60px",
            fontWeight: "bold",
            color: "#1e3a8a",
          }}
        >
          C
        </div>

        {/* Company Name */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          [Company Name]
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
          }}
        >
          Investor Relations
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            [TICKER: XXXX]
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
