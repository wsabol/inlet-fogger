import { Link } from "react-router-dom";
import type { ScenarioRun } from "./useSimulation";

export function InterpretationPanel({
  run,
  showHotWater,
}: {
  run: ScenarioRun;
  showHotWater: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-panel px-5 py-4">
        <p className="font-mono text-sm tracking-widest text-gold">{run.interpretation.status}</p>
        <p className="mt-1 text-sm text-muted">{run.interpretation.statusDetail}</p>
        <p className="mt-3 text-[15px] leading-7 text-cream/90">{run.interpretation.body}</p>
      </div>
      {(showHotWater || run.interpretation.waterTempCallout) && (
        <aside className="border-l-2 border-gold bg-panel px-5 py-4">
          <p className="font-mono text-sm tracking-widest text-gold">
            Why did hotter water evaporate faster but leave warmer air?
          </p>
          <p className="mt-2 text-[15px] leading-7 text-cream/90">
            {run.interpretation.waterTempCallout ??
              "Faster evaporation is not the same as greater cooling. Higher-temperature water contains more initial energy. Although hot water may evaporate more readily under otherwise identical conditions, that added enthalpy remains part of the droplet–air system."}
          </p>
          <p className="mt-3 text-sm">
            <Link to="/how-it-works#convection" className="text-gold hover:underline">
              Read the physics
            </Link>
            {" · "}
            <Link to="/case-study" className="text-gold hover:underline">
              Field investigation
            </Link>
          </p>
        </aside>
      )}
      {run.result.stopReason !== "continuum-limit" && run.result.evaporatedFraction < 0.98 && (
        <p className="text-sm text-muted">
          Larger remaining droplets increase the possibility that liquid is still present as airflow approaches
          downstream inlet components.{" "}
          <Link to="/guide#fallout" className="text-gold hover:underline">
            Liquid fallout and compressor considerations
          </Link>
        </p>
      )}
    </div>
  );
}

export function AboutModel() {
  return (
    <details className="rounded-lg border border-line bg-panel px-5 py-4">
      <summary className="cursor-pointer font-sans text-sm text-cream">About this model</summary>
      <p className="mt-3 text-sm leading-6 text-muted">
        This simulator models heat and mass transfer between a representative water droplet and surrounding humid air
        over a nominal 1.5 s filter-house residence time, with a 0.1 ms timestep. It does not model detailed duct
        geometry, turbulence, nozzle spray distributions, wall interaction, or compressor behavior. Results are not a
        guaranteed plant-performance predictor.
      </p>
      <p className="mt-2 text-sm">
        <Link to="/resources" className="text-gold hover:underline">
          View full assumptions and derivation
        </Link>
      </p>
    </details>
  );
}
