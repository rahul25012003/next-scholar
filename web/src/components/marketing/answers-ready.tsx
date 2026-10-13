"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, DownloadSimple, Info } from "@phosphor-icons/react";
import { guides } from "@/content/guides";
import { Button } from "@/components/ui/button";

/**
 * What a form shows when it has checked the answers but cannot send them yet.
 *
 * Nothing reaches us until booking, payment and data protection are in place,
 * and the page says so. It does not leave the visitor empty-handed either: the
 * answers can be saved as a file, and the parts of the site that work today,
 * for the countries they picked, are one click away. Focus moves to the
 * heading so a screen reader announces the result rather than staying silent.
 */
export function AnswersReady({
  heading,
  message,
  text,
  filename,
  destinations,
  missingTitle,
  missing,
}: {
  heading: string;
  message: string;
  /** The answers as plain text, for the file. */
  text: string;
  filename: string;
  destinations: string[];
  missingTitle: string;
  missing: string[];
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const picked = guides.filter((guide) => destinations.includes(guide.slug));

  return (
    <div className="rounded-panel border border-line bg-light p-6">
      <div className="flex items-start gap-3">
        <Info size={20} weight="fill" className="mt-0.5 shrink-0 text-blue" aria-hidden />
        <div className="min-w-0">
          <h3 ref={headingRef} tabIndex={-1} className="text-blue-dark h--6 focus:outline-none">
            {heading}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-grey">{message}</p>

          <Button type="button" onClick={download} className="mt-4">
            <DownloadSimple size={16} weight="bold" aria-hidden />
            Download my answers
          </Button>

          <p className="mt-6 text-[0.9375rem] font-semibold text-blue-dark">
            What you can do today
          </p>
          <ul className="mt-2 space-y-2">
            {picked.map((guide) => (
              <li key={guide.slug}>
                <AnswerLink href={`/destinations/${guide.slug}`}>
                  Read the {guide.country} guide
                </AnswerLink>
              </li>
            ))}
            <li>
              <AnswerLink
                href={`/tools/requirements-check${picked[0] ? `?destination=${picked[0].slug}` : ""}`}
              >
                Check yourself against the requirements
              </AnswerLink>
            </li>
            <li>
              <AnswerLink href="/universities">Compare courses, fees and deadlines</AnswerLink>
            </li>
          </ul>

          <details className="mt-6">
            <summary className="cursor-pointer text-[0.875rem] font-medium text-blue-dark">
              {missingTitle}
            </summary>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              {missing.map((item) => (
                <li key={item} className="text-[0.875rem] leading-relaxed text-grey">
                  {item}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}

function AnswerLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-pink-dark hover:text-blue-dark"
    >
      {children}
      <ArrowRight
        size={14}
        weight="bold"
        aria-hidden
        className="transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
