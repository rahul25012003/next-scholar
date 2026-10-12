/**
 * A template, not a layout: it is remounted on every navigation, which is what
 * replays `page-enter` in globals.css and fades each page in. The header, the
 * footer and the smooth scroller stay in the layout and do not replay.
 */
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
