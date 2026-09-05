import { Hero, HeroQuickLinks } from "@/components/marketing/hero";
import { CredentialsBanner } from "@/components/marketing/credentials-banner";
import { DayOneFigures } from "@/components/marketing/day-one-figures";
import { TheProblem } from "@/components/marketing/the-problem";
import { RevenueChart } from "@/components/marketing/revenue-chart";
import { PolicyDesk } from "@/components/marketing/policy-desk";
import { Destinations } from "@/components/marketing/destinations";
import { Process } from "@/components/marketing/process";
import { Outcomes } from "@/components/marketing/outcomes";
import { ClosingCta } from "@/components/marketing/closing-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HeroQuickLinks />
      <CredentialsBanner />
      <DayOneFigures />
      <TheProblem />
      <RevenueChart />
      <Destinations />
      <PolicyDesk />
      <Process />
      <Outcomes />
      <ClosingCta />
    </>
  );
}
