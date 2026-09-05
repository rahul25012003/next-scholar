import type { Metadata } from "next";
import { currentShortlist } from "@/app/actions/shortlist";
import { MastersLanding } from "@/components/catalogue/masters-landing";

export const metadata: Metadata = {
  title: "Masters in Ireland",
  description:
    "Taught Master's programmes in Ireland, curated by hand, each with what we earn from the institution printed next to the fee.",
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
