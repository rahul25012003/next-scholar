import { ImageResponse } from "next/og";

/** The 192x192 icon a browser's install prompt and home screen ask for. */
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
          fontSize: 120,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        N
      </div>
    ),
    { width: 192, height: 192 },
  );
}
