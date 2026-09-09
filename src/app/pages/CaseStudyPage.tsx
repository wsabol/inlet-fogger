import { InsightCard, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";

export function CaseStudyPage() {
  return (
    <PageShell>
      <PageIntro index="Field investigation" title="The 2–3 MW mystery">
        <p>
          A fleet investigation separated two questions that can look identical from the control room: is a fogging
          system thermodynamically better, or is it simply healthier and more available?
        </p>
      </PageIntro>

      <Section title="The fleet-wide challenge">
        <p>
          A 2011 study reviewed 27 fogging units across nine power plants. Seven of the nine plants needed fogging
          upgrades or replacements. The recurring weak point was the dedicated high-pressure pump: demineralized
          water has low lubricity, and frequent starts, long runtimes, and high pressure accelerated wear.
        </p>
        <p>
          Failed seals, valves, pistons, and crankcases led to leaks and vibration. Pump debris and damaged discharge
          filters then traveled downstream, restricting or plugging nozzles. A skid could still show water flow while
          delivering an uneven or ineffective spray.
        </p>
        <InsightCard kicker="Fleet signal">
          <p>
            Average maintenance cost per fogging unit rose from roughly $10,500 in 2008 to nearly $19,000 in 2011.
            Lower-stage pumps often accumulated the most starts—in one representative sequence, the first-zone pump
            started 15 times while the largest pump started once.
          </p>
        </InsightCard>
      </Section>

      <Section title="The alternative">
        <p>
          One plant removed the dedicated fogging pumps and tapped the <strong>boiler-feedwater system</strong>. A heat exchanger
          cooled the water to approximately 200 °F, and control valves replaced the pump combinations that had
          activated the fogging zones.
        </p>
        <p>
          After the first unit was retrofitted with the new boiler-feedwater system at the plant, operators observed more complete evaporation,
          less filter-house runoff, and a unit that appeared to generate more power than comparable units.
        </p>
        <blockquote className="border-l-2 border-gold pl-4 font-serif text-xl italic text-cream">
          “We noticed the turbine with the new fogging system was generating 2–3 MW more than the other units. The
          temperature of the fogging water must be responsible for the power spike—it’s the only parameter that’s
          different.”
          <footer className="mt-2 font-sans text-sm not-italic text-muted">Plant operator</footer>
        </blockquote>
      </Section>

      <Section title="The hypothesis">
        <p>
          If the apparent difference was water temperature, and hotter water evaporated more completely, it was
          reasonable to ask whether that extra evaporation caused the additional output. 
        </p>
        <p className="text-[15px] italic text-gold">
          Does more evaporation necessarily mean more cooling and greater turbine output?
        </p>
        <p>
          The theoretical droplet model was built to isolate that variable while holding the other initial conditions fixed.
        </p>
      </Section>

      <Section title="What the model showed">
        <div className="grid gap-4 md:grid-cols-3">
          <Mini title="The assumption">
            More complete evaporation means better cooling and higher turbine output.
          </Mini>
          <Mini title="The physics">
            Cooling is both latent and convective. Hot water initially transfers sensible heat into the inlet air.
          </Mini>
          <Mini title="The result">
            Hotter water produced a slightly warmer, less-dense inlet airstream despite evaporating more completely.
          </Mini>
        </div>
        <InsightCard kicker="Theoretical result">
          <p>
            Cooler water produced a greater air-density increase in the transient droplet model. Water temperature had
            an effect—but it acted opposite to the original explanation for the extra megawatts.
          </p>
        </InsightCard>
        <p>
          Reproduce the comparison in the Simulator with the <TextLink to="/simulator?preset=cold-water">cold</TextLink>,{" "}
          <TextLink to="/simulator?preset=ambient-water">ambient</TextLink>, and{" "}
          <TextLink to="/simulator?preset=hot-water">hot-water</TextLink> presets.
        </p>
      </Section>

      <Section title="What changed operationally">
        <div className="grid gap-4 md:grid-cols-2">
          <Comparison title="Conventional pump skid">
            <li>Four to six dedicated positive-displacement pumps</li>
            <li>Pump combinations create the flow stages</li>
            <li>Frequent starts, rebuilds, vibration, and leakage</li>
            <li>Pump and filter debris can reach the nozzles</li>
          </Comparison>
          <Comparison title="Boiler-feedwater conversion">
            <li>Existing boiler-feedwater pressure supplies the fogger</li>
            <li>Control valves activate the existing zones</li>
            <li>Dedicated fogging pumps and motors are eliminated</li>
            <li>Heat exchanger, controls, filtration, and chemistry still require attention</li>
          </Comparison>
        </div>
      </Section>

      <Section title="Five years of field experience">
        <div className="grid gap-4 sm:grid-cols-2">
          <Metric value="4 units" label="operating with boiler-feedwater fogging" />
          <Metric value="Nearly 100%" label="availability reported by the plant" />
          <Metric value="~$10,000" label="lower annual maintenance cost per unit" />
          <Metric value="~18 vs. 40–45" label="recorded work orders per unit since 2008" />
        </div>
        <p>
          The site reported no fogging-induced compressor or SCR performance problems. The study also estimated that
          removing the dedicated motors avoided approximately 100,000–200,000 kWh of auxiliary consumption per unit
          each year.
        </p>
      </Section>

      <Section title="Where did the extra megawatts come from?">
        <p>
          The study did not isolate a single cause. The 2–3 MW difference was an operating observation, not a
          controlled before-and-after test. Water temperature alone could not explain it.
        </p>
        <p>
          The fleet evidence points instead to system condition and availability as plausible contributors. Eliminating
          failure-prone pumps removed a major source of vibration and debris. Cleaner filters and nozzles, dependable
          zone operation, correct delivered flow, and fewer maintenance outages make it more likely that a system will
          produce its intended fog when called upon.
        </p>
        <InsightCard kicker="Evidence boundary">
          <p>
            The comparison included four boiler-feedwater units at one plant. Maintenance-recording practices varied by
            site, and fogger unavailability was not consistently captured in plant historians or GADS reports. The study
            shows a strong reliability signal—not a guaranteed 2–3 MW benefit from boiler-feedwater fogging.
          </p>
        </InsightCard>
      </Section>

      <Section title="Three lessons that transfer">
        <ol className="list-decimal space-y-3 pl-5">
          <li>Separate thermodynamic effectiveness from mechanical reliability.</li>
          <li>A healthy nozzle system can matter more than the relatively small effect of water temperature.</li>
          <li>
            Before assigning a cause to an MW difference, normalize ambient conditions and check water flow, header
            pressure, enabled zones, nozzle condition, and control state.
          </li>
        </ol>
      </Section>

      <Section title="Read the underlying analysis">
        <p>The white paper develops the droplet model and compares its predicted final-air temperatures with field data.</p>
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

function Comparison({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-5">
      <h3 className="font-serif text-xl text-cream">{title}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">{children}</ul>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-cyan bg-panel px-5 py-4">
      <p className="font-serif text-2xl text-cream">{value}</p>
      <p className="mt-1 text-sm leading-6 text-muted">{label}</p>
    </div>
  );
}
