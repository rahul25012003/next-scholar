import type { Metadata } from "next";
import { termsOfUse } from "@/content/legal";
import { LegalDocumentView } from "@/components/legal/document";

export const metadata: Metadata = {
  title: termsOfUse.title,
  description: termsOfUse.lede.slice(0, 200),
  alternates: { canonical: "/terms" },
};

export default function TermsOfUsePage() {
  return <LegalDocumentView doc={termsOfUse} />;
}
