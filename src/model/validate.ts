import type { ScenarioInputs, ValidationIssue } from "./types";

const RANGES = {
  airTempF: { min: 40, max: 140, warnMin: 50, warnMax: 120 },
  waterTempF: { min: 32, max: 212, warnMin: 50, warnMax: 140 },
  rhPercent: { min: 0, max: 100, warnMin: 10, warnMax: 90 },
  waterFlowGpm: { min: 0.1, max: 200, warnMin: 10, warnMax: 80 },
  dropletUm: { min: 1, max: 80, warnMin: 8, warnMax: 40 },
  loadPercent: { min: 1, max: 100, warnMin: 50, warnMax: 100 },
};

export function validateScenario(inputs: ScenarioInputs): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const hard = (
    field: keyof ScenarioInputs,
    value: number,
    min: number,
    max: number,
    label: string,
  ) => {
    if (!Number.isFinite(value)) {
      issues.push({ field, level: "error", message: `${label} must be a number.` });
      return false;
    }
    if (value < min || value > max) {
      issues.push({
        field,
        level: "error",
        message: `${label} must be between ${min} and ${max}.`,
      });
      return false;
    }
    return true;
  };

  if (hard("airTempF", inputs.airTempF, RANGES.airTempF.min, RANGES.airTempF.max, "Air temperature")) {
    if (inputs.airTempF < RANGES.airTempF.warnMin || inputs.airTempF > RANGES.airTempF.warnMax) {
      issues.push({
        field: "airTempF",
        level: "warning",
        message: "This inlet temperature is outside the range used to discuss the original cases. Interpret results cautiously.",
      });
    }
  }
  if (hard("waterTempF", inputs.waterTempF, RANGES.waterTempF.min, RANGES.waterTempF.max, "Water temperature")) {
    if (inputs.waterTempF < RANGES.waterTempF.warnMin || inputs.waterTempF > RANGES.waterTempF.warnMax) {
      issues.push({
        field: "waterTempF",
        level: "warning",
        message: "This water temperature is outside the range emphasized in the original study.",
      });
    }
  }
  if (hard("rhPercent", inputs.rhPercent, RANGES.rhPercent.min, RANGES.rhPercent.max, "Relative humidity")) {
    if (inputs.rhPercent < RANGES.rhPercent.warnMin || inputs.rhPercent > RANGES.rhPercent.warnMax) {
      issues.push({
        field: "rhPercent",
        level: "warning",
        message: "Very dry or nearly saturated inlets sit at the edge of typical fogging operation.",
      });
    }
  }
  if (hard("waterFlowGpm", inputs.waterFlowGpm, RANGES.waterFlowGpm.min, RANGES.waterFlowGpm.max, "Water flow")) {
    if (inputs.waterFlowGpm < RANGES.waterFlowGpm.warnMin || inputs.waterFlowGpm > RANGES.waterFlowGpm.warnMax) {
      issues.push({
        field: "waterFlowGpm",
        level: "warning",
        message: "This flow is outside the range used to validate the original model. Results should be interpreted cautiously.",
      });
    }
  }
  if (hard("dropletUm", inputs.dropletUm, RANGES.dropletUm.min, RANGES.dropletUm.max, "Droplet diameter")) {
    if (inputs.dropletUm < RANGES.dropletUm.warnMin || inputs.dropletUm > RANGES.dropletUm.warnMax) {
      issues.push({
        field: "dropletUm",
        level: "warning",
        message: "Typical fog nozzles produce droplets near 5–40 μm SMD. This size is outside that band.",
      });
    }
  }
  if (hard("loadPercent", inputs.loadPercent, RANGES.loadPercent.min, RANGES.loadPercent.max, "Turbine load")) {
    if (inputs.loadPercent < RANGES.loadPercent.warnMin) {
      issues.push({
        field: "loadPercent",
        level: "warning",
        message: "Load only scales the reference airflow. Low load increases the water-to-air ratio.",
      });
    }
  }

  return issues;
}

export function hasErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.level === "error");
}
