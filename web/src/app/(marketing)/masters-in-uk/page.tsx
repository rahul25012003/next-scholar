import type { Metadata } from "next";
import { currentShortlist } from "@/app/actions/shortlist";
import { MastersLanding } from "@/components/catalogue/masters-landing";

export const metadata: Metadata = {
  title: "Masters in the UK",
  description:
    "Taught Master's programmes in the United Kingdom, chosen by hand, each with its fee.",
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
