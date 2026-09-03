import type { Metadata } from "next";
import { refundPolicy } from "@/content/legal";
import { LegalDocumentView } from "@/components/legal/document";

export const metadata: Metadata = {
  title: refundPolicy.title,
  description: refundPolicy.lede.slice(0, 200),
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return <LegalDocumentView doc={refundPolicy} />;
}
