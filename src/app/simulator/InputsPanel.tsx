import type { ScenarioInputs } from "../../model/types";
import { PRESETS, type Preset } from "../../model/presets";

type Field = {
  key: keyof ScenarioInputs;
  label: string;
  unit: string;
  hint: string;
  tooltip: string;
  min: number;
  max: number;
  step: number;
};

const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "Ambient conditions",
    fields: [
      {
        key: "airTempF",
        label: "Air temperature",
        unit: "°F",
        hint: "Ambient dry-bulb temperature",
        tooltip: "Temperature of the inlet air before fogging begins.",
        min: 40,
        max: 140,
        step: 1,
      },
      {
        key: "rhPercent",
        label: "Relative humidity",
        unit: "%",
        hint: "Lower humidity generally allows more water to evaporate.",
        tooltip: "Amount of water vapor already present in the inlet air relative to saturation.",
        min: 0,
        max: 100,
        step: 1,
      },
    ],
  },
  {
    title: "Fogging conditions",
    fields: [
      {
        key: "waterTempF",
        label: "Water temperature",
        unit: "°F",
        hint: "Water supply temperature at the nozzle",
        tooltip: "Temperature of the fogging water as it exits the nozzle.",
        min: 32,
        max: 212,
        step: 1,
      },
      {
        key: "waterFlowGpm",
        label: "Water flow rate",
        unit: "gpm",
        hint: "Total fog-skid flow — more flow is not always more cooling",
        tooltip:
          "Total water supplied to the fogging system. Increasing water flow increases the amount of water available for evaporation but does not guarantee that all of it will evaporate before the compressor inlet.",
        min: 0.1,
        max: 200,
        step: 0.5,
      },
      {
        key: "dropletUm",
        label: "Initial droplet diameter",
        unit: "μm",
        hint: "Representative SMD / D32, not a full spray distribution",
        tooltip: "Representative initial droplet diameter used by the model.",
        min: 1,
        max: 80,
        step: 0.5,
      },
    ],
  },
  {
    title: "Turbine / flow",
    fields: [
      {
        key: "loadPercent",
        label: "Turbine load",
        unit: "%",
        hint: "Scales inlet air mass flow (3.9 Mpph at full load)",
        tooltip: "Used to scale airflow through the turbine and therefore the water-to-air mixing ratio.",
        min: 1,
        max: 100,
        step: 1,
      },
    ],
  },
];

export function InputsPanel({
  draft,
  onChange,
  onPreset,
  onRun,
  onCompare,
  onClearComparisons,
  busy,
  canCompare,
  comparisonCount,
}: {
  draft: ScenarioInputs;
  onChange: (patch: Partial<ScenarioInputs>) => void;
  onPreset: (preset: Preset) => void;
  onRun: (name?: string, asComparison?: boolean) => void;
  onCompare: () => void;
  onClearComparisons: () => void;
  busy: boolean;
  canCompare: boolean;
  comparisonCount: number;
}) {
  return (
    <div className="rounded-lg border border-line bg-panel">
      <div className="space-y-6 px-4 py-4">
        <div>
          <p className="mb-2 font-mono text-sm tracking-widest text-muted">Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.watchFor}
                onClick={() => onPreset(p)}
                className="rounded border border-line px-2 py-1 font-sans text-sm text-cream/80 hover:border-gold hover:text-gold"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {GROUPS.map((group, index) => (
          <details key={group.title} className="input-group" open={index === 0}>
            <summary className="mb-3 cursor-pointer font-mono text-sm tracking-widest text-gold md:cursor-default">
              {group.title}
            </summary>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <label key={field.key} className="block" title={field.tooltip}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-sans text-sm text-cream/90">{field.label}</span>
                    <span className="font-mono text-sm text-gold">
                      {formatValue(draft[field.key])} {field.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="mt-2 hidden md:block"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={draft[field.key]}
                    onChange={(e) => onChange({ [field.key]: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    className="mt-2 w-full rounded border border-line bg-ink px-2 py-1.5 font-mono text-sm text-cream md:mt-1"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={draft[field.key]}
                    onChange={(e) => onChange({ [field.key]: Number(e.target.value) })}
                  />
                  <p className="mt-1 font-sans text-sm text-muted">{field.hint}</p>
                </label>
              ))}
            </div>
          </details>
        ))}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onRun(undefined, false)}
            className="bg-gold px-4 py-2.5 font-sans text-sm font-medium text-ink hover:bg-gold-2 disabled:opacity-60"
          >
            {busy ? "Running…" : "Run simulation"}
          </button>
          {canCompare && (
            <button
              type="button"
              disabled={busy || comparisonCount >= 3}
              onClick={onCompare}
              className="border border-cream/30 px-4 py-2 font-sans text-sm text-cream hover:border-gold hover:text-gold disabled:opacity-50"
            >
              Compare scenario
            </button>
          )}
          {comparisonCount > 1 && (
            <button
              type="button"
              onClick={onClearComparisons}
              className="font-sans text-sm text-muted hover:text-cream"
            >
              Clear comparisons
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatValue(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
