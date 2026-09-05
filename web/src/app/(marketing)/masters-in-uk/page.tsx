import type { Metadata } from "next";
import { currentShortlist } from "@/app/actions/shortlist";
import { MastersLanding } from "@/components/catalogue/masters-landing";

export const metadata: Metadata = {
  title: "Masters in the UK",
  description:
    "Taught Master's programmes in the United Kingdom, curated by hand, each with what we earn from the institution printed next to the fee.",
  alternates: { canonical: "/masters-in-uk" },
};

export default async function MastersInUkPage(props: PageProps<"/masters-in-uk">) {
  const searchParams = await props.searchParams;
  const saved = await currentShortlist();
  return (
    <MastersLanding
      destinationSlug="united-kingdom"
      country="the United Kingdom"
      searchParams={searchParams}
      savedSlugs={saved}
    />
  );
}
