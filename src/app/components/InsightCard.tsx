import { Link } from "react-router-dom";

export function InsightCard({
  kicker = "Core insight",
  children,
}: {
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="border-l-2 border-cyan bg-panel px-5 py-5">
      <p className="font-mono text-sm tracking-widest text-cyan">{kicker}</p>
      <div className="mt-2 space-y-3 font-sans text-[15px] leading-7 text-cream/90">{children}</div>
    </aside>
  );
}

export function EquationBlock({
  label,
  formula,
  legend,
}: {
  label: string;
  formula: React.ReactNode;
  legend: { symbol: React.ReactNode; meaning: React.ReactNode }[];
}) {
  return (
    <div className="rounded-lg border border-line bg-panel px-5 py-5">
      <p className="font-mono text-sm tracking-wide text-muted">{label}</p>
      <div className="mt-4 overflow-x-auto pb-1 font-serif text-xl leading-loose text-cream md:text-2xl">
        {formula}
      </div>
      <dl className="mt-4 space-y-1">
        {legend.map((item, index) => (
          <div key={index} className="flex flex-wrap items-baseline gap-2 text-sm">
            <dt className="font-serif text-base text-gold">{item.symbol}</dt>
            <dd className="text-muted">{item.meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EquationLine({ children }: { children: React.ReactNode }) {
  return <div className="flex min-w-max items-center gap-x-2">{children}</div>;
}

export function MathVariable({
  children,
  subscript,
  superscript,
  accent,
}: {
  children: React.ReactNode;
  subscript?: React.ReactNode;
  superscript?: React.ReactNode;
  accent?: "dot" | "bar";
}) {
  const symbol = <var className="font-serif font-normal italic">{children}</var>;

  return (
    <span className="inline-flex items-baseline whitespace-nowrap">
      {accent === "dot" ? (
        <span className="relative inline-block" aria-label="time derivative">
          <span aria-hidden="true" className="absolute -top-[0.55em] left-1/2 -translate-x-1/2 text-[0.75em] not-italic">
            •
          </span>
          {symbol}
        </span>
      ) : accent === "bar" ? (
        <span className="border-t border-current leading-none">{symbol}</span>
      ) : (
        symbol
      )}
      {subscript !== undefined && <sub className="ml-px text-[0.62em] leading-none">{subscript}</sub>}
      {superscript !== undefined && <sup className="ml-px text-[0.62em] leading-none">{superscript}</sup>}
    </span>
  );
}

export function MathFraction({
  numerator,
  denominator,
}: {
  numerator: React.ReactNode;
  denominator: React.ReactNode;
}) {
  return (
    <span className="inline-flex flex-col items-center px-1 align-middle text-[0.9em] leading-tight">
      <span className="w-full border-b border-current px-1 pb-0.5 text-center">{numerator}</span>
      <span className="px-1 pt-0.5 text-center">{denominator}</span>
    </span>
  );
}

export function TextLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold">
      {children}
    </Link>
  );
}
