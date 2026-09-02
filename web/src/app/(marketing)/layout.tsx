import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </SmoothScroll>
  );
}
