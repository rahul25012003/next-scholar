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
          backgroundColor: "#205bad",
          color: "#f0f0f0",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          lineHeight: 1.5,
          padding: "2rem 1.25rem",
        }}
      >
        <title>Something failed | Next Scholar</title>
        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.8125rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#c7dbf4",
            }}
          >
            Application error
          </p>
          <h1
            style={{
              margin: "0.75rem 0 0",
              fontSize: "2.2rem",
              lineHeight: 1.2,
              fontWeight: 900,
              color: "#ffffff",
            }}
          >
            The site failed to load
          </h1>
          <p style={{ margin: "1.25rem 0 0", fontSize: "1.125rem" }}>
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
                color: "#484848",
                fontSize: "0.9375rem",
              }}
            >
              <strong style={{ color: "#205bad" }}>Reference:</strong>{" "}
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{error.digest}</span>
            </p>
          )}
          <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => retry()}
              style={{
                appearance: "none",
                border: "none",
                borderRadius: "99px",
                background: "#de2870",
                color: "#ffffff",
                padding: "0.5rem 2.5rem",
                fontSize: "1.125rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- this boundary replaces the root layout, so the router Link depends on may not be mounted. A full document load is the point. */}
            <a
              href="/"
              style={{
                borderRadius: "99px",
                background: "#4899df",
                color: "#ffffff",
                padding: "0.5rem 2.5rem",
                fontSize: "1.125rem",
                fontWeight: 700,
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
