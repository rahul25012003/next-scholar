import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Info } from "@phosphor-icons/react/ssr";
import { articleFor, articles, destinationLabel, readMinutes } from "@/content/articles";
import { guideFor } from "@/content/guides";
import { ButtonLink } from "@/components/ui/button";
import { primaryCta } from "@/content/site";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/guides/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = articleFor(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.standfirst.slice(0, 200),
    alternates: { canonical: `/guides/${article.slug}` },
    openGraph: {
      type: "article",
      publishedTime: article.publishedOn,
      modifiedTime: article.updatedOn,
    },
  };
}

export default async function ArticlePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const article = articleFor(slug);
  if (!article) notFound();

  const guide = article.destination === "all" ? null : guideFor(article.destination);
  const related = articles
    .filter(
      (other) =>
        other.slug !== article.slug &&
        (other.destination === article.destination ||
          other.topics.some((topic) => article.topics.includes(topic))),
    )
    .slice(0, 3);

  return (
    <>
      <article>
        <header className="border-b border-line bg-light">
          <div className="shell max-w-3xl">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pink hover:text-blue"
            >
              <ArrowLeft size={14} weight="bold" aria-hidden />
              All guides
            </Link>

            <h1 className="mt-5 text-blue-dark">
              {article.title}
            </h1>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-grey">
              {article.standfirst}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5 text-[0.8125rem] text-grey">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} weight="bold" aria-hidden />
                {readMinutes(article)} min read
              </span>
              <span aria-hidden>·</span>
              <span>
                Published <span className="figures">{article.publishedOn}</span>
              </span>
              <span aria-hidden>·</span>
              <span>
                Updated <span className="figures">{article.updatedOn}</span>
              </span>
              <span aria-hidden>·</span>
              <span>{destinationLabel[article.destination]}</span>
              <span aria-hidden>·</span>
              <span>{article.stage}</span>
            </div>
          </div>
        </header>

        <div className="shell max-w-3xl">
          <div className="space-y-6">
            {article.body.map((block, index) => {
              let content: ReactNode;
              if ("h" in block) {
                content = (
                  <h2 className="pt-4 text-blue-dark">
                    {block.h}
                  </h2>
                );
              } else if ("p" in block) {
                content = (
                  <p className=" leading-relaxed text-grey">{block.p}</p>
                );
              } else if ("note" in block) {
                content = (
                  <p className="flex gap-3.5 rounded-card border border-line bg-light p-5 leading-relaxed text-grey">
                    <Info
                      size={18}
                      weight="fill"
                      aria-hidden
                      className="mt-0.5 shrink-0 text-pink"
                    />
                    {block.note}
                  </p>
                );
              } else {
                content = (
                  <ul className="space-y-2.5">
                    {block.list.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed text-grey">
                        <span
                          aria-hidden
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-dark"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }

              // One inline conversion widget per article, at the midpoint,
              // rather than several: "adopt sparingly" was the verdict on this
              // pattern, and one well-placed prompt is what that means.
              const showWidget = index === Math.floor(article.body.length / 2);

              return (
                <Fragment key={index}>
                  {showWidget && (
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-blue-dark/20 bg-light/60 p-5">
                      <p className="text-[0.9375rem] leading-relaxed text-blue-dark">
                        {guide
                          ? `Check your own profile against ${guide.country}'s published requirements.`
                          : "Check your own profile against a published requirement, in your browser."}
                      </p>
                      <ButtonLink
                        href={
                          guide
                            ? `/tools/requirements-check?destination=${guide.slug}`
                            : "/tools/requirements-check"
                        }
                        size="md"
                      >
                        Run the checklist
                      </ButtonLink>
                    </div>
                  )}
                  {content}
                </Fragment>
              );
            })}
          </div>

          <div className="mt-12 rounded-panel border border-line bg-light p-7">
            <h2 className="text-blue-dark h--5">
              Every figure in this piece is on one page
            </h2>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-grey">
              With the official body it came from, the date it was written down, and
              whether a named person has since re-checked it. That count is currently zero
              and the page says so.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-[0.9375rem]">
              <Link
                href="/our-numbers"
                className="font-medium text-pink hover:text-blue"
              >
                Our numbers, one source
              </Link>
              {guide && (
                <Link
                  href={`/destinations/${guide.slug}`}
                  className="font-medium text-pink hover:text-blue"
                >
                  The full {guide.country} guide
                </Link>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <nav aria-label="Related guides" className="mt-12 border-t border-line pt-8">
              <h2 className="eyebrow text-grey">
                Related
              </h2>
              <ul className="mt-4 grid gap-4">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/guides/${other.slug}`}
                      className="group flex items-start justify-between gap-5 rounded-card border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-pink"
                    >
                      <span>
                        <span className="block text-[0.9375rem] font-semibold text-blue-dark">
                          {other.title}
                        </span>
                        <span className="mt-1 block text-[0.8125rem] text-grey">
                          {readMinutes(other)} min read · {destinationLabel[other.destination]}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        weight="bold"
                        aria-hidden
                        className="mt-1 shrink-0 text-grey transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-pink"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/tools" variant="outline" size="lg">
              Work it out yourself first
            </ButtonLink>
          </div>
        </div>
      </article>
    </>
  );
}
