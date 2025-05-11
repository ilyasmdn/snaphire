import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 1200,
  height: 628,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to right, #0066cc, #3399ff)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://snaphire.pro/snaphire.png"
            alt="SnapHire Logo"
            width={180}
            height={180}
            style={{ marginRight: 30 }}
          />
          <div style={{ textAlign: "left" }}>
            <h1
              style={{
                fontSize: 72,
                margin: 0,
                fontWeight: "bold",
                lineHeight: 1.1,
              }}
            >
              SnapHire
            </h1>
            <p
              style={{
                fontSize: 32,
                margin: 0,
                marginTop: 8,
                opacity: 0.9,
                maxWidth: 450,
              }}
            >
              Ace Your Next Interview
            </p>
          </div>
        </div>
        <p
          style={{
            fontSize: 28,
            position: "absolute",
            bottom: 30,
            maxWidth: 850,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          AI-powered mock interviews with personalized feedback
        </p>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
