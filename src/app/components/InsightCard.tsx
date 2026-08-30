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
  formula: string;
  legend: { symbol: string; meaning: string }[];
}) {
  return (
    <div className="rounded-lg border border-line bg-panel px-5 py-5">
      <p className="font-mono text-sm tracking-wide text-muted">{label}</p>
      <p className="mt-3 overflow-x-auto font-mono text-lg text-cream md:text-xl">{formula}</p>
      <dl className="mt-4 space-y-1">
        {legend.map((item) => (
          <div key={item.symbol} className="flex flex-wrap gap-2 text-sm">
            <dt className="font-mono text-gold">{item.symbol}</dt>
            <dd className="text-muted">{item.meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function TextLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold">
      {children}
    </Link>
  );
}
