"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  // This group has no layout, so the page's AppShell, and its <main>, is gone
  // when this boundary renders. The marketing and auth layouts keep theirs.
  return (
    <main id="main-content" tabIndex={-1}>
      <ErrorState error={error} retry={retry} scope="app" />
    </main>
  );
}
