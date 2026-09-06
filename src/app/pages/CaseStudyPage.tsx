import { InsightCard, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";

export function CaseStudyPage() {
  return (
    <PageShell>
      <PageIntro index="Field investigation" title="The boiler-feedwater paradox">
        <p>
          A real-world case study that challenged conventional wisdom about inlet fogging systems.
        </p>
      </PageIntro>

      <Section title="The challenge">
        <p>
          Conventional fogging skids were suffering familiar problems: pump degradation from demineralized water's low
          lubricity, persistent clogged filters and nozzles, and a maintenance load that showed up as unreliable fog on the days it
          was needed.
        </p>
      </Section>

      <Section title="The alternative">
        <p>
          Some plants implemented an innovative solution: tap directly into the <span className="text-gold">boiler-feedwater system</span>. 
          This solution removed dedicated high-pressure pumps, reduced a class of mechanical failures, and produced warmer fog — on the order of 200 °F. 
        </p>
        <p>
          Operators saw more complete evaporation and less filter-house runoff, and the plant was able to generate more power.
        </p>
        <blockquote className="border-l-2 border-gold pl-4 font-serif text-xl italic text-cream">
          "We noticed the turbine with the new fogging system was generating 2-3 MW more than the other units. 
          The temperature of the fogging water must be responsible for the power spike – it's the only parameter that's different."
          <footer className="mt-2 font-sans text-sm not-italic text-muted">Plant operator</footer>
        </blockquote>
      </Section>

      <Section title="The hypothesis">
        <p>
          If the only intentional difference is water temperature, and evaporation looks more complete, then hotter
          water caused the extra megawatts. That is a coherent operations story. This is the hypothesis the model was built to test.
        </p>
        <p className="text-[15px] text-gold italic">
          Does more evaporation mean better cooling and therefore higher turbine output?
        </p>
      </Section>

      <Section title="What the model showed">
        <div className="grid gap-4 md:grid-cols-3">
          <Mini title="The assumption">
            More evaporation means better cooling and higher turbine output. A common and understandable inference.
          </Mini>
          <Mini title="The physics">
            Cooling is latent and convective. Warmer water <span className="text-gold">reverses</span> convective cooling, and water vapor itself <span className="text-gold">negatively impacts</span> air density.
          </Mini>
          <Mini title="The result">
            Despite increased evaporation, hotter water creates a slightly warmer, less dense inlet airstream — the
            opposite of the desired thermodynamic effect.
          </Mini>
        </div>
        <InsightCard kicker="Theoretical Result">
          <p>
            Cooler inlet water produced greater air-density increase in the transient droplet model, holding other
            initial conditions fixed: more evaporation does not mean better cooling.
          </p>
          <p>
            The droplet-air system is a relatively closed system, so the extra enthalpy from the hotter water has nowhere to go but into the air. 
            All else equal, the air temperature as it enters the compressor will be slightly higher.
          </p>
        </InsightCard>
        <p>
          Reproduce the comparison in the Simulator with the <TextLink to="/simulator?preset=cold-water">cold</TextLink>,{" "}
          <TextLink to="/simulator?preset=ambient-water">ambient</TextLink>, and{" "}
          <TextLink to="/simulator?preset=hot-water">hot-water</TextLink> presets.
        </p>
      </Section>

      <Section title="Where did the extra megawatts come from?">
        <p>
          It turns out that the water temperature was not the only difference between the two systems. The mineral content of the fogger water was vastly different between the two systems
          and had a significant impact on the nozzle condition, pump maintenance, and overall system performance.
        </p>
        <p>
          Boiler-feedwater is demineralized and treated with a variety of chemicals to prevent corrosion and scale buildup. The nozzles 
          fed with boiler-feedwater were clean and atomizing properly. These systems were also rarely down for maintenace because they 
          did not require dedicted pumps. 
        </p>
        <p>
          Standard systems, on the other hand, we saw were plagued with clogged malfunctioning nozzles. Mineral buildup and 
          debris required frequent maintenance and downtime to clean and repair pumps and nozzles.
        </p>
        <p>
          At the end of the day, you need a properly functioning system in order to get the benefits of that system. 
          Having clean nozzles that produce fog to spec vastly outweigh the small thermodynamic effect of hot water.
        </p>
      </Section>

      <Section title="">
        <p>For more information, read the full white paper:</p>
        <a
          href="/Fogger-Case-Study-White-Paper.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-block border border-cream/30 px-5 py-2.5 font-sans text-sm text-cream hover:border-gold hover:text-gold"
        >
          Fogger Case Study White Paper (PDF) ↗
        </a>
      </Section>
    </PageShell>
  );
}

function Mini({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <h3 className="font-serif text-lg text-cream">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{children}</p>
    </div>
  );
}
