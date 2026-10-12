import type { Metadata } from "next";
import { currentShortlist } from "@/app/actions/shortlist";
import { MastersLanding } from "@/components/catalogue/masters-landing";

export const metadata: Metadata = {
  title: "Masters in Ireland",
  description:
    "Taught Master's programmes in Ireland, chosen by hand, each with its fee.",
  alternates: { canonical: "/masters-in-ireland" },
};

export default async function MastersInIrelandPage(props: PageProps<"/masters-in-ireland">) {
  const searchParams = await props.searchParams;
  const saved = await currentShortlist();
  return (
    <MastersLanding
      destinationSlug="ireland"
      country="Ireland"
      searchParams={searchParams}
      savedSlugs={saved}
    />
  );
}
