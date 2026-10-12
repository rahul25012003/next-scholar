import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/shell";
import { CostOfLivingPicker } from "@/components/tools/cost-picker";

export const metadata: Metadata = {
  title: "Cost of living calculator",
  description:
    "What a year costs in each of our three destinations, line by line, with a source for every range. Every line can be edited, and no signup is needed.",
  alternates: { canonical: "/tools/cost-of-living" },
};

export default async function CostOfLivingPage(props: PageProps<"/tools/cost-of-living">) {
  const { destination } = await props.searchParams;
  return (
    <ToolPage
      title="What a year there actually costs"
      lede="Each range names the body that publishes it, and you can edit any line, such as your own rent. Tuition is not included: it is listed separately on each destination guide."
    >
      <CostOfLivingPicker
        initialDestination={typeof destination === "string" ? destination : undefined}
      />
    </ToolPage>
  );
}
