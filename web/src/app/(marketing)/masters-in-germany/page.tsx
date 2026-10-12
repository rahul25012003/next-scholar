import type { Metadata } from "next";
import { currentShortlist } from "@/app/actions/shortlist";
import { MastersLanding } from "@/components/catalogue/masters-landing";

export const metadata: Metadata = {
  title: "Masters in Germany",
  description:
    "Taught Master's programmes in Germany, chosen by hand, each with its fee.",
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
