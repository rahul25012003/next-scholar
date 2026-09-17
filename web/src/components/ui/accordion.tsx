import { CaretDown } from "@phosphor-icons/react/ssr";

/**
 * FAQ and disclosure lists.
 *
 * Built on native details and summary, which gives keyboard operation, screen
 * reader semantics, in-page find and deep-link expansion for free. A JavaScript
 * accordion would have to re-earn all four and would still be worse at the
 * fourth, so there is no state here and no client boundary.
 */
export function Accordion({
  items,
  name,
}: {
  items: { q: string; a: string }[];
  /** Set to make the group exclusive, so opening one closes the rest. */
  name?: string;
}) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-panel border border-line bg-white">
      {items.map((item) => (
        <details key={item.q} name={name} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-5 px-6 py-5 transition-colors hover:bg-light [&::-webkit-details-marker]:hidden">
            <h3 className="text-blue-dark h--6">
              {item.q}
            </h3>
            <CaretDown
              size={16}
              weight="bold"
              aria-hidden
              className="mt-1 shrink-0 text-grey transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="px-6 pb-6 text-[0.9375rem] leading-relaxed text-grey">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
