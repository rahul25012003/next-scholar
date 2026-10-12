import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BurstLayer } from "@/components/ui/burst-layer";
import { site } from "@/content/site";

// Headings in Plus Jakarta Sans, everything else in Inter: Inter's tall
// x-height keeps small text and fee tables readable, and Jakarta keeps the
// headings confident without Montserrat's width. Both are variable fonts, so
// one file each covers every weight the stylesheet asks for.
const display = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // No domain is registered yet, so none is asserted here.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : null,
  title: {
    default: "Next Scholar",
    template: "%s | Next Scholar",
  },
  description: `${site.pitch} ${site.description}`,
  openGraph: {
    title: "Next Scholar",
    description: `${site.pitch} ${site.description}`,
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#4899df",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${display.variable} ${sans.variable} background h-full`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <BurstLayer />
      </body>
    </html>
  );
}
