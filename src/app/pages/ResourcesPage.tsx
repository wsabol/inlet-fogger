import { useState } from "react";
import { EquationBlock, TextLink } from "../components/InsightCard";
import { PageIntro, PageShell } from "../components/PageShell";

const TABS = ["Model equations", "Assumptions", "Constants", "Validation", "References"] as const;
type Tab = (typeof TABS)[number];

export function ResourcesPage() {
  const [tab, setTab] = useState<Tab>("Model equations");

  return (
    <PageShell>
      <PageIntro index="05 — Technical reference" title="Model & Methods">
        <p>
          The simulator integrates coupled droplet and air energy/mass balances using a fixed timestep (dt = 0.0001
          s) for up to 1.5 s of duct residence time, stopping early at the continuum (Knudsen) limit or at equilibrium.
        </p>
      </PageIntro>

      <div className="mx-auto max-w-3xl px-5">
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
        <div className="py-8">{tab === "Model equations" && <Equations />}
          {tab === "Assumptions" && <Assumptions />}
          {tab === "Constants" && <Constants />}
          {tab === "Validation" && <Validation />}
          {tab === "References" && <References />}
        </div>
      </div>
    </PageShell>
  );
}

function Equations() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-cream">State variables</h2>
        <div className="mt-4">
          <EquationBlock
            label="State vector"
            formula="y = [T_air, T_drop, d, ω]"
            legend={[
              { symbol: "T_air", meaning: "Air dry-bulb temperature (integrated in K, displayed °F)" },
              { symbol: "T_drop", meaning: "Droplet temperature (K / °F)" },
              { symbol: "d", meaning: "Droplet diameter (m / μm)" },
              { symbol: "ω", meaning: "Specific humidity of air (kg water / kg dry air)" },
            ]}
          />
        </div>
      </div>
      <div>
        <h2 className="font-serif text-2xl text-cream">Saturation vapor pressure</h2>
        <p className="mt-3 text-[15px] leading-7 text-muted">
          The implementation uses an Arden Buck–style expression in Kelvin, matching the original MATLAB{" "}
          <span className="font-mono text-cream">mee_funct</span>. It is not the Magnus formula sometimes quoted in
          simplified notes.
        </p>
        <div className="mt-4">
          <EquationBlock
            label="Arden Buck — P_sat(T)"
            formula="P_sat(T) = 611.21 × exp((19.8428 − T/234.5) · (T − 273.15) / (T − 16.01))  [Pa]"
            legend={[{ symbol: "T", meaning: "Temperature (K)" }]}
          />
        </div>
      </div>
      <div>
        <h2 className="font-serif text-2xl text-cream">Heat and mass transfer</h2>
        <p className="mt-3 text-[15px] leading-7 text-muted">
          Nusselt and Sherwood numbers use a natural-convection correlation of the form Nu, Sh = 2 + 0.6 Gr^{1/4}
          Pr^{1/3} (or Sc). The stagnant-sphere limit Sh = 2 is a useful teaching form; see{" "}
          <TextLink to="/explore">Explore the physics</TextLink>.
        </p>
      </div>
    </div>
  );
}

function Assumptions() {
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
        <tbody className="font-mono text-cream">
          <Row s="g" v="9.80665 m/s²" m="Gravity" />
          <Row s="M_water" v="0.01801528 kg/mol" m="Water molar mass" />
          <Row s="M_da" v="0.0289652 kg/mol" m="Dry-air molar mass" />
          <Row s="R" v="8.314472 J/mol/K" m="Gas constant" />
          <Row s="dt" v="0.0001 s" m="Fixed timestep" />
          <Row s="t_max" v="1.5 s" m="Nominal residence time" />
          <Row s="ṁ_air,ref" v="3.9×10⁶ lb/h" m="Full-load reference airflow" />
        </tbody>
      </table>
    </div>
  );
}

function Row({ s, v, m }: { s: string; v: string; m: string }) {
  return (
    <tr className="border-t border-line">
      <td className="px-3 py-2 text-gold">{s}</td>
      <td className="px-3 py-2">{v}</td>
      <td className="px-3 py-2 font-sans text-muted">{m}</td>
    </tr>
  );
}

function Validation() {
  return (
    <div className="space-y-4 text-[15px] leading-7 text-muted">
      <p>
        The browser solver is a TypeScript port of the recovered JavaScript implementation of MATLAB{" "}
        <span className="font-mono text-cream">mee_funct.m</span>. Canonical study inputs (80 °F air, 50% RH, 60
        gpm, 30 μm, load = 1, water at 60 / 80 / 140 °F) are regression-tested in Vitest.
      </p>
      <p>Known implementation notes versus MATLAB:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          MATLAB <span className="font-mono">mee_funct</span> takes temperatures in °C. The public API of this port
          takes °F and converts to Kelvin internally.
        </li>
        <li>
          Liquid-density and some specific-heat polynomials in the recovered JS already differed from one of the
          MATLAB expressions. This port follows the recovered JS, not a silent re-fit to MATLAB.
        </li>
        <li>
          Display RH is stored as percent once. An earlier UI multiplied percent by 100 a second time; that bug is
          not present here.
        </li>
        <li>
          Numeric gold-standard outputs from MATLAB/Octave are not checked in CI (no Octave in the pipeline). When
          those exports exist, they should replace snapshot tolerances.
        </li>
      </ul>
      <p>
        Tests assert internal consistency (density change vs. first/last samples, unit conversions, determinism) and
        the qualitative hot-vs-cold result: hotter water, smaller final droplet, higher final air temperature.
      </p>
    </div>
  );
}

function References() {
  return (
    <div className="space-y-4 text-[15px] leading-7 text-muted">
      <p>
        Claims on this site are either (a) standard psychrometrics and heat/mass-transfer textbook relations, (b)
        results of the educational droplet model, (c) generalized field observations from an anonymized fleet study,
        or (d) author interpretation. Those categories are labeled where it matters.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Original MATLAB droplet model and parametric water-temperature study (author; unpublished as a numbered paper on this site).</li>
        <li>Standard Arden Buck saturation-pressure formulation as implemented in <span className="font-mono">mee_funct.m</span>.</li>
        <li>
          Public evaporative-inlet-cooling literature (ASME / manufacturer application notes) summarized, not
          reproduced. Figures and proprietary Calpine materials are not republished here.
        </li>
      </ul>
      <p>
        See also <TextLink to="/how-it-works">How fogging works</TextLink>, the{" "}
        <TextLink to="/how-it-works#glossary">glossary</TextLink>, and the{" "}
        <TextLink to="/case-study">case study</TextLink>.
      </p>
    </div>
  );
}
