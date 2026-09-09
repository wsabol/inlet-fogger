import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InsightCard, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";

const WATER_TEMPERATURE_RESULTS = [
  { x: 60, y: 1.83 },
  { x: 80, y: 1.78 },
  { x: 100, y: 1.72 },
  { x: 120, y: 1.66 },
  { x: 140, y: 1.6 },
  { x: 160, y: 1.54 },
  { x: 180, y: 1.47 },
  { x: 200, y: 1.41 },
];

const chartAxis = {
  fill: "var(--color-muted)",
  fontFamily: "IBM Plex Mono",
  fontSize: 12,
};

function ModelResultsChart() {
  return (
    <figure
      aria-label="Air density increase by water temperature"
      className="rounded-lg border border-line bg-panel p-4 md:p-5"
    >
      <figcaption className="mb-4 font-mono text-sm tracking-widest text-muted">
        AIR DENSITY INCREASE BY WATER TEMPERATURE
      </figcaption>
      <div className="h-80 w-full">
        <ResponsiveContainer>
          <LineChart
            accessibilityLayer
            data={WATER_TEMPERATURE_RESULTS}
            margin={{ top: 8, right: 12, bottom: 28, left: 12 }}
          >
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis
              dataKey="x"
              type="number"
              domain={[60, 200]}
              ticks={[60, 80, 100, 120, 140, 160, 180, 200]}
              tick={chartAxis}
              tickLine={false}
              axisLine={{ stroke: "var(--color-line)" }}
              label={{
                value: "Water temperature (°F)",
                textAnchor: "middle",
                position: "bottom",
                // offset: -18,
                fill: "var(--color-muted)",
                fontSize: 12,
              }}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={[1.4, 1.85]}
              ticks={[1.4, 1.5, 1.6, 1.7, 1.8]}
              tick={chartAxis}
              tickFormatter={(value: number) => value.toFixed(2)}
              tickLine={false}
              axisLine={{ stroke: "var(--color-line)" }}
              width={58}
              label={{
                value: "Air density increase (%)",
                textAnchor: "middle",
                angle: -90,
                position: "left",
                fill: "var(--color-muted)",
                fontSize: 12,
              }}
            />
            <Tooltip
              cursor={{ stroke: "var(--color-muted)", strokeDasharray: "3 3" }}
              contentStyle={{
                background: "var(--color-ink-2)",
                border: "1px solid var(--color-line)",
                borderRadius: 6,
                color: "var(--color-cream)",
                fontSize: 13,
              }}
              labelFormatter={(value) => `Water temperature: ${value} °F`}
              formatter={(value) => [`${Number(value).toFixed(2)}%`, "Air density increase"]}
            />
            <Line
              dataKey="y"
              name="Air density increase"
              type="linear"
              stroke="var(--color-gold)"
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: "var(--color-gold)",
                stroke: "var(--color-panel)",
                strokeWidth: 2,
              }}
              activeDot={{ r: 5, fill: "var(--color-gold-2)", stroke: "var(--color-cream)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

export function CaseStudyPage() {
  return (
    <PageShell>
      <PageIntro index="Field investigation" title="The megawatt mystery">
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
          Since retrofitting with the boiler-feedwater system, operators observed more complete evaporation,
          less filter-house runoff, and consistently more power output than comparable units–about 2–3 MW per unit.
        </p>
        <blockquote className="border-l-2 border-gold pl-4 font-serif text-xl italic text-cream">
          “You get much better air water mixing/evaporation with the higher temperatures. This is where we are picking up the extra megawatts.”
          <footer className="mt-2 font-sans text-sm not-italic text-muted">Plant operator</footer>
        </blockquote>
        <blockquote className="border-l-2 border-gold pl-4 font-serif text-xl italic text-cream">
          “Even though the feedwater temperature is 180 deg F, if you hold you hand a couple of inches from the end of the nozzles, the evaporative cooling is amazing.”
          <footer className="mt-2 font-sans text-sm not-italic text-muted">Plant operator</footer>
        </blockquote>
      </Section>

      <Section title="The hypothesis">
        <p>
          If the only apparent difference was water temperature, and hotter water evaporated more completely, it is
          reasonable to ask whether that extra evaporation caused the additional output. 
        </p>
        <p>
          Our theoretical droplet model was built to investigate this question.
        </p>
        <InsightCard kicker="Core question">
          <p className="text-[15px] italic">Does more evaporation necessarily mean better inlet cooling?</p>
        </InsightCard>
      </Section>

      <Section title="What the model showed">
        <p>
          <span className="italic">Does more evaporation mean more cooling?</span> <span className="font-bold text-cream">No.</span>
        </p>
        <p>
          Cooler water produced a greater air-density increase in the transient droplet model. The water temperature's effect
          acted opposite to the original assumption. 
        </p>
        <ModelResultsChart />
        <p>
          Reproduce the comparison in the Simulator with the <TextLink to="/simulator?preset=cold-water">cold</TextLink>,{" "}
          <TextLink to="/simulator?preset=ambient-water">ambient</TextLink>, and{" "}
          <TextLink to="/simulator?preset=hot-water">hot-water</TextLink> presets.
        </p>
      </Section>

      <Section title="Where did the extra megawatts come from?">
        <p>
          The study did not isolate a single cause. The 2–3 MW difference was an operating observation, not a
          controlled before-and-after test. <span className="text-cream">Water temperature alone does not explain it.</span>
        </p>
        <p>
          The fleet evidence points instead to system condition and availability as plausible contributors. Eliminating
          failure-prone pumps removed a major source of vibration and debris. Cleaner filters and nozzles, dependable
          zone operation, correct delivered flow, and fewer maintenance outages make it more likely that a system will
          produce its intended fog when called upon.
        </p>
        <p>
          For the units operating with boiler-feedwater fogging in the study:
        </p>
        <ul className="list-disc space-y-2 pl-5 leading-6">
          <li>The plant reported nearly 100% availability</li>
          <li>The annual maintenance cost per unit was 60-70% lower</li>
          <li>The recorded work orders per unit were 18 – versus 45 with the dedicated pump systems</li>
        </ul>
        <p>
          The comparison included four boiler-feedwater units at one plant. Maintenance-recording practices varied by site, and 
          fogger unavailability was not consistently captured in plant historians or GADS reports.
        </p>
      </Section>

      <Section title="Conclusions">
        <ol className="list-disc space-y-3 pl-5">
          <li>The primary goal of inlet fogging is to increase the air density so that the mass flow through the turbine and the total power generated increase. Increasing water temperature alone does not accomplish this.</li>
          <li>Colder fogger water will not evaporate as quickly as warm water but will result in a cooler compressor inlet ir temperature.</li>
          <li>The study's findings show a strong reliability signal associated with boiler-feedwater fogging, not a guaranteed MW benefit.</li>
          <li>Healthy nozzles can matter more than the relatively small effect of water temperature.</li>
          <li>Reliability and operational availability are key factors in long-term performance.</li>
          <li>Separate thermodynamic effectiveness from mechanical reliability.</li>
          <li>
            Before assigning a thermodynamic cause to a MW difference, normalize ambient conditions and check water flow, header
            pressure, enabled zones, nozzle condition, and control state.
          </li>
        </ol>
      </Section>

      <Section title="Read the white paper">
        <p>
          The model and accompanying paper, <cite>Theoretical Analysis of Gas Turbine Inlet Foggers and their
          Effectiveness</cite>, were published in the proceedings of <strong>POWER-GEN International 2012</strong>. The paper develops the droplet model
          and compares its predicted final-air temperatures with field data.
        </p>
        <a
          href="/Fogger-Study-White-Paper.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-block border border-cream/30 px-5 py-2.5 font-sans text-sm text-cream hover:border-gold hover:text-gold"
        >
          Fogger Study White Paper (PDF) ↗
        </a>
      </Section>
    </PageShell>
  );
}
