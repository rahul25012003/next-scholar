import type { Metadata } from "next";
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
        <header className="border-b border-line bg-surface">
          <div className="shell max-w-3xl py-10 md:py-14">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft size={14} weight="bold" aria-hidden />
              All guides
            </Link>

            <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-navy-900 md:text-[2.75rem]">
              {article.title}
            </h1>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-body">
              {article.standfirst}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5 text-[0.8125rem] text-muted">
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

        <div className="shell max-w-3xl py-10 md:py-14">
          <div className="space-y-6">
            {article.body.map((block, index) => {
              if ("h" in block) {
                return (
                  <h2
                    key={index}
                    className="pt-4 font-display text-[1.375rem] font-bold text-navy-900 md:text-[1.5rem]"
                  >
                    {block.h}
                  </h2>
                );
              }
              if ("p" in block) {
                return (
                  <p key={index} className="text-[1.0625rem] leading-relaxed text-body">
                    {block.p}
                  </p>
                );
              }
              if ("note" in block) {
                return (
                  <p
                    key={index}
                    className="flex gap-3.5 rounded-card border border-line bg-surface p-5 text-[1rem] leading-relaxed text-body"
                  >
                    <Info
                      size={18}
                      weight="fill"
                      aria-hidden
                      className="mt-0.5 shrink-0 text-blue-600"
                    />
                    {block.note}
                  </p>
                );
              }
              return (
                <ul key={index} className="space-y-2.5">
                  {block.list.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[1.0625rem] leading-relaxed text-body"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>

          <div className="mt-12 rounded-panel border border-line bg-surface p-7">
            <h2 className="font-display text-[1.125rem] font-bold text-navy-900">
              Every figure in this piece is on one page
            </h2>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-body">
              With the official body it came from, the date it was written down, and
              whether a named person has since re-checked it. That count is currently zero
              and the page says so.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-[0.9375rem]">
              <Link
                href="/our-numbers"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Our numbers, one source
              </Link>
              {guide && (
                <Link
                  href={`/destinations/${guide.slug}`}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  The full {guide.country} guide
                </Link>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <nav aria-label="Related guides" className="mt-12 border-t border-line pt-8">
              <h2 className="text-[0.75rem] font-semibold uppercase tracking-wide text-muted">
                Related
              </h2>
              <ul className="mt-4 grid gap-4">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/guides/${other.slug}`}
                      className="group flex items-start justify-between gap-5 rounded-card border border-line bg-paper p-5 transition-[border-color,box-shadow] hover:border-blue-600 hover:shadow-card"
                    >
                      <span>
                        <span className="block text-[0.9375rem] font-semibold text-navy-900">
                          {other.title}
                        </span>
                        <span className="mt-1 block text-[0.8125rem] text-muted">
                          {readMinutes(other)} min read · {destinationLabel[other.destination]}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        weight="bold"
                        aria-hidden
                        className="mt-1 shrink-0 text-muted transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-blue-600"
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
