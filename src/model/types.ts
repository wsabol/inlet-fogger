export const DELTA_T = 0.0001;
export const T_MAX = 1.5;
export const REFERENCE_AIRFLOW_PPH = 3_900_000;
export const CHART_STRIDE = 50;

export type ModelInputs = {
  /** Initial droplet temperature, °F */
  Td_0: number;
  /** Initial air temperature, °F */
  Ta_0: number;
  /** Water flow rate, gpm */
  flow_water: number;
  /** Turbine load, 0–1 */
  load: number;
  /** Relative humidity, 0–1 */
  RH: number;
  /** Initial droplet diameter, μm */
  Dd0: number;
};

export type ScenarioInputs = {
  airTempF: number;
  waterTempF: number;
  rhPercent: number;
  waterFlowGpm: number;
  dropletUm: number;
  loadPercent: number;
};

export type StopReason = "residence-time" | "continuum-limit" | "equilibrium";

export type SeriesPoint = {
  time: number;
  airTempF: number;
  dropletTempF: number;
  dropletUm: number;
  rhPercent: number;
  density: number;
  convection: number;
  evaporation: number;
};

export type ModelResult = {
  timeEnd: number;
  finalAirTemperatureF: number;
  finalDropletTemperatureF: number;
  finalDropletDiameterUm: number;
  finalRelativeHumidityPercent: number;
  finalAirDensity: number;
  initialAirDensity: number;
  airDensityChange: number;
  AWB: number;
  s_drp: number;
  s_air: number;
  h_drp: number;
  h_air: number;
  stopReason: StopReason;
  evaporatedFraction: number;
  series: SeriesPoint[];
};

export type ValidationIssue = {
  field: keyof ScenarioInputs | "general";
  level: "error" | "warning";
  message: string;
};

export function fahrenheitToKelvin(fahrenheit: number): number {
  return (5 / 9) * (fahrenheit - 32) + 273.15;
}

export function kelvinToFahrenheit(kelvin: number): number {
  return (9 / 5) * (kelvin - 273.15) + 32;
}

export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15;
}

export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

export function scenarioToModel(s: ScenarioInputs): ModelInputs {
  return {
    Td_0: s.waterTempF,
    Ta_0: s.airTempF,
    flow_water: s.waterFlowGpm,
    load: s.loadPercent / 100,
    RH: s.rhPercent / 100,
    Dd0: s.dropletUm,
  };
}

export function round(v: number, n = 0): number {
  const f = 10 ** n;
  return Math.round(v * f) / f;
}
