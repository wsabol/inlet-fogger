import { fahrenheitToKelvin } from "./types";

const G = 9.80665;
const M_WATER = 0.01801528;
const M_DA = 0.0289652;
const R = 8.314472;

export type InstantaneousTransferInputs = {
  airTemperatureF: number;
  dropletTemperatureF: number;
  dropletDiameterUm: number;
  relativeHumidityPercent: number;
};

export type TransferStateInputs = {
  airTemperatureK: number;
  dropletTemperatureK: number;
  dropletDiameterM: number;
  specificHumidity?: number;
  relativeHumidity?: number;
};

export type InstantaneousTransfer = {
  airThermalConductivity: number;
  airDynamicViscosity: number;
  dryAirDensity: number;
  dryAirPressure: number;
  saturationVaporPressure: number;
  vaporPressure: number;
  vaporDensity: number;
  totalPressure: number;
  specificHumidity: number;
  dryAirMassFraction: number;
  vaporMassFraction: number;
  humidAirDensity: number;
  vaporDiffusivity: number;
  dryAirSpecificHeat: number;
  vaporSpecificHeat: number;
  airSpecificHeat: number;
  waterDensity: number;
  dropletSurfaceArea: number;
  dropletMass: number;
  latentHeat: number;
  dropletSpecificHeat: number;
  prandtlNumber: number;
  thermalGrashofNumber: number;
  nusseltNumber: number;
  convectiveCoefficient: number;
  kelvinVaporPressure: number;
  kelvinVaporDensity: number;
  massGrashofNumber: number;
  schmidtNumber: number;
  sherwoodNumber: number;
  concentrationDifference: number;
  massTransferCoefficient: number;
  massFlux: number;
  dropletMassRate: number;
  vaporMassRate: number;
  convectiveHeatRate: number;
  latentHeatFromAirRate: number;
  vaporMassRatePerDropletMass: number;
  convectiveHeatRatePerDropletMass: number;
  latentHeatFromAirRatePerDropletMass: number;
};

function gasLawPressure(density: number, temp: number, molarMass: number): number {
  return (density * R * temp) / molarMass;
}

export function densityWater(T: number): number {
  return 786.5 + 1.681 * T - 0.003272 * T ** 2;
}

export function densityDryAir(T: number): number {
  return 2.3723 - 0.00397 * T;
}

/** Arden Buck-style saturation vapor pressure, T in Kelvin, result in Pa. */
export function saturationVaporPressure(T: number): number {
  return 611.21 * Math.exp(((19.8428 - T / 234.5) * (T - 273.15)) / (T - 16.01));
}

/**
 * Evaluate the transfer terms used at one timestep of the transient solver.
 * Positive vapor and latent rates mean evaporation; positive convection means heat flows from air to droplet.
 */
export function calculateTransferState(inputs: TransferStateInputs): InstantaneousTransfer {
  const { airTemperatureK: Ta, dropletTemperatureK: Td, dropletDiameterM: Dd } = inputs;
  const kAir = (46.766 + 0.7143 * Ta) * 1e-4;
  const muAir = (1.512e-6 * Ta ** 1.5) / (Ta + 120);
  const dryAirDensity = densityDryAir(Ta);
  const dryAirPressure = gasLawPressure(dryAirDensity, Ta, M_DA);
  const psat = saturationVaporPressure(Ta);

  const vaporPressure =
    inputs.specificHumidity !== undefined
      ? (inputs.specificHumidity * dryAirPressure) / 0.622
      : (inputs.relativeHumidity ?? 0) * psat;
  const specificHumidity = (0.622 * vaporPressure) / dryAirPressure;
  const vaporDensity = (vaporPressure * M_WATER) / (R * Ta);
  const totalPressure = vaporPressure + dryAirPressure;

  const dryAirMassFraction = 1 / (1 + specificHumidity);
  const vaporMassFraction = 1 - dryAirMassFraction;
  const humidAirDensity =
    dryAirMassFraction * dryAirDensity + vaporMassFraction * vaporDensity;
  const vaporDiffusivity = (2.26e-5 * 101325 * Ta) / totalPressure / 273.15;
  const dryAirSpecificHeat = 0.000402 * Ta ** 2 - 0.2026 * Ta + 1030.9;
  const vaporSpecificHeat = 1772 + 0.312 * Ta;
  const airSpecificHeat =
    dryAirMassFraction * dryAirSpecificHeat + vaporMassFraction * vaporSpecificHeat;

  const waterDensity = densityWater(Td);
  const dropletSurfaceArea = 4 * Math.PI * (Dd / 2) ** 2;
  const dropletMass = waterDensity * (4 / 3) * Math.PI * (Dd / 2) ** 3;
  // Psat intentionally follows the solver's existing air-temperature evaluation.
  const latentHeat =
    (psat *
      Td *
      ((R * Td) / (M_WATER * psat) - 1 / waterDensity) *
      (1192134 + 32.02 * Td - Td ** 2)) /
    (234.5 * (Td - 16.01) ** 2);
  const dropletSpecificHeat =
    -0.000099 * Td ** 3 + 0.10913 * Td ** 2 - 39.178 * Td + 8785.4;

  const prandtlNumber = (muAir * airSpecificHeat) / kAir;
  const thermalGrashofNumber =
    (humidAirDensity ** 2 * G * (1 / Ta) * Math.abs(Ta - Td) * Dd ** 3) /
    muAir ** 2;
  const nusseltNumber =
    2 + 0.6 * thermalGrashofNumber ** 0.25 * prandtlNumber ** 0.33;
  const convectiveCoefficient = (nusseltNumber * kAir) / Dd;

  const surfaceTension =
    2.1e-7 * (waterDensity / M_WATER) ** (2 / 3) * (647.1 - Td);
  const kelvinVaporPressure =
    psat * Math.exp((4 * surfaceTension * M_WATER) / (R * Td * Dd * waterDensity));
  const kelvinVaporDensity = (M_WATER * kelvinVaporPressure) / (R * Td);
  const massExpansionCoefficient = vaporMassFraction / humidAirDensity;
  const massGrashofNumber =
    (humidAirDensity ** 2 *
      G *
      massExpansionCoefficient *
      Math.abs(vaporDensity - kelvinVaporDensity) *
      Dd ** 3) /
    muAir ** 2;
  const schmidtNumber = muAir / (humidAirDensity * vaporDiffusivity);
  const sherwoodNumber =
    2 + 0.6 * massGrashofNumber ** 0.25 * schmidtNumber ** 0.33;
  const concentrationDifference = vaporDensity - kelvinVaporDensity;
  const massTransferCoefficient = (sherwoodNumber * vaporDiffusivity) / Dd;
  const massFlux = massTransferCoefficient * concentrationDifference;

  const dropletMassRate = dropletSurfaceArea * massFlux;
  const vaporMassRate = -dropletMassRate;
  const convectiveHeatRate =
    convectiveCoefficient * dropletSurfaceArea * (Ta - Td);
  const latentHeatFromAirRate = -latentHeat * dropletMassRate;

  return {
    airThermalConductivity: kAir,
    airDynamicViscosity: muAir,
    dryAirDensity,
    dryAirPressure,
    saturationVaporPressure: psat,
    vaporPressure,
    vaporDensity,
    totalPressure,
    specificHumidity,
    dryAirMassFraction,
    vaporMassFraction,
    humidAirDensity,
    vaporDiffusivity,
    dryAirSpecificHeat,
    vaporSpecificHeat,
    airSpecificHeat,
    waterDensity,
    dropletSurfaceArea,
    dropletMass,
    latentHeat,
    dropletSpecificHeat,
    prandtlNumber,
    thermalGrashofNumber,
    nusseltNumber,
    convectiveCoefficient,
    kelvinVaporPressure,
    kelvinVaporDensity,
    massGrashofNumber,
    schmidtNumber,
    sherwoodNumber,
    concentrationDifference,
    massTransferCoefficient,
    massFlux,
    dropletMassRate,
    vaporMassRate,
    convectiveHeatRate,
    latentHeatFromAirRate,
    vaporMassRatePerDropletMass: vaporMassRate / dropletMass,
    convectiveHeatRatePerDropletMass: convectiveHeatRate / dropletMass,
    latentHeatFromAirRatePerDropletMass: latentHeatFromAirRate / dropletMass,
  };
}

export function calculateInstantaneousTransfer(
  inputs: InstantaneousTransferInputs,
): InstantaneousTransfer {
  return calculateTransferState({
    airTemperatureK: fahrenheitToKelvin(inputs.airTemperatureF),
    dropletTemperatureK: fahrenheitToKelvin(inputs.dropletTemperatureF),
    dropletDiameterM: inputs.dropletDiameterUm * 1e-6,
    relativeHumidity: inputs.relativeHumidityPercent / 100,
  });
}
