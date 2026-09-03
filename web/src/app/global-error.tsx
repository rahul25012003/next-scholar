"use client";

/**
 * The last boundary.
 *
 * This one replaces the root layout when it fires, so it renders its own html
 * and body and cannot rely on the design tokens, the fonts or the shell. The
 * styles are therefore inline and deliberately plain: a global error page that
 * itself depends on the stylesheet that may have failed is not a fallback.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          backgroundColor: "#f6f8fc",
          color: "#5b6472",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          lineHeight: 1.65,
          padding: "2rem 1.25rem",
        }}
      >
        <title>Something failed | Next Scholar</title>
        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#b42318",
            }}
          >
            Application error
          </p>
          <h1
            style={{
              margin: "0.75rem 0 0",
              fontSize: "1.875rem",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#0e2a5e",
            }}
          >
            The site failed to load
          </h1>
          <p style={{ margin: "1.25rem 0 0", fontSize: "1.0625rem" }}>
            This is a failure in the application itself rather than in the page you asked
            for. Nothing you were reading was stored on your behalf, and no action you took
            on a public page was lost, because public pages do not store anything.
          </p>
          {error.digest && (
            <p
              style={{
                margin: "1.5rem 0 0",
                padding: "1rem 1.25rem",
                background: "#ffffff",
                border: "1px solid #e7ebf3",
                borderRadius: "1rem",
                fontSize: "0.9375rem",
              }}
            >
              <strong style={{ color: "#0e2a5e" }}>Reference:</strong>{" "}
              <span style={{ fontFamily: "ui-monospace, monospace" }}>{error.digest}</span>
            </p>
          )}
          <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => retry()}
              style={{
                appearance: "none",
                border: "none",
                borderRadius: "999px",
                background: "#1553d6",
                color: "#ffffff",
                padding: "0.8rem 1.75rem",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- this boundary replaces the root layout, so the router Link depends on may not be mounted. A full document load is the point. */}
            <a
              href="/"
              style={{
                borderRadius: "999px",
                border: "1px solid #d3dae8",
                background: "#ffffff",
                color: "#0e2a5e",
                padding: "0.8rem 1.75rem",
                fontSize: "1rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Back to the start
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
