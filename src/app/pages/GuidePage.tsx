import { InsightCard, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";
import { Term } from "../components/Term";

export function GuidePage() {
  return (
    <PageShell>
      <PageIntro index="04 — Engineering guide" title="Practice, not prescriptions">
        <p>
          These notes reorganize field experience into reusable guidance. They are generalized and anonymized. They
          are not site-specific recommendations, OEM guidance, or a substitute for engineering judgment. Equipment and
          vendor practices have changed since the early-2000s / 2011–2012 studies that informed this work; the
          underlying physics has not.
        </p>
      </PageIntro>

      <Section id="nozzles" kicker="4.1" title="Droplet sizing and nozzle condition">
        <p>
          Nozzles exist to create surface area. Typical fog droplets are on the order of 10–40 μm. Debris, scale, or
          wear that opens the orifice increases <Term id="smd" /> and the <Term id="dv90" /> tail. The water-flow
          meter may still look healthy while atomization has collapsed.
        </p>
        <p>
          See <TextLink to="/how-it-works#droplet-size">why droplet size matters</TextLink> and compare{" "}
          <TextLink to="/simulator?preset=small-droplets">small</TextLink> vs.{" "}
          <TextLink to="/simulator?preset=large-droplets">large droplet</TextLink> presets.
        </p>
      </Section>

      <Section id="pressure" kicker="4.2" title="Operating pressure and distribution">
        <p>
          Atomization quality is a function of nozzle design and differential pressure. Undersized pressure or
          uneven header distribution produces a mixed spray: some fine fog, some coarse jets that fall out
          immediately. Orientation relative to the airflow and to obstructions matters more than a plot of gpm.
        </p>
      </Section>

      <Section id="residence" kicker="4.3" title="Residence time and filter-house geometry">
        <p>
          The model assumes a nominal ~1.5 s of unobstructed contact. Real inlets have trash screens, silencers,
          struts, and turns. Even small droplets can collide with those surfaces; collected films can be re-entrained as
          much larger drops. Geometry is outside the ODE model. Treat remaining diameter in the simulator as a warning
          light, not a CFD result.
        </p>
      </Section>

      <Section id="fallout" kicker="4.4" title="Drainage and liquid fallout">
        <p>
          Filter-house runoff does not map one-to-one onto cooling or system health. It fluctuates with climate. If there
          is never any runoff, the system may be under-fogging. Dirty nozzles also increase <Term id="liquid-fallout" />{" "}
          and should be inspected — but maximizing cooling usually implies <em>some</em> liquid never evaporates.
        </p>
        <p>
          When the simulator reports liquid remaining, read{" "}
          <TextLink to="/how-it-works#overspray">overspray and wet compression</TextLink>.
        </p>
      </Section>

      <Section id="pumps" kicker="4.5" title="Pumps, materials, and plugging">
        <p>
          Dedicated high-pressure pumps are the common supply. Demineralized water has low lubricity and will destroy
          pumps not designed for it. Vibration sheds debris that loads filters and nozzles. Filtration, metallurgy, and
          a maintenance interval that matches the water chemistry are not optional accessories.
        </p>
        <p>
          Tubing vibration and high-cycle fatigue at clamps and takeoffs are recurring failure modes on long fog grids.
        </p>
      </Section>

      <Section id="controls" kicker="4.6" title="Controls and wet-bulb approach">
        <p>
          A control system that only looks at dry bulb will over-fog on humid days and under-fog on dry ones. Wet-bulb
          (or humidity) feedback is how you stay near, not through, saturation. The model will happily run to 100% RH;
          a plant should not treat that as a target without considering carryover.
        </p>
      </Section>

      <Section id="bfw" kicker="4.7" title="Boiler-feedwater fogging">
        <p>
          Tapping boiler feedwater can eliminate dedicated demin pumps and their maintenance. Warmer water often
          evaporates more completely, with less visible runoff. Operators may reasonably infer that this is “working
          better.”
        </p>
        <InsightCard>
          <p>
            Operational reliability and thermodynamic cooling are different questions. BFW can be a rational
            reliability choice. It should not be assumed, from reduced runoff alone, to be the thermodynamically
            cooler inlet. <TextLink to="/case-study">The case study</TextLink> is the narrative; the{" "}
            <TextLink to="/simulator?preset=hot-water">hot-water preset</TextLink> is the demonstration.
          </p>
        </InsightCard>
      </Section>

      <Section id="inspection" kicker="4.8" title="Inspection and maintenance">
        <p>
          Walkdowns that only check “pumps running, flow on” miss the performance-critical parts: nozzle spray
          quality, header leaks, vibration, filter ΔP, and drain paths. Historical vendor-specific findings from the
          original study period should be checked against current hardware rather than copied as eternal rules.
        </p>
      </Section>
    </PageShell>
  );
}
