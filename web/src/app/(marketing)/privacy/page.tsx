import type { Metadata } from "next";
import { privacyPolicy } from "@/content/legal";
import { LegalDocumentView } from "@/components/legal/document";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.lede.slice(0, 200),
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentView doc={privacyPolicy} />;
}
