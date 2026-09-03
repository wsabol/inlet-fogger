import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";

export function HomePage() {
  return (
    <PageShell>
      <section className="grid-hero border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
          <p className="flex items-center gap-3 font-mono text-sm tracking-widest text-gold">
            <span className="inline-block h-px w-8 bg-gold" />
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-tight text-cream md:text-6xl">
            Inlet Fogging
            <span className="mt-1 block italic text-gold">Physics & Practice</span>
          </h1>
          <p className="mt-6 max-w-xl text-[16px] leading-7">
            Learn how water temperature, air temperature, and humidity effect gas turbine performance through an interactive droplet
            simulation and practical engineering lessons from real-world fogging installations.
          </p> 
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/simulator" className="bg-gold px-5 py-2.5 font-sans text-sm font-medium text-ink">
              Open Simulator →
            </Link>
            <Link
              to="/how-it-works"
              className="border border-cream/30 px-5 py-2.5 font-sans text-sm text-cream hover:border-gold hover:text-gold"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="font-mono text-sm tracking-widest text-gold">Explore</p>
          <h2 className="mt-2 font-serif text-3xl text-cream">Why This Matters</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
            Gas turbines generate less power on hot days because hotter, less dense air reduces mass flow through a
            volumetric machine - just as the grid needs the megawatts most. Inlet fogging trades the latent heat of
            water for a colder, denser airstream.
          </p>
          
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <PathCard
              kicker="01"
              title="How fogging works"
              to="/how-it-works"
              body="Dry bulb, wet bulb, evaporation, droplet size, and why residence time is only about a second."
            />
            <PathCard
              kicker="02"
              title="Explore the physics"
              to="/explore"
              body="Interactive diagrams of convective heat transfer, vapor release, and why smaller droplets evaporate faster."
            />
            <PathCard
              kicker="03"
              title="Fogger simulator"
              to="/simulator"
              body="Change inlet conditions, run the transient model, and compare cold water with hot boiler-feedwater cases."
            />
            <PathCard
              kicker="04"
              title="Engineering guide"
              to="/guide"
              body="Nozzles, drainage, pumps, materials, controls, and the operational lessons that actually show up in the field."
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="font-mono text-sm tracking-widest text-gold">Case Study</p>
          <h2 className="mt-2 font-serif text-3xl text-cream">More Evaporation. Less Cooling?</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
            A fleet study asked whether warmer fogging water could explain a 2-3 MW difference between units. 
            What does it mean when more of the fogger water is being evaporated? How does this effect performance?
          </p>
          <Link to="/case-study" className="mt-4 inline-block text-sm text-gold hover:underline">
            Read more →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function PathCard({
  kicker,
  title,
  body,
  to,
}: {
  kicker: string;
  title: string;
  body: string;
  to: string;
}) {
  return (
    <Link to={to} className="rounded-lg border border-line bg-panel p-6 hover:border-gold/50">
      <p className="font-mono text-sm text-gold">{kicker}</p>
      <h2 className="mt-2 font-serif text-2xl text-cream">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </Link>
  );
}
