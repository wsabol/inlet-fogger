import { InsightCard, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";

export function CaseStudyPage() {
  return (
    <PageShell>
      <PageIntro index="Field investigation" title="The boiler-feedwater paradox">
        <p>
          A real-world (anonymized) investigation that challenged a reasonable operating hypothesis: if hotter fogging
          water evaporates more completely, it must be cooling more.
        </p>
        <p className="text-sm">
          Plant names, personnel, costs, and confidential operating data are omitted. The physics and the qualitative
          operational pattern are what this page is for.
        </p>
      </PageIntro>

      <Section title="The challenge">
        <p>
          Conventional fogging skids were suffering familiar problems: pump degradation from demineralized water’s low
          lubricity, clogged filters and nozzles, and a maintenance load that showed up as unreliable fog on the days it
          was needed.
        </p>
      </Section>

      <Section title="The alternative">
        <p>
          One response was to take water from the boiler-feedwater system. That removed dedicated high-pressure pumps,
          reduced a class of mechanical failures, and produced warmer fog — on the order of 200 °F. Operators saw more
          complete evaporation and less filter-house runoff.
        </p>
        <blockquote className="border-l-2 border-gold pl-4 font-serif text-xl italic text-cream">
          “We noticed the turbine with the new fogging system was generating 2–3 MW more than the other units. The
          temperature of the fogging water must be responsible for the power spike — it’s the only parameter that’s
          different.”
          <footer className="mt-2 font-sans text-sm not-italic text-muted">Plant operator, paraphrased</footer>
        </blockquote>
        <p>
          The MW observation is a field report from that period, not a model output and not a prediction the
          simulator is entitled to make.
        </p>
      </Section>

      <Section title="The hypothesis">
        <p>
          If the only intentional difference is water temperature, and evaporation looks more complete, then hotter
          water caused the extra megawatts. That is a coherent operations story. It is also the story the model was
          built to test.
        </p>
      </Section>

      <Section title="What the model showed">
        <div className="grid gap-4 md:grid-cols-3">
          <Mini title="The assumption">
            More evaporation means better cooling and higher turbine output. A common and understandable inference.
          </Mini>
          <Mini title="The physics">
            Cooling is latent plus convective. Warmer water reduces (or reverses) convective cooling; added vapor also
            affects mixture density.
          </Mini>
          <Mini title="The result">
            Despite increased evaporation, hotter water left a slightly warmer, less dense inlet airstream — the
            opposite of the hoped-for thermodynamic effect.
          </Mini>
        </div>
        <InsightCard kicker="Model-derived conclusion">
          <p>
            Cooler inlet water produced greater air-density increase in the transient droplet model, holding other
            initial conditions fixed. That is a theoretical result. It does not prove that any particular unit’s 2–3 MW
            was caused — or not caused — by water temperature. Other differences (nozzle condition, distribution,
            controls, instrumentation) can dominate.
          </p>
        </InsightCard>
        <p>
          Reproduce the comparison with the <TextLink to="/simulator?preset=cold-water">cold</TextLink>,{" "}
          <TextLink to="/simulator?preset=ambient-water">ambient</TextLink>, and{" "}
          <TextLink to="/simulator?preset=hot-water">hot-water</TextLink> presets.
          For equations and assumptions see <TextLink to="/resources">Resources</TextLink>. For the operational
          side of BFW, see the <TextLink to="/guide#bfw">engineering guide</TextLink>.
        </p>
      </Section>
    </PageShell>
  );
}

function Mini({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <h3 className="font-serif text-lg text-cream">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{children}</p>
    </div>
  );
}
