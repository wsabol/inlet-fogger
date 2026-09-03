import { describe, expect, it } from "vitest";
import { calculateInstantaneousTransfer } from "../../model";
import { scaleTransferArrow, TRANSFER_RATE_MAXIMA } from "./transfer-visual";

describe("transfer arrow scaling", () => {
  it("maps absolute rates linearly on a fixed scale", () => {
    const quarter = scaleTransferArrow(25, 100);
    const half = scaleTransferArrow(-50, 100);
    expect(half).toBeCloseTo(quarter * 2, 12);
  });

  it("maps equilibrium and invalid values to zero and caps the declared domain", () => {
    expect(scaleTransferArrow(0, 100)).toBe(0);
    expect(scaleTransferArrow(Number.NaN, 100)).toBe(0);
    expect(scaleTransferArrow(200, 100)).toBe(scaleTransferArrow(100, 100));
  });

  it("contains transfer rates at the control-domain corners", () => {
    for (const airTemperatureF of [40, 140]) {
      for (const dropletTemperatureF of [32, 212]) {
        for (const dropletDiameterUm of [5, 60]) {
          for (const relativeHumidityPercent of [0, 100]) {
            const result = calculateInstantaneousTransfer({
              airTemperatureF,
              dropletTemperatureF,
              dropletDiameterUm,
              relativeHumidityPercent,
            });
            expect(Math.abs(result.vaporMassRatePerDropletMass)).toBeLessThanOrEqual(
              TRANSFER_RATE_MAXIMA.vapor,
            );
            expect(Math.abs(result.latentHeatFromAirRatePerDropletMass)).toBeLessThanOrEqual(
              TRANSFER_RATE_MAXIMA.latent,
            );
            expect(Math.abs(result.convectiveHeatRatePerDropletMass)).toBeLessThanOrEqual(
              TRANSFER_RATE_MAXIMA.convection,
            );
          }
        }
      }
    }
  });
});
