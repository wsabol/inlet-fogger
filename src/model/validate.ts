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

  return issues;
}

export function hasErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.level === "error");
}
