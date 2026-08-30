import { EquationBlock, InsightCard, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell, Section } from "../components/PageShell";
import { Term } from "../components/Term";
import { GLOSSARY } from "../content/glossary";

export function HowItWorksPage() {
  return (
    <PageShell>
      <PageIntro index="01 — How fogging works" title="Inlet cooling, explained">
        <p>
          Gas-turbine inlet foggers inject a fine spray of water into the airstream ahead of the compressor. The
          droplets evaporate, pulling heat from the air. Cooler air is denser, so mass flow — and output — recover on
          hot afternoons.
        </p>
      </PageIntro>

      <Section id="inlet-temperature" kicker="1.1" title="Why inlet temperature matters">
        <p>
          A gas turbine is a volumetric machine: the compressor swallows a volume of air, not a guaranteed mass. On a
          hot day that volume weighs less, fueling and firing temperatures are constrained, and output collapses just
          as demand peaks. Industry rules of thumb put the output gain from inlet cooling on the order of 0.5–0.9% per
          °F of inlet-temperature reduction — a magnitude, not a guarantee for any particular machine.
        </p>
        <p>
          Fogging is evaporative cooling, not a refrigerated chiller. Heat is taken from the air to vaporize water at
          the droplet surface. Cooling stops when the water is gone or the airstream reaches saturation.
        </p>
      </Section>

      <Section id="psychrometrics" kicker="1.2" title="Dry bulb, wet bulb, and saturation">
        <p>
          <Term id="dry-bulb" /> is the ordinary air temperature. <Term id="wet-bulb" /> is the lowest temperature air
          can reach by evaporating water at the current humidity. The difference is the evaporative potential.
        </p>
        <p>
          <Term id="relative-humidity" /> is how close the air already is to saturation.{" "}
          <Term id="approach-to-wet-bulb" /> is how closely the fogged airstream gets to that limit before it enters the
          compressor. High ambient humidity leaves little room to cool.
        </p>
        <p>
          Try the <TextLink to="/simulator?preset=dry-day">dry-day</TextLink> versus{" "}
          <TextLink to="/simulator?preset=humid-day">humid-day</TextLink> presets to see the saturation ceiling.
        </p>
      </Section>

      <Section id="evaporation" kicker="1.3" title="Droplet heat and mass transfer">
        <p>Two stages dominate after injection:</p>
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
          The analysis does not stop at evaporation.{" "}
          <strong className="text-cream">Convective heat transfer</strong> between droplet and air can add or subtract
          cooling depending on whether the water is colder or hotter than the airstream. That is the physical core of
          the boiler-feedwater question.{" "}
          <TextLink to="/explore">Explore this interactively</TextLink>.
        </p>
      </Section>

      <Section id="convection" kicker="1.4" title="Latent cooling versus convection">
        <p>
          Latent heat — the energy absorbed as liquid becomes vapor — is the main cooling mechanism. Convection is the
          sensible exchange: if droplets are colder than the air, they also cool the air by contact; if they are much
          hotter, they dump enthalpy into the same airstream that evaporation is trying to cool.
        </p>
        <InsightCard kicker="Key insight">
          <p>
            Faster evaporation is not the same as greater cooling. Hotter water evaporates more readily and can leave
            less runoff, but the extra enthalpy stays in the droplet–air system. All else equal, final air temperature
            is slightly higher.
          </p>
        </InsightCard>
        <p>
          Compare <TextLink to="/simulator?preset=cold-water">cold</TextLink>,{" "}
          <TextLink to="/simulator?preset=ambient-water">ambient</TextLink>, and{" "}
          <TextLink to="/simulator?preset=hot-water">hot-water</TextLink> presets. Then read the{" "}
          <TextLink to="/case-study">field investigation</TextLink> that made this distinction operationally important.
        </p>
      </Section>

      <Section id="droplet-size" kicker="1.5" title="Droplet size and surface area">
        <p>
          Evaporation rate scales with surface area. Smaller droplets have more area per unit mass, so they approach
          equilibrium faster. Typical fog nozzles produce droplets on the order of 5–20 μm, with a representative{" "}
          <Term id="smd" /> used in engineering discussion. <Term id="dv90" /> describes the large tail of the spray —
          the droplets most likely to survive to the compressor.
        </p>
        <p>
          The simulator models a <em>representative</em> spherical droplet, not a statistical nozzle distribution. Worn
          or plugged nozzles that produce large droplets change the problem even if the water flow reading looks
          unchanged. See <TextLink to="/guide#nozzles">nozzle condition</TextLink> and compare{" "}
          <TextLink to="/simulator?preset=small-droplets">small</TextLink> versus{" "}
          <TextLink to="/simulator?preset=large-droplets">large droplet</TextLink> presets.
        </p>
      </Section>

      <Section id="residence-time" kicker="1.6" title="Residence time">
        <p>
          <Term id="residence-time">Residence time</Term> between the fog grid and the compressor inlet is typically on
          the order of a second — often cited as less than 1.5 s. That is the time available for evaporation. The model
          integrates for up to 1.5 s and stops earlier if the droplet reaches the continuum (Knudsen) limit or if air
          and droplet stop changing.
        </p>
        <p>
          Filter-house geometry, silencer baffles, and duct turns steal residence time and collect liquid. Those
          effects are <TextLink to="/guide#residence">engineering-guide topics</TextLink>, not part of the ODE model.
        </p>
      </Section>

      <Section id="overspray" kicker="1.7" title="Overspray and wet compression">
        <p>
          If liquid still exists at the compressor inlet, that is <Term id="overspray" />. Some of it may evaporate
          inside the compressor (<Term id="wet-compression" />); some may hit blades, casings, or drains. The
          educational model does not simulate compressor stages. Remaining droplet diameter at 1.5 s is a signal that
          liquid <em>could</em> still be present — not a prediction of blade wetting.
        </p>
        <EquationBlock
          label="Mass transfer rate (Sh = 2, stagnant sphere — limiting form)"
          formula="ṁ = −π · d · Dᵥ · Sh · (ρ_vs − ρ_v∞)"
          legend={[
            { symbol: "d", meaning: "Droplet diameter" },
            { symbol: "Dᵥ", meaning: "Vapor diffusivity in air" },
            { symbol: "Sh", meaning: "Sherwood number (mass-transfer Nusselt number)" },
            { symbol: "ρ_vs", meaning: "Saturation vapor density at the droplet surface" },
            { symbol: "ρ_v∞", meaning: "Vapor density in the bulk air" },
          ]}
        />
        <p>
          The working simulator uses buoyancy-corrected Nu and Sh rather than forcing Sh = Nu = 2. Full equations:{" "}
          <TextLink to="/resources">Model & methods</TextLink>.
        </p>
      </Section>

      <Section id="glossary" kicker="1.8" title="Glossary">
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
