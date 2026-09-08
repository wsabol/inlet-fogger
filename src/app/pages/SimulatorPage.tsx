import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { presetById } from "../../model/presets";
import { PageShell } from "../components/PageShell";
import { InterpretationPanel } from "../simulator/Interpretation";
import { InputsPanel } from "../simulator/InputsPanel";
import { ResultsSummary } from "../simulator/ResultsSummary";
import { SimulatorCharts } from "../simulator/Charts";
import { useSimulation } from "../simulator/useSimulation";
import { Assumptions } from "../components/Assumptions";
import { TextLink } from "../components/InsightCard";

export function SimulatorPage() {
  const sim = useSimulation();
  const [params] = useSearchParams();

  useEffect(() => {
    const preset = presetById(params.get("preset") ?? "");
    if (preset) sim.loadInputs(preset.inputs, preset.name);
  }, [params, sim.loadInputs]);

  const hasHotVsCold =
    sim.runs.length >= 2 &&
    Math.max(...sim.runs.map((r) => r.inputs.waterTempF)) -
      Math.min(...sim.runs.map((r) => r.inputs.waterTempF)) >=
      40;
  const active = sim.runs.find((r) => r.id === sim.activeId) ?? sim.runs[0];

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-6">
        <p className="font-mono text-sm tracking-widest text-gold">03 — Fogger simulator</p>
        <h1 className="mt-3 font-serif text-4xl text-cream md:text-5xl">Droplet Evaporation Model</h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7">
          Explore how air temperature, humidity, droplet temperature, droplet size, and water flow affect the
          evaporation of fog droplets before they reach the compressor. Add up to three scenarios to compare on the
          same charts.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 lg:grid-cols-[minmax(16rem,20rem)_1fr]">
        <InputsPanel
          draft={sim.draft}
          onChange={sim.updateDraft}
          onPreset={(p) => {
            sim.loadInputs(p.inputs, p.name);
          }}
          onRun={(name, asComparison) => void sim.run(name, asComparison)}
          onCompare={() => void sim.run(undefined, true)}
          onClearComparisons={sim.clearComparisons}
          busy={sim.busy}
          canCompare={sim.runs.length > 0}
          comparisonCount={sim.runs.length}
        />

        <div className="min-w-0 space-y-6">
          {sim.stale && sim.runs.length > 0 && (
            <p className="rounded border border-gold/40 px-3 py-2 font-mono text-sm text-gold">
              Inputs changed — run again
            </p>
          )}
          {sim.error && (
            <p className="rounded border border-heat/50 px-3 py-2 text-sm text-heat">{sim.error}</p>
          )}
          {sim.issues
            .filter((i) => i.level === "warning")
            .slice(0, 2)
            .map((issue) => (
              <p key={issue.message} className="text-sm text-muted">
                {issue.message}
              </p>
            ))}

          {sim.runs.length === 0 ? (
            <div className="flex min-h-[22rem] items-center justify-center rounded-lg border border-dashed border-line px-6 text-center">
              <div>
                <p className="font-mono text-sm tracking-wide text-muted">
                  Configure inputs and click <span className="text-cream">Run simulation</span>
                </p>
                <p className="mt-2 text-sm text-muted">Or choose a preset to load example conditions.</p>
              </div>
            </div>
          ) : (
            <>
              <ResultsSummary runs={sim.runs} />
              <SimulatorCharts runs={sim.runs} />
              {active && <InterpretationPanel run={active} showHotWater={hasHotVsCold} />}
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-5 pb-6 border-t border-line">
        <div className="max-w-4xl">
          <p className="font-mono text-sm tracking-widest text-cyan">About this model</p>
          <p className="mt-3 text-[15px] leading-6">
            This simulator models heat and mass transfer between a representative spherical water droplet and surrounding humid air over a 
            nominal filter-house, with a 0.1 ms timestep. 
          </p>
          <p className="mt-3 text-[15px] leading-6">
            Its results were validated as a part of a <TextLink to="/case-study">case study</TextLink> against real-world scenarios within ~1.0% of final air temperatures.
          </p>
        </div>
        <Assumptions />
      </div>
    </PageShell>
  );
}
