import type { Metadata } from "next";
import { nonAffiliation } from "@/content/legal";
import { LegalDocumentView } from "@/components/legal/document";

export const metadata: Metadata = {
  title: nonAffiliation.title,
  description: nonAffiliation.lede.slice(0, 200),
  alternates: { canonical: "/non-affiliation" },
};

export default function NonAffiliationPage() {
  return <LegalDocumentView doc={nonAffiliation} />;
}
