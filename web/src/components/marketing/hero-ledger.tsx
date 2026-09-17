"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, WarningDiamond } from "@phosphor-icons/react";
import { ledgerRows } from "@/content/ledger";
import { StatusChip } from "@/components/ui/chip";

/**
 * Not a mockup. This is the real ledger data the Open Ledger page renders,
 * three rows of it, so the hero shows the actual product rather than a picture
 * of one. The two layers drift at slightly different rates on scroll, which is
 * the only motion in the hero.
 */
export function HeroLedger() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end start"],
  });

  const front = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -34]);
  const back = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 22]);

  const rows = ledgerRows.slice(0, 3);

  return (
    <div ref={wrap} className="relative">
      <motion.div
        style={{ y: back }}
        aria-hidden
        className="absolute -right-6 -top-8 hidden h-64 w-64 rounded-panel bg-light sm:block"
      />

      <motion.div style={{ y: front }} className="relative">
        <div className="rounded-panel border border-line bg-white p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-blue-dark h--6">
                What we earn on a shortlist
              </h2>
              <p className="mt-1 text-[0.8125rem] leading-snug text-grey">
                Shown before you pay us anything
              </p>
            </div>
            <Link
              href="/open-ledger"
              className="flex shrink-0 items-center gap-1 text-[0.8125rem] font-medium text-pink transition-colors hover:text-blue"
            >
              Full ledger
              <ArrowUpRight size={14} weight="bold" aria-hidden />
            </Link>
          </div>

          <ul className="mt-6 space-y-px">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-card px-3 py-3.5 odd:bg-light"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.9375rem] font-medium text-blue-dark">
                    {row.relationship}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <StatusChip status={row.status} />
                    {row.aboveAverage && (
                      <span className="inline-flex items-center gap-1 rounded-input bg-pending-bg px-2 py-1 text-[0.6875rem] font-medium text-pending">
                        <WarningDiamond size={12} weight="fill" aria-hidden />
                        Above category average
                      </span>
                    )}
                  </div>
                </div>
                <p className="figures shrink-0 font-semibold text-blue-dark">
                  {row.commissionDisplay}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-line pt-4 text-[0.8125rem] leading-relaxed text-grey">
            Two of these three are market estimates, not confirmed contract terms.
            They say so on the row, and they stay off the verified ledger until a
            university confirms the number in writing.
          </p>
        </div>

        <div className="relative z-10 -mt-4 ml-6 mr-10 rounded-card bg-blue-dark px-6 py-5 text-white sm:ml-10">
          <p className="figures text-2xl font-semibold">₹0</p>
          <p className="mt-1 text-[0.875rem] leading-snug text-white/85">
            What German public universities pay any agent, including us.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
