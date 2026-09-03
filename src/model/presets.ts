import type { ScenarioInputs } from "./types";

export type Preset = {
  id: string;
  name: string;
  watchFor: string;
  inputs: ScenarioInputs;
};

export const BASELINE_INPUTS: ScenarioInputs = {
  airTempF: 80,
  waterTempF: 80,
  rhPercent: 50,
  waterFlowGpm: 30,
  dropletUm: 30,
  loadPercent: 100,
};

export const PRESETS: Preset[] = [
  {
    id: "baseline",
    name: "Baseline",
    watchFor: "Reference case from the original water-temperature comparison.",
    inputs: { ...BASELINE_INPUTS },
  },
  {
    id: "cold-water",
    name: "Cold water",
    watchFor: "Water colder than the air — convection and evaporation both cool the inlet.",
    inputs: { ...BASELINE_INPUTS, waterTempF: 60 },
  },
  {
    id: "ambient-water",
    name: "Ambient water",
    watchFor: "Water injected at the inlet dry-bulb temperature.",
    inputs: { ...BASELINE_INPUTS, waterTempF: 80 },
  },
  {
    id: "hot-water",
    name: "Hot water",
    watchFor: "Faster evaporation, but the added enthalpy leaves warmer air.",
    inputs: { ...BASELINE_INPUTS, waterTempF: 140 },
  },
  {
    id: "small-droplets",
    name: "Small droplets",
    watchFor: "High surface area per unit mass — droplets evaporate more completely.",
    inputs: { ...BASELINE_INPUTS, dropletUm: 12 },
  },
  {
    id: "large-droplets",
    name: "Large droplets",
    watchFor: "Slower evaporation; liquid is more likely to remain at 1.5 s.",
    inputs: { ...BASELINE_INPUTS, dropletUm: 40 },
  },
  {
    id: "dry-day",
    name: "Dry day",
    watchFor: "Hot, dry ambient air has more evaporative potential.",
    inputs: { ...BASELINE_INPUTS, airTempF: 105, rhPercent: 20, waterTempF: 70 },
  },
  {
    id: "humid-day",
    name: "Humid day",
    watchFor: "High humidity reduces remaining evaporation potential.",
    inputs: { ...BASELINE_INPUTS, airTempF: 95, rhPercent: 80, waterTempF: 75 },
  },
];

export function presetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
