import type { Metadata } from "next";
import { cookiePolicy } from "@/content/legal";
import { LegalDocumentView } from "@/components/legal/document";

export const metadata: Metadata = {
  title: cookiePolicy.title,
  description: cookiePolicy.lede.slice(0, 200),
  alternates: { canonical: "/cookies" },
};

export default function CookiePolicyPage() {
  return <LegalDocumentView doc={cookiePolicy} />;
}
