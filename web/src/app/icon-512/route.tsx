import { ImageResponse } from "next/og";

/** The 512x512 icon a browser's install prompt and app store listing ask for. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#205bad",
          color: "#ffffff",
          fontSize: 320,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        N
      </div>
    ),
    { width: 512, height: 512 },
  );
}
