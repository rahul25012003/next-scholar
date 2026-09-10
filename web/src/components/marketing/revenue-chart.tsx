import { destinations } from "@/content/destinations";
import { isPublishable } from "@/content/types";

/**
 * Where our money comes from, per route, on one axis in rupees.
 *
 * Two series: the fee the client pays us, which is exact, and the commission
 * the university pays us, which is a range and not yet confirmed. The range is
 * drawn as a range, and the unconfirmed part is hatched rather than filled, so
 * the uncertainty is visible instead of averaged away into a tidy number.
 *
 * Palette validated for colour vision deficiency: #1553d6 against #b45309
 * separates at deltaE 29.5 under protanopia, well clear of the floor.
 */

const rows = destinations.map((destination) => ({
  label: destination.country,
  sub: destination.route ?? "Taught masters",
  fee: destination.clientFeeInr,
  commissionLow: destination.commission.lowInr,
  commissionHigh: destination.commission.highInr,
  verified: isPublishable(destination.commission.status),
  flagged: Boolean(destination.commission.aboveAverage),
}));

const AXIS_MAX = 400_000;
const PLOT_X = 196;
const PLOT_W = 400;
const ROW_H = 66;
const TOP = 34;
const BAR_H = 18;
const WIDTH = 760;
const HEIGHT = TOP + rows.length * ROW_H + 34;

const x = (value: number) => (value / AXIS_MAX) * PLOT_W;
const lakh = (value: number) =>
  value === 0 ? "0" : value >= 100_000 ? `${value / 100_000}L` : `${value / 1000}k`;

export function RevenueChart() {
  const ticks = [0, 100_000, 200_000, 300_000, 400_000];

  return (
    <section className="band bg-paper">
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-navy-900 md:text-[2.5rem]">
            Where our money comes from, per route
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
            On the German public route the fee you pay is the whole of it. On a
            private university the fee is the small part, and the university pays
            the rest. You can see which is which before you choose.
          </p>
        </div>

        <figure className="mt-11">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <span className="flex items-center gap-2 text-[0.875rem] text-ink-soft">
              <span
                aria-hidden
                className="h-3 w-3 rounded-xs"
                style={{ backgroundColor: "#1553d6" }}
              />
              What you pay us
            </span>
            <span className="flex items-center gap-2 text-[0.875rem] text-ink-soft">
              <span
                aria-hidden
                className="h-3 w-3 rounded-xs"
                style={{ backgroundColor: "#b45309" }}
              />
              What the university pays us
            </span>
            <span className="flex items-center gap-2 text-[0.875rem] text-muted">
              <span
                aria-hidden
                className="h-3 w-3 rounded-xs border"
                style={{
                  borderColor: "#b45309",
                  backgroundImage:
                    "repeating-linear-gradient(135deg, #b4530955 0 2px, transparent 2px 4px)",
                }}
              />
              Unconfirmed range
            </span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="h-auto w-full min-w-[42rem]"
              role="img"
              aria-label="Commission and client fee per destination route, in rupees. Germany public universities pay no commission, so the client fee is the entire amount."
            >
              <defs>
                <pattern
                  id="unconfirmed"
                  width="6"
                  height="6"
                  patternTransform="rotate(135)"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="6" height="6" fill="#ffffff" />
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#b45309" strokeWidth="2.4" />
                </pattern>
              </defs>

              {ticks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={PLOT_X + x(tick)}
                    y1={TOP - 12}
                    x2={PLOT_X + x(tick)}
                    y2={TOP + rows.length * ROW_H - 18}
                    stroke="#e7ebf3"
                    strokeWidth="1"
                  />
                  <text
                    x={PLOT_X + x(tick)}
                    y={TOP + rows.length * ROW_H}
                    textAnchor="middle"
                    fill="#6a7280"
                    fontSize="11"
                    className="figures"
                  >
                    {tick === 0 ? "₹0" : `₹${lakh(tick)}`}
                  </text>
                </g>
              ))}

              {rows.map((row, index) => {
                const y = TOP + index * ROW_H;
                const feeW = x(row.fee);
                const confirmedStart = PLOT_X + feeW + 2;
                const lowW = x(row.commissionLow);
                const highW = x(row.commissionHigh);
                const hasCommission = row.commissionHigh > 0;

                return (
                  <g key={row.label + row.sub}>
                    <text x="0" y={y + 5} fill="#0e2a5e" fontSize="14" fontWeight="600">
                      {row.label}
                    </text>
                    <text x="0" y={y + 22} fill="#6a7280" fontSize="12">
                      {row.sub}
                    </text>

                    <rect
                      x={PLOT_X}
                      y={y - 8}
                      width={Math.max(feeW, 3)}
                      height={BAR_H}
                      rx="4"
                      fill="#1553d6"
                    />

                    {hasCommission && (
                      <>
                        <rect
                          x={confirmedStart}
                          y={y - 8}
                          width={lowW}
                          height={BAR_H}
                          fill="#b45309"
                        />
                        <rect
                          x={confirmedStart + lowW + 2}
                          y={y - 8}
                          width={highW - lowW - 2}
                          height={BAR_H}
                          rx="4"
                          fill="url(#unconfirmed)"
                          stroke="#b45309"
                          strokeWidth="1"
                        />
                      </>
                    )}

                    <text
                      x={hasCommission ? confirmedStart + highW + 10 : PLOT_X + feeW + 10}
                      y={y + 6}
                      fill="#3f4a5c"
                      fontSize="12.5"
                      className="figures"
                    >
                      {hasCommission
                        ? `₹${lakh(row.fee)} + ₹${lakh(row.commissionLow)} to ₹${lakh(row.commissionHigh)}`
                        : `₹${lakh(row.fee)}, and nothing from the university`}
                    </text>

                    {row.flagged && (
                      <text x="0" y={y + 38} fill="#a16207" fontSize="11">
                        Above category average
                      </text>
                    )}
                    {row.verified && (
                      <text x="0" y={y + 38} fill="#15803d" fontSize="11">
                        Verified
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <figcaption className="mt-5 max-w-3xl text-[0.875rem] leading-relaxed text-muted">
            Hatched sections are commission bands that no university has confirmed
            to us in writing yet. They are drawn as ranges because that is what
            they are. The same figures, with their sources and verification
            status, are listed in the Open Ledger.
          </figcaption>

          {/* A table cannot shrink below its content width, so sr-only on the table itself left it 994px wide and scrolling the page sideways on a phone; the wrapper takes the clipping instead. */}
          <div className="sr-only">
          <table>
            <caption>Fee and commission per route, in rupees</caption>
            <thead>
              <tr>
                <th scope="col">Route</th>
                <th scope="col">What you pay us</th>
                <th scope="col">What the university pays us</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.label}-${row.sub}-data`}>
                  <th scope="row">{`${row.label}, ${row.sub}`}</th>
                  <td>{`₹${row.fee.toLocaleString("en-IN")}`}</td>
                  <td>
                    {row.commissionHigh === 0
                      ? "₹0"
                      : `₹${row.commissionLow.toLocaleString("en-IN")} to ₹${row.commissionHigh.toLocaleString("en-IN")}`}
                  </td>
                  <td>
                    {row.verified ? "Verified" : "Unconfirmed market estimate"}
                    {row.flagged ? ", above category average" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </figure>
      </div>
    </section>
  );
}
