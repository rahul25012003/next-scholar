import Link from "next/link";
import { site } from "@/content/site";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-center bg-paper px-6 py-14 sm:px-12 lg:px-16">
        <Link href="/" className="mb-10 flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-input bg-navy-900 font-display text-[1.05rem] font-bold text-white"
            aria-hidden
          >
            N
          </span>
          <span className="font-display text-[1.0625rem] font-bold tracking-tight text-navy-900">
            Next<span className="text-blue-600">Scholar</span>
          </span>
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </div>

      <aside className="hidden flex-col justify-center bg-navy-900 px-16 py-16 lg:flex">
        <blockquote className="max-w-md">
          <p className="font-display text-[1.75rem] font-bold leading-snug text-white">
            {site.pitch}
          </p>
          <p className="mt-6 text-[1rem] leading-relaxed text-white/70">
            Your portal shows the same figures the public Open Ledger does. There
            is no version of your case that we can see and you cannot.
          </p>
        </blockquote>

        <dl className="mt-12 grid gap-5 border-t border-white/12 pt-10">
          {[
            ["What you see", "Your stage, your deadlines, every reference number we hold for you."],
            ["What we never show", "A predicted chance of an admission or a visa. Nobody can honestly give you one."],
            ["What you control", "Consent per document category, withdrawable at any time."],
          ].map(([term, detail]) => (
            <div key={term}>
              <dt className="text-[0.875rem] font-medium text-white">{term}</dt>
              <dd className="mt-1 text-[0.875rem] leading-relaxed text-white/60">{detail}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
