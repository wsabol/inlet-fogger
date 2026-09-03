import { describe, expect, it } from "vitest";
import { longestSeriesTime, mergeSeries, timeTicks } from "./chart-data";

type TestPoint = {
  time: number;
  value: number;
};

const longRun: TestPoint[] = [
  { time: 0, value: 10 },
  { time: 0.5, value: 15 },
  { time: 1, value: 20 },
];

const shortRun: TestPoint[] = [
  { time: 0, value: 30 },
  { time: 0.25, value: 35 },
  { time: 0.5, value: 40 },
];

describe("comparison chart data", () => {
  it("merges exact samples without extending the shorter run", () => {
    const rows = mergeSeries([longRun, shortRun], (point, runIndex) => ({
      [`run-${runIndex}`]: point.value,
    }));

    expect(rows).toEqual([
      { time: 0, "run-0": 10, "run-1": 30 },
      { time: 0.25, "run-1": 35 },
      { time: 0.5, "run-0": 15, "run-1": 40 },
      { time: 1, "run-0": 20 },
    ]);
    expect(rows.at(-1)).not.toHaveProperty("run-1");
  });

  it("does not create nearest-point values at another run's timestamps", () => {
    const rows = mergeSeries([longRun, shortRun], (point, runIndex) => ({
      [`run-${runIndex}`]: point.value,
    }));

    expect(rows.find((row) => row.time === 0.25)).not.toHaveProperty("run-0");
    expect(rows.find((row) => row.time === 1)).not.toHaveProperty("run-1");
  });

  it("uses the longest real series endpoint for the time axis", () => {
    const maxTime = longestSeriesTime([shortRun, longRun]);
    const ticks = timeTicks(maxTime);

    expect(maxTime).toBe(1);
    expect(ticks[0]).toBe(0);
    expect(ticks.at(-1)).toBe(maxTime);
    expect(ticks.every((tick) => tick >= 0 && tick <= maxTime)).toBe(true);
  });
});
