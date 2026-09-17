import Link from "next/link";
import { site } from "@/content/site";
import { BackgroundShapes } from "@/components/site/background-shapes";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundShapes />
      <header className="Header">
        <div className="Header__container constrain">
          <Link href="/" className="Header__logo" title="Home">
            <span className="Header__logo-mark" aria-hidden>
              N
            </span>
            <span aria-hidden>Next Scholar</span>
            <span className="sr-only">{site.name} home</span>
          </Link>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="constrain grid flex-1 gap-10 pad-after-lg lg:grid-cols-[1fr_1.1fr] lg:items-start"
      >
        <div className="bg-white pad-around pad-x">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <aside className="pad-around hidden flex-col justify-center text-light lg:flex">
          <blockquote className="flow max-w-md">
            <p className="h h--4 text-light">{site.pitch}</p>
            <p>
              Your portal shows the same figures the public Open Ledger does. There
              is no version of your case that we can see and you cannot.
            </p>
          </blockquote>

          <dl className="mt-12 grid gap-5 border-t-2 border-white/20 pt-10">
            {[
              ["What you see", "Your stage, your deadlines, every reference number we hold for you."],
              ["What we never show", "A predicted chance of an admission or a visa. Nobody can honestly give you one."],
              ["What you control", "Consent per document category, withdrawable at any time."],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="font-bold text-white">{term}</dt>
                <dd className="small mt-1 text-white/80">{detail}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </main>
    </div>
  );
}
