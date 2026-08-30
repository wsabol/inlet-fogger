import type { ModelResult, ScenarioInputs } from "./types";
import { round } from "./types";

export type Interpretation = {
  status: string;
  statusDetail: string;
  body: string;
  waterTempCallout?: string;
};

function dropletStatus(result: ModelResult): { status: string; statusDetail: string } {
  if (result.stopReason === "continuum-limit" || result.evaporatedFraction > 0.98) {
    return {
      status: "Fully evaporated",
      statusDetail: "The modeled droplet evaporated before reaching the compressor inlet.",
    };
  }
  if (result.finalRelativeHumidityPercent >= 95) {
    return {
      status: "Near saturation",
      statusDetail: "Increasing humidity reduced the remaining evaporation potential.",
    };
  }
  return {
    status: "Liquid remains",
    statusDetail:
      "The modeled droplet reached the end of the assumed residence time before fully evaporating.",
  };
}

export function interpretResult(inputs: ScenarioInputs, result: ModelResult): Interpretation {
  const { status, statusDetail } = dropletStatus(result);
  const dT = round(result.finalAirTemperatureF - inputs.airTempF, 1);
  const coolWord = dT < 0 ? "cooled" : "warmed";
  const minDrop = result.series.reduce(
    (min, p) => (p.dropletTempF < min ? p.dropletTempF : min),
    result.series[0]?.dropletTempF ?? inputs.waterTempF,
  );

  const body = [
    `The droplet ${inputs.waterTempF < inputs.airTempF ? "cools" : "adjusts"} rapidly after injection as evaporation removes energy from its surface.`,
    `The modeled minimum droplet temperature is ${round(minDrop, 1)} °F.`,
    `As the surrounding air becomes cooler and more humid, the evaporation rate decreases.`,
    `After ${round(result.timeEnd, 2)} s, the air has ${coolWord} from ${round(inputs.airTempF, 1)} °F to ${round(result.finalAirTemperatureF, 1)} °F`,
    `and the droplet has decreased from ${round(inputs.dropletUm, 1)} μm to ${round(result.finalDropletDiameterUm, 1)} μm`,
    `(about ${round(result.evaporatedFraction * 100, 0)}% of the modeled droplet mass).`,
  ].join(" ");

  const waterTempCallout =
    inputs.waterTempF >= inputs.airTempF + 20
      ? "Faster evaporation is not the same as greater cooling. Higher-temperature water contains more initial energy. Although hot water may evaporate more readily, that added enthalpy remains in the droplet–air system, so final air temperature is slightly higher, all else equal."
      : undefined;

  return { status, statusDetail, body, waterTempCallout };
}
