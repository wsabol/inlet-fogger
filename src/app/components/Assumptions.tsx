import { useState } from "react";
import { COMPARISONS } from "../content/fieldComparisons";
import { MathVariable, TextLink } from "./InsightCard";
import { Term } from "./Term";

const TABS = ["Validation", "Constants", "Assumptions", "References"] as const;
type Tab = (typeof TABS)[number];

export function Assumptions() {
  const [tab, setTab] = useState<Tab>("Constants");

  return (
      <>
        <div className="mx-auto max-w-3xl px-5 mt-8"></div>
        <div className="flex flex-wrap gap-1 border-b border-line">
          {TABS.map((t) => (
            <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-3 py-2 font-sans text-sm ${
                tab === t ? "bg-panel text-gold" : "text-muted hover:text-cyan"
                }`}
            >
                {t}
            </button>
          ))}
        </div>
        <div className="py-8">
          {tab === "Constants" && <Constants />}
          {tab === "Assumptions" && <AssumptionNotes />}
          {tab === "Validation" && <Validation />}
          {tab === "References" && <References />}
        </div>
    </>
  );
}

function AssumptionNotes() {
  const assumptions = [
    {
      headline: "Droplets exit the nozzle at the same velocity as the air.",
      description: "For a very short time after exiting the nozzle, there are differences between the air velocity and droplet velocity, meaning there is forced heat transfer. Due to their size and low Reynolds number (<1), droplets attain air stream velocity within a few milliseconds. The difference between natural and forced evaporation over that short time is negligible.",
    },
    {
      headline: "A single representative spherical droplet stands in for the spray.",
      description: "This is a common assumption. In practice, droplet size and eccentricity follow a normal distribution. The overall effect is neglible for the purposes of this model.",
    },
    {
      headline: "The residence time within the gas turbine filter house is 1.5 seconds.",
      description: "Residence times are dependent on air stream velocity and filter house design but most range from 1-2 seconds.",
    },
    {
      headline: <><Term id="lumped-capacitance" case="title" /> model is valid for the droplet and air.</>,
      description: "This assumption allows the model to represent the droplet and air each with a single temperature, so we can focus on the interaction between the fluids rather than temperature gradients within the fluids.",
    },
    {
      headline: "No detailed inlet geometry or turbulence.",
      description: "Droplets in turbulent surroundings experience much faster heat and mass transfer rates. Inlet geometry, support posts, and other irregularities add some turbulence.",
    },
    {
      headline: "Droplets are distributed uniformly in the air upon exiting the nozzle.",
      description: "In practice, droplet, temperature, and humidity will not be uniform across the filter house. This may account for some variance in the model, although these fluctions will disspate over the droplet's residence time.",
    },
    {
      headline: <>Air is an <Term id="ideal-gas" case="lower" />.</>,
      description: "This is a very common assumption, albeit impossible for any real gas. Water vapor is not as ideal as air, but with the low water vapor concentrations in these simulations, the inaccuracies are negligible. This model uses the ideal gas law in some instances to determine some properties of humid air where it cannot be determined by empirical or other psychrometric means.",
    },
  ];

  return (
    <div className="leading-6">
      <ul className="list-disc space-y-3 pl-5">
        {assumptions.map((assumption, index) => (
          <li key={index}><span className="text-cream">{assumption.headline}</span> {assumption.description}</li>
        ))}
      </ul>

      <p className="mt-6 mb-2 text-muted font-bold text-[15px]">Limitations of the model</p>
      <ul className="list-disc space-y-3 pl-5">
        <li>No compressor-stage or Brayton-cycle model; no MW prediction.</li>
        <li>Fixed 1.5 s maximum residence time.</li>
        <li>The model is scaled to a 3.9 Mpph reference airflow, which is the full-load airflow for a standard 700 MW gas turbine.</li>
        <li>Integration stops if the Knudsen number exceeds ~0.08 (continuum treatment no longer applicable) or if rounded temperature and diameter stop changing.</li>
      </ul>
    </div>
  );
}

function Constants() {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-panel font-mono text-sm uppercase text-muted">
          <tr>
            <th className="px-3 py-2">Symbol</th>
            <th className="px-3 py-2">Value</th>
            <th className="px-3 py-2">Meaning</th>
          </tr>
        </thead>
        <tbody className="text-body">
          <Row s={<MathVariable>g</MathVariable>} v={<>9.80665 m/s<sup>2</sup></>} m="Gravity" />
          <Row s={<MathVariable subscript="water">M</MathVariable>} v="0.01801528 kg/mol" m="Water molar mass" />
          <Row s={<MathVariable subscript="da">M</MathVariable>} v="0.0289652 kg/mol" m="Dry-air molar mass" />
          <Row s={<MathVariable>R</MathVariable>} v="8.314472 J/mol/K" m="Gas constant" />
          <Row s={<MathVariable subscript="max">t</MathVariable>} v="1.5 s" m="Nominal residence time" />
          <Row
            s={<MathVariable subscript={<>air,ref</>} accent="dot">m</MathVariable>}
            v={<>3.9 × 10<sup>6</sup> lb/h</>}
            m="Full-load reference airflow"
          />
          <Row s={<>Δ<MathVariable>t</MathVariable></>} v="0.0001 s" m="Fixed integral timestep" />
        </tbody>
      </table>
    </div>
  );
}

function Row({ s, v, m }: { s: React.ReactNode; v: React.ReactNode; m: React.ReactNode }) {
  return (
    <tr className="border-t border-line">
      <td className="whitespace-nowrap px-3 py-2 font-serif text-base text-gold">{s}</td>
      <td className="whitespace-nowrap px-3 py-2 font-mono text-cream">{v}</td>
      <td className="px-3 py-2 font-sans">{m}</td>
    </tr>
  );
}

function Validation() {
  return (
    <div className="space-y-4 text-[15px] leading-7">
      <p>
        Five turbine operating points compare real-world readings with model output. Across these cases, the
        simulated final air temperature is within 1 °F of the measured value, with a mean absolute error of 0.58
        °F.
      </p>
      <div className="grid gap-5">
        {COMPARISONS.map((comparison) => (
          <div key={comparison.title} className="overflow-hidden rounded-lg border border-line">
            <div className="border-b border-line bg-panel px-3 py-2 font-serif text-lg text-cream">
              {comparison.title}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-panel/60 font-mono text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th scope="col" className="w-2/5 px-3 py-2">
                      Property
                    </th>
                    <th scope="col" className="w-1/5 px-3 py-2 text-right">
                      Actual
                    </th>
                    <th scope="col" className="w-1/5 px-3 py-2 text-right">
                      Simulated
                    </th>
                    <th scope="col" className="w-1/5 px-3 py-2 text-right">% Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row) => (
                    <tr key={row.property} className="border-t border-line">
                      <th scope="row" className="px-3 py-2 font-sans font-normal text-muted">
                        {row.property}
                      </th>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-mono text-cream">
                        {`${row.actual}${row.unit}`}
                      </td>
                      <td className={`whitespace-nowrap px-3 py-2 text-right font-mono text-${row.property === "Final Air Temperature" ? "gold" : "cream"}`}>
                        {`${row.simulated}${row.unit}`}
                      </td>
                      <td className="pwhitespace-nowrap px-3 py-2 text-right font-mono text-gold">
                        {row.property === "Final Air Temperature" ? `${(100 * ((+row.actual) - (+row.simulated)) / (+row.actual)).toFixed(2)}%` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function References() {
  return (
    <div className="text-[15px]">
      <ol className="list-decimal space-y-3 pl-5 leading-6">
        <li>
        <TextLink to="https://en.wikipedia.org/wiki/Density_of_air">Density of Air</TextLink>. Wikipedia.
        </li>
        <li>
        <TextLink to="https://en.wikipedia.org/wiki/Knudsen_layer">Knudsen layer</TextLink>. Wikipedia.
        </li>
        <li>
        <TextLink to="https://en.wikipedia.org/wiki/Arden_Buck_equation">Arden Buck Equation</TextLink>. Wikipedia.
        </li>
        <li>
        <TextLink to="https://en.wikipedia.org/wiki/Clausius%E2%80%93Clapeyron_relation">Clausius-Clapeyron relation</TextLink>. Wikipedia.
        </li>
        <li>
        <TextLink to="https://www.mhtlab.uwaterloo.ca/pdf_reports/mhtl_G01.pdf">Properties of Dry Air at One Atmosphere</TextLink>.
        F.J. McQuillan, J.R. Culham and M.M. Yovanovich (1984).
        </li>
        <li>
        <TextLink to="https://web.archive.org/web/20120919171021/http://www.lsbu.ac.uk/water/molecule.html">Water Structure and Science: Water molecule structure</TextLink>.
        Chaplin, Martin. (2 July, 2012). 
        </li>
        <li>
        <TextLink to="https://www.engineeringtoolbox.com/water-vapor-d_979.html">Water Vapor - Specific Heat. Water Vapor - Specific Heat</TextLink>
        The Engineering Toolbox. (n.d.). 
        </li>
        <li>
        <TextLink to="https://web.archive.org/web/20120807032523/http://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html">Earth Fact Sheet: Terrestrial Atmosphere</TextLink>.
        NASA Goddard Space Flight Center. Grayzeck, Ed. (17 November, 2010). 
        </li>
      </ol>
      <p className="mt-6 text-muted">
        Formal citations are available in the accompanying <TextLink to="/Fogger-Study-White-Paper.pdf">white paper</TextLink>.
      </p>
      <p className="mt-2 text-muted leading-7">
          See also <TextLink to="/how-it-works">How fogging works</TextLink>, and the{" "}
          <TextLink to="/how-it-works#glossary">glossary</TextLink>.
      </p>
    </div>
  );
}
