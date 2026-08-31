import schematicUrl from "../../../img/inlet-fogger-system-schematic.svg";
import { EquationBlock, InsightCard, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";
import { Term } from "../components/Term";
import { GLOSSARY } from "../content/glossary";

export function HowItWorksPage() {
  return (
    <PageShell>
      <PageIntro index="01 — How fogging works" title="Inlet cooling, explained">
        <p>
          Gas turbine inlet foggers are systems designed to enhance turbine output by increasing the density of inlet air. 
          Inlet foggers inject a fine spray of water into the airstream ahead of the compressor. Nozzles atomize the water into <strong className="text-cream">droplets</strong> that are typically on the order of 5-30 μm in diameter. 
          The droplets evaporate, pulling heat from the air. Cooler air is denser, so mass flow — and output — are higher though the turbine.
        </p>
        <p>
          Fogging is primarily an <strong className="text-cream">evaporative cooling</strong> technology, not a refrigerated chiller. Heat is taken from the air to vaporize water at
          the droplet surface. Cooling stops when the water is gone or the airstream reaches saturation.
        </p>
        <figure className="mx-auto max-w-5xl px-5 pb-8">
          <img
            src={schematicUrl}
            alt="Basic inlet fogger system schematic. Ambient inlet air passes through an inlet air filter and fogging nozzle zone within an inlet house before entering a gas turbine. A water supply and high-pressure pump feed the fogger nozzle manifold. Unevaporated water drains from the inlet house."
            className="w-full rounded-sm border border-line bg-white"
          />
          <figcaption className="mt-3 font-sans text-sm leading-6 text-muted">
            Inlet fogger schematic: high-pressure water is injected at the fogger nozzles into the filtered airstream.
            Droplets evaporate in the inlet house, or drain as runoff, before the gas turbine.
          </figcaption>
        </figure>
      </PageIntro>

      <Section id="inlet-temperature" kicker="1.1" title="Why inlet temperature matters">
        <p>
          A gas turbine is a volumetric machine: the compressor swallows a volume of air, not a guaranteed mass. 
          But the power output is directly proportional to the <strong className="text-cream">mass flow rate</strong> of the airstream through the turbine.
        </p>
        <p>On a hot day the same volume of air weighs less than on a cold day, fueling and firing temperatures are constrained, and output collapses just
          as demand peaks. Industry rules of thumb put the output gain from inlet cooling on the order of 0.5-0.9% per
          degree °F of inlet-temperature reduction.
        </p>
      </Section>

      <Section id="psychrometrics" kicker="1.2" title="Dry bulb, wet bulb, and saturation">
        <p>
          <Term id="dry-bulb" /> is the ordinary air temperature. <Term id="wet-bulb" /> is the lowest temperature air
          can reach by evaporating water at the current humidity. The difference is the <strong className="text-cream">evaporative potential</strong>.
        </p>
        <p>
          <Term id="relative-humidity" /> is how close the air already is to saturation. High ambient relative humidity leaves little room to cool.
        </p>
        <p>
          Try the <TextLink to="/simulator?preset=dry-day">dry-day</TextLink> versus{" "}
          <TextLink to="/simulator?preset=humid-day">humid-day</TextLink> presets to see the saturation ceiling.
        </p>
      </Section>

      <Section id="evaporation" kicker="1.3" title="Latent cooling versus evaporation">
        <p>Two stages dominate after the water atomizes into droplets:</p>
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            <strong className="text-cream">Initial cooling phase.</strong> The droplet temperature moves quickly toward
            the wet-bulb temperature as evaporation removes energy from the liquid.
          </li>
          <li>
            <strong className="text-cream">Steady-state evaporation.</strong> Once the droplet is near wet bulb, further
            evaporation is limited by how fast the air can supply heat and how much vapor the bulk air can still accept.
          </li>
        </ol>
        <p>
          Steady-state evaporation is the phase that drives turbine performance. Energy for evaporation is pulled <strong className="text-cream">from the air </strong> to drive <Term id="latent-heat" /> transfer. 
        </p>
        <p>
          <Term id="convection" /> is also a consideration: if droplets are colder than the air, they also cool the air by contact; if they are much
          hotter, they add heat to the same airstream that evaporation is trying to cool.
        </p>
        <InsightCard kicker="Key insight">
          <p>
            Faster evaporation is not the same as greater cooling. Hotter water evaporates very quickly in Phase 1 as it approaches wet bulb, and can leave
            less runoff, but there's less potential for Phase 2 latent-heaer transfer. Put simply, in a closed system the extra enthalpy from the water stays in the droplet-air system. 
            All else equal, the air temperatureas in enters to the compressor will be slightly higher.
          </p>
        </InsightCard>
        <p>
          Compare <TextLink to="/simulator?preset=cold-water">cold</TextLink>,{" "}
          <TextLink to="/simulator?preset=ambient-water">ambient</TextLink>, and{" "}
          <TextLink to="/simulator?preset=hot-water">hot-water</TextLink> presets. Then read the{" "}
          <TextLink to="/case-study">field investigation</TextLink> that made this distinction operationally important.
        </p>
      </Section>

      <Section id="droplet-size" kicker="1.4" title="Droplet size and surface area">
        <p>
          Evaporation rate scales with surface area. Smaller droplets have more area per unit mass, so they approach
          equilibrium faster. Typical fog nozzles produce droplets on the order of 5-30 μm. In reality, droplet size forms a normal distribution, with a representative{" "}
          <Term id="smd" /> used in engineering discussion. <Term id="dv90" /> describes the large tail of the spray —
          the droplets most likely to survive to the compressor.
        </p>
        <InsightCard kicker="Practical Insight">
          <p>
            Water must atomize sufficiently to provide a true fog effect, not just a mist. Worn or clogged nozzles can drastically prevent this from happening. Even if the water flow reading looks
            unchanged, all that water just runs off out of the inlet housing without cooling the air. 
          </p>
        </InsightCard>
        <p>
          The simulator models a <em>representative</em> spherical droplet, not a statistical nozzle distribution. See <TextLink to="/guide#nozzles">nozzle condition</TextLink> and compare{" "}
          <TextLink to="/simulator?preset=small-droplets">small</TextLink> versus{" "}
          <TextLink to="/simulator?preset=large-droplets">large droplet</TextLink> presets.
        </p>
      </Section>

      <Section id="residence-time" kicker="1.5" title="Residence time">
        <p>
          <Term id="residence-time">Residence time</Term> between the fog grid and the compressor inlet is typically on
          the order of a second — often cited as less than 1.5 s. That is the time available for evaporation. 
        </p>
        <p>
          Filter-house geometry, silencer baffles, and duct turns steal residence time and collect liquid. Those
          effects are discussed further in the <TextLink to="/guide#residence">engineering-guide</TextLink>.
        </p>
      </Section>

      <Section id="overspray" kicker="1.6" title="Overspray and wet compression">
        <p>
          If liquid still exists at the compressor inlet, that is <Term id="overspray" />. Some of it may evaporate
          inside the compressor (<Term id="wet-compression" />); some may hit blades, casings, or drains.
        </p>
        <p>
          Some drainage is normal in a well-designed fogging system. Too much or increasing 
          drainage may indicate excessive water flow, worn or damaged nozzles, poor atomization, a piping leak, or changing ambient conditions. 
        </p>
      </Section>

      <Section id="glossary" kicker="1.7" title="Glossary">
        <dl className="space-y-3">
          {Object.entries(GLOSSARY).map(([id, entry]) => (
            <div key={id} id={id} className="scroll-mt-24">
              <dt className="font-sans text-cream">{entry.term}</dt>
              <dd className="text-sm leading-6 text-muted">{entry.meaning}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </PageShell>
  );
}
