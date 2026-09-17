import type { Metadata, Viewport } from "next";
import { Montserrat, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  description:
    "A study abroad consultancy that publishes what it earns on every university it recommends, including the ones that pay nothing.",
  openGraph: {
    title: "Next Scholar",
    description:
      "We publish what we earn on every university we recommend. Bengaluru based, three destinations covered in full depth.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
