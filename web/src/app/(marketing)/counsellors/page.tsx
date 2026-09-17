import type { Metadata } from "next";
import { publishableCounsellors, counsellorScope } from "@/content/counsellors";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Counsellors",
  description:
    "A profile appears here once a named person has checked a counsellor's stated credential against the body that issued it. A job title is not a credential.",
  alternates: { canonical: "/counsellors" },
};

export default function CounsellorsPage() {
  const rows = publishableCounsellors();

  return (
    <>
      <PageHero
        title="Counsellors"
        lede="A checkable credential, not a job title and a stock photo. This page publishes a profile only once a named person has confirmed the stated credential against the body that issued it."
      />

      <section className="band">
        <div className="shell">
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
            {counsellorScope.note}
          </p>

          {rows.length === 0 ? (
            <div className="mt-8 rounded-panel border border-dashed border-line-strong bg-light p-8">
              <h2 className="text-blue-dark h--5">
                No counsellor profile published yet
              </h2>
              <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                Case work already runs through named counsellors, visible on the case log
                whenever an account has access. What is missing here is a public profile with
                a credential someone has actually checked, and that has not happened yet.
              </p>
              <ButtonLink href="/book-consultation" className="mt-6">
                Book a consultation instead
              </ButtonLink>
            </div>
          ) : (
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {rows.map((counsellor) => (
                <li
                  key={counsellor.slug}
                  className="rounded-panel border border-line bg-white p-6 md:p-7"
                >
                  <h2 className="text-blue-dark h--5">
                    {counsellor.name}
                  </h2>
                  <p className="mt-1 text-[0.875rem] text-grey">
                    {counsellor.credential}, {counsellor.credentialBody}
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">
                    {counsellor.bio}
                  </p>
                  <p className="mt-3 text-[0.8125rem] text-grey">
                    Covers {counsellor.destinationsCovered.join(", ")}
                  </p>
                  <p className="mt-3 border-t border-line pt-3 text-[0.75rem] text-grey">
                    Credential checked by {counsellor.verifiedBy},{" "}
                    <span className="figures">{counsellor.verifiedOn}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
