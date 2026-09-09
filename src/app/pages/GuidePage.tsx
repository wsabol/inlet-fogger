import { InsightCard, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";
import { Term } from "../components/Term";

export function GuidePage() {
  return (
    <PageShell>
      <PageIntro index="04 — Engineering guide" title="Practice, not prescriptions">
        <p>
          These notes reorganize field experience into reusable guidance. They
          are not site-specific recommendations, OEM guidance, or a substitute for engineering judgment. 
        </p>
        <p>
          While equipment and vendor practices may change over time, the underlying physics does not.
        </p>
      </PageIntro>

      <Section id="nozzles" kicker="4.1" title="Droplet sizing and nozzle condition">
        <p>
          Nozzles exist to create surface area. Typical fog droplets are on the order of 10–40 μm. Debris, scale, or
          wear that opens the orifice increases <Term id="smd" /> and the <Term id="dv90" /> tail. The water-flow
          meter may still look healthy while atomization has collapsed.
        </p>
        <p>
          Fogging nozzles typically wear out over a period of several years with accompanying loss in 
          cooling effectiveness and increase in liquid fallout inside inlet filter house and compressor inlet manifold.
          Replacement of worn nozzles restores cooling efficiency and minimizes liquid fallout.
        </p>
        <p>
          See <TextLink to="/how-it-works#droplet-size">why droplet size matters</TextLink> and compare{" "}
          <TextLink to="/simulator?preset=small-droplets">small</TextLink> vs.{" "}
          <TextLink to="/simulator?preset=large-droplets">large droplet</TextLink> presets.
        </p>
        <InsightCard kicker="Field lesson — flow is not proof of atomization">
          <p>
            A normal water-flow reading does not prove that the nozzles are producing an effective fog. If cooling
            performance falls while indicated flow remains steady, inspect representative spray patterns and compare
            zone pressures before assuming the turbine or weather data is at fault.
          </p>
        </InsightCard>
      </Section>

      <Section id="pressure" kicker="4.2" title="Operating pressure and distribution">
        <p>
          Atomization quality is a function of nozzle design and differential pressure. Undersized pressure or
          uneven header distribution produces a mixed spray: some fine fog, some coarse jets that fall out
          immediately. Orientation relative to the airflow and to obstructions matters more than a plot of gpm.
        </p>
        <p>
          Plant operators can be tempted to reduce pump loading by reducing pressure. 
          However, this is an engineered modification: it requires compatible nozzles, verified flow 
          and atomization, controls review, and the appropriate engineering and OEM approvals.
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
        <InsightCard kicker="Field lesson — use drainage as a trend">
          <p>
            Drainage is a diagnostic signal, not a stand-alone pass/fail test. Compare it with humidity, commanded
            stages, water flow, and the unit’s normal baseline. A sudden increase can indicate a damaged nozzle, a
            header leak, poor atomization, or a restricted drain—not simply “too much fog.”
          </p>
        </InsightCard>
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
        <InsightCard kicker="Field lesson — trace debris upstream">
          <p>
            Repeatedly cleaning plugged nozzles may treat the symptom while leaving the source untouched. Fleet
            inspections traced recurring plugs to deteriorating pump components and damaged or collapsed discharge
            filters. Examine the debris, pump condition, and filter integrity before returning the grid to service.
          </p>
          <p>
            Lower-stage pumps may also age first because the staging sequence starts and stops them more often. Compare
            start counts and runtime by pump rather than assuming equal service.
          </p>
        </InsightCard>
      </Section>

      <Section id="controls" kicker="4.6" title="Controls and wet-bulb approach">
        <p>
          A control system that only looks at dry bulb will over-fog on humid days and under-fog on dry ones. Typical
          logic uses ambient dry-bulb and humidity measurements to calculate wet bulb, then compares that reference
          with downstream inlet temperature to estimate approach and stay near, not through, saturation.
        </p>
        <InsightCard kicker="Field lesson — the displayed approach is an estimate">
          <p>
            The wet-bulb approach shown by the control system is not direct humidity measurement—it's an estimate derived
            from ambient dry-bulb/RH (to calculate wet bulb) compared against downstream inlet temperature. Sensor location,
            calibration, response time, the control system modeling, and a deliberate margin against liquid carryover all 
            influence the displayed value. Treat it as a trend indicator, not an independent primary measurement.
          </p>
          <p>
            The control system and simulator are describe the same physical outcome, but through different
            measurement paths and assumptions. Since the two use different methods, some variance in the field is expected;
            large or shifting gaps warrant checking sensors, active fogging stages, water flow, nozzle condition, and control limits.
          </p>
        </InsightCard>
      </Section>

      <Section id="bfw" kicker="4.7" title="Boiler-feedwater fogging">
        <p>
          Tapping boiler feedwater can eliminate dedicated water pumps and their maintenance. Warmer water often
          evaporates more completely, with less visible runoff. Operators may reasonably infer that this is "working
          better", but we should be careful about what that means.
        </p>
        <InsightCard>
          <p>
            Operational reliability and thermodynamic cooling are different questions. BFW can be a rational
            reliability choice. However, the reliability gains come with slightly less efficient cooling and 
            equipment compatibility concerns.
          </p>
        </InsightCard>
        <p>
          In the case study, four boiler-feedwater units had far fewer work orders and 60%-70% lower
          annual maintenance cost per unit than the pump-based systems. That operating history is encouraging, but a
          conversion still requires site-specific review of water chemistry, cooling availability, heat-exchanger duty,
          materials, relief protection, controls, and compressor requirements.
        </p>
      </Section>

      <Section id="inspection" kicker="4.8" title="Inspection and maintenance">
        <p>
          Walkdowns that only check "pumps running, flow on" miss the performance-critical parts: nozzle spray
          quality, header leaks, vibration, filter pressure differential, and drain paths.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Check for abnormal leakage, wall wetting, pump noise, or vibration.</li>
          <li>Check suction and discharge filter condition or differential pressure.</li>
          <li>Clean or replace filters as required and inspect representative nozzles by zone.</li>
          <li>Test drain switches or flowmeters, every operating stage, and important permissives.</li>
          <li>Compare pump starts and runtime so heavily cycled stages are identified early.</li>
        </ul>
      </Section>
    </PageShell>
  );
}
