"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function MarketingError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <ErrorState error={error} retry={retry} scope="site" />;
}
