import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "@phosphor-icons/react/ssr";
import {
  articles,
  destinationLabel,
  readMinutes,
  taxonomy,
  type Article,
} from "@/content/articles";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/stagger";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Written guides",
  description:
    "Pieces on the things that actually decide these applications: the fee Germany does not mention, the UK 28 day rule, the new dMAT, and what a consultant genuinely cannot do for you.",
  alternates: { canonical: "/guides" },
};

/**
 * Four filter axes, applied as a plain GET form.
 *
 * A reader arrives with one of four questions: which country, which subject,
 * which part of the process, or where they are in the journey. A single
 * category field answers one of them, which is why both benchmark archives are
 * unnavigable past the first page.
 */
function matches(article: Article, params: Record<string, string | string[] | undefined>) {
  const value = (key: string) => (typeof params[key] === "string" ? params[key] : "");

  const destination = value("destination");
  const topic = value("topic");
  const service = value("service");
  const stage = value("stage");

  if (destination && article.destination !== destination) return false;
  if (topic && !article.topics.includes(topic as Article["topics"][number])) return false;
  if (service && article.service !== service) return false;
  if (stage && article.stage !== stage) return false;
  return true;
}

export default async function GuidesPage(props: PageProps<"/guides">) {
  const params = await props.searchParams;
  const axes = taxonomy();
  const rows = articles.filter((article) => matches(article, params));
  const active = ["destination", "topic", "service", "stage"].filter(
    (key) => typeof params[key] === "string" && params[key] !== "",
  ).length;

  return (
    <>
      <PageHero
        title="Written guides"
        lede="Six pieces, each about one thing that actually decides an application, including two corrections to figures we published wrongly ourselves. Filter by country, by subject, by which part of the process you are in, or by where you are in the journey."
        aside={
          <div className="rounded-panel border border-line bg-white p-6">
            <p className="text-[0.8125rem] font-semibold text-blue-dark">
              Every piece carries
            </p>
            <ul className="mt-3 space-y-2 text-[0.875rem] leading-relaxed text-grey">
              <li>Its read time, computed from the text rather than typed</li>
              <li>The date it was published and the date it last changed</li>
              <li>Four tags, so it can be found from any of four questions</li>
              <li>A claim in the standfirst, not a teaser</li>
            </ul>
          </div>
        }
      />

      <section className="band">
        <div className="shell grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 lg:items-start">
          <form
            method="get"
            action="/guides"
            className="rounded-panel border border-line bg-white lg:sticky lg:top-24"
            aria-label="Filter guides"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <h2 className="text-blue-dark h--6">Filter</h2>
              <Link
                href="/guides"
                className="text-[0.8125rem] font-medium text-grey transition-colors hover:text-pink"
              >
                Reset
              </Link>
            </div>

            <div className="space-y-5 px-5 py-5">
              <Axis
                label="Destination"
                name="destination"
                current={typeof params.destination === "string" ? params.destination : ""}
                options={axes.destination.map((item) => ({
                  value: item.value,
                  label: destinationLabel[item.value],
                  count: item.count,
                }))}
              />
              <Axis
                label="Topic"
                name="topic"
                current={typeof params.topic === "string" ? params.topic : ""}
                options={axes.topic.map((item) => ({
                  value: item.value,
                  label: item.value,
                  count: item.count,
                }))}
              />
              <Axis
                label="Part of the service"
                name="service"
                current={typeof params.service === "string" ? params.service : ""}
                options={axes.service.map((item) => ({
                  value: item.value,
                  label: item.value,
                  count: item.count,
                }))}
              />
              <Axis
                label="Where you are"
                name="stage"
                current={typeof params.stage === "string" ? params.stage : ""}
                options={axes.stage.map((item) => ({
                  value: item.value,
                  label: item.value,
                  count: item.count,
                }))}
              />
            </div>

            <div className="border-t border-line px-5 py-4">
              <button
                type="submit"
                className="w-full button"
              >
                Apply
              </button>
            </div>
          </form>

          <div className="min-w-0">
            <p className="text-[0.875rem] text-grey">
              {rows.length} piece{rows.length === 1 ? "" : "s"}
              {active > 0 ? ` on ${active} filter${active === 1 ? "" : "s"}` : ""}.
            </p>

            {rows.length === 0 ? (
              <div className="mt-5 rounded-panel border border-dashed border-line-strong bg-light p-8">
                <h2 className="text-blue-dark h--5">
                  Nothing written on that combination yet
                </h2>
                <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-grey">
                  Six pieces is six pieces. An empty result here means we have not written
                  it, not that there is nothing to say.
                </p>
                <Link
                  href="/guides"
                  className="mt-4 inline-block text-[0.9375rem] font-medium text-pink hover:text-blue-dark"
                >
                  Clear the filters
                </Link>
              </div>
            ) : (
              <div className="mt-5 grid gap-5">
                {rows.map((article, index) => (
                  <Reveal key={article.slug} delay={staggerDelay(index, 0.05)}>
                    <article className=" rounded-panel border border-line bg-white p-7">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag>{destinationLabel[article.destination]}</Tag>
                        {article.topics.map((topic) => (
                          <Tag key={topic}>{topic}</Tag>
                        ))}
                        <Tag muted>{article.stage}</Tag>
                      </div>
                      <h2 className="mt-3.5 text-blue-dark h--5">
                        <Link href={`/guides/${article.slug}`} className="hover:text-pink">
                          {article.title}
                        </Link>
                      </h2>
                      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-grey">
                        {article.standfirst}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-grey">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={13} weight="bold" aria-hidden />
                            {readMinutes(article)} min read
                          </span>
                          <span aria-hidden>·</span>
                          <span>
                            Updated <span className="figures">{article.updatedOn}</span>
                          </span>
                        </p>
                        <Link
                          href={`/guides/${article.slug}`}
                          className="group inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pink hover:text-blue-dark"
                        >
                          Read it
                          <ArrowRight
                            size={14}
                            weight="bold"
                            aria-hidden
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Axis({
  label,
  name,
  current,
  options,
}: {
  label: string;
  name: string;
  current: string;
  options: { value: string; label: string; count: number }[];
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[0.8125rem] font-semibold text-blue-dark">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={current}
        className="mt-2 w-full rounded-input border border-line-strong bg-white px-3 py-2 text-[0.875rem] text-blue-dark"
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </div>
  );
}

function Tag({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-input px-2 py-0.5 text-[0.6875rem] font-medium",
        muted ? "bg-light text-neutral-chip" : "bg-light text-pink",
      )}
    >
      {children}
    </span>
  );
}
