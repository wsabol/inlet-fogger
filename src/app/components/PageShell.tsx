import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageIntro({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-14 pb-8">
      <p className="font-mono text-sm tracking-widest text-gold">{index}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-cream md:text-5xl">{title}</h1>
      <div className="mt-5 space-y-4 font-sans text-[15px] leading-7 text-muted">{children}</div>
    </div>
  );
}

export function Section({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-3xl scroll-mt-24 px-5 py-8">
      {kicker && <p className="font-mono text-sm tracking-widest text-gold">{kicker}</p>}
      <h2 className="mt-2 font-serif text-3xl text-cream">{title}</h2>
      <div className="mt-4 space-y-4 font-sans text-[15px] leading-7 text-muted">{children}</div>
    </section>
  );
}
