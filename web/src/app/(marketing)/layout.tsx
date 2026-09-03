import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { TalkToUs } from "@/components/site/talk-to-us";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <TalkToUs />
    </SmoothScroll>
  );
}
