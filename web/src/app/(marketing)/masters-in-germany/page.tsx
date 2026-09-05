import type { Metadata } from "next";
import { currentShortlist } from "@/app/actions/shortlist";
import { MastersLanding } from "@/components/catalogue/masters-landing";

export const metadata: Metadata = {
  title: "Masters in Germany",
  description:
    "Taught Master's programmes in Germany, curated by hand, each with what we earn from the institution printed next to the fee. German public universities pay agents nothing.",
  alternates: { canonical: "/masters-in-germany" },
};

export default async function MastersInGermanyPage(props: PageProps<"/masters-in-germany">) {
  const searchParams = await props.searchParams;
  const saved = await currentShortlist();
  return (
    <MastersLanding
      destinationSlug="germany"
      country="Germany"
      searchParams={searchParams}
      savedSlugs={saved}
    />
  );
}
