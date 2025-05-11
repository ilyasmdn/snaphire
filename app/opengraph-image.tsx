import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
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
          background: "linear-gradient(to bottom, #0066cc, #004c99)",
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
            width={200}
            height={200}
            style={{ marginRight: 40 }}
          />
          <div style={{ textAlign: "left" }}>
            <h1
              style={{
                fontSize: 80,
                margin: 0,
                fontWeight: "bold",
                lineHeight: 1.1,
              }}
            >
              SnapHire
            </h1>
            <p
              style={{
                fontSize: 36,
                margin: 0,
                marginTop: 10,
                opacity: 0.9,
                maxWidth: 500,
              }}
            >
              AI-Powered Interview Practice
            </p>
          </div>
        </div>
        <p
          style={{
            fontSize: 32,
            position: "absolute",
            bottom: 30,
            maxWidth: 900,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Master your interview skills with advanced AI feedback
        </p>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
