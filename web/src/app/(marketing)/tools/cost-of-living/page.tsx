import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/shell";
import { CostOfLivingPicker } from "@/components/tools/cost-picker";

export const metadata: Metadata = {
  title: "Cost of living calculator",
  description:
    "What a year actually costs in each of our three destinations, broken into line items with every range sourced. Editable, ungated, and never converted into a probability of anything.",
  alternates: { canonical: "/tools/cost-of-living" },
};

export default async function CostOfLivingPage(props: PageProps<"/tools/cost-of-living">) {
  const { destination } = await props.searchParams;
  return (
    <ToolPage
      title="What a year there actually costs"
      lede="Line by line, with each range attributed to the body that publishes it, and every line editable so your own rent can sit next to our published figure. Tuition is not in here: it is a separate number on each destination guide."
    >
      <CostOfLivingPicker
        initialDestination={typeof destination === "string" ? destination : undefined}
      />
    </ToolPage>
  );
}
