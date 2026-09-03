import { describe, expect, it } from "vitest";
import { calculateInstantaneousTransfer } from "./transfer";

const transfer = (
  airTemperatureF: number,
  dropletTemperatureF: number,
  dropletDiameterUm = 30,
  relativeHumidityPercent = 50,
) =>
  calculateInstantaneousTransfer({
    airTemperatureF,
    dropletTemperatureF,
    dropletDiameterUm,
    relativeHumidityPercent,
  });

describe("instantaneous droplet transfer", () => {
  it("reports evaporation and its latent demand as positive outward/from-air rates", () => {
    const result = transfer(80, 60);
    expect(result.massFlux).toBeLessThan(0);
    expect(result.vaporMassRatePerDropletMass).toBeGreaterThan(0);
    expect(result.latentHeatFromAirRatePerDropletMass).toBeGreaterThan(0);
  });

  it("reports condensation with reversed mass and latent signs", () => {
    const result = transfer(40, 212, 30, 100);
    expect(result.massFlux).toBeGreaterThan(0);
    expect(result.vaporMassRatePerDropletMass).toBeLessThan(0);
    expect(result.latentHeatFromAirRatePerDropletMass).toBeLessThan(0);
  });

  it("reverses convection with the temperature difference", () => {
    expect(transfer(100, 60).convectiveHeatRatePerDropletMass).toBeGreaterThan(0);
    expect(transfer(60, 100).convectiveHeatRatePerDropletMass).toBeLessThan(0);
    expect(transfer(80, 80).convectiveHeatRatePerDropletMass).toBe(0);
  });

  it("shows the stronger per-mass response of smaller droplets", () => {
    const small = transfer(100, 60, 8, 20);
    const large = transfer(100, 60, 60, 20);
    expect(small.vaporMassRatePerDropletMass).toBeGreaterThan(
      large.vaporMassRatePerDropletMass,
    );
    expect(small.convectiveHeatRatePerDropletMass).toBeGreaterThan(
      large.convectiveHeatRatePerDropletMass,
    );
  });

  it("stays finite at every corner of the Explore control domain", () => {
    const values: number[] = [];
    for (const airTemperatureF of [40, 140]) {
      for (const dropletTemperatureF of [32, 212]) {
        for (const dropletDiameterUm of [8, 60]) {
          for (const relativeHumidityPercent of [0, 100]) {
            const result = transfer(
              airTemperatureF,
              dropletTemperatureF,
              dropletDiameterUm,
              relativeHumidityPercent,
            );
            values.push(
              result.vaporMassRatePerDropletMass,
              result.latentHeatFromAirRatePerDropletMass,
              result.convectiveHeatRatePerDropletMass,
            );
          }
        }
      }
    }
    expect(values.every(Number.isFinite)).toBe(true);
  });
});
