import { Link } from "react-router-dom";
import { round } from "../../model/types";
import type { ScenarioRun } from "./useSimulation";

function dropletLabel(run: ScenarioRun): string {
  if (run.result.stopReason === "continuum-limit" || run.result.evaporatedFraction > 0.98) {
    return "Fully evaporated";
  }
  if (run.result.evaporatedFraction > 0.5) return "Substantially evaporated";
  return "Liquid remains";
}

function rhLabel(rh: number): string {
  if (rh >= 95) return "Approaching saturation";
  if (rh >= 80) return "High humidity";
  return "Evaporation potential remains";
}

export function ResultsSummary({ runs }: { runs: ScenarioRun[] }) {
  const primary = runs[0];
  if (!primary) return null;
  const dT = round(primary.result.finalAirTemperatureF - primary.inputs.airTempF, 1);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultCard
          label="Final air temperature"
          value={`${round(primary.result.finalAirTemperatureF, 1)} °F`}
          hint={`${dT > 0 ? "+" : ""}${dT} °F from inlet`}
          href="/how-it-works#inlet-temperature"
        />
        <ResultCard
          label="Final relative humidity"
          value={`${round(primary.result.finalRelativeHumidityPercent, 0)} %`}
          hint={rhLabel(primary.result.finalRelativeHumidityPercent)}
          href="/how-it-works#psychrometrics"
        />
        <ResultCard
          label="Final droplet diameter"
          value={`${round(primary.result.finalDropletDiameterUm, 1)} μm`}
          hint={dropletLabel(primary)}
          href="/how-it-works#droplet-size"
        />
        <ResultCard
          label="Air density change"
          value={`${primary.result.airDensityChange >= 0 ? "+" : ""}${round(primary.result.airDensityChange * 100, 1)} %`}
          hint="Cooler inlet air increases density"
          href="/how-it-works#inlet-temperature"
        />
      </div>

      {runs.length > 1 && (
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[32rem] text-left font-sans text-sm">
            <thead className="bg-panel font-mono text-sm uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-2">Result</th>
                {runs.map((r) => (
                  <th key={r.id} className="px-3 py-2 text-cream">
                    {r.name}
                  </th>
                ))}
                <th className="px-3 py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="Final air temp"
                unit="°F"
                values={runs.map((r) => r.result.finalAirTemperatureF)}
                digits={1}
              />
              <CompareRow
                label="Final RH"
                unit="%"
                values={runs.map((r) => r.result.finalRelativeHumidityPercent)}
                digits={0}
              />
              <CompareRow
                label="Final droplet"
                unit="μm"
                values={runs.map((r) => r.result.finalDropletDiameterUm)}
                digits={1}
              />
              <CompareRow
                label="Density change"
                unit=" pt"
                values={runs.map((r) => r.result.airDensityChange * 100)}
                digits={1}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string;
  hint: string;
  href: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-panel px-4 py-4">
      <p className="font-mono text-sm tracking-widest text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl text-cream">{value}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      <Link to={href} className="mt-2 inline-block font-sans text-sm text-gold hover:underline">
        Why this matters
      </Link>
    </div>
  );
}

function CompareRow({
  label,
  unit,
  values,
  digits,
}: {
  label: string;
  unit: string;
  values: number[];
  digits: number;
}) {
  const delta = values.length > 1 ? values[values.length - 1] - values[0] : 0;
  return (
    <tr className="border-t border-line">
      <td className="px-3 py-2 text-muted">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-3 py-2 font-mono text-cream">
          {round(v, digits)} {unit}
        </td>
      ))}
      <td className="px-3 py-2 font-mono text-gold">
        {delta > 0 ? "+" : ""}
        {round(delta, digits)}
        {unit}
      </td>
    </tr>
  );
}
