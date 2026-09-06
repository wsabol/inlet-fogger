import { useState } from "react";
import { COMPARISONS } from "../content/fieldComparisons";
import { MathVariable, TextLink } from "./InsightCard";

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
                tab === t ? "bg-panel text-gold" : "text-muted hover:text-cream"
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
  return (
    <ul className="list-disc space-y-3 pl-5 text-[15px] leading-7 text-muted">
      <li>A single representative spherical droplet stands in for the spray (not SMD/Dv90 distributions).</li>
      <li>Uniform mixing with a prescribed water-to-air ratio from skid flow and a 3.9 Mpph reference airflow scaled by load.</li>
      <li>No detailed inlet geometry, turbulence, wall impingement, drainage, or re-entrainment.</li>
      <li>No compressor-stage or Brayton-cycle model; no MW prediction.</li>
      <li>Fixed 1.5 s maximum residence time.</li>
      <li>Empirical property polynomials valid over a limited temperature band (inlet dry-bulb 40–140 °F in this UI).</li>
      <li>Integration stops if the Knudsen number exceeds ~0.08 (continuum treatment no longer applicable) or if rounded temperature and diameter stop changing.</li>
    </ul>
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
        <tbody className="text-cream">
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
      <td className="whitespace-nowrap px-3 py-2 font-mono">{v}</td>
      <td className="px-3 py-2 font-sans text-muted">{m}</td>
    </tr>
  );
}

function Validation() {
  return (
    <div className="space-y-4 text-[15px] leading-7">
      <p className="text-muted">
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
                        {row.property === "Final Air Temperature" ? `${(100 * (row.actual - row.simulated) / row.actual).toFixed(2)}%` : ""}
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
        <ul className="list-disc space-y-3 pl-5 leading-7 text-muted">
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
        </ul>
        <p className="mt-4 text-muted leading-7">
            Formal citations are available in the accompanying <TextLink to="/case-study">case study</TextLink> and <TextLink to="/Fogger-Case-Study-White-Paper.pdf">white paper</TextLink>.
        </p>
        <p className="mt-2 text-muted leading-7">
            See also <TextLink to="/how-it-works">How fogging works</TextLink>, and the{" "}
            <TextLink to="/how-it-works#glossary">glossary</TextLink>.
        </p>
    </div>
  );
}
