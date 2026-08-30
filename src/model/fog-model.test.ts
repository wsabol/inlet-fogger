import { describe, expect, it } from "vitest";
import { calculateFogModel } from "./fog-model";
import { fahrenheitToKelvin, kelvinToFahrenheit, scenarioToModel } from "./types";
import { BASELINE_INPUTS } from "./presets";
import { hasErrors, validateScenario } from "./validate";

describe("unit conversions", () => {
  it("round-trips Fahrenheit through Kelvin", () => {
    expect(kelvinToFahrenheit(fahrenheitToKelvin(80))).toBeCloseTo(80, 10);
    expect(kelvinToFahrenheit(fahrenheitToKelvin(32))).toBeCloseTo(32, 10);
  });

  it("maps UI percent fields onto model fractions", () => {
    const m = scenarioToModel({
      airTempF: 80,
      waterTempF: 60,
      rhPercent: 50,
      waterFlowGpm: 60,
      dropletUm: 30,
      loadPercent: 100,
    });
    expect(m.RH).toBe(0.5);
    expect(m.load).toBe(1);
    expect(m.Ta_0).toBe(80);
    expect(m.Td_0).toBe(60);
  });
});

describe("validation", () => {
  it("rejects impossible RH and non-positive flow", () => {
    expect(hasErrors(validateScenario({ ...BASELINE_INPUTS, rhPercent: -1 }))).toBe(true);
    expect(hasErrors(validateScenario({ ...BASELINE_INPUTS, rhPercent: 120 }))).toBe(true);
    expect(hasErrors(validateScenario({ ...BASELINE_INPUTS, waterFlowGpm: 0 }))).toBe(true);
    expect(hasErrors(validateScenario({ ...BASELINE_INPUTS, dropletUm: 0 }))).toBe(true);
    expect(hasErrors(validateScenario({ ...BASELINE_INPUTS, loadPercent: 0 }))).toBe(true);
  });

  it("accepts the baseline case", () => {
    expect(hasErrors(validateScenario(BASELINE_INPUTS))).toBe(false);
  });
});

describe("fog model", () => {
  it("runs the baseline case and reports display units as °F and %", () => {
    const result = calculateFogModel(scenarioToModel(BASELINE_INPUTS));
    expect(result.series.length).toBeGreaterThan(10);
    expect(result.finalAirTemperatureF).toBeGreaterThan(50);
    expect(result.finalAirTemperatureF).toBeLessThan(80);
    expect(result.finalRelativeHumidityPercent).toBeGreaterThan(50);
    expect(result.finalRelativeHumidityPercent).toBeLessThanOrEqual(100);
    expect(result.series[0].rhPercent).toBeCloseTo(50, 0);
    expect(result.series[0].airTempF).toBeCloseTo(80, 0);
    const last = result.series[result.series.length - 1];
    expect(last.rhPercent).toBeCloseTo(result.finalRelativeHumidityPercent, 0);
  });

  it("computes density change from first and last samples", () => {
    const result = calculateFogModel(scenarioToModel(BASELINE_INPUTS));
    expect(result.airDensityChange).toBeCloseTo(
      (result.finalAirDensity - result.initialAirDensity) / result.initialAirDensity,
      8,
    );
  });

  it("is deterministic", () => {
    const a = calculateFogModel(scenarioToModel(BASELINE_INPUTS));
    const b = calculateFogModel(scenarioToModel(BASELINE_INPUTS));
    expect(a.finalAirTemperatureF).toBe(b.finalAirTemperatureF);
    expect(a.finalDropletDiameterUm).toBe(b.finalDropletDiameterUm);
    expect(a.timeEnd).toBe(b.timeEnd);
  });

  it("shows hotter water evaporating more but cooling less than cold water", () => {
    const cold = calculateFogModel(
      scenarioToModel({ ...BASELINE_INPUTS, waterTempF: 60 }),
    );
    const hot = calculateFogModel(
      scenarioToModel({ ...BASELINE_INPUTS, waterTempF: 140 }),
    );
    expect(hot.finalDropletDiameterUm).toBeLessThan(cold.finalDropletDiameterUm);
    expect(hot.finalAirTemperatureF).toBeGreaterThan(cold.finalAirTemperatureF);
  });

  it("stops at or before the 1.5 s residence time", () => {
    const result = calculateFogModel(scenarioToModel(BASELINE_INPUTS));
    expect(result.timeEnd).toBeLessThanOrEqual(1.5);
  });

  it("rejects out-of-range air temperature", () => {
    expect(() =>
      calculateFogModel(scenarioToModel({ ...BASELINE_INPUTS, airTempF: 20 })),
    ).toThrow(/out of bounds/);
  });
});
